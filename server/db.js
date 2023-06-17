const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connectionString = await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`\nDB connected\n`);
  } catch (error) {
    console.log("\nConnection failed\n");
  }
};

module.exports = dbConnect;
