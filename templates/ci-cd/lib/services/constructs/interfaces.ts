import s3 = require('@aws-cdk/aws-s3')
import codebuild = require('@aws-cdk/aws-codebuild')
import codecommit = require('@aws-cdk/aws-codecommit')

export interface ServiceProps {
  serviceName: string
}

export interface ServiceBuildProjectProps extends ServiceProps {
  makeBuildSpec?(lambdaArtifactsBucket: s3.Bucket): any
  repository: codecommit.Repository
}

export interface ServicePipelineProps extends ServiceProps {
  buildProject: codebuild.Project
  repository: codecommit.Repository
  getDynamicStackParameters?(): { [name: string]: any }
}
