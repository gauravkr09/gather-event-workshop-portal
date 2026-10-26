import 'dotenv/config';import express from 'express';import cors from 'cors';import helmet from 'helmet';import cookieParser from 'cookie-parser';import rateLimit from 'express-rate-limit';
import {connectDB} from './config/db.js';import eventRoutes from './routes/eventRoutes.js';import registrationRoutes from './routes/registrationRoutes.js';import dashboardRoutes from './routes/dashboardRoutes.js';import authRoutes from './routes/authRoutes.js';import {notFound,errorHandler} from './middleware/errorMiddleware.js';
const app=express();app.use(helmet());app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173',credentials:true}));app.use(express.json({limit:'1mb'}));app.use(cookieParser());
app.get('/api/health',(req,res)=>res.json({success:true,message:'Event Portal API is running'}));
app.use('/api/auth',rateLimit({windowMs:15*60*1000,limit:30,standardHeaders:true,legacyHeaders:false}),authRoutes);
app.use('/api/events',eventRoutes);app.use('/api/registrations',rateLimit({windowMs:15*60*1000,limit:100,standardHeaders:true,legacyHeaders:false}),registrationRoutes);app.use('/api/dashboard',dashboardRoutes);app.use(notFound);app.use(errorHandler);
const port=process.env.PORT||5000;
connectDB().then(()=>app.listen(port,()=>console.log(`API listening on http://localhost:${port}`))).catch(err=>{console.error('Startup failed:',err.message);process.exit(1)});
export default app;
