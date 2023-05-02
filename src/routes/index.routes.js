import { Router } from "express";
import {
    renderIndex,
    consulta,
    renderCatalogo,
} from "../controllers/index.controller.js";

const router = Router();

router.get("/", renderIndex);

router.get("/consulta", consulta);

router.get("/catalogue", renderCatalogo)

export default router;