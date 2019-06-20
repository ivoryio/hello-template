import cdk = require('@aws-cdk/cdk')
import codecommit = require('@aws-cdk/aws-codecommit')

import { ServiceProps } from './interfaces'

export default class ServiceRepository extends cdk.Construct {
  public readonly entity: codecommit.Repository

  constructor(parent: cdk.Construct, id: string, props: ServiceProps) {
    super(parent, id)

    const { serviceName } = props
    const repositoryName = `${serviceName}-repository`

    this.entity = new codecommit.Repository(this, repositoryName, {
      repositoryName,
      description: `Git repository for the ${serviceName}.`
    })
  }
}
