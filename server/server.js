import { v2 as cloudinary } from "cloudinary";
import http from "http";

import app from "./app.js";
import connectToDB from "./src/configs/dbConn.js";

const port = process.env.PORT || 10000;

// ✅ Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Create HTTP server (Express wrapped)
const server = http.createServer(app);

// ✅ Dynamically choose allowed origins
const allowedOrigins = [
  "http://localhost:5173", // frontend dev
  process.env.FRONTEND_URL, // production
].filter(Boolean); // remove undefined/null


// ✅ Start server + connect DB
server.listen(port, async () => {
  await connectToDB();
  console.log(`🚀 Server running at port ${port}`);
  console.log(`✅ Allowed Origins:`, allowedOrigins);
});
