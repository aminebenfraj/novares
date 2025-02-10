const express = require('express');
const { registerUser, loginUser, currentUser } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get("/user", authMiddleware, currentUser);

router.post('/register', registerUser);

router.post('/login', loginUser);


module.exports = router;
