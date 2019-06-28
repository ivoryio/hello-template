import cdk = require('@aws-cdk/cdk')
import codebuild = require('@aws-cdk/aws-codebuild')

import { WebBuildProjectProps } from './interfaces'

export default class WebBuildProject extends cdk.Construct {
  public readonly entity: codebuild.IProject

  constructor(parent: cdk.Stack, id: string, props: WebBuildProjectProps) {
    super(parent, id)

    const { repository, env, distributionID } = props
    const buildProjectName = `${this.projectName}-web-build-${env}`

    this.entity = new codebuild.Project(this, buildProjectName, {
      projectName: buildProjectName,
      source: new codebuild.CodeCommitSource({ repository }),
      buildSpec: this.makeDefaultBuildSpec(env, distributionID),
      description: `Build web project for ${env}`
    })
  }

  private makeDefaultBuildSpec(env: string, distributionID: string) {
    return {
      version: '0.2',
      phases: {
        pre_build: {
          commands: [
            'npm ci',
            `PROJECT_NAME=${
              this.projectName
            } ENVIRONMENT=${env.toLowerCase()} node ./src/config/configureEnv.js`
          ]
        },
        build: {
          commands: [`npm run build:${env.toLowerCase()}`]
        },
        post_build: {
          commands: [
            `aws cloudfront create-invalidation --distribution-id ${distributionID} --paths '/*'`
          ]
        }
      },
      artifacts: {
        files: '**/*',
        'base-directory': 'build'
      }
    }
  }

  private readonly projectName = process.env.PROJECT_NAME!
}
