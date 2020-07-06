import {config} from 'dotenv'
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import fs from 'fs';
import path from 'path';
import FrontRouter from '../generic-frontend-app/src/router';

config();

const app = express();

app.use(express.static('../generic-frontend-app/build'))

app.get('/*',(req,res)=>{
    const context = {}
    console.log('request made');
    
    const load = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={context}>
            <FrontRouter/>
        </StaticRouter>
    );

    const HTML = path.resolve('../generic-frontend-app/build/index.html');

    fs.readFile(HTML,'utf8',(err,data)=>{
        if(err)
            return res.status(500).send('Error 500: Sorry for the inconvinence');

        return res.send(
            data.replace('<div id="root"></div>',`<div id="root">${load}</div>`)
        );
    });   
})

app.listen(process.env.PORT||5000,()=>{console.log(`Listening at ${process.env.PORT||5000}`)});
