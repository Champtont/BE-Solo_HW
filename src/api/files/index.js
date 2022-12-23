import express from "express";
import multer from "multer";
import { extname } from "path";
import {
  saveProductPhotos,
  getProducts,
  writeProducts,
} from "../../lib/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post(
  "/:productId/single",
  multer().single("imageUrl"),
  async (req, res, next) => {
    try {
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.productId + originalFileExtension;

      await saveProductPhotos(fileName, req.file.buffer);

      const url = `http://localhost:3001/productPics/${fileName}`;

      const products = await getProducts();

      const index = products.findIndex(
        (product) => product.id === req.params.productId
      );
      if (index !== -1) {
        const oldProduct = products[index];

        const productPhoto = { ...oldProduct.imageUrl, imageUrl: url };
        const updatedProduct = {
          ...oldProduct,
          productPhoto,
          updatedAt: new Date(),
        };

        products[index] = updatedProduct;

        await writeProducts(products);
      }

      res.send("File uploaded");
    } catch (error) {
      next(error);
    }
  }
);

// filesRouter.post("/multiple", multer().array("avatars"), async (req, res, next) => {
//   try {
//     console.log("FILES:", req.files)
//     await Promise.all(req.files.map(file => saveUsersAvatars(file.originalname, file.buffer)))
//     res.send("File uploaded")
//   } catch (error) {
//     next(error)
//   }
// })

export default filesRouter;
