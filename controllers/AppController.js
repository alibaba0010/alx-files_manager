import redisClient from '../utils/redis';
import dbClient from '../utils/db';
class AppController {
  static getStatus(req, res) {
    if (redisClient.isAlive() && dbClient.isAlive()) {
      res.status(200).json({ redis: true, db: true }, 200);
    }
  }

  static async getStats(req, res) {
    const users = await redisClient.nbUsers();
    const files = await redisClient.nbFiles();
    const obj = {
      users,
      files,
    };
    res.status(200).json(obj);
  }
}

export default AppController;
