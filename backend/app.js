import express from 'express';
import cors from 'cors';
import userRoute from './routes/userRoute.js';
import loginRoute from './routes/loginRoute.js';
import giftRoute from './routes/giftRoute.js'

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api',userRoute);
app.use('/api',loginRoute);
app.use('/api',giftRoute);

export default app;