const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");

// Import Mongoose models
// const { Customer } = require("../schemas/customer-schema/customer-schema");
// const { Vehicle } = require("../schemas/vehicle-schema/vehicle-schema");
// MongoDB connection URI
const uri =
  "mongodb+srv://moheensajjad82:0OT4fH2rzu3FjxJj@cluster0.i1fcb9l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function importData() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    const db = client.db("test"); // Replace with your database name

    const usersCollection = db.collection("users");

    // Load JSON data
    const data = fs.readFileSync("src/import/users.json", "utf8");
    const Users = JSON.parse(data);

    // Process each customer
    for (const user of Users) {
      // const vehicleIds = [];
      // console.log(customer);
      // // Insert each vehicle and collect their IDs
      // for (const vehicle of customer.vehicles) {
      //   const vehicleResult = await vehiclesCollection.insertOne(vehicle);
      //   console.log(vehicleResult);
      //   vehicleIds.push(vehicleResult.insertedId);
      // }

      // // Replace vehicles array with the array of vehicle IDs
      // customer.vehicles = vehicleIds;

      // Insert the customer document
      await usersCollection.insertOne(user);
    }

    console.log("Data import completed successfully.");
  } catch (error) {
    console.error("Error importing data:", error);
  }
}

importData();
