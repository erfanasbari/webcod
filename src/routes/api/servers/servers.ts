import express from "express";
import { body } from "express-validator";
import { validateSequential } from "../../../include/validator";

// Controllers
import { checkIsAuthenticated, checkIsNotAuthenticated } from "../../../controllers/authenticate";

let router = express.Router();

export default router;
