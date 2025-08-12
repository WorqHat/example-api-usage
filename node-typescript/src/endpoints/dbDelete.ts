import dotenv from "dotenv";
import Worqhat from "worqhat";

dotenv.config();

const API_KEY = process.env.API_KEY || "";

export const client = new Worqhat({
  apiKey: API_KEY,
});

export async function dbDelete() {
  const table = "users";

  // Where usage:
  // - You can provide a SINGLE condition, e.g. { id: "123" }
  // - Or MULTIPLE conditions, e.g. { id: "123", email: "user@example.com" }
  //   Multiple keys are treated as AND filters (id = '123' AND email = 'user@example.com').
  //
  // Examples:
  // const whereSingle = { id: "123" };
  // const whereMultiple = { id: "123", email: "user@example.com" };

  const where = {
    id: "123",
    email: "user@example.com",
  };

  const response = await client.db.deleteRecords({
    table,
    where,
  });

  console.log(JSON.stringify(response, null, 2));
}

// Sample Response:
// {
//   "success": true,
//   "table": "users",
//   "count": 1,
//   "executionTime": 241,
//   "message": "Data deleted successfully from users"
// }
