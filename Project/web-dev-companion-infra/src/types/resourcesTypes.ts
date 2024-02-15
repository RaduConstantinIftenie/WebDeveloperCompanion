import { ISecurityGroup, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";

export type VpcArguments = {
  vpcName: string;
  subnetConfiguration: {
    cidrMask: number;
    name: string;
    subnetType: SubnetType;
    mapPublicIpOnLaunch?: boolean;
  }[];
};

export type RdsArguments = {
  databaseName: string;
  username: string;
  vpc: Vpc;
  port: number;
  securityGroups: ISecurityGroup[];
};

export type SgArguments = {
  securityGroupName: string;
  vpc: Vpc;
  description: string;
  allowAllOutbound?: boolean;
};

export type Ec2BastionArguments = {
  vpc: Vpc;
  subnetType: SubnetType;
  securityGroup: ISecurityGroup;
  keyName: string;
};
