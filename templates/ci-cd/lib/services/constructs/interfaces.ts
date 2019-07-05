import s3 = require('@aws-cdk/aws-s3')
import codebuild = require('@aws-cdk/aws-codebuild')
import codecommit = require('@aws-cdk/aws-codecommit')

export interface ServiceProps {
  serviceName: string
}

export interface ServiceBuildProjectProps extends ServiceProps {
  lambdaArtifactsBucket: s3.Bucket
  repository: codecommit.Repository
}

export interface ServicePipelineProps extends ServiceProps {
  buildProject: codebuild.Project
  lambdaArtifactsBucket: s3.Bucket
  repository: codecommit.Repository
  getDynamicStackParameters?(): { [name: string]: any }
}
