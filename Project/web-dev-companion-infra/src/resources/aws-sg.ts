import { IPeer, Peer, Port, SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

import AwsResource from "../interfaces/awsResource";
import { SgArguments } from "../types";
import { SgRuleTypes } from "../enums/SgRuleTypes";

export class AwsSg extends Construct implements AwsResource<SecurityGroup> {
  private vpc: Vpc;
  public resource: SecurityGroup;

  constructor(scope: Construct, id: string, props: SgArguments) {
    super(scope, id);

    const { securityGroupName, vpc, description, allowAllOutbound } = props;

    this.vpc = vpc;
    this.resource = new SecurityGroup(this, id, {
      securityGroupName,
      vpc,
      description,
      allowAllOutbound: allowAllOutbound || false,
    });
  }

  public addRule(ruleType: SgRuleTypes, port: Port, peer: IPeer): void {
    const parameters: [IPeer, Port, string] = [
      peer,
      port,
      `Allow port ${port} as ${ruleType} for vpc ${this.vpc.vpcId}.`,
    ];

    switch (ruleType) {
      case SgRuleTypes.Ingress:
        this.resource.addIngressRule(...parameters);
        break;
      case SgRuleTypes.Egress:
        this.resource.addEgressRule(...parameters);
        break;
    }
  }
}
