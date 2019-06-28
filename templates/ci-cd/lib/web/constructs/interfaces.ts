import s3 = require('@aws-cdk/aws-s3')
import codebuild = require('@aws-cdk/aws-codebuild')
import codecommit = require('@aws-cdk/aws-codecommit')

import { ServiceProps } from '../../constructs/interfaces'

export interface WebBuildProjectProps extends ServiceProps {
  env: 'staging' | 'production'
  distributionID: string
  repository: codecommit.IRepository
}

export interface WebPipelineProps extends ServiceProps {
  repository: codecommit.IRepository
  buckets: { staging: s3.IBucket; production: s3.IBucket }
  buildProjects: { staging: codebuild.IProject; production: codebuild.IProject }
}
