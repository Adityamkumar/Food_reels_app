import app from "./src/app.js";
import { connectDB } from "./src/db/db.js";
import { configDotenv } from 'dotenv';

configDotenv()


const startServer = async () => {
    try {
        await connectDB();
        app.listen(3000, () => {
             console.log(`Server Running on PORT: 3000`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();