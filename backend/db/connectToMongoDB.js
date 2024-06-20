const mongoose= require("mongoose");

const connectToMongoDB = async() =>{
try {
    await mongoose.connect(process.env.MONGO_DB_URL)
console.log("Connected to MongoDB");

} catch (error) {
    console.log("error connection to mongodb",error.message);
}


}

module.exports = connectToMongoDB;