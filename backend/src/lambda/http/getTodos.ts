import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getAllTodosForUser } from '../../businessLogic/todoService'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("processing getTodos event - "+event);
  
  let todoItems:TodoItem[] = await getAllTodosForUser(getUserId(event));
  return {
    statusCode: 200,
    body: JSON.stringify({
    items: todoItems
    })
  }

})

handler.use(
  cors({
      credentials: true
  })
)
