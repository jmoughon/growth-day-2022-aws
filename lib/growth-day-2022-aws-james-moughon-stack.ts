import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";

export class GrowthDay2022AwsJamesMoughonStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Create an Identity provider for GitHub inside your AWS Account. This
     * allows GitHub to present itself to AWS IAM and assume a role.
     */
    const provider = new iam.OpenIdConnectProvider(this, "MyProvider", {
      url: "https://token.actions.githubusercontent.com",
      clientIds: ["sts.amazonaws.com"],
    });
    const githubOrganisation = "jmoughon";
    // Change this to the repo you want to push code from
    const repoName = "growth-day-2022-aws";
    /**
     * Create a principal for the OpenID; which can allow it to assume
     * deployment roles.
     */
    const GitHubPrincipal = new iam.OpenIdConnectPrincipal(
      provider
    ).withConditions({
      StringLike: {
        "token.actions.githubusercontent.com:sub": `repo:${githubOrganisation}/${repoName}:*`,
      },
    });

    /**
     * Create a deployment role that has short lived credentials. The only
     * principal that can assume this role is the GitHub Open ID provider.
     *
     * This role is granted authority to assume aws cdk roles; which are created
     * by the aws cdk v2.
     */
    new iam.Role(this, "GitHubActionsRole", {
      assumedBy: GitHubPrincipal,
      description:
        "Role assumed by GitHubPrincipal for deploying from CI using aws cdk",
      roleName: "github-ci-role",
      maxSessionDuration: cdk.Duration.hours(1),
      inlinePolicies: {
        CdkDeploymentPolicy: new iam.PolicyDocument({
          assignSids: true,
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["sts:AssumeRole"],
              resources: [`arn:aws:iam::${this.account}:role/cdk-*`],
            }),
          ],
        }),
      },
    });

    new ec2.Vpc(this, "GrowthDay2022AwsJamesMoughonVpc", {
      // CHANGE: this is where we define how many AZs to use
      maxAzs: 2,

      // CHANGE: We define a single subnet configuration per AZ.
      subnetConfiguration: [
        {
          // CHANGE: this is it's CIDR mask so 255.255.255.0
          cidrMask: 24,

          // CHANGE: a name for each of these subnets
          name: "GrowthDay2022AwsJamesMoughon-subnet",

          // CHANGE: and the subnet type to be used - here we will have
          // a public subnet. There are other options available here.
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });
  }
}
