import { Router } from "express";
import index from "./index.routes.js";
import auth from "./auth.routes.js";

const router = Router();

router.use(index);
router.use(auth);

export default router;