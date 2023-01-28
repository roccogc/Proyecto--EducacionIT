import { Router } from "express";


const renderIndex = (req, res) => {
    res.render("index");
  };

const renderAbout = (req, res) => {
    res.render("about");
  };

const renderContact = (req, res) => {
    res.render("contact");
  };
  

const router = Router();

router.get("/", renderIndex);

router.get("/about", renderAbout);

router.get("/contact", renderContact);

export default router;
