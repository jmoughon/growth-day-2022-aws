#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { GrowthDay2022AwsJamesMoughonStack } from "../lib/growth-day-2022-aws-james-moughon-stack";

const app = new cdk.App();
new GrowthDay2022AwsJamesMoughonStack(
  app,
  "GrowthDay2022AwsJamesMoughonStack",
  {
    /* If you don't specify 'env', this stack will be environment-agnostic.
     * Account/Region-dependent features and context lookups will not work,
     * but a single synthesized template can be deployed anywhere. */

    /* Uncomment the next line to specialize this stack for the AWS Account
     * and Region that are implied by the current CLI configuration. */
    // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to. */
    env: { account: "082357080898", region: "us-east-2" },

    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  }
);
