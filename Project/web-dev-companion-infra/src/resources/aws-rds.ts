import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  PostgresEngineVersion,
  StorageType,
} from "aws-cdk-lib/aws-rds";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { InstanceClass, InstanceSize, InstanceType } from "aws-cdk-lib/aws-ec2";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";

import AwsResource from "../interfaces/awsResource";
import { RdsArguments } from "../types";

export class AwsRds extends Construct implements AwsResource<DatabaseInstance> {
  public resource: DatabaseInstance;

  constructor(scope: Construct, id: string, props: RdsArguments) {
    super(scope, id);

    const { databaseName, username, vpc, port, securityGroups } = props;

    const secret = new Secret(this, `${databaseName}-credentials`, {
      secretName: `${databaseName}-credentials`,
      description: "Database master user credentials.",
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username }),
        generateStringKey: "password",
        passwordLength: 16,
        excludePunctuation: true,
      },
    });

    const engine = DatabaseInstanceEngine.postgres({
      version: PostgresEngineVersion.VER_15_3,
    });

    this.resource = new DatabaseInstance(this, id, {
      databaseName,
      credentials: Credentials.fromSecret(secret),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      storageType: StorageType.GP2,
      allocatedStorage: 20,
      vpc,
      vpcSubnets: { subnets: vpc.isolatedSubnets },
      engine,
      port,
      securityGroups,
      backupRetention: Duration.days(0), // disable automatic DB snapshot retention
      deleteAutomatedBackups: true,
      removalPolicy: RemovalPolicy.DESTROY,
      storageEncrypted: true,
    });
  }
}
