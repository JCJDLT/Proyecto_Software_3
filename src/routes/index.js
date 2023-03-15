import { Router } from "express";
import index from "./index.routes.js";

const router = Router();

router.use(index);

export default router;