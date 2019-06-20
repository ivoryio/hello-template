import cdk = require('@aws-cdk/cdk')
import s3 = require('@aws-cdk/aws-s3')

export interface ServiceCICDStackProps extends cdk.StackProps {
  makeBuildSpec?(lambdaArtifactsBucket: s3.Bucket): any
  serviceName: string
  projectName: string
}
