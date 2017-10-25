import mongoose from 'mongoose';
import CommonPlugin from './plugins/common';

const Schema = mongoose.Schema;

const Groups = new Schema({
  name: { type: String, required: true },
  sort: { type: Number, default: 99, required: true },
  parent_type: { type: Number, default: 0, required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  parent: { type: Schema.Types.ObjectId, ref: 'Group' },
  parents: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

Groups.plugin(CommonPlugin);

export default mongoose.model('Group', Groups);
