import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export class WebDevCompanionInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'WebDevCompanionInfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    new Bucket(this, "mytestbucket", {
      bucketName: "mytestbucketzzxxssdd",
    });
  }
}
