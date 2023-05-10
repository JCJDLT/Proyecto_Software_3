import { validationResult } from 'express-validator';

export const validator = (req, res, next) => {
    const { fullname, email, phone } = req.body;
    const errors = validationResult(req);

    const protocol = req.protocol; // Protocolo utilizado: http o https
    const host = req.get('host'); // Nombre de dominio y puerto
    const url = `${protocol}://${host}${req.originalUrl}`; // URL completa

    if (!errors.isEmpty()) {
        req.flash('errors', errors.array().map(error => error.msg));
        console.log(url)
        const queryString = `?fullname=${encodeURIComponent(fullname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
        if (url.startsWith("https://ec2-100-27-12-164.compute-1.amazonaws.com/")) {
            return res.status(400).redirect(req.originalUrl + queryString);
        }
    }
    next();
};

export const validatorApointment = (req, res, next) => {
    const errors = validationResult(req);

    const protocol = req.protocol; // Protocolo utilizado: http o https
    const host = req.get('host'); // Nombre de dominio y puerto
    const url = `${protocol}://${host}${req.originalUrl}`; // URL completa

    if (!errors.isEmpty()) {
        req.flash('errors', errors.array().map(error => error.msg));
        console.log(url)
        if (url.startsWith("https://ec2-100-27-12-164.compute-1.amazonaws.com/")) {
            return res.status(400).redirect(req.originalUrl);
        }
    }
    next();
}