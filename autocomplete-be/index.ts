import { ServerResponse } from "http";

const http = require('http')
const url = require('url')
const data: JSON = require('../data/cities.json')
const { createAutoComplete } = require('../../auto-complete/index.js')

// GET /?complete=java

// You are not allowed to use any framework to work with HTTP server (express/koa/sails)
// Response must be a valid JSON with a valid contentType header.
// All uknown URLs must return 404
// You must use cities.json as a data for engine.
// You are only allowed to change the export statement (if required) in your original autocomplete.
// Usage of TS is required

// Extras:
// HTTP cache headers (static) +5pts
// HTTP cache headers (dynamic, last modified changes when cities.json changes) +30pts
// Deployment (somewhere, link in PR) +5pts

const port = process.env.PORT || 3000;
const searchFunction = createAutoComplete(data)



type Response = {
    writeHead: (
        statusCode: number,
        statusMessage?: string,
        headers?: object | Array<string>
    ) => ServerResponse,
    end: (
        data: string | Buffer,
        encoding?: string,
        callback?: Function
    ) => void,
}


http.createServer((request: Request, response: Response) => {
    if (request.method == 'GET') {
        let urlRequest = url.parse(request.url, true);
        if ('complete' in urlRequest.query) {
            const searchResult: string = JSON.stringify(searchFunction(urlRequest.query.complete))
            response.writeHead(200, 'OK', getSuccessOptions(searchResult))
            response.end(searchResult);
        } else {
            response.writeHead(404, 'Not Found', {
                'Content-Type': 'text'
            })
            response.end('Not Found');
        }
    }
}).listen(port)

function getSuccessOptions(searchResult: string): Object {
    return {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(searchResult),
        'Cache-Control': 'no-cache'
    }
}