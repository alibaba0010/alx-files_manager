import { createClient } from "redis";

class RedisClient {
  /**
   * Creates a new RedisClient instance.
   */
  constructor() {
    this.client = createClient();
    this.client.on("error", (err) => {
      console.log("Redis Client Error", err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on("connect", () => {
      this.isClientConnected = true;
    });
  }
  /**
    Checks if this client's connection to the Redis server is active.
   @returns {boolean}
   */
  isAlive() {
    return this.isClientConnected;
  }
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }
  /**
   * Stores a key and its value along with an expiration time.
   * @param {String} key The key of the item to store.
   * @param {String | Number | Boolean} value The item to store.
   * @param {Number} duration The expiration time of the item in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX).bind(this.client)(key, duration, value);
  }
    /**
   * Removes the value of a given key.
   * @param {String} key The key of the item to remove.
   * @returns {Promise<void>}
   */
    async del(key) {
      await promisify(this.client.DEL).bind(this.client)(key);
    }
}

export const redisClient = new RedisClient();
export default redisClient;