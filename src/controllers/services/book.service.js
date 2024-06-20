import Book from "../../models/bookSchema.js";
// import redisClient from "../../integrations/redis.js";

import logger from "../../logger/logger.js";

export const getAllBooks = async (page = 1, limit = 5, query) => {
  try {
    const skip = (page - 1) * limit;

    if (query != null) {
      const searchConditionOne = query
        ? { title: { $regex: query, $options: "i" } }
        : {};
      const searchConditionTwo = query
        ? { author: { $regex: query, $options: "i" } }
        : {};
      const searchConditionThree = query
        ? { ISBN: { $regex: query, $options: "i" } }
        : {};


      const searchData = await Book.find({
        $or: [
          { searchConditionOne },
          { searchConditionTwo },
          { searchConditionThree },
        ],
      })
        // .sort({ readCount: -1, readingTime: 1, timestamps: -1 })
        .skip(skip)
        .limit(limit);

      return { data: searchData, meta: { page, limit } };
    } else {
      // // set cacheKey and check for cache
      // const cacheKey = "publishedBook";

      // // get data from database
      // const value = await redisClient.get(cacheKey);

      // // check for cache miss
      // if (value != null) {
      //   console.log("returning data from cache");
      //   return { data: JSON.parse(value), meta: { page, limit } };
      // }

      // cache miss is true, get data from DB
      // console.log("getting data from DB");
      let allBooks = await Book.find()
        // .sort({ readCount: -1, readingTime: 1, timestamps: -1 })
        .skip(skip)
        .limit(limit);

      // // set cache with expirition of 1 minute
      // await redisClient.setEx(cacheKey, 1 * 60, JSON.stringify(publishedBooks));
      return { data: allBooks, meta: { page, limit } };
    }
  } catch (error) {
    logger.error(error);
  }
};
