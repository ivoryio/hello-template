import cdk = require('@aws-cdk/cdk')
import s3 = require('@aws-cdk/aws-s3')
import codebuild = require('@aws-cdk/aws-codebuild')
import codecommit = require('@aws-cdk/aws-codecommit')
import cpa = require('@aws-cdk/aws-codepipeline-actions')
import codepipeline = require('@aws-cdk/aws-codepipeline')

import { WebPipelineProps } from './interfaces'


export default class WebPipeline extends cdk.Construct {
  public readonly entity: codepipeline.IPipeline

  constructor(parent: cdk.Construct, id: string, props: WebPipelineProps) {
    super(parent, id)

    const { serviceName, repository, project, buckets } = props
    const pipelineName = `${serviceName}-web-pipeline`

    const pipeline = new codepipeline.Pipeline(this, pipelineName, {
      pipelineName
    })

    const sourceAction = this.makeSourceAction(repository)
    pipeline.addStage({
      name: 'Source',
      actions: [sourceAction]
    })

    const buildAction = this.makeBuildAction(sourceAction, project)
    pipeline.addStage({
      name: 'Build',
      actions: [buildAction]
    })
    
    const deployStagingAction = this.makeDeployStagingAction(buildAction, buckets.staging)
    pipeline.addStage({
      name: 'DeployStaging',
      actions: [deployStagingAction]
    })

    const deployProductionActions = this.makeDeployProductionActions(buildAction, buckets.production)
    pipeline.addStage({
      name: 'DeployProduction',
      actions: deployProductionActions
    })

    this.entity = pipeline
  }

  private makeSourceAction(repository: codecommit.IRepository) {
    return new cpa.CodeCommitSourceAction({
      repository,
      actionName: 'GetLatestChanges',
      output: new codepipeline.Artifact()
    })
  }

  private makeBuildAction(sourceAction: cpa.CodeCommitSourceAction, project: codebuild.IProject) {
    return new cpa.CodeBuildAction({
      project,
      actionName: 'BuildWebApp',
      input: sourceAction.outputs[0],
      output: new codepipeline.Artifact()
    })
  }

  private makeDeployStagingAction(buildAction: cpa.CodeBuildAction, bucket: s3.IBucket) {
    return new cpa.S3DeployAction({
      bucket,
      input: buildAction.outputs[0],
      actionName: 'DeployWebApp'
    })
  }

  private makeDeployProductionActions(buildAction: cpa.CodeBuildAction, bucket: s3.IBucket) {
    const manualApprovalAction = new cpa.ManualApprovalAction({
      runOrder: 1,
      actionName: 'ApproveChanges'
    })

    const deployToProductionBucket = new cpa.S3DeployAction({
      bucket,
      runOrder: 2,
      actionName: 'DeployWebApp',
      input: buildAction.outputs[0]
    })

    return [manualApprovalAction, deployToProductionBucket]
  }
}