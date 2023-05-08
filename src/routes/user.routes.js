import { Router } from "express";
import { isLoggedIn} from "../lib/auth.js";
import { renderUserProfile , renderRecords } from "../controllers/user.controller.js";

const router = Router();

router.get("/profile", isLoggedIn, renderUserProfile);
router.get("/records",isLoggedIn,renderRecords);

export default router;