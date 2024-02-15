import { SubnetType } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

import { WedVpc } from "../resources/vpc";
import { environment } from "../config/environment";
import { Stack, StackProps } from "aws-cdk-lib";

export class WebDevCompanionInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new WedVpc(this, `wed-vpc`, {
      vpcName: `wed-${environment.stage}-vpc`,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "wed-isolated-subnet",
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
        {
          cidrMask: 24,
          name: "wed-private-subnet",
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: "wed-public-subnet",
          subnetType: SubnetType.PUBLIC,
          mapPublicIpOnLaunch: true,
        },
      ],
    });
  }
}
