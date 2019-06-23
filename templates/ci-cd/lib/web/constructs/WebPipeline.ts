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

    const {
      repository,
      stagingBuildProject,
      productionBuildProject,
      buckets,
      projectName
    } = props

    const pipelineName = `${projectName}-web-pipeline`
    const pipeline = new codepipeline.Pipeline(this, pipelineName, {
      pipelineName
    })

    const sourceAction = this.setUpSourceStage(pipeline, repository)

    this.setUpStagingStage(
      buckets.staging,
      stagingBuildProject,
      pipeline,
      sourceAction
    )
    this.setUpProductionStage(
      buckets.production,
      productionBuildProject,
      pipeline,
      sourceAction
    )

    this.entity = pipeline
  }

  private setUpSourceStage(
    pipeline: codepipeline.Pipeline,
    repository: codecommit.IRepository
  ) {
    const sourceAction = new cpa.CodeCommitSourceAction({
      repository,
      actionName: 'GetLatestChanges',
      output: new codepipeline.Artifact()
    })

    pipeline.addStage({
      name: 'Source',
      actions: [sourceAction]
    })

    return sourceAction
  }

  private setUpStagingStage(
    bucket: s3.IBucket,
    project: codebuild.IProject,
    pipeline: codepipeline.Pipeline,
    sourceAction: cpa.CodeCommitSourceAction
  ) {
    const stagingBuildAction = new cpa.CodeBuildAction({
      project,
      actionName: 'Build',
      input: sourceAction.outputs[0],
      output: new codepipeline.Artifact(),
      runOrder: 1
    })

    const deployStagingAction = new cpa.S3DeployAction({
      bucket,
      input: stagingBuildAction.outputs[0],
      actionName: 'DeployToS3Bucket',
      runOrder: 2
    })

    pipeline.addStage({
      name: 'DeployToStaging',
      actions: [stagingBuildAction, deployStagingAction]
    })
  }

  private setUpProductionStage(
    bucket: s3.IBucket,
    project: codebuild.IProject,
    pipeline: codepipeline.Pipeline,
    sourceAction: cpa.CodeCommitSourceAction
  ) {
    const productionBuildAction = new cpa.CodeBuildAction({
      project,
      actionName: 'Build',
      input: sourceAction.outputs[0],
      output: new codepipeline.Artifact()
    })

    pipeline.addStage({
      name: 'BuildForProduction',
      actions: [productionBuildAction]
    })

    const manualApprovalAction = new cpa.ManualApprovalAction({
      runOrder: 1,
      actionName: 'ApproveChanges'
    })

    const deployToProductionBucket = new cpa.S3DeployAction({
      bucket,
      runOrder: 2,
      actionName: 'DeployWebApp',
      input: productionBuildAction.outputs[0]
    })

    pipeline.addStage({
      name: 'DeployToProduction',
      actions: [manualApprovalAction, deployToProductionBucket]
    })
  }
}
