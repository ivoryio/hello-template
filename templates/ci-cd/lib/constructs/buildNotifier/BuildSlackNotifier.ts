import cdk = require('@aws-cdk/cdk')
import sns = require('@aws-cdk/aws-sns')
import lambda = require('@aws-cdk/aws-lambda')
import events = require('@aws-cdk/aws-events')
import targets = require('@aws-cdk/aws-events-targets')

import { ServiceProps } from '../interfaces'


export default class BuildSlackNotifier extends cdk.Construct {
  constructor(parent: cdk.Construct, id: string, props: ServiceProps) {
    super(parent, id)

    const { serviceName } = props
    const topicName = `${serviceName}-web-build-topic`

    this.topic = new sns.Topic(this, topicName, {
      topicName,
      displayName: topicName
    })

    const functionName = `${serviceName}-web-build-slack-notifier-lambda`
    const subscriber = new lambda.Function(this, functionName, {
      functionName,
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810,
      code: lambda.Code.asset('./lib/constructs/buildNotifier/lambda/'),
      environment: {
        'SLACK_WEBHOOK':'https://hooks.slack.com/services/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',
        'CHANNEL': '#ivory'
    } 
    })

    this.topic.subscribeLambda(subscriber)
  }
  
  public makeTarget(info: { component: string, isBuildSuccessful: boolean }) {
    const message = events.RuleTargetInput.fromObject(info)
    return new targets.SnsTopic(this.topic, { message })
  }

  private topic: sns.Topic
}