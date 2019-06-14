import cdk = require('@aws-cdk/cdk')
import s3 = require('@aws-cdk/aws-s3')

import WebRepository from './constructs/WebRepository'
import { ServiceProps } from '../constructs/interfaces'


export default class WebCICDStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ServiceProps) {
    super(scope, id)

    const { serviceName } = props

    new WebRepository(this, `${serviceName}-repository-construct`, {
      serviceName
    }).entity

    const stagingBucket = this.createBucket(this, 'staging')
    const productionBucket = this.createBucket(this, 'production')
  }

  private createBucket(stack: cdk.Stack, stage: string) {
    return new s3.Bucket(stack, `web-${stage}-bucket`, {
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false
      },
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    })
  }
}