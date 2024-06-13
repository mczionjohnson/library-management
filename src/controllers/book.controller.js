import * as userService from "./services/book.service.js";
import logger from "../logger/logger.js";


export const getAllBooks = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    page = page < 1 ? 1 : page;
    let limit = Number(req.query.limit) || 5;
    limit = limit < 1 ? 5 : limit;
    const query = req.query.q;

    const { data, meta } = await userService.getAllBooks(page, limit, query);

    return res.status(200).json({ message: "Get all books", data, meta });
    // logger.info("Success: unregistered user viewed all blog");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
