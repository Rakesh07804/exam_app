const express = require("express");
const router = express.Router();
const { getQuestions, submitExam, getResult } = require("../controller/examController");
const auth = require("../middlewares/authMiddleware");

router.get("/questions", auth, getQuestions);
router.post("/submit", auth, submitExam);
router.get("/result/:id", auth, getResult);

module.exports = router;
