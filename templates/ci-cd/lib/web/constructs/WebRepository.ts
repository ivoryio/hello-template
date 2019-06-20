import cdk = require('@aws-cdk/cdk')
import codecommit = require('@aws-cdk/aws-codecommit')

import { ServiceProps } from '../../constructs/interfaces'

export default class WebRepository extends cdk.Construct {
  public readonly entity: codecommit.IRepository

  constructor(parent: cdk.Construct, id: string, props: ServiceProps) {
    super(parent, id)

    const { projectName } = props
    const repositoryName = `${projectName}-web-repository`

    this.entity = new codecommit.Repository(this, repositoryName, {
      repositoryName,
      description: `Git repository for the ${projectName} web app`
    })
  }
}
