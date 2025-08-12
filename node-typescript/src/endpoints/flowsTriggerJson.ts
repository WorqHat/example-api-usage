import dotenv from "dotenv";
import Worqhat from "worqhat";

dotenv.config();

const API_KEY = process.env.API_KEY || "";

export const client = new Worqhat({
  apiKey: API_KEY,
});

export async function triggerFlowJson() {
  const workflow_id = "a4a0053f-adec-4a3d-abf6-87ccac03b391";
  const data = {
    "input1": "value1",
    "input2": "value2"
  };

  const response = await client.flows.triggerWithPayload(
    workflow_id,
    { body: data }
  );

  console.log(response);
}

// Sample Response

// {
//   success: true,
//   message: 'Workflow a4a0053f-adec-4a3d-abf6-87ccac03b391 triggered successfully',
//   timestamp: '2025-08-12T13:02:52.973Z',
//   data: {
//     success: true,
//     statusCode: '200',
//     data: { output1: 'value1', output2: 'value2' }
//   }
// }