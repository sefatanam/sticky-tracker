const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose
  .connect("MONGO_URL_HERE", { useNewUrlParser: true })
  .then(() => {
    console.log("Connect Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

module.exports = {
  mongoose,
};
