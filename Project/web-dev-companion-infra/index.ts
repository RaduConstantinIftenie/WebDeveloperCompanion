#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { WebDevCompanionInfraStack } from './src/stacks/web-dev-companion-infra-stack';
import { environment } from './src/config/environment';

const app = new cdk.App();
new WebDevCompanionInfraStack(app, 'WebDevCompanionInfraStack', {
  env: {
    account: environment.awsAccount,
    region: environment.awsRegion,
  },
});