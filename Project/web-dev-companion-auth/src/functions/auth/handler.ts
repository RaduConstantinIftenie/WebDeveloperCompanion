import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from "aws-lambda";
import { JwksClient } from "jwks-rsa";
import { decode, verify } from "jsonwebtoken";

export const main = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  const token = event.authorizationToken;
  const methodArn = event.methodArn;

  console.log("1: ", token);

  const decodedToken = decode(token, { complete: true });
  console.log("2: ", decodedToken);
  const kid = decodedToken.header.kid;
  console.log("3: ", kid);

  const client = new JwksClient({
    jwksUri:
      "http://52.17.196.216:8080/auth/realms/wed/protocol/openid-connect/certs",
  });

  const key = await client.getSigningKey(kid);
  const signingKey = key.getPublicKey();

  try {
    verify(token, signingKey);
  } catch (error) {

    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: methodArn,
          },
        ],
      },
    };
  }

  return {
    principalId: "user",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: methodArn,
        },
      ],
    },
  };
};
