import cdk = require('@aws-cdk/cdk')
import codebuild = require('@aws-cdk/aws-codebuild')

import { WebBuildProjectProps } from './interfaces'
import BuildSlackNotifier from '../../constructs/buildNotifier/BuildSlackNotifier'


export default class WebBuildProject extends cdk.Construct {
  public readonly entity: codebuild.IProject

  constructor(parent: cdk.Stack, id: string, props: WebBuildProjectProps) {
    super(parent, id)

    const { serviceName, repository, buildSpec } = props
    const projectName = `${serviceName}-web-build`
    const notifier = new BuildSlackNotifier(this, `${serviceName}-web-notifier`, { serviceName })

    this.entity = new codebuild.Project(this, projectName, {
      projectName,
      source: new codebuild.CodeCommitSource({ repository }),
      buildSpec: buildSpec ? buildSpec : this.makeDefaultBuildSpec(),
      description: `Build ${serviceName} web project`
    })

    this.entity.onBuildSucceeded(`trigger-${serviceName}-web-build-succeeded`, {
      target: notifier.makeTarget({
        component: 'web',
        isBuildSuccessful: true
      })
    })

    this.entity.onBuildFailed(`trigger-${serviceName}-web-build-failed`, {
      target: notifier.makeTarget({
        component: 'web',
        isBuildSuccessful: false
      })
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