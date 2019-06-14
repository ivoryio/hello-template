import codecommit = require('@aws-cdk/aws-codecommit')

import { ServiceProps } from '../../constructs/interfaces'

export interface WebBuildProjectProps extends ServiceProps {
  buildSpec?: string,
  repository: codecommit.IRepository
}