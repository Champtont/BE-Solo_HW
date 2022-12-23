import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const productIMGFolderPath = join(process.cwd(), "/public/productPics");

console.log("ROOT OF THE PROJECT:", process.cwd());
console.log("PRODUCT IMG FOLDER:", productIMGFolderPath);

console.log("DATA FOLDER PATH: ", dataFolderPath);
const productsJSONPath = join(dataFolderPath, "product.json");
const reviewsJSONPath = join(dataFolderPath, "review.json");

export const getProducts = () => readJSON(productsJSONPath);
export const writeProducts = (productsArray) =>
  writeJSON(productsJSONPath, productsArray);
export const getReviews = () => readJSON(reviewsJSONPath);
export const writeReviews = (reviewsArray) =>
  writeJSON(reviewsJSONPath, reviewsArray);

export const saveProductPhotos = (fileName, contentAsABuffer) =>
  writeFile(join(productIMGFolderPath, fileName), contentAsABuffer);
