import cdk = require('@aws-cdk/cdk')

import WebRepository from './constructs/WebRepository'
import { ServiceProps } from '../constructs/interfaces'


export default class WebCICDStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ServiceProps) {
    super(scope, id)

    const { serviceName } = props

    new WebRepository(this, `${serviceName}-repository-construct`, {
      serviceName
    }).entity
  }
}