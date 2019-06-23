import cdk = require('@aws-cdk/cdk')
import codebuild = require('@aws-cdk/aws-codebuild')

import { WebBuildProjectProps } from './interfaces'

export default class WebBuildProject extends cdk.Construct {
  public readonly entity: codebuild.IProject

  constructor(parent: cdk.Stack, id: string, props: WebBuildProjectProps) {
    super(parent, id)

    const { repository, buildSpec, projectName, env } = props
    const buildProjectName = `${projectName}-web-build-${env}`

    this.entity = new codebuild.Project(this, buildProjectName, {
      projectName: buildProjectName,
      source: new codebuild.CodeCommitSource({ repository }),
      buildSpec: buildSpec ? buildSpec : this.makeDefaultBuildSpec(env),
      description: `Build web project for ${env}`
    })
  }

  private makeDefaultBuildSpec(env: string) {
    return {
      version: '0.2',
      phases: {
        pre_build: {
          commands: [
            'npm ci',
            `ENVIRONMENT=${env.toLowerCase()} node configureEnv.js`
          ]
        },
        build: {
          commands: [`npm run build:${env.toLowerCase()}`]
        }
      },
      artifacts: {
        files: '**/*',
        'base-directory': 'build'
      }
    }
  }
}
