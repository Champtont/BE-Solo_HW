import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checksProductSchema, triggerBadRequest } from "./validator.js";
import { getProducts, writeProducts } from "../../lib/fs-tools.js";

const { NotFound, Unauthorized, BadRequest } = httpErrors;

const productsRouter = express.Router();

productsRouter.post(
  "/",
  checksProductSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newProduct = { ...req.body, createdAt: new Date(), id: uniqid() };

      const productsArray = await getProducts();

      productsArray.push(newProduct);

      await writeProducts(productsArray);

      res.status(201).send({ id: newProduct.id });
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.get("/", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    console.log("PRODUCTS ARRAY: ", productsArray);
    if (req.query && req.query.category) {
      const filteredProducts = productsArray.filter(
        (product) => product.category === req.query.category
      );
      res.send(filteredProducts);
    } else {
      res.send({ productsArray });
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts();
    const product = products.find(
      (product) => product.id === req.params.productId
    );
    if (product) {
      res.send(product);
    } else {
      next(NotFound(`Product with id ${req.params.productId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts();

    const index = products.findIndex(
      (product) => product.id === req.params.productId
    );
    if (index !== -1) {
      const oldProduct = products[index];

      const updatedProduct = {
        ...oldProduct,
        ...req.body,
        updatedAt: new Date(),
      };

      products[index] = updatedProduct;

      await writeProducts(products);
      res.send(updatedProduct);
    } else {
      next(NotFound(`Product with id ${req.params.productId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts();

    const remainingProducts = products.filter(
      (product) => product.id !== req.params.productId
    );

    if (products.length !== remainingProducts.length) {
      await writeProducts(remainingProducts);
      res.status(204).send();
    } else {
      next(NotFound(`Product with id ${req.params.bookId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
