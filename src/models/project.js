import mongoose from 'mongoose';
import CommonPlugin from './plugins/common';

const Schema = mongoose.Schema;

const Projects = new Schema({
  name: { type: String, required: true },
  language: { type: String, required: true },
  version: { type: String, required: true },
  hide: { type: Boolean, required: true, default: false },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

Projects.plugin(CommonPlugin);

export default mongoose.model('Project', Projects);
