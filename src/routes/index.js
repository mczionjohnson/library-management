import { Router } from "express";

import { generateMiddleWare } from "../middleware/loginSignup.middleware.js"
import { loginSchema, registerSchema } from "../middleware/validation/loginSignup.validation.js"
import { loginLibSchema, registerLibSchema } from "../middleware/validation/loginSignupLib.validation.js"

import { memLogin, memSignup } from "../controllers/mem.controller.js"
import { libLogin, libSignup } from "../controllers/lib.controller.js"


const indexRouter = Router();

indexRouter.get("/", async (req, res) => {
  res.status(200).json({ message: "Welcome to the ALTSCHOOL Library!" });
});

// plug the validation into
indexRouter.post("/signup", generateMiddleWare(registerSchema), memSignup)
indexRouter.post("/library/signup", generateMiddleWare(registerLibSchema), libSignup)


// indexRouter.post("/login", generateMiddleWare(loginSchema),memLogin)
indexRouter.post("/library/login", generateMiddleWare(loginLibSchema), libLogin)


export default indexRouter;
