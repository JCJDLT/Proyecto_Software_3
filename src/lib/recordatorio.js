import cron from "node-cron";
import { fechaRecordatorio , transporter} from "./helpers.js";
import { pool } from "../database.js";

export const recordatorio = async () => {
  cron.schedule('0 12 * * *', async () => {
    const [rows] = await pool.query("SELECT email FROM appointment a join users u on a.id_user = u.id where id_state = 1 AND date = ?", [fechaRecordatorio()]);
    rows.forEach(row => {

      const mailOptions = {
        from: 'nailsbyjohannadelatorre@gmail.com',
        to: row.email,
        subject: 'Recordatorio de cita',
        text: `Tu cita es mañana ${fechaRecordatorio()}`
      };

      // Enviar el correo electrónico
      transporter.sendMail(mailOptions, (error, info) => {
        error ? console.log(error) : console.log('Correo electrónico enviado: ' + info.response);
      });
    });
  });
}