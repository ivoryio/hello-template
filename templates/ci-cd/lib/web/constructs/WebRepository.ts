import cdk = require('@aws-cdk/cdk')
import codecommit = require('@aws-cdk/aws-codecommit')

import { ServiceProps } from '../../constructs/interfaces'

export default class WebRepository extends cdk.Construct {
  public readonly entity: codecommit.IRepository

  constructor(parent: cdk.Construct, id: string) {
    super(parent, id)

    const repositoryName = `${this.projectName}-web-repository`

    this.entity = new codecommit.Repository(this, repositoryName, {
      repositoryName,
      description: `Git repository for the ${this.projectName} web app`
    })
  }

  private readonly projectName = process.env.PROJECT_NAME!
}
