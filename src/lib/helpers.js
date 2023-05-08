import bcrypt from "bcryptjs";
import moment from "moment/moment.js";
import nodemailer from "nodemailer";

export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const matchPassword = async (password, savedPassword) =>
  await bcrypt.compare(password, savedPassword);

export const sumTime = (start_time, end_time) => {
  const momentTime1 = moment(start_time, 'hh:mm');
  const sum = momentTime1.add(end_time);
  const resultT = sum.format('HH:mm');
  return resultT;
}

export const getFechaActual = () => {
  const currentDate = moment().format().split('T')[0];
  return currentDate;
}

export const fechaRecordatorio = () => {
  const currentDate = moment().add(1, 'days').format().split('T')[0];
  return currentDate;
}

export const getHoraActual = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes());
  const horaNecesariaCita = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  return horaNecesariaCita;
}

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nailsbyjohannadelatorre@gmail.com',
    pass: 'kqfwrebvhezebhjw'
  }
});