


import { Router } from "express";

import { isAuthenticated } from "../helpers/auth.js";

import transaccion from "../models/transaccion.js";


const rendertransaccionForm = (req, res) =>
  res.render("transaccion/new-transaccion");


const createNewtransaccion = async (req, res) => {
  const { tipo, monto, description } = req.body;
  const errors = [];
  if (!tipo) {
    errors.push({ text: "Please Write a tipe." });
  }
  if (!description) {
    errors.push({ text: "Please Write a Description" });
  }
  if (errors.length > 0)
    return res.render("transaccion/new-transaccion", {
      
      errors,
      tipo,
      description,
      monto,
    });

  const newtransaccion = new transaccion({ tipo, monto, description });
  newtransaccion.user = req.user.id;
  
  await newtransaccion.save();
  
  req.flash("success_msg", "Transaccion registrada de forma correcta");
  res.redirect("/transaccion");
};


const rendertransaccion = async (req, res) => {
  const transaccions = await transaccion
    .find({ user: req.user.id })
    .sort({ date: "desc" })
    .lean();
  res.render("transaccion/all-transaccion", { transaccions });
};


const renderEditForm = async (req, res) => {
  const transaccions = await transaccion.findById(req.params.id).lean();
  if (transaccions.user != req.user.id) {
    req.flash("error_msg", "No estas autorizado para ingresar en esta ruta");
    return res.redirect("/transaccion");
  }
  res.render("transaccion/edit-transaccion", { transaccions });
};


const updatetransaccion = async (req, res) => {
  const { tipo, monto, description } = req.body;
  await transaccion.findByIdAndUpdate(req.params.id, {
    tipo,
    monto,
    description,
  });
  req.flash("success_msg", "Transaccion actualizada de forma correcta");
  res.redirect("/transaccion");
};


const deletetransaccion = async (req, res) => {
  await transaccion.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Transaccion eliminada de forma correcta");
  res.redirect("/transaccion");
};

const router = Router();

router.get("/transaccion/add", isAuthenticated, rendertransaccionForm);


router.get("/transaccion/edit/:id", isAuthenticated, renderEditForm);


router.post("/transaccion/new-transaccion",isAuthenticated,createNewtransaccion);


router.get("/transaccion", isAuthenticated, rendertransaccion);

router.put(
  "/transaccion/edit-transaccion/:id",  isAuthenticated, updatetransaccion);

router.delete("/transaccion/delete/:id", isAuthenticated, deletetransaccion);

export default router;
