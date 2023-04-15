import { pool } from "../database.js";
import { sumTime, getFechaActual, getHoraActual } from "../lib/helpers.js";

export const renderAppointmentsAdd = async (req, res, next) => {
    const selectedItem = req.query.selectedItem;
    const dateInput = req.query.date;

    if (selectedItem == null && dateInput == null) {
        res.render("appointment/add", {
            getFechaActual,
        });
    } else {
        if (selectedItem != null) {
            validationPriceNails(selectedItem, res);
        }
        if (dateInput != null) {
            validationTimes(dateInput, res);
        }
    }
};

export const addAppointments = async (req, res, next) => {

    const { date, start_time, nails } = req.body;

    if (start_time < getHoraActual() && date == getFechaActual()) {
        req.flash("message", "Debes agendar la cita antes de la hora escogida, verifica la fecha y la hora");
        return res.redirect("/appointment/add");
    }

    const newAppointment = await buildAppointment(date, start_time, nails, req, 0);
    await pool.query("INSERT INTO appointment SET ? ", [newAppointment]);
    req.flash("success", "Registro exitosamente");
    res.redirect("/profile");
};

export const buildAppointment = async (date, start_time, nails, req, opcion) => {
    const { dateA, timeA } = req.body;
    const newAppointment = {
        date,
    };

    if (opcion == 1) {
        newAppointment.start_time = start_time == "" ? date == dateA ? (newAppointment.end_time = sumTime(timeA, "01:59:00"), timeA) : "Invalid" : start_time;
        newAppointment.end_time = sumTime(newAppointment.start_time, "01:59:00");
    } else {
        newAppointment.start_time = start_time;
        newAppointment.end_time = sumTime(start_time, "01:59:00");
        newAppointment.id_user = req.user.id;
        newAppointment.id_state = 1;
    }

    const [result] = await pool.query("SELECT * FROM nails WHERE name = ?", [nails]);

    newAppointment.id_nails = result[0].id;

    return newAppointment;
}

export const validationPriceNails = async (selectedItem, res) => {
    const [result] = await pool.query("SELECT * FROM nails WHERE name = ?", [selectedItem]);
    var resultado;
    if (result.length > 0) {
        resultado = result[0].price;
    } else {
        resultado = null;
    }
    res.json({ resultado })
}

export const validationTimes = async (dateInput, res) => {
    //const [result] = await pool.query("SELECT start_time FROM appointment WHERE date = ? AND (id_state = 1 OR id_state = 2)", [dateInput]);
    const [result] = await pool.query("SELECT start_time FROM appointment WHERE date = ? AND id_state = 1", [dateInput]);
    var rows;
    if (result.length > 0) {
        rows = result;
    } else {
        rows = [];
    }
    res.json({ rows })
}