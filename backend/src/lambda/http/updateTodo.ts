import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodoItem } from '../../businessLogic/todoService'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  console.log("todoId = "+todoId);
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const newItem:TodoItem = await updateTodoItem(todoId, getUserId(event), updatedTodo );

  return {
    statusCode: 200,
    body: JSON.stringify({
      item:newItem
    })
  }
})

handler.use(
  cors({
      credentials: true
  })
)
