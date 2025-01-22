import { connect } from "mongoose";
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const dbConnect = async () => {
    const connectionString = process.env.NODE_ENV === 'production'
        ? process.env.CONNECTION_STRING
        : process.env.MONGO_LOCAL_URI;
    if (!connectionString) {
        console.error("Database connection string is undefined. Check your environment variables.");
        process.exit(1);
    }
    try {
        const mongodbConnect = await connect(connectionString as string);
        console.log(`Database connected: ${mongodbConnect.connection.host}`);
    } catch (error) {
        console.log(`Database connection failed: ${error}`);
        process.exit(1);
    }
}

export default dbConnect;
