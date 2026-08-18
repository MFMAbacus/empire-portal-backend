import { MongoError } from "mongodb";

export class ErrorHandler {
  public static handleError(error: any): void {
    if (error instanceof MongoError) {
      // Handle MongoDB specific errors
      console.error("MongoDB Error:", error.message);
      switch (error.code) {
        case 11000:
          //   console.error('Duplicate key error:', error.keyValue);
          throw new Error(
            "Duplicate key error: A record with the same key already exists."
          );
        // Add other MongoDB specific error codes and handling as needed
        default:
          console.error("General MongoDB error:", error);
          throw new Error(
            "An error occurred while processing your request with MongoDB."
          );
      }
    } else {
      // General error handling
      console.error("An error occurred:", error);
      throw new Error("An error occurred while processing your request.");
    }
  }
}
