import { createClient } from 'redis';

class RedisClient {
    /**
     * Creates a new RedisClient instance.
     */
    constructor() {
        this.client = createClient();
        this.client.on('error', err => {console.log('Redis Client Error', err.message || err.toString());
        this.isClientConnected = false;}
    );
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
    }
}