import mongoose from "mongoose";

type ConnectionsObject = {
    isConnected?: number
}


const connection:ConnectionsObject = {}

async function dbConnect():Promise<void> {
    if (connection.isConnected) {
        console.log('Already connected to db' )        
        return 
    };

    try {
       const db = await mongoose.connect(process.env.MONGO_URL || '')
      connection.isConnected = db.connections[0].readyState

      console.log("DB connected successfully")

        
    } catch (error) {
        console.log("db connection failed",error)
        process.exit(1)
        
    }
}
export {dbConnect}