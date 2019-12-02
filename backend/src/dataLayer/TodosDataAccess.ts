import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWS from 'aws-sdk'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

export class TodoDataAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly TodosTable = process.env.TODOS_TABLE,
    private readonly TodosIndex = process.env.TODO_INDEX_NAME) {
  }

  async getAllTodosForUser(userId:string): Promise<TodoItem[]> {
    console.log('Getting all Todos'+userId)

    const result = await this.docClient.query({
      TableName: this.TodosTable,
      IndexName: this.TodosIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
    }).promise()

    const items = result.Items
    return items as TodoItem[];
  }

  async createTodoItem(item: TodoItem): Promise<TodoItem> {

    console.log("adding new todoItem in db - "+item.todoId);
    
    await this.docClient.put({
      TableName: this.TodosTable,
      Item: item
    }).promise()

    
    return item;
  }

  async deleteToItem(todoItemId:string, userId: string):Promise<void>{

    console.log("deleting item - "+todoItemId+", user - "+userId);
    await this.docClient.delete({
      TableName: this.TodosTable,
      Key:{
        "todoId": todoItemId,
        "userId": userId
      }
    }).promise();
  }


  async updateToDoItemAttachmentURL(todoItemId:string, userId: string, imageUrl:string):Promise<void>{

    await this.docClient.update({
      TableName: this.TodosTable,
      Key:{
        "todoId": todoItemId,
        "userId": userId
      },
      UpdateExpression: 'SET attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': imageUrl
      }
    }).promise();

  }

  async updateToDoItem(todoItemId:string, userId: string, updateTodoRequest: UpdateTodoRequest):Promise<TodoItem>{
    const result =  await this.docClient.update({
      TableName: this.TodosTable,
      Key:{
        "todoId": todoItemId,
        "userId": userId
      },
      UpdateExpression: 'SET #todoItemName = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeValues: {
        ':name': updateTodoRequest.name,
        ':dueDate': updateTodoRequest.dueDate,
        ':done': updateTodoRequest.done
      },
      ExpressionAttributeNames: {
        "#todoItemName": "name"
      },
      ReturnValues: 'ALL_NEW'
    }).promise();

    return result.Attributes as TodoItem;
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}
