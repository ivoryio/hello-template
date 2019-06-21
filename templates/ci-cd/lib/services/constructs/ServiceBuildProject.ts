import cdk = require('@aws-cdk/cdk')
import s3 = require('@aws-cdk/aws-s3')
import codebuild = require('@aws-cdk/aws-codebuild')
import { ComputeType } from '@aws-cdk/aws-codebuild'

import { ServiceBuildProjectProps } from './interfaces'

export default class ServiceBuildProject extends cdk.Construct {
    public readonly entity: codebuild.Project

    constructor(parent: cdk.Construct, id: string, props: ServiceBuildProjectProps) {
        super(parent, id)

        const { serviceName, repository, makeBuildSpec: buildSpec } = props

        const bucketName = `${serviceName}-lambda-artifacts-bucket`
        const lambdaArtifactsBucket = new s3.Bucket(this, bucketName, {})

        const projectName = `${serviceName}-build`
        const buildProject = new codebuild.Project(this, projectName, {
            projectName,
            description: `Build project for the ${serviceName}`,
            environment: {
                buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1,
                computeType: ComputeType.Small
            },
            source: new codebuild.CodeCommitSource({ repository }),
            buildSpec: buildSpec ? buildSpec(lambdaArtifactsBucket) : this.makeDefaultBuildSpec(lambdaArtifactsBucket)
        })

        lambdaArtifactsBucket.grantPut(buildProject)

        this.entity = buildProject
    }

    private makeDefaultBuildSpec(lambdaArtifactsBucket: s3.Bucket) {
        return {
            version: '0.2',
            phases: {
                pre_build: {
                    commands: [
                        'mkdir -p build',
                        'npm i',
                        'npm run test:unit'
                    ]
                },
                build: {
                    commands: [
                        'npm prune --production',
                    ]
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
                    'template': {
                        'files': 'infrastructure.packaged.yaml',
                        'base-directory': 'build'
                    },
                    'staging_parameters': {
                        'files': 'staging.json',
                        'base-directory': 'parameters'
                    },
                    'production_parameters': {
                        'files': 'production.json',
                        'base-directory': 'parameters'
                    }
                }
            },
        }
    }
}
