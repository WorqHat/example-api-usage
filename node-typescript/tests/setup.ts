import dotenv from "dotenv";

// Load environment variables for tests
dotenv.config();

// Set test environment
process.env.NODE_ENV = "test";
process.env.WORQHAT_ENVIRONMENT = "test";
