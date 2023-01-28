import { Router } from "express";
import User from "../models/User.js";
import passport from "passport";


const renderSignUpForm = (req, res) => res.render("auth/signup");

const singup = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password } = req.body;
  if (password !== confirm_password) {
    errors.push({ text: "La contraseña no coincide." });
  }

  if (password.length < 4) {
    errors.push({ text: "La contraseña debe tener al menos 4 caracteres" });
  }

  if (errors.length > 0) {
    return res.render("auth/signup", { 
      errors,
      name,
      email,
      password,
      confirm_password,
    });
  }

  
  const userFound = await User.findOne({ email: email });
  if (userFound) {
    req.flash("error_msg", "El Mail ya esta en uso ");
    return res.redirect("/auth/signup");
  }

  
  const newUser = new User({ name, email, password });
  newUser.password = await newUser.encryptPassword(password);
  await newUser.save();
  req.flash("success_msg", "Ahora estas registrado");
  res.redirect("/auth/signin");
};


const renderSigninForm = (req, res) => res.render("auth/signin");

const signin = passport.authenticate("local", {
  successRedirect: "/transaccion", 
  failureRedirect: "/auth/signin", 
  failureFlash: true, 
});

const logout = async (req, res, next) => {
  await req.logout((err) => {
    if (err) return next(err);
    req.flash("success_msg", "Has salido de la sesion");
    res.redirect("/auth/signin");
  });
};


const router = Router();

router.get("/auth/signup", renderSignUpForm);

router.post("/auth/signup", singup);

router.get("/auth/signin", renderSigninForm);

router.post("/auth/signin", signin);

router.get("/auth/logout", logout);

export default router;
