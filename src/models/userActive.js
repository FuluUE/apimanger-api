import mongoose from 'mongoose';
import CommonPlugin from './plugins/common';

const Schema = mongoose.Schema;

const UserActives = new Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  is_used: { type: Boolean, required: true, default: false },
});

UserActives.plugin(CommonPlugin);

export default mongoose.model('UserActive', UserActives);
