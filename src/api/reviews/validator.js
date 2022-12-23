import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const { BadRequest, NotFound } = createHttpError;

const reviewSchema = {
  comment: {
    in: ["body"],
    isString: {
      errorMessage: "Comment is a mandatory field and needs to be a string!",
    },
  },
  rate: {
    in: ["body"],
    isInt: {
      options: {
        min: 0,
        max: 5,
        errorMessage: "rating can only be 0 - 5",
      },
      errorMessage:
        "Rating is a mandatory field and needs to be a number 0 - 5!",
    },
  },
};

export const checksReviewSchema = checkSchema(reviewSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors.array());

  if (!errors.isEmpty()) {
    next(
      BadRequest("Errors during review validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
