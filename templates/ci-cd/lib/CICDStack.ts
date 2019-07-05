import cdk = require('@aws-cdk/cdk')
import s3 = require('@aws-cdk/aws-s3')
import codecommit = require('@aws-cdk/aws-codecommit')

export default class CICDStack extends cdk.Stack {
  public readonly lambdaArtifactsBucket: s3.Bucket

  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props)
    
    const projectName = process.env.PROJECT_NAME!

    this.lambdaArtifactsBucket = this.makeBucket(projectName)

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

  private makeBucket(projectName: string) {
    return new s3.Bucket(this, `${projectName}-lambda-artifacts`, {
      bucketName: `${projectName}-lambda-artifacts`
    })
  }
}
