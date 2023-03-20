import express from "express";
import { create } from "express-handlebars";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import expressMySQLSession from "express-mysql-session";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";
import { pool } from "./database.js";

// Intializations
const app = express();
export const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MySQLStore = expressMySQLSession(session);

// Settings
app.set("views", path.join(__dirname, "views"));
app.engine(
    ".hbs",
    create({
      defaultLayout: "main",
      layoutsDir: path.join(app.get("views"), "layouts"),
      partialsDir: path.join(app.get("views"), "partials"),
      extname: ".hbs",
      helpers:{
      }
    }).engine
  );
app.set("view engine", ".hbs");

// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser("nailsmysqlnodemysql"));
app.use(
  session({
    secret: "nailsmysqlnodemysql",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({}, pool),
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash("message");
  app.locals.success = req.flash("success");
  app.locals.error = req.flash("error");
  app.locals.errors = req.flash("errors");
  app.locals.user = req.user;
    next();
  });

// Routes
app.use(routes);


// Public
app.use(express.static("/home/ubuntu/nails/_work/Proyecto_Software_3/Proyecto_Software_3/src/public"));

export default app;