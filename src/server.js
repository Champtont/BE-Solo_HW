import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { join } from "path";
import productsRouter from "./api/products/index.js";
import reviewsRouter from "./api/reviews/index.js";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";
import filesRouter from "./api/files/index.js";

const server = express();

const port = 3002;

const publicFolderPath = join(process.cwd(), "./public");

// ***************** MIDDLEWARES ********************

server.use(express.static(publicFolderPath)); //allows access to public folder
server.use(cors()); // allow FE communicate with BE successfully
server.use(express.json()); // req.body "UNDEFINED" solved

// ****************** ENDPOINTS *********************
server.use("/products", productsRouter);
server.use("/review", reviewsRouter);
server.use("/files", filesRouter);

// ****************** ERROR HANDLERS ****************
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server is running on port:", port);
});
