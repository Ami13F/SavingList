import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ShoppingItem } from './models/item';

export type ItemType = {
  _id: string,
  success: boolean,
  name: String,
  category: String,
  done: boolean
}

export type GetItemResponse = {
  success: boolean,
  item: ItemType
}
export type GetItemsResponse = {
  success: boolean,
  items: ItemType[]
}

export type SolveTaskResponse = {
  success: boolean,
}

let backupListItems:Map<string, ItemType> 

export class ShoppingListDB {
  private mongoServer: MongoMemoryServer;
  private connection: mongoose.Connection;

  constructor() { }

  async connect(): Promise<void> {
    this.mongoServer = new MongoMemoryServer();
    const mongoUri = "mongodb+srv://genezio:genezio@cluster0.c6qmwnq.mongodb.net/?retryWrites=true&w=majority"
    //await this.mongoServer.getUri();

    await mongoose.createConnection(mongoUri).asPromise();
  }

  async disconnect(): Promise<void> {
    await this.connection.close();
    await this.mongoServer.stop();
  }

  async addItem(name: string, category: 'Today' | 'Soon' | 'Long term', done: boolean): Promise<GetItemResponse> {
    const item = { _id: "id" + Math.random().toString(16).slice(2), success: true, name: name, category: category, done: done }
    console.log("Add item: ",item._id, name, category, done)
    // backupListItems.set(item._id, item)
    return {
      success: true,
      item: item
    };
  }

  async updateItem(id: string, done: boolean): Promise<SolveTaskResponse> {
    console.log("Update item with: ",id, done)
    // backupListItems.set(id, backupListItems.get(id)!)
    await ShoppingItem.updateOne(
      { _id: id },
      {
        done: done
      }
    ).maxTimeMS(30000);

    return { success: true };
  }

  async getItemsByCategory(category: 'Today' | 'Soon' | 'Long term'): Promise<GetItemsResponse> {
    console.log("Getting all items by category: ", category)
    const listOfItems = (await ShoppingItem.find().maxTimeMS(30000)).map(item => ({
      _id: item._id ?? '',
      category: item.category,
      name: item.name,
      done: !!item.done ?? false,
      success: true
    }))
    
    return { success: true, items: listOfItems };
  }

}