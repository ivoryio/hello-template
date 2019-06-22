import cdk = require('@aws-cdk/cdk')
import codebuild = require('@aws-cdk/aws-codebuild')
import codecommit = require('@aws-cdk/aws-codecommit')
import codepipeline = require('@aws-cdk/aws-codepipeline')
import cpa = require('@aws-cdk/aws-codepipeline-actions')

import { ServicePipelineProps } from './interfaces'

export default class ServicePipeline extends cdk.Construct {
  public readonly entity: codepipeline.Pipeline

  constructor(parent: cdk.Construct, id: string, props: ServicePipelineProps) {
    super(parent, id)

    const pipelineName = `${props.serviceName}-pipeline`
    const pipeline = new codepipeline.Pipeline(this, pipelineName, {
      pipelineName
    })

    const sourceAction = this.makeSourceAction(props.repository)
    pipeline.addStage({
      name: 'Source',
      actions: [sourceAction]
    })

    const buildAction = this.makeBuildAction(sourceAction, props.buildProject)
    pipeline.addStage({
      name: 'Build',
      actions: [buildAction]
    })

    const deployStagingActions = this.makeDeployStagingActions(
      buildAction,
      props.serviceName
    )
    pipeline.addStage({
      name: 'DeployStaging',
      actions: deployStagingActions
    })

    const deployProdActions = this.makeDeployProductionActions(
      buildAction,
      props.serviceName
    )
    pipeline.addStage({
      name: 'DeployProduction',
      actions: deployProdActions
    })

    this.entity = pipeline
  }

  private makeSourceAction(repository: codecommit.Repository) {
    return new cpa.CodeCommitSourceAction({
      actionName: 'GetLatestChanges',
      repository,
      output: new codepipeline.Artifact()
    })
  }
  private makeBuildAction(
    sourceAction: cpa.CodeCommitSourceAction,
    project: codebuild.Project
  ) {
    return new cpa.CodeBuildAction({
      actionName: 'BuildService',
      project,
      input: sourceAction.outputs[0],
      output: new codepipeline.Artifact('template'),
      extraOutputs: [
        new codepipeline.Artifact('staging_parameters'),
        new codepipeline.Artifact('production_parameters')
      ]
    })
  }
  private makeDeployStagingActions(
    buildAction: cpa.CodeBuildAction,
    serviceName: string
  ) {
    const changeSetName = 'StagingChangeSet'
    const stackName = `${serviceName}-staging`

    const templatePath = buildAction.outputs
      .find(t => t.artifactName === 'template')!
      .atPath('infrastructure.packaged.yaml')
    const templateConfiguration = buildAction.outputs
      .find(t => t.artifactName === 'staging_parameters')!
      .atPath('staging.json')

    const createChangeSetAction = new cpa.CloudFormationCreateReplaceChangeSetAction(
      {
        actionName: 'PrepareChanges',
        stackName,
        changeSetName,
        adminPermissions: true,
        templatePath,
        templateConfiguration,
        runOrder: 1
      }
    )

    const executeChangeSetAction = new cpa.CloudFormationExecuteChangeSetAction(
      {
        actionName: 'ExecuteChanges',
        stackName,
        changeSetName,
        runOrder: 2
      }
    )

    return [createChangeSetAction, executeChangeSetAction]
  }
  private makeDeployProductionActions(
    buildAction: cpa.CodeBuildAction,
    serviceName: string
  ) {
    const changeSetName = 'ProductionChangeSet'
    const stackName = `${serviceName}-production`

    const templatePath = buildAction.outputs
      .find(t => t.artifactName === 'template')!
      .atPath('infrastructure.packaged.yaml')
    const templateConfiguration = buildAction.outputs
      .find(t => t.artifactName === 'production_parameters')!
      .atPath('production.json')

    const manualApprovalAction = new cpa.ManualApprovalAction({
      actionName: 'ApproveDeployment',
      runOrder: 1
    })

    const createChangeSetAction = new cpa.CloudFormationCreateReplaceChangeSetAction(
      {
        actionName: 'PrepareChanges',
        stackName,
        changeSetName,
        adminPermissions: true,
        templatePath,
        templateConfiguration,
        runOrder: 2
      }
    )

    const executeChangeSetAction = new cpa.CloudFormationExecuteChangeSetAction(
      {
        actionName: 'ExecuteChanges',
        stackName,
        changeSetName,
        runOrder: 3
      }
    )

    return [manualApprovalAction, createChangeSetAction, executeChangeSetAction]
  }
}
