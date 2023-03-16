import { Router } from "express";
import { renderIndex,consulta } from "../controllers/index.controller.js";

const router = Router();

router.get("/", renderIndex);

router.get('/consulta',consulta);

export default router;