import express from 'express';

import authController from '../Controllers/AuthController.js';

const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.logIn);
export { router };
