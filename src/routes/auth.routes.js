import { Router } from "express";

const router = Router();

import {
  renderSignUp,
  renderSignIn
} from "../controllers/auth.controller.js";

// SIGNUP
router.get("/signup",renderSignUp);

// SINGIN
router.get("/signin",renderSignIn);

export default router;