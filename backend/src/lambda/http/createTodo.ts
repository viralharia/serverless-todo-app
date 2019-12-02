import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodoItem } from '../../businessLogic/todoService'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("processing createToDo event.."+event);

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  
  const newItem:TodoItem = await createTodoItem(newTodo, getUserId(event))
  console.log("new todo item created"+newItem.todoId);
  return {
    statusCode: 201,
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
