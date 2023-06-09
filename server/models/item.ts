import mongoose, { Document, Schema } from 'mongoose';

// interface IShoppingItem extends Document {
//   name: string;
//   category: 'Today' | 'Soon' | 'Long term';
// }

const ShoppingItemSchema: Schema = new mongoose.Schema({
  _id: {type:String, required: true},
  name: { type: String, required: true },
  category: { type: String, required: true },
  done: { type: Boolean, required: true }
});

export const ShoppingItem = mongoose.model('ShoppingItem', ShoppingItemSchema);


