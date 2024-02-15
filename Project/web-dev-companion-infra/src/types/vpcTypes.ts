import { SubnetType } from "aws-cdk-lib/aws-ec2";

export type VpcArguments = {
  vpcName: string;
  subnetConfiguration: {
    cidrMask: number;
    name: string;
    subnetType: SubnetType;
    mapPublicIpOnLaunch?: boolean;
  }[];
};
