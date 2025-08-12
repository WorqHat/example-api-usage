import dotenv from "dotenv";
import Worqhat from "worqhat";

dotenv.config();

const API_KEY = process.env.API_KEY || "";

export const client = new Worqhat({
  apiKey: API_KEY,
});

export async function checkStatus() {
  const response = await client.getServerInfo();
  console.log(response);
}

// Sample Response
// {
//   name: 'WorqHat API',
//   message: "Welcome to WorqHat Endpoints and to WorqHat! Well, well, well... look at you poking around our API! That curiosity of yours? That's EXACTLY what we're looking for! Wanna turn that inquisitive mind into a career? We'd be thrilled to have you join the WorqHat crew! Apply now and let's build cool stuff together! 🚀 Drop your resume at https://careers.worqhat.com/",
//   version: '1.0.0',
//   status: 'running',
//   timestamp: '2025-08-12T11:00:51.461Z'
// }
