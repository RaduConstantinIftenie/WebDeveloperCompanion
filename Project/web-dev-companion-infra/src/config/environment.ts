import "dotenv/config";

class Environment {
  public static instance: Environment;

  public stage: string;
  public awsAccount: string;
  public awsRegion: string;
  public rdsPort: number;

  private constructor() {
    this.stage = this.getVariable("STAGE", true);
    this.awsAccount = this.getVariable("AWS_ACCOUNT", true);
    this.awsRegion = this.getVariable("AWS_REGION", true);
    this.rdsPort = parseInt(this.getVariable("RDS_PORT", false, "5432"));
  }

  public static getInstance() {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }

    return Environment.instance;
  }

  private getVariable(
    key: string,
    isRequired: boolean,
    defaultValue?: string
  ): string {
    if (isRequired && !process.env[key]) {
      throw new Error(
        `No value found for required environment variable for key: ${key}`
      );
    }

    if (!(isRequired || defaultValue)) {
      throw new Error(
        `No default value supplied for optional environment variable: ${key}`
      );
    }

    return process.env[key] || (defaultValue as string);
  }
}

export const environment = Environment.getInstance();
