import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import {
  Cluster,
  Compatibility,
  ContainerImage,
  FargateService,
  FargateTaskDefinition,
  NetworkMode,
  TaskDefinition,
} from "aws-cdk-lib/aws-ecs";
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  PostgresEngineVersion,
  StorageType,
} from "aws-cdk-lib/aws-rds";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { ScheduledFargateTask } from "aws-cdk-lib/aws-ecs-patterns";
import { ApplicationLoadBalancer } from "aws-cdk-lib/aws-elasticloadbalancingv2";

export class WebDevCompanionInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const dynamoDb = new Table(this, "Users", {
    //   partitionKey: {
    //     name: "id",
    //     type: AttributeType.STRING,
    //   },
    //   billingMode: BillingMode.PROVISIONED,
    //   readCapacity: 10,
    //   writeCapacity: 10,
    // });

    // const vpc = new Vpc(this, "wed-vpc", {
    //   vpcName: "wed-vpc",
    //   natGateways: 0,
    //   maxAzs: 2,
    //   subnetConfiguration: [
    //     {
    //       cidrMask: 24,
    //       name: "public",
    //       subnetType: SubnetType.PUBLIC,
    //       mapPublicIpOnLaunch: true,
    //     },
    //   ],
    // });

    const vpc = Vpc.fromLookup(this, "ImportVPC", { isDefault: true });

    const sg = new SecurityGroup(this, "wed-sg", {
      securityGroupName: "wed-sg",
      vpc,
      description: "Security group for the the RDS PostgreSql.",
      allowAllOutbound: true,
    });

    sg.addIngressRule(Peer.anyIpv4(), Port.tcp(5432));

    sg.addIngressRule(Peer.anyIpv4(), Port.tcp(8080));

    sg.addIngressRule(Peer.anyIpv4(), Port.tcp(443));

    sg.addIngressRule(Peer.anyIpv4(), Port.tcp(80));

    const rdsSecret = new Secret(this, "wed-db-credentials", {
      secretName: "wed-db-credentials",
      description: "Database master user credentials",
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: "postgres" }),
        generateStringKey: "password",
        passwordLength: 16,
        excludePunctuation: true,
      },
    });

    const engine = DatabaseInstanceEngine.postgres({
      version: PostgresEngineVersion.VER_15_3,
    });

    const rds = new DatabaseInstance(this, "wed-db", {
      databaseName: "users",
      credentials: Credentials.fromSecret(rdsSecret),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      storageType: StorageType.GP2,
      allocatedStorage: 20,
      vpc,
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
      engine,
      port: 5432,
      securityGroups: [sg],
      backupRetention: Duration.days(0), // disable automatic DB snapshot retention
      deleteAutomatedBackups: true,
      removalPolicy: RemovalPolicy.DESTROY,
      storageEncrypted: true,
    });

    // const taskDefinition = new FargateTaskDefinition(this, "KeycloackTaskDef", {
    //   ephemeralStorageGiB: 2,
    // });

    // taskDefinition.addContainer("keycloack", {
    //   image: ContainerImage.fromRegistry("quay.io/keycloak/keycloak:23.0.5"),
    //   command: ["start-dev"],
    //   environment: {
    //     KEYCLOAK_ADMIN: "admin",
    //     KEYCLOAK_ADMIN_PASSWORD: "toor",
    //   },
    // });

    // new ScheduledFargateTask
    const taskDefinition = new TaskDefinition(this, "keycloack-task-def", {
      compatibility: Compatibility.FARGATE,
      family: "keycloak",
      cpu: "256",
      memoryMiB: "512",
      networkMode: NetworkMode.AWS_VPC,
      ephemeralStorageGiB: 21,
    });

    taskDefinition.addContainer("keycloak", {
      containerName: "keycloak",
      image: ContainerImage.fromRegistry("quay.io/keycloak/keycloak:23.0.5"),
      cpu: 256,
      memoryLimitMiB: 512,
      essential: true,
      portMappings: [
        { containerPort: 8080 },
        { containerPort: 8443 },
        { containerPort: 443 },
      ],
      environment: {
        DB_VENDOR: "dynamodb",
        DB_ADDR: rds.dbInstanceEndpointAddress,
        DB_DATABASE: "users",
        DB_USER: "keycloack",
        DB_PASSWORD: "keycloack",
        KEYCLOAK_USER: "admin",
        KEYCLOAK_PASSWORD: "superparola123",
      },
    });

    const cluster = new Cluster(this, "keycloak", {
      vpc,
      containerInsights: true,
    });

    new FargateService(this, "keycloack-fargate", {
      cluster,
      taskDefinition,
      desiredCount: 1,
      vpcSubnets: vpc.selectSubnets({
        subnetType: SubnetType.PUBLIC,
      }),
      assignPublicIp: true
    });

    // const alb = new ApplicationLoadBalancer(this, "keycloa-alb", {
    //   vpc,
    //   securityGroup: sg,
    // });

    // const listener = alb.addListener("keycloack-listener", { port: 80 });
    // listener.addTargets("keycloack-target", {
    //   port: 8080,
    //   healthCheck: {
    //     path: "/auth/realm/master",
    //   },
    // });
  }
}
