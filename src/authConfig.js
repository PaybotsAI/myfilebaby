// authConfig.js
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
    auth: {
//        clientId: "2be92905-5f2c-49bb-a1ba-3664388dd3a8",
//        authority: "https://login.microsoftonline.com/73bc0c96-da02-4596-acb7-953c57ed55ac",
//        redirectUri: "https://my.file.baby"
        clientId: "cecf9ab2-8682-4ad6-9f85-3812fe5efba0",
        authority: "https://login.microsoftonline.com/73bc0c96-da02-4596-acb7-953c57ed55ac",
       redirectUri: "https://dev-my.file.baby"
//      test to log in using file baby tenant
//        clientId: "247f5d06-8776-4fa6-9cc4-390826e2704c",
 //       authority: "https://login.microsoftonline.com/1cb7b2f8-2a75-4a9c-82a0-43d42a2e5b5e",

//        authority: "https://filebaby.b2clogin.com/filebaby.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_susi",
//        authority: "https://filebaby.b2clogin.com/filebaby.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_SignUpOrSignIn&client_id=247f5d06-8776-4fa6-9cc4-390826e2704c&nonce=defaultNonce&redirect_uri=https%3A%2F%2Fdev-my.file.baby&scope=openid&response_type=code&prompt=login&code_challenge_method=S256&code_challenge=lxktjEhT1an5CaAk1Ts7xX_DoV1IqX5paL2ZGSJ6Y3A",
//        redirectUri: "https://dev-my.file.baby"

    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true,
    }
};

const msalInstance = new PublicClientApplication(msalConfig);

export default msalInstance;
