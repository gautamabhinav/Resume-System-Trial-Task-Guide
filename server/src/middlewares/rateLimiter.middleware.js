// import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
// import RedisStore from 'rate-limit-redis';
// import { createClient } from 'redis';


// const redisUrl = process.env.REDIS_URL;

// if (!redisUrl) {
//   throw new Error("❌ REDIS_URL is not defined in environment variables");
// }

// // Create Redis client
// // const redisClient = createClient({
// //   url: redisUrl,
// //   socket: {
// //     tls: true,                // Required for Upstash
// //     tls: redisUrl.startsWith("rediss://"), // enable TLS only if needed
// //     // rejectUnauthorized: false, // Prevents SSL issues
// //     rejectUnauthorized: true, // Prevents SSL issues


// //     // host: process.env.HOST || '127.0.0.1',
// //     // port: process.env.REDISPORT || 6379,
// //   },
// // });


// // import { createClient } from "redis";

// const redisClient = createClient({
//   url: process.env.REDIS_URL,
//   socket: {
//     tls: process.env.REDIS_URL.startsWith("rediss://"),
//     rejectUnauthorized: true, // only false if necessary
//   },
// });

// redisClient.on("error", (err) => console.error("Redis error:", err));

// await redisClient.connect();
// console.log("Redis connected ✅");


// // await redisClient.connect(); // Must be awaited before using

// // General rate limiter by IP
// export const ipLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//   }),
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: 'Too many requests from this IP. Please try again in 15 minutes.',
//   keyGenerator: ipKeyGenerator, // ✅ This solves the IPv6 warning

//   standardHeaders: true,
//   legacyHeaders: false,

//   // 👇 Insert your handler here
//   handler: (req, res, _next, options) => {
//     console.error(`⚠️ Rate limit hit: ${req.ip}`);
//     res.status(options.statusCode).json({
//       success: false,
//       message: options.message,
//     });
//   },
// });

// // Ultra-strict limiter (login/register/forgot-password)
// export const ultraStrictLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//   }),
//   windowMs: 5 * 60 * 1000, // 5 mins
//   max: 5,
//   message: 'Too many attempts. Please wait 5 minutes and try again.',
//   keyGenerator: ipKeyGenerator, // ✅ This solves the IPv6 warning

//   standardHeaders: true,
//   legacyHeaders: false,

//   // 👇 Insert your handler here
//   handler: (req, res, _next, options) => {
//     console.error(`⚠️ Rate limit hit: ${req.ip}`);
//     res.status(options.statusCode).json({
//       success: false,
//       message: options.message,
//     });
//   },
// });

// // Per-user limiter (for logged-in users)
// export const userLimiter = rateLimit({
//   store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//   }),
//   keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),
//   windowMs: 10 * 60 * 1000,
//   max: 50,
//   message: 'Too many requests from your account. Try again later.',
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: (req, res, _next, options) => {
//     console.error(`⚠️ Rate limit hit: ${req.ip}`);
//     res.status(options.statusCode).json({
//       success: false,
//       message: options.message,
//     });
//   },
// });


