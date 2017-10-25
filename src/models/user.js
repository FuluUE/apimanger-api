import mongoose from 'mongoose';
import CommonPlugin from './plugins/common';

const Schema = mongoose.Schema;

const Users = new Schema({
  email: { type: String, required: true, index: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  reg_ip: { type: String, required: true },
  is_actived: { type: Boolean, required: true, default: false },
  is_locked: { type: Boolean, required: true, default: false },
});

Users.plugin(CommonPlugin);

export default mongoose.model('User', Users);
