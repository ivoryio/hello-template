import s3 = require('@aws-cdk/aws-s3')

const services = [
  {
    name: 'user'
  },
  {
    name: 'greeter'
  },
  {
    name: 'data-gateway',
    // custom build spec, not needed if default one suffices
    makeBuildSpec: (lambdaArtifactsBucket: s3.Bucket) => ({
      version: '0.2',
      phases: {
        pre_build: {
          commands: ['mkdir -p build']
        },
        build: {
          commands: ['npm prune --production']
        },
        post_build: {
          commands: [
            `aws cloudformation package \
--template-file infrastructure.yaml \
--output-template-file build/infrastructure.packaged.yaml \
--s3-bucket ${lambdaArtifactsBucket.bucketName}`
          ]
        }
      },
      artifacts: {
        'secondary-artifacts': {
          template: {
            files: 'infrastructure.packaged.yaml',
            'base-directory': 'build'
          },
          staging_parameters: {
            files: 'staging.json',
            'base-directory': 'parameters'
          },
          production_parameters: {
            files: 'production.json',
            'base-directory': 'parameters'
          }
        }
      }
    })
  }
]

export default services
