const RedisStore = require('connect-redis').default
const { createClient } = require('redis')
const { RateLimiterRedis } = require('rate-limiter-flexible');

 // Initialize client.
const redisClient = createClient({
    enable_offline_queue: false,
  })
redisClient.connect().catch(console.error)

// Initialize store.
const sessionRedisStore = new RedisStore({
  client: redisClient,
  prefix: `${process.env.APP_NAME}:`,
})

const maxAttemptsByIpPerTwoMinute = 1;
const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 10;

const redisLimiterSlowBruteByIPForForgotPassword = new RateLimiterRedis({
    useRedisPackage: true,
  storeClient: redisClient,
  keyPrefix: 'forgot_password_throtteling',
  points: maxAttemptsByIpPerTwoMinute,
  duration: 60 * 2, // 2 mins
  blockDuration: 60 * 2 * 24, // 2 mins
});

const redisLimiterSlowBruteByIPForLogin = new RateLimiterRedis({
    useRedisPackage: true,
  storeClient: redisClient,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day
});

const redisLimiterConsecutiveFailsByUsernameAndIPForLogin = new RateLimiterRedis({
    useRedisPackage: true,
  storeClient: redisClient,
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
  blockDuration: 60 * 60, // Block for 1 hour
});

module.exports = {
    sessionRedisStore,
    redisLimiterSlowBruteByIPForLogin,
    redisLimiterSlowBruteByIPForForgotPassword,
    redisLimiterConsecutiveFailsByUsernameAndIPForLogin
}