import 'source-map-support/register'
import { deleteTodoItemForUser } from '../../businessLogic/todoService'


import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("processing deleteTodo event - "+event);

  const todoId = event.pathParameters.todoId;

  deleteTodoItemForUser(todoId, getUserId(event));
  
  //TODO: get the old todoItem back and if it has attachment url, then remove the media from s3 bucket as well
  
  return {
    statusCode: 204,
    body: ''
  }

})

handler.use(
  cors({
      credentials: true
  })
)
