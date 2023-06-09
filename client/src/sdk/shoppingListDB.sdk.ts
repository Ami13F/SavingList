/**
* This is an auto generated code. This code should not be modified since the file can be overwriten
* if new genezio commands are executed.
*/

import { Remote } from "./remote";

export type ItemType = {_id: string, success: boolean, name: String, category: String, done: boolean};
export type GetItemResponse = {success: boolean, item: ItemType};
export type GetItemsResponse = {success: boolean, items: Array<ItemType>};
export type SolveTaskResponse = {success: boolean};

export class ShoppingListDB {
  static remote = new Remote("http://127.0.0.1:8083/ShoppingListDB");

  static async connect(): Promise<any> {
    return await ShoppingListDB.remote.call("ShoppingListDB.connect");
  }
  static async disconnect(): Promise<any> {
    return await ShoppingListDB.remote.call("ShoppingListDB.disconnect");
  }
  static async addItem(name: string, category: any | any | any, done: boolean): Promise<GetItemResponse> {
    return await ShoppingListDB.remote.call("ShoppingListDB.addItem", name, category, done);
  }
  static async updateItem(id: string, done: boolean): Promise<SolveTaskResponse> {
    return await ShoppingListDB.remote.call("ShoppingListDB.updateItem", id, done);
  }
  static async getItemsByCategory(category: any | any | any): Promise<GetItemsResponse> {
    return await ShoppingListDB.remote.call("ShoppingListDB.getItemsByCategory", category);
  }
}

export { Remote };
