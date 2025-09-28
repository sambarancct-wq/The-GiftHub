import express from 'express';
import cors from 'cors';
import userRoute from './routes/userRoute.js';
import loginRoute from './routes/loginRoute.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api',userRoute);
app.use('/api',loginRoute);

export default app;