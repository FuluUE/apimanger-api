import mongoose from 'mongoose';
import bluebird from 'bluebird';
import mongooseLong from 'mongoose-long';
import config from './';
// import logger from '../utils/logger';

const logger = { info: console.log, error: console.error };

mongoose.Promise = bluebird;
mongooseLong(mongoose);
mongoose.set('debug', true);

export default function () {
  // create the database connection
  mongoose.set('debug', config.mongooseDebug);

  (async () => await reconnect())();// eslint-disable-line no-return-await
  return mongoose;
}

function reconnect() {
  return new Promise(async (resolve) => {
    try {
      await mongoose.connect(config.mongodb, { useMongoClient: true });
      resolve();
    } catch (err) {
      logger.error(err);
      logger.info(`attempting to reconnect in (${config.mongooseReconnectMs || 1000}) ms`);
      setTimeout(() => {
        resolve(reconnect());
      }, config.mongooseReconnectMs || 1000);
    }
  });
}
