import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

import { VpcArguments } from "../types";

export class WedVpc extends Construct {
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
