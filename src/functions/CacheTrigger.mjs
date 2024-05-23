
import { app } from '@azure/functions';
import { v4 as uuidv4 } from 'uuid';
//const { connectToCache } = require('./connectToCache.js');
import { callCache } from './connectToCache.js';





async function httpTrigger1(request, context) {
    return { body: uuidv4() };
};

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        var cachevalue = await callCache();        

        return { body: `Hello, ${cachevalue}!` };
    }
});
