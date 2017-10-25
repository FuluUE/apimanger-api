import fs from 'fs-extra';
import uuidV1 from 'uuid/v1';
import path from 'path';
import moment from 'moment';
import config from '../config';
// import ApiError from '../errors/ApiError';

export async function base64(ctx) {
  const { img } = ctx.request.body;

  const base64Data = img.replace(/^data:image\/\w+;base64,/, '');
  const dataBuffer = new Buffer(base64Data, 'base64');

  const uploadDir = path.join('upload', 'images', moment().format('YYYYMMDD'));
  fs.mkdirsSync(uploadDir);
  const filepath = path.join(uploadDir, `${uuidV1()}.png`);

  fs.writeFileSync(filepath, dataBuffer);
  let urlPath = filepath;
  if (path.sep === '\\') {
    urlPath = urlPath.replace(/\\/g, '/');
  }
  ctx.body = `${config.api}/${urlPath.replace('upload/', '')}`;
}
