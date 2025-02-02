import redisClient from "../utils/redis";
import dbClient from "../utils/db";
import { v4 as uuidv4 } from 'uuid';

const crypto = require('crypto');
import bcrypt from "bcryptjs";


async function hashPasswd(password) {
   const salt = await bcrypt.genSalt(10);
   const genHash = await bcrypt.hash(password, salt);
  return genHash;
}

class AuthController {
  static async getConnect(req, res) {
    const user = req.header('Authorization');
    if (!user || user.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = user.substring(6);
    const buff = Buffer.from(data, 'base64').toString('utf-8');
    const credentials = buff.split(':');
    if (!credentials || credentials.length === 1) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const email = credentials[0].toString('utf-8');
    const psswd = credentials[1].toString('utf-8');
    const hashpwd = await hashPasswd(psswd);
    const search = await dbClient.db.collection('users').find({ email, password: hashpwd }).toArray();

    if (search.length < 1) {
      return res.status(401).json({ error: 'Unauthorized' });
    } if (hashpwd !== search[0].password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const key = uuidv4();
    const token = `auth_${key}`;
    await redisClient.set(token, search[0]._id.toString(), 86400);
    return res.status(200).json({ token: key });
  }

  static async getDisconnect(req, res) {
    const key = req.header('X-Token');
    if (!key || key.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (await redisClient.get(`auth_${key}`)) {
      await redisClient.del(`auth_${key}`);
      return res.status(204).end();
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = AuthController;
