import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import methodOverride from "method-override";
import flash from "connect-flash";
import passport from "passport";
import morgan from "morgan";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import indexRoutes from "./routes/index.routes.js";
import transaccionRoutes from "./routes/transaccion.routes.js";
import userRoutes from "./routes/auth.routes.js";
import "./config/passport.js";
import mongoose from "mongoose"

const port = process.env.PORT || 4200
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set("views", join(__dirname, "views"));

const hbs = exphbs.create({
  defaultLayout: "main",
  layoutsDir: join(app.get("views"), "layouts"),
  partialsDir: join(app.get("views"), "partials"),
  extname: ".hbs",
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use(indexRoutes);
app.use(userRoutes);
app.use(transaccionRoutes);

app.use(express.static(join(__dirname, "public")));

app.use((req, res) => {
  res.render("404");
});

export default app;

mongoose.connect ("mongodb+srv://roccogiro:12345678ro@cluster0.xdjzz0g.mongodb.net/?retryWrites=true&w=majority")
.then (()=> {console.log ("Conectado a la base de datos MONGODB de forma exitosa")})
.catch ((err)=> {console.log ("error", err)}) 

app.listen (port, ()=> console.log("Servidor corriendo en el puerto",port))
