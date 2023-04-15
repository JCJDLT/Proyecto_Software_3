import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const matchPassword = async (password, savedPassword) =>
  await bcrypt.compare(password, savedPassword);

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nailsbyjohannadelatorre@gmail.com',
    pass: 'kqfwrebvhezebhjw'
  }
});