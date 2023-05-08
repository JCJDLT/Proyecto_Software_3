import { pool } from "../database.js";
import { getFechaActual } from "../lib/helpers.js";

export const renderUserProfile = async (req, res, next) => {
  await pool.query("UPDATE appointment set id_state = 3 WHERE date < ? AND id_state = 1",[getFechaActual()]);
  const [rows] = await pool.query("SELECT a.id,u.fullname,a.date,a.start_time,n.name,n.price,ap.state FROM appointment a JOIN users u ON a.id_user = u.id JOIN nails n ON a.id_nails = n.id JOIN appointment_state ap ON a.id_state = ap.id WHERE ap.state = 'pendiente' AND a.id_user = ?", [req.user.id]);
  res.render("profile", {
    appointment: rows,
  });
};

export const renderRecords = async (req, res, next) => {
  const [rows] = await pool.query("SELECT a.id,u.fullname,a.date,a.start_time,n.name,n.price,ap.state FROM appointment a JOIN users u ON a.id_user = u.id JOIN nails n ON a.id_nails = n.id JOIN appointment_state ap ON a.id_state = ap.id WHERE ap.state = 'realizada' AND a.id_user = ?", [req.user.id]);
  res.render("appointment/records", {
    appointment: rows,
  });
};