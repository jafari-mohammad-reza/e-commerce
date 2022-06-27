const authController = require("../../http/controllers/Api/auth.controller");

const router = require("express").Router();
//? Email Authentication Routes
/**
 * @swagger
 *  /api/v1/auth/email/login:
 *      post:
 *          tags: ["Auth"]
 *          summary: "Login with email"
 *          description: "Login with email"
 *          consumes: ["application/json"]
 *          parameters:
 *              - in: input
 *                name: email
 *                description: "Email"
 *                required: true
 *                schema: 
 *                  type: string
 *              - in: input
 *                name: password
 *                description: "Password"
 *                required: true
 *                schema:
 *                  type: string          
 *          responses:
 *                  200:
 *                      description: Successful operation
 *                  400:
 *                      description: Bad request
 *                  404:
 *                      description: Not found
 *                  500:
 *                      description: Internal server error
 * */
router.post("/email/login", authController.loginByEmail);
/**
 * @swagger
 *  /api/v1/auth/email/register:
 *      post:
 *          tags: ["Auth"]
 *          summary: "Register with email"
 *          description: "Register with email"
 *          consumes: ["application/json"]
 *          parameters:
 *              - in: input
 *                name: userName
 *                description: "userName"
 *                required: true
 *                schema: 
 *                type: string
 *              - in: input
 *                name: email
 *                description: "Email"
 *                required: true
 *                schema: 
 *                type: string
 *              - in: input
 *                name: password
 *                description: "Password"
 *                required: true
 *                schema:
 *                type: password          
 *              - in: input
 *                name: confirmPassword
 *                description: "ConfirmPassword"
 *                required: true
 *                schema:
 *                type: password          
 * */
router.post("/email/register", authController.registerByEmail);
/**
 * @swagger
 *  /api/v1/auth/email/verify-account/:token:
 *      post:
 *          tags: ["Auth"]
 *          summary: "verify account"
 *          description: "verify account"
 *          consumes: ["application/json"]
 *          parameters:
 *              - in: input
 *                name: verificationToken
 *                description: "verificationToken"
 *                required: true
 *                schema: 
 *                type: string      
 * */
router.post(
    "/email/verify-account/:token",
    authController.verifyAccountByEmail
);
router.post("/email/resend/:token", authController.resendOTPToEmail);
/**
 * @swagger
 *  /api/v1/auth/email/get-reset-password:
 *      post:
 *          tags: ["Auth"]
 *          summary: "get-reset-password with email"
 *          description: "get-reset-password with email"
 *          consumes: ["application/json"]
 *          parameters:
 *              - in: input
 *                name: email
 *                description: "Email"
 *                required: true
 *                schema: 
 *                type: string        
 * */
router.post("/email/get-reset-password", authController.getResetPasswordLink);
/**
 * @swagger
 *  /api/v1/auth/email/reset-password:
 *      post:
 *          tags: ["Auth"]
 *          summary: "get-reset-password with email"
 *          description: "get-reset-password with email"
 *          consumes: ["application/json"]
 *          parameters:
 *              - in: params
 *                name: resetPasswordToken
 *                description: "resetPasswordToken"
 *                required: true
 *              - in: input
 *                name: password
 *                description: "password"
 *                required: true
 *                schema: 
 *                type: string 
 *              - in: input
 *                name: confirmPassword
 *                description: "confirmPassword"
 *                required: true
 *                schema: 
 *                type: string 
 * */
router.post(
    "/email/reset-password/:resetPasswordToken",
    authController.resetPassword
);
router.post("/email/logout", authController.logOut);

//? Mobile Authentication
/**
 * @swagger
 *  /api/v1/auth/mobile/get-otp:
 *      post:
 *          tags: ["Auth"]
 *          summary: "Login with mobile"
 *          description: "Login with mobile"
 *          consumes: ["application/json"]
 *          parameters:
 *              - in: input
 *                name: mobile
 *                description: "mobile"
 *                required: true
 *                schema: 
 *                  type: string         
 * */
router.post("/mobile/get-otp", authController.getOTP);
/**
 * @swagger
 *  /api/v1/auth/mobile/validate-otp:
 *      post:
 *          tags: ["Auth"]
 *          summary: "Login with mobile"
 *          description: "Login with mobile"
 *          consumes: ["application/json"]
 *          parameters:
 *              - in: input
 *                name: mobile
 *                description: "mobile"
 *                required: true
 *                schema: 
 *                  type: string         
 *              - in: input
 *                name: otp
 *                description: "otp"
 *                required: true
 *                schema: 
 *                  type: string         
 * */
router.post("/mobile/validate-otp", authController.validateOTP);

module.exports = {
    AuthRouter: router,
};
