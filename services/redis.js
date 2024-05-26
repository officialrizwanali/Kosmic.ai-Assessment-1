const redis = require("redis");

// Check if Redis is up and running
async function checkRedisConnection() {
  return new Promise(async (resolve, reject) => {
    // const client = redis.createClient({
    //   host: "127.0.0.1",
    //   // host: "localhost",
    //   port: 6379,
    //   // port: 6380,
    //   // type: 'bull'
    //   retry_strategy: (options) => {
    //     if (options.error) {
    //       console.error("Redis connection error:", options.error);
    //       return new Error('Redis connection error');
    //     }
    //     if (options.total_retry_time > 1000 * 60 * 5) { // 5 minutes
    //       return new Error('Retry time exhausted');
    //     }
    //     if (options.attempt > 10) {
    //       return undefined; // End reconnecting after 10 attempts
    //     }
    //     return Math.min(options.attempt * 100, 3000); // Reconnect after
    //   },
    // });
    // client.on("ready", () => {
    //   console.log("Connected to Redis");
    //   client.quit(); // Close the connection
    //   resolve(); // Resolve the promise when connected
    // });
    // client.on("error", (err) => {
    //   console.error("Error connecting to Redis:", err);
    //   client.quit();
    //   reject(err);
    // });
    // // client.on("connect", () => {
    // //   // client.quit();
    // //   resolve();
    // // });
    // // Adding timeout to avoid hanging
    // client.on("connect", () => {
    //   setTimeout(() => {
    //     if (!client.connected) {
    //       console.error("Connection to Redis timed out");
    //       client.quit();
    //       reject(new Error("Connection timed out"));
    //     }
    //   }, 5000); // 5 seconds timeout
    // });

    // // client.connect();

    // // // Add a timeout for connection attempts
    // // setTimeout(() => {
    // //   console.error("Connection to Redis timed out");
    // //   client.quit(); // Close the connection
    // //   reject(new Error("Connection timed out")); // Reject with a timeout error
    // // }, 5000); // Timeout after 5 seconds

    const client = redis.createClient({
      url: "redis://127.0.0.1:6379",
    });

    client.on("error", (err) => {
      console.error("Error connecting to Redis:", err);
    });

    client.on("ready", () => {
      console.log("Connected to Redis");
    });

    try {
      await client.connect();
      await client.ping(); // Optional: Test the connection
      console.log("Ping successful");
      await client.quit();
      resolve();
    } catch (err) {
      console.error("Failed to connect to Redis:", err);
      await client.quit();
      reject(err);
      throw err;
    }
  });
}

module.exports = { checkRedisConnection };
