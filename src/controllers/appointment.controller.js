import { pool } from "../database.js";
import { sumTime, getFechaActual, getHoraActual, transporter } from "../lib/helpers.js";

export const renderAppointments = async (req, res, next) => {
    await pool.query("UPDATE appointment set id_state = 3 WHERE date < ? AND id_state = 1", [getFechaActual()]);
    const [rows] = await pool.query("SELECT a.id,u.fullname,a.date,a.start_time,n.name,n.price,ap.state FROM appointment a JOIN users u ON a.id_user = u.id JOIN nails n ON a.id_nails = n.id JOIN appointment_state ap ON a.id_state = ap.id WHERE ap.state = 'pendiente'");
    res.render("appointment/list", {
        appointment: rows
    });
};

export const renderAppointmentsAdd = async (req, res, next) => {
    const selectedItem = req.query.selectedItem;
    const dateInput = req.query.date;

    if (selectedItem == null && dateInput == null) {
        res.render("appointment/add", {
            getFechaActual,
        });
    } else {
        if (selectedItem != null) {
            try {
                await validationPriceNails(selectedItem, res);
            } catch (error) {
                req.flash("error", "Disculpe ocurrio un error en el sistema");
            }
        }
        if (dateInput != null) {
            try {
                await validationTimes(dateInput, res);
            } catch (error) {
                req.flash("error", "Disculpe ocurrio un error en el sistema");
            }
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
    req.user.id_rol == 1 ? res.redirect("/appointment") : res.redirect("/profile");
};

export const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    await pool.query("UPDATE appointment SET id_state = 3 WHERE id = ?", [id]);
    const [result] = await pool.query("SELECT u.email,u.fullname FROM appointment a join users u on a.id_user = u.id where a.id = ?", id)

    if (req.user.id_rol == 1) {
        // Configurar el contenido del correo electrónico
        const mailOptions = {
            from: 'nailsbyjohannadelatorre@gmail.com',
            to: result[0].email,
            subject: 'Cita cancelada',
            text: `${result[0].fullname} su cita se ha cancelado, pongase en contacto para cualquier duda`
        };

        // Enviar el correo electrónico
        transporter.sendMail(mailOptions, (error, info) => {
            error ? console.log(error) : console.log('Correo electrónico enviado: ' + info.response);
        });
    }

    req.flash("success", "La cita se ha cancelado correctamente");
    req.user.id_rol == 1 ? res.redirect("/appointment") : res.redirect("/profile");
};

export const renderEditAppointment = async (req, res) => {
    const { id } = req.params;
    const selectedItem = req.query.selectedItem;
    const dateInput = req.query.date;
    const [rows] = await pool.query("SELECT * FROM appointment WHERE id = ?", [id]);

    if (selectedItem == null && dateInput == null) {
        res.render("appointment/edit", {
            appointment: rows[0],
            getFechaActual,
        });
    } else {
        if (selectedItem != null) {
            try {
                await validationPriceNails(selectedItem, res);
            } catch (error) {
                req.flash("error", "Disculpe ocurrio un error en el sistema");
            }
        }
        if (dateInput != null) {
            try {
                await validationTimes(dateInput, res);
            } catch (error) {
                req.flash("error", "Disculpe ocurrio un error en el sistema");
            }
        }
    }
};

export const editAppointment = async (req, res) => {
    const { id } = req.params;
    const { date, start_time, nails, timeA } = req.body;

    let start = start_time;

    if (start_time == "") { start = timeA }

    const newAppointment = await buildAppointment(date, start_time, nails, req, 1);

    if (newAppointment.start_time == "Invalid") {
        req.flash("message", "Para dejar la misma hora, tambien debes dejar la misma fecha");
        return res.redirect("/appointment/edit/" + id);
    }

    if (start < getHoraActual() && date == getFechaActual()) {
        req.flash("message", "Debes agendar la cita en los horarios disponibles, verifica la fecha y la hora");
        return res.redirect("/appointment/edit/" + id);
    }

    await pool.query("UPDATE appointment set ? WHERE id = ?", [newAppointment, id]);
    req.flash("success", "Cita actualizada correctamente");
    req.user.id_rol == 1 ? res.redirect("/appointment") : res.redirect("/profile");
};

export const buildAppointment = async (date, start_time, nails, req, opcion) => {
    const { dateA, timeA } = req.body;
    const newAppointment = {
        date,
    };

    if (opcion == 1) {
        if (start_time == "") {
            if (date == dateA) {
                newAppointment.start_time = timeA;
            } else {
                newAppointment.start_time = "Invalid";
            }
        } else {
            newAppointment.start_time = start_time;
        }
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
    let resultado;
    if (result.length > 0) {
        resultado = result[0].price;
    } else {
        resultado = null;
    }
    res.json({ resultado })
}

export const validationTimes = async (dateInput, res) => {
    const [result] = await pool.query("SELECT start_time FROM appointment WHERE date = ? AND id_state = 1", [dateInput]);
    let rows;
    if (result.length > 0) {
        rows = result;
    } else {
        rows = [];
    }
    res.json({ rows })
}