import express from 'express'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js'
import foodRoutes from './routes/food.routes.js'
import foodPartnerRoutes from './routes/food-partner.route.js'
import cors from 'cors'

const app = express();
app.use(cors({
     origin: "http://localhost:5173",
     credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.get('/', (req, res)=>{
     res.send("Hello This is Server")
})

app.use('/api/auth', authRoutes)
app.use('/api/food', foodRoutes)
app.use('/api/food-partner', foodPartnerRoutes)


export default app