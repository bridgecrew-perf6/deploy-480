"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const url = require("url");
const data = require("./data/cities.json");
const { createAutoComplete } = require("./auto-complete/index.js");
const port = process.env.PORT || 3000;
const searchFunction = createAutoComplete(data);
http
  .createServer((request, response) => {
    if (request.method == "GET") {
      let urlRequest = url.parse(request.url, true);
      if ("complete" in urlRequest.query) {
        const searchResult = JSON.stringify(
          searchFunction(urlRequest.query.complete),
        );
        const EtagValue = Buffer.from(
          urlRequest.query.complete + Buffer.byteLength(searchResult),
        ).toString("base64");
        if (request.headers["if-none-match"] === EtagValue) {
          response.statusCode = 304;
          response.end();
        } else {
          response.writeHead(200, "OK", {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(searchResult),
            "Cache-Control": "no-cache",
            ETag: EtagValue,
          });
          response.end(searchResult);
        }
      } else {
        response.writeHead(404, "Not Found", {
          "Content-Type": "text",
        });
        response.end("Not Found");
      }
    }
  })
  .listen(port);
