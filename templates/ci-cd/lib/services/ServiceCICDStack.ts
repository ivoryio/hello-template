import cdk = require('@aws-cdk/cdk')
import targets = require('@aws-cdk/aws-events-targets')

import { ServiceCICDStackProps } from './interfaces'
import ServicePipeline from './constructs/ServicePipeline'
import ServiceRepository from './constructs/ServiceRepository'
import ServiceBuildProject  from './constructs/ServiceBuildProject'

export default class ServiceCICDStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ServiceCICDStackProps) {
    super(scope, id, props)

    const { serviceName, makeBuildSpec, projectName } = props

    const repository = new ServiceRepository(
      this,
      `${projectName}-${serviceName}-repository-construct`,
      {
        serviceName: `${projectName}-${serviceName}`
      }
    ).entity

    new cdk.CfnOutput(this, `repository-ssh-url`, {
      value: repository.repositoryCloneUrlSsh,
      description: `The SSH URL for cloning the ${projectName} ${serviceName} service`
    })

    const buildProject = new ServiceBuildProject(this, `${projectName}-${serviceName}-build-construct`, {
      serviceName: `${projectName}-${serviceName}`,
      makeBuildSpec,
      repository
    }).entity

    new ServicePipeline(this, `${projectName}-${serviceName}-pipeline-construct`, {
      serviceName: `${projectName}-${serviceName}`,
      repository,
      buildProject,
    })

    repository.onCommit(`trigger-${projectName}-${serviceName}-service-build`, {
      target: new targets.CodeBuildProject(buildProject)
    })
  }
}
