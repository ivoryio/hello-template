import cdk = require('@aws-cdk/cdk')
import codecommit = require('@aws-cdk/aws-codecommit')

export default class CICDStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props)
    
    const projectName = process.env.PROJECT_NAME!

    const repositoryName = `${projectName}-ci-cd`
    const repository = new codecommit.Repository(this, repositoryName, {
      repositoryName,
      description: `Git repository for the ${projectName} CI/CD`
    })

    new cdk.CfnOutput(this, `repository-ssh-url`, {
      value: repository.repositoryCloneUrlSsh,
      description: `The SSH URL for cloning the ${projectName} CI/CD repository`
    })
  }
}
