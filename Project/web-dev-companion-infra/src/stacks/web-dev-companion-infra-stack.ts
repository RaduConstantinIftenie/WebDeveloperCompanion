import { Peer, Port, SubnetType } from "aws-cdk-lib/aws-ec2";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import { environment } from "../config/environment";
import { AwsCnfKeyPair, AwsEc2, AwsRds, AwsSg, AwsVpc } from "../resources";
import { SgRuleTypes } from "../enums/SgRuleTypes";

export class WebDevCompanionInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const { stage, rdsPort } = environment;

    const vpc = new AwsVpc(this, `wed-vpc`, {
      vpcName: `wed-${stage}-vpc`,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "wed-isolated-subnet",
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
        {
          cidrMask: 24,
          name: "wed-public-subnet",
          subnetType: SubnetType.PUBLIC,
          mapPublicIpOnLaunch: true,
        },
      ],
    });

    const rdsSecurityGroup = new AwsSg(this, "wed-rds-sg", {
      securityGroupName: `wed-${stage}-rds-sg`,
      vpc: vpc.resource,
      description: "Security group for Rds PostgreSql.",
    });
    rdsSecurityGroup.addRule(
      SgRuleTypes.Ingress,
      Port.tcp(rdsPort),
      Peer.ipv4(vpc.resource.vpcCidrBlock)
    );

    new AwsRds(this, "wed-postgresql-rds", {
      databaseName: `wedDB`,
      username: "wedadmin",
      vpc: vpc.resource,
      port: rdsPort,
      securityGroups: [rdsSecurityGroup.resource],
    });

    const cfnKeyPair = new AwsCnfKeyPair(this, "wed-cfnkp", `wed-${stage}-cfnkp`);

    const bastionSg = new AwsSg(this, "wed-bastion-sg", {
      securityGroupName: `wed-${stage}-bastion-sg`,
      vpc: vpc.resource,
      description: "Security group for Ec2 bastion.",
      allowAllOutbound: true,
    });
    bastionSg.addRule(SgRuleTypes.Ingress, Port.tcp(22), Peer.anyIpv4());

    const bastionEc2 = new AwsEc2(this, "wed-bastion-ec2", {
      vpc: vpc.resource,
      securityGroup: bastionSg.resource,
      subnetType: SubnetType.PUBLIC,
      keyName: cfnKeyPair.resource.keyName,
    });
    bastionEc2.addUserData("bastionStartup.sh");
  }
}
