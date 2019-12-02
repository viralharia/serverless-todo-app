import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoDataAccess } from '../dataLayer/TodosDataAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoDataAccess:TodoDataAccess = new TodoDataAccess()

export async function getAllTodosForUser(userId: string): Promise<TodoItem[]> {
  return todoDataAccess.getAllTodosForUser(userId);
}

export async function deleteTodoItemForUser(todoId:string, userId: string){
    todoDataAccess.deleteToItem(todoId,userId);
}

export async function updateAttachmentUrlForTodoItem(todoId:string, userId: string, imageUrl:string) : Promise<void>{
    return todoDataAccess.updateToDoItemAttachmentURL(todoId, userId, imageUrl);
}

export async function createTodoItem(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  

  return await todoDataAccess.createTodoItem({
    todoId: uuid.v4(),
    createdAt: new Date().toISOString(),
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false
  });
}

export async function updateTodoItem(todoId:string, userId: string, updateTodoRequest: UpdateTodoRequest ): Promise<TodoItem> {
    return todoDataAccess.updateToDoItem(todoId, userId, updateTodoRequest);
}

