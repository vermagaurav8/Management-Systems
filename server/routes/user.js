const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.view);
router.post("/", userController.search);

router.get("/adduser", userController.userForm);
router.post("/adduser", userController.createUser);

router.get("/edituser/:id", userController.edit);
router.post("/edituser/:id", userController.update);

router.get("/viewuser/:id", userController.viewUser);

router.get("/:id", userController.delete);

module.exports = router;
