import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisclient = createClient({
  url: process.env.REDIS_URL,
});

redisclient.on("error", (err) => {
  console.error("Redis Error:", err);
});

export default redisclient;