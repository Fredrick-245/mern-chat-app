const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE, {
      // userNewUrlParser:true,
      // useUnifiedTopology:true,
      // useFindAndModify:true
    });

    console.log(`MongoDb connected on ${conn.connection.host}`.cyan.underline);
  } catch (err) {
    console.log(err);
    process.exit();
  }
};
module.exports = connectDb;
