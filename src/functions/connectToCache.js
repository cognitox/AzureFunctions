
import { createClient } from "redis";
import { ManagedIdentityCredential } from "@azure/identity";
//import * as dotenv from "dotenv";
//dotenv.config();
const userName = "";
const endPoint = "";
const clientId = "";

export async function callCache() {
  // Construct a Token Credential from Identity library, e.g. ClientSecretCredential / ClientCertificateCredential / ManagedIdentityCredential, etc.
  const credential = new ManagedIdentityCredential(clientId);
  const redisScope = "https://redis.azure.com/.default";

  // Fetch a Microsoft Entra token to be used for authentication. This token will be used as the password.
  let accessToken = await credential.getToken(redisScope);
  console.log("access Token", accessToken);

  // Create redis client and connect to the Azure Cache for Redis over the TLS port using the access token as password.
  const client = createClient({
    username: userName,
    password: accessToken.token,
    url: `redis://${endPoint}:6380`,
    pingInterval: 100000,
    socket: { 
      tls: true,
      keepAlive: 0 
    },
  });

  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
  // Set a value against your key in the Azure Redis Cache.
  //await client.set("Az:key", "value1312");
  // Get value of your key in the Azure Redis Cache.
  var cacheValue = await client.get("Az:key");
  console.log("value-", cacheValue);
  return cacheValue;
}

callCache().catch((err) => {
  console.log("error code: ", err.code);
  console.log("error message: ", err.message);
  console.log("error stack: ", err.stack);
});

