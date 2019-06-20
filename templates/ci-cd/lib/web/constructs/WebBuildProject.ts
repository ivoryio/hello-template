import cdk = require('@aws-cdk/cdk')
import codebuild = require('@aws-cdk/aws-codebuild')

import { WebBuildProjectProps } from './interfaces'


export default class WebBuildProject extends cdk.Construct {
  public readonly entity: codebuild.IProject

  constructor(parent: cdk.Stack, id: string, props: WebBuildProjectProps) {
    super(parent, id)

    const { repository, buildSpec } = props
    const projectName = `web-build`

    this.entity = new codebuild.Project(this, projectName, {
      projectName,
      source: new codebuild.CodeCommitSource({ repository }),
      buildSpec: buildSpec ? buildSpec : this.makeDefaultBuildSpec(),
      description: `Build web project`
    })
  }

  private makeDefaultBuildSpec() {
    return {
      version: '0.2',
        phases: {
          pre_build: {
            commands: ['npm ci']
          },
          build: {
            commands: ['npm run build']
          }
        },
        artifacts: {
          files: '**/*',
          'base-directory': 'build'
        }
    }
  }
}