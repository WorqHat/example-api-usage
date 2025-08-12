import dotenv from "dotenv";
import Worqhat from "worqhat";

dotenv.config();

const API_KEY = process.env.API_KEY || "";

export const client = new Worqhat({
  apiKey: API_KEY,
});

export async function dbNlQuery() {
    const question = "How many rows are in my_table?";
    const table = "customer_management_data";

    const response = await client.db.processNlQuery({
        question,
        table,
    })

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
//   "message": "7 record(s) fetched successfully from customer_management_data"
// }