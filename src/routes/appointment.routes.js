import { Router } from "express";
import { isLoggedIn } from "../lib/auth.js";
import {
    renderAppointments,
    renderAppointmentsAdd,
    addAppointments,
    deleteAppointment,
    renderEditAppointment,
    editAppointment,
} from "../controllers/appointment.controller.js";
import { signupSchema, signupSchemaEdit } from "../validators/appointmentadd.validator.js";
import { validatorApointment , validatorEditApointment } from "../middlewares/validator.middleware.js";
const router = Router();

// Authorization
router.use(isLoggedIn);

// Routes appoiment/
router.get("/", renderAppointments);
router.get("/add", renderAppointmentsAdd);

router.post("/add", signupSchema, validatorApointment, addAppointments);

router.get("/delete/:id", deleteAppointment);

router.get("/edit/:id", renderEditAppointment);
router.post("/edit/:id",signupSchemaEdit, validatorEditApointment ,editAppointment);

export default router;