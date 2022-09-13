/**
 * @swagger
 *  components:
 *      schemas:
 *          emailLogin:
 *              type: object
 *              required:
 *                  -   email
 *                  -   password
 *              properties:
 *                  email:
 *                      type: email
 *                      description: the uniq email of user
 *                  password:
 *                      type: string
 *                      description: the strong password of user contains at least one capital one lower case and one numerical letter with length of between 8 and 16
 *                  rememberme:
 *                      type: boolean
 *          emailRegister:
 *              type: object
 *              required:
 *                  -   username
 *                  -   email
 *                  -   password
 *                  -   confirmPassword
 *              properties:
 *                  username:
 *                      type: string
 *                      description: the uniq username of user
 *                  email:
 *                      type: email
 *                      description: the uniq email of user
 *                  password:
 *                      type: string
 *                      description: the strong password of user contains at least one capital one lower case and one numerical letter with length of between 8 and 16
 *                  confirmPassword:
 *                      type: string
 *                      description: confirmation of user password
 *          verifyAccountByEmail:
 *              type: object
 *              required:
 *                  -   code
 *              properties:
 *                  code:
 *                      type: string
 *                      description: code we sent to your email
 *          getResetPasswordLink:
 *              type: object
 *              required:
 *                  -   email
 *              properties:
 *                  email:
 *                      type: string
 *                      description: the email address you used for registration
 *          resetPassword:
 *              type: object
 *              required:
 *                  -   password
 *                  -   confirmPassword
 *              properties:
 *                  password:
 *                      type: string
 *                      description: your new password
 *                  confirmPassword:
 *                      type: string
 *                      description: your new password confirmation
 *          getOTP:
 *              type: object
 *              required:
 *                  -   mobile
 *              properties:
 *                  mobile:
 *                      type: string
 *                      description: your mobile number
 *                      example: +989037418138
 *          validateOTP:
 *              type: object
 *              required:
 *                  -   mobile
 *                  -   otp
 *              properties:
 *                  mobile:
 *                      type: string
 *                      description: your mobile number
 *                      example: +989037418138
 *                  otp:
 *                      type: string
 *                      description: the code we have sent to your account
 *                      example: 238759
 */


/**
 * @swagger
 *  /api/v1/auth/email/login/:
 *      post:
 *          tags: [ Auth(API) ]
 *          summary: login by email
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/emailLogin'
 *          responses:
 *              200:
 *                  description: auth controller result
 */

/**
 * @swagger
 *  /api/v1/auth/email/register/:
 *      post:
 *          tags: [ Auth(API) ]
 *          summary: register by email
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/emailRegister'
 *          responses:
 *              200:
 *                  description: auth controller result
 */

/**
 * @swagger
 * /api/v1/auth/mobile/get-otp/:
 *      post:
 *          tags: [ Auth(API) ]
 *          summary: get otp code
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/getOTP'
 *          responses:
 *              200:
 *                  description: auth controller result
 */

/**
 * @swagger
 *  /api/v1/auth/mobile/validate-otp/:
 *      post:
 *          tags: [ Auth(API) ]
 *          summary: validate otp code
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/validateOTP'
 *          responses:
 *              200:
 *                  description: auth controller result
 */


/**
 * @swagger
 *  /api/v1/auth/email/verify-account/:
 *      post:
 *          tags: [ Auth(API) ]
 *          summary: verify account
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/verifyAccountByEmail'
 *          responses:
 *              200:
 *                  description: auth controller result
 */

/**
 * @swagger
 *  /api/v1/auth/email/resend-code/:
 *      post:
 *          tags: [ Auth(API) ]
 *          summary: resend verification code
 *          responses:
 *              200:
 *                  description: auth controller result
 */

/**
 * @swagger
 *  /api/v1/auth/email/logout/:
 *      post:
 *          tags: [ Auth(API) ]
 *          summary: logout from account
 *          responses:
 *              200:
 *                  description: auth controller result
 */

/**
 * @swagger
 *  /api/v1/auth/email/reset-password/{resetPasswordToken}/:
 *      post:
 *          tags: [ Auth(API) ]
 *          summary: reset account password
 *          parameters:
 *              - in: path
 *                name: resetPasswordToken
 *                type: string
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/resetPassword'
 *          responses:
 *              200:
 *                  description: auth controller result
 */


/**
 * @swagger
 *  /api/v1/auth/email/forgot-password/:
 *      post:
 *          tags: [ Auth(API) ]
 *          summary: get reset password link
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/getResetPasswordLink'
 *          responses:
 *              200:
 *                  description: auth controller result
 */
