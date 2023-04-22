const mongoose = require("mongoose");

const dbConnect = async () => {
  console.log(process.env.MONGODB_URI);
  try {
    const connectionString = await mongoose.connect("mongodb://localhost:27017/chatAPP", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`\nDB connected\n`);
  } catch (error) {
    console.log("\nConnection failed\n");
  }
};

module.exports = dbConnect;
