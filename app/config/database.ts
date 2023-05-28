import mongoose, { ConnectOptions } from "mongoose";

mongoose.set("strictQuery", false);

const dbOptions: ConnectOptions = {
  //@ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(process.env.MONGO_URI as string, dbOptions)
  .then(() => {
    const db = mongoose.connection;
    console.log(`Connected to ${db.name} at ${db.host}:${db.port}`);
  })
  .catch((error) => {
    console.error("Connection error:", error);
  });
