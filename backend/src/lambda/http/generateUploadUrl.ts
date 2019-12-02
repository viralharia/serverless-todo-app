import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { updateAttachmentUrlForTodoItem } from '../../businessLogic/todoService'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'

const image_bucket_name = process.env.IMAGES_S3_BUCKET;
const EXPIRES:number = parseInt(process.env.SIGNED_URL_EXPIRATION, 10);
const XAWS = AWSXRay.captureAWS(AWS);

const s3Client = new XAWS.S3({
  signatureVersion: 'v4'
})

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  console.log("todoId = "+todoId);

  let imageUrl:string = `https://${image_bucket_name}.s3.amazonaws.com/${todoId}`;

  await updateAttachmentUrlForTodoItem(todoId, getUserId(event), imageUrl);

  const url = getUploadUrl(todoId)

  return {
      statusCode : 200,
      body : JSON.stringify({
          uploadUrl: url
      })
  }
})

function getUploadUrl(todoId: string): string{
  return s3Client.getSignedUrl('putObject', {
    Bucket: image_bucket_name,
    Key: todoId,
    Expires: EXPIRES
  })
}

handler.use(
  cors({
      credentials: true
  })
)
