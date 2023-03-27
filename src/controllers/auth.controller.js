import { encryptPassword } from "../lib/helpers.js";
import { pool } from "../database.js";

export const renderSignUp = (req, res) => {
  const { fullname, email, phone} = req.query;
  res.render("auth/signup", {
    fullname,
    email,
    phone,
  });
};

export const signUp = async (req, res, next) => {
  const { fullname, email, phone, password1, password2 } = req.body;
  if (password1 !== password2) {
    req.flash("message", "Las contraseñas no coinciden");
    return res.redirect("/signup?fullname=" + fullname +"&email="+ email + "&phone="+ phone);
  }

  const newUser = {
    fullname,
    email,
    phone,
  };

  newUser.password = await encryptPassword(password1);
  newUser.id_rol = 2;

  try {
    // Guardar en la base de datos
    const [result] = await pool.query("INSERT INTO users SET ? ", newUser);
    newUser.id = result.insertId;

    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/profile");
    });
    
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('users.email_UNIQUE')) {
      req.flash("error", "El email ya existe");
      return res.redirect("/signup?fullname=" + fullname +"&email="+ email + "&phone="+ phone);
    } else {
      req.flash("error", "El numero telefonico ya existe");
      return res.redirect("/signup?fullname=" + fullname +"&email="+ email + "&phone="+ phone);
    }
  }
}

export const renderSignIn = (req, res, next) => {
  const {username} = req.query;
  res.render("auth/signin", {
    username,
  });
};