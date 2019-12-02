// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '1svpv949b7'
export const apiEndpoint = `https://${apiId}.execute-api.ap-south-1.amazonaws.com/dev`
//export const apiEndpoint = ` http://localhost:3003`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'udagram-serverless.auth0.com',            // Auth0 domain
  clientId: 'wvGHGM0pSJaKqSx8bFCVxyRvH9KI5KUk',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
