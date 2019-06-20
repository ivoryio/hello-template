import cdk = require('@aws-cdk/cdk')
import targets = require('@aws-cdk/aws-events-targets')

import { ServiceCICDStackProps } from './interfaces'
import ServicePipeline from './constructs/ServicePipeline'
import ServiceRepository from './constructs/ServiceRepository'
import ServiceBuildProject  from './constructs/ServiceBuildProject'

export default class ServiceCICDStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ServiceCICDStackProps) {
    super(scope, id, props)

    const { serviceName, makeBuildSpec } = props

    const projectName = process.env.PROJECT_NAME

    const repository = new ServiceRepository(
      this,
      `${projectName}-${serviceName}-repository-construct`,
      {
        serviceName: `${projectName}-${serviceName}`
      }
    ).entity

    const buildProject = new ServiceBuildProject(this, `${serviceName}-build-construct`, {
      serviceName,
      makeBuildSpec,
      repository
    }).entity

    new ServicePipeline(this, `${serviceName}-pipeline-construct`, {
      serviceName,
      repository,
      buildProject,
    })

    repository.onCommit(`trigger-${serviceName}-service-build`, {
      target: new targets.CodeBuildProject(buildProject)
    })
  }
}
