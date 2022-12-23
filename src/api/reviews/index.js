import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checksReviewSchema, triggerBadRequest } from "./validator.js";
import { getReviews, writeReviews } from "../../lib/fs-tools.js";

const { NotFound, Unauthorized, BadRequest } = httpErrors;

const reviewsRouter = express.Router();

reviewsRouter.post(
  "/products/:productId/reviews",
  checksReviewSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newReview = {
        ...req.body,
        createdAt: new Date(),
        id: uniqid(),
        productId: req.params.productId,
      };

      const reviewsArray = await getReviews();

      reviewsArray.push(newReview);

      await writeReviews(reviewsArray);

      res.status(201).send({ id: newReview.id });
    } catch (error) {
      next(error);
    }
  }
);

export default reviewsRouter;
