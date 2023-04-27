// const { MongoClient } = require("mongodb");

// const database = "login";
// const uri = `mongodb+srv://krishnamoorthy:krishna2000@cluster0.exf7eoz.mongodb.net/${database}`;

// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// async function connectToMongoDB() {
//   try {
//     // Connect to MongoDB
//     await client.connect();
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error(error);
//   }
// }

// connectToMongoDB();

// module.exports = { client };

const mongoose = require("mongoose");

// const database = "login";
// const uri = "mongodb+srv://krishnamoorthy:krishna2000@cluster0.exf7eoz.mongodb.net/login";
const connection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://krishnamoorthy:krishna2000@cluster0.exf7eoz.mongodb.net/login",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }

  // .then(() => console.log("Connected to MongoDB"))
  // .catch((error) => console.error(error));
};

module.exports = { connection };
