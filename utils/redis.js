import { promisify } from "util";

import redis from "redis";
class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on("error", (error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const getval = await promisify(this.client.get).bind(this.client);
    const val = await getval(key);
    return val;
  }

  async set(key, val, duration) {
    await this.client.set(key, val);
    await this.client.expire(key, duration);
  }

  async del(key) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
