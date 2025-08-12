import dotenv from "dotenv";
import Worqhat from "worqhat";

dotenv.config();

const API_KEY = process.env.API_KEY || "";

export const client = new Worqhat({
  apiKey: API_KEY,
});

export async function dbUpdate() {
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
  const data = {
    status: "active",
    name: "Updated Name",
  };

  const response = await client.db.updateRecords({
    table,
    where,
    data,
  });

  console.log(JSON.stringify(response, null, 2));
}

// Sample Response:
// {
//   "success": true,
//   "data": [
//     {
//       "documentId": "22904fb3-8ead-44de-83f6-4689d4958d7d",
//       "createdAt": "2025-08-05 18:36:40",
//       "updatedAt": "2025-08-11 11:40:36",
//       "customer_name": "Alice Johnson",
//       "customer_email": "alice@example.com",
//       "customer_phone_number": "+91-9876543210",
//       "customer_address": "456 Park Street, Mumbai",
//       "customer_type": "individual"
//     }
//     {Additional Records}
//   ],
//   "count": 7,
//   "executionTime": 387,
//   "message": "7 record(s) updated successfully in customer_management_data"
// }