'use strict';
import dotenv from 'dotenv';

// const __dirname = path.resolve();
// dotenv.config({ path: __dirname + '/.env', debug: true, override: true });
dotenv.config();

import express from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import errorMiddleware from './middlewares/error-middleware.js';
import apartment from './routes/apartment.js';
import user from './routes/user.js';
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
app.use('/', apartment);
app.use('/api', user);
app.use('/api', util);
app.use(errorMiddleware);


// fs.createReadStream('./dataset/Daegu_Real_Estate_data.csv')
//     .pipe(csv())
//     .on('data', data => result.push({ salePrice: data.SalePrice, yearBuilt: data.YearBuilt, size: data['Size(sqf)'], floor: data.Floor, hallwayType: data.HallwayType, heatingType: data.HeatingType, heatingType: data.HeatingType }))
//     .on('end', () => {
//         console.log(result);
//     });

app.listen(process.env.PORT ?? 5000, () => {
    console.log('Server has been started...');
})