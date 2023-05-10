import { validationResult } from 'express-validator';

export const validator = (req, res, next) => {
    const { fullname, email, phone } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array().map(error => error.msg));
        console.log(req.originalUrl)
        const queryString = `?fullname=${encodeURIComponent(fullname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
        if (req.originalUrl.startsWith("http://localhost:4100/")) {
            return res.status(400).redirect(req.originalUrl + queryString);
        }
    }
    next();
};

export const validatorApointment = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array().map(error => error.msg));
        if (req.originalUrl.startsWith("http://localhost:4100/")) {
            return res.status(400).redirect(req.originalUrl);
        }
    }
    next();
}