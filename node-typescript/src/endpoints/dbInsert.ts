import dotenv from 'dotenv';
import Worqhat from 'worqhat';

dotenv.config();

const API_KEY = process.env.API_KEY || '';

export const client = new Worqhat({
  apiKey: API_KEY,
});

export async function dbInsert() {
  const table = "customer_management_data";
  // Sample 1: single JSON as data
  const singleData = {
    customer_name: "Alice Johnson",
    customer_email: "alice@example.com",
    customer_phone_number: "+91-9876543210",
    customer_address: "123 MG Road, Pune",
    customer_type: "individual",
  };

  const singleResponse = await client.db.insertRecord({
    table,
    data: singleData,
  });

  console.log("Single insert response:\n", JSON.stringify(singleResponse, null, 2));

  // Sample 2: array of JSONs as data (bulk insert)
  const bulkData = [
    {
      customer_name: "Bob Smith",
      customer_email: "bob@example.com",
      customer_phone_number: "+91-9000000001",
      customer_address: "456 Brigade Road, Bengaluru",
      customer_type: "business",
    },
    {
      customer_name: "Carol Lee",
      customer_email: "carol@example.com",
      customer_phone_number: "+91-9000000002",
      customer_address: "789 Park Street, Kolkata",
      customer_type: "individual",
    },
  ];

  const bulkResponse = await client.db.insertRecord({
    table,
    data: bulkData,
  });

  console.log("Bulk insert response:\n", JSON.stringify(bulkResponse, null, 2));
}

// Sample Response

// Single insert response:
//  {
//   "success": true,
//   "table": "customer_management_data",
//   "count": 1,
//   "executionTime": 241,
//   "message": "Data inserted successfully into customer_management_data"
// }
// Bulk insert response:
//  {
//   "success": true,
//   "table": "customer_management_data",
//   "count": 2,
//   "executionTime": 207,
//   "message": "Data inserted successfully into customer_management_data"
// }
