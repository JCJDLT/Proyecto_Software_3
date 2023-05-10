import { validationResult } from 'express-validator';

export const validator = (req, res, next) => {
    const { fullname, email, phone } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array().map(error => error.msg));
        const queryString = `?fullname=${encodeURIComponent(fullname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
            return res.status(400).redirect("/signup" + queryString);
    }
    next();
};

export const validatorApointment = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('errors', errors.array().map(error => error.msg));
        return res.status(400).redirect("/appointment/add");
    }
    next();
}

export const validatorEditApointment = (req, res, next) => {
    const errors = validationResult(req);
    const id = req.params.id;
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array().map(error => error.msg));
        const queryString = `${encodeURIComponent(id)}`;
        return res.status(400).redirect("/appointment/edit/" + queryString);
    }
    next();
}