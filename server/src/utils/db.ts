import mongoose from 'mongoose';
require('dotenv').config();

const dbURL: string = process.env.DB_URL || '';

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(dbURL).then((data: any) => {
            console.log(`Database connected with ${data.connection.host}`);
        });
    } catch (error: any) {
        console.log(error.message);
        setTimeout(connectDB, 5000); // Retry connection after 5 seconds
    }
};

export default connectDB;