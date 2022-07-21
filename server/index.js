'use strict';
import 'dotenv/config';

// const __dirname = path.resolve();
// dotenv.config({ path: __dirname + '/.env', debug: true, override: true });

import express from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import session from 'express-session';
import { Server } from 'socket.io';
import passport from 'passport';

import { connection } from './controllers/socket-controller.js';

import errorMiddleware from './middlewares/error-middleware.js';
import apartment from './routes/apartment.js';
import user from './routes/user.js';
import chat from './routes/chat.js';
import util from './routes/util.js';


const app = express();

app.use(fileUpload({
    createParentPath: true,
  }));
app.use(express.json({limit: '30mb'}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(express.static('files'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    key: process.env.SESSION_KEY,
    cookie: {
      "path": "/",
      "httpOnly": true,
      "maxAge": null
    },
    // store: sessionStore,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', apartment);
app.use('/api', user);
app.use('/api', util);
app.use('/api', chat);
app.use(errorMiddleware);


// fs.createReadStream('./dataset/Daegu_Real_Estate_data.csv')
//     .pipe(csv())
//     .on('data', data => result.push({ salePrice: data.SalePrice, yearBuilt: data.YearBuilt, size: data['Size(sqf)'], floor: data.Floor, hallwayType: data.HallwayType, heatingType: data.HeatingType, heatingType: data.HeatingType }))
//     .on('end', () => {
//         console.log(result);
//     });

const server = app.listen(process.env.PORT ?? 5000, () => {
    console.log('Server has been started...');
})
const io = new Server(server, {
    cors: {
        credentials: true,
        origin: process.env.CLIENT_URL
    }
  });
io.on('connection', connection);
export  { 
          io
        }
