import mongoose from 'mongoose';
import CommonPlugin from './plugins/common';

const Schema = mongoose.Schema;

const Apis = new Schema({
  name: { type: String, required: true },
  type: { type: Number, required: true },
  status: { type: Number, required: true },
  sort: { type: Number, default: 99, required: true },
  parent: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  use: String,
  release_status: String,
  version_status: { type: Number, required: true },
  refer_to: String,
  compatibility: Object,
  parent_type: { type: Number, required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
});

Apis.plugin(CommonPlugin);

export default mongoose.model('Api', Apis);
