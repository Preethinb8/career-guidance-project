const express = require("express");
const router = express.Router();

const { chatWithCareerAI } = require("../controllers/chatbotController");

router.post("/chat", chatWithCareerAI);

module.exports = router;