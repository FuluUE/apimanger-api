import mongoose from 'mongoose';
import CommonPlugin from './plugins/common';

const Schema = mongoose.Schema;

const Tags = new Schema({
  name: { type: String, required: true },
  sort: { type: Number, default: 99, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

Tags.plugin(CommonPlugin);

export default mongoose.model('Tag', Tags);
