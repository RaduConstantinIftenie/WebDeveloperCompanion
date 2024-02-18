import {
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

import { Ec2BastionArguments } from "../types";
import AwsResource from "../interfaces/awsResource";
import { readFileSync } from "fs";
import { resolve } from "path";

export class AwsEc2 extends Construct implements AwsResource<Instance> {
  public resource: Instance;

  constructor(scope: Construct, id: string, props: Ec2BastionArguments) {
    super(scope, id);

    const { vpc, subnetType, securityGroup, keyName, instanceName } = props;

    this.resource = new Instance(this, id, {
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      machineImage: MachineImage.latestAmazonLinux2023(),
      vpc,
      vpcSubnets: {
        subnetType,
      },
      securityGroup,
      keyName,
      instanceName,
    });
  }

  public addUserData(fileName: string): void {
    const path = resolve(`./src/scripts/${fileName}`);
    const userDataScript = readFileSync(path, "utf8");

    this.resource.addUserData(userDataScript);
  }
}
