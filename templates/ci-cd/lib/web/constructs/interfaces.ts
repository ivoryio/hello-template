import s3 = require('@aws-cdk/aws-s3')
import codebuild = require('@aws-cdk/aws-codebuild')
import codecommit = require('@aws-cdk/aws-codecommit')

import { ServiceProps } from '../../constructs/interfaces'

export interface WebBuildProjectProps extends ServiceProps {
  env: 'staging' | 'production'
  buildSpec?: string
  repository: codecommit.IRepository
}

export interface WebPipelineProps extends ServiceProps {
  buckets: { [stage: string]: s3.IBucket }
  stagingBuildProject: codebuild.IProject
  productionBuildProject: codebuild.IProject
  repository: codecommit.IRepository
}
