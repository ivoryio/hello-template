import cdk = require('@aws-cdk/cdk')
import s3 = require('@aws-cdk/aws-s3')

export interface WebCICDStackProps extends cdk.StackProps {
  lambdaArtifactsBucket: s3.Bucket
}
