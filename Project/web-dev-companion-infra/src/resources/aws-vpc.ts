import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

import { VpcArguments } from "../types";
import AwsResource from "../interfaces/awsResource";

export class AwsVpc extends Construct implements AwsResource<Vpc> {
  public resource: Vpc;

  constructor(scope: Construct, id: string, props: VpcArguments) {
    super(scope, id);

    const { vpcName, subnetConfiguration } = props;

    this.resource = new Vpc(this, id, {
      vpcName,
      natGateways: 0,
      maxAzs: 2,
      subnetConfiguration,
    });
  }
}
