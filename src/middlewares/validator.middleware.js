import { validationResult } from 'express-validator';

export const validator = (req, res, next) => {
    const { fullname, email, phone} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array().map(error => error.msg));
        return res.status(400).redirect(req.originalUrl+"?fullname=" + fullname +"&email="+ email + "&phone="+ phone);
    }
    next();
}

export const validatorApointment = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array().map(error => error.msg));
        return res.status(400).redirect(req.originalUrl);
    }
    next();
}

export const validatorEditApointment = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array().map(error => error.msg));
        return res.status(400).redirect(req.originalUrl);
    }
    next();
}