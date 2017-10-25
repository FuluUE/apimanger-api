import path from 'path';
import fs from 'fs';
import NodeRSA from 'node-rsa';

function decrypt(str) {
  const privateKey = fs.readFileSync(path.join(__dirname, '../config/private.pem'));
  const rsa = new NodeRSA(privateKey, { encryptionScheme: 'pkcs1' });

  return rsa.decrypt(str).toString();
}

function encrypt(str) {
  const privateKey = fs.readFileSync(path.join(__dirname, '../config/private.pem'));
  const rsa = new NodeRSA(privateKey, { encryptionScheme: 'pkcs1' });

  return rsa.encrypt(str, 'base64').toString();
}

export default { decrypt, encrypt };
