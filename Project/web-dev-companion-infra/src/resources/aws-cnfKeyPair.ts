import { CfnKeyPair } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

import AwsResource from "../interfaces/awsResource";

export class AwsCnfKeyPair
  extends Construct
  implements AwsResource<CfnKeyPair>
{
  public resource: CfnKeyPair;

  constructor(scope: Construct, id: string, keyName: string) {
    super(scope, id);

    this.resource = new CfnKeyPair(this, id, {
      keyName,
    });
  }
}
