import dotenv from "dotenv";
import Worqhat from "worqhat";

dotenv.config();

const API_KEY = process.env.API_KEY || "";

export const client = new Worqhat({
  apiKey: API_KEY,
});

export async function triggerFlowWithFile() {

}

export async function triggerFlowWithUrl() {
  const workflow_id = "e3f35867-77f4-4c49-b376-ac0f0cedb423";
  const url = "https://assets.worqhat.com/worqkitties/kitty-hi.png";

    // Trigger the image analysis workflow with a URL
    const response = await client.flows.triggerWithFile(
      workflow_id,
      {
        url: url,
        "input1": "value1",
        "input2": "value2"
      }
    );

    console.log(response);
}

// Sample Response

// {
//   success: true,
//   statusCode: '200',
//   data: {
//     output: `In the picture, I see a cute cartoon cat wearing a Santa hat. It's holding a sign that says "Hi" along with a paw print. The cat is also wearing a red collar with a round charm on it. The overall style is cheerful and festive.\n`,
//     data1: 'value1',
//     data2: 'value2'
//   },
//   message: 'Workflow triggered successfully with file upload'
// }