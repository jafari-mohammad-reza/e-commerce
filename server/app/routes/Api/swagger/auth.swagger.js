/**
 * @swagger
 *  components:
 *      schemas:
 *          emailLogin:
 *              type: object
 *              required:
 *                  -   password
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
 *          resetEmail:
 *              type: object
 *              required:
 *                  -   email
 *              properties:
 *                  email:
 *                      type: email
 *                      description: the uniq email of user
 *          resetPassword:
 *              type: object
 *              required:
 *                  -   password
 *                  -   confirmPassword
 *              properties:
 *                  password:
 *                      type: string
 *                      description: user new password
 *                  confirmPassword:
 *                      type: string
 *                      description: user new password confirmation
 *          getOtp:
 *              type: object
 *              required:
 *                  -   mobile
 *              properties:
 *                  mobile:
 *                      type: string
 *                      description: user mobile number
 *          verifyOtp:
 *              type: object
 *              required:
 *                  -   mobile
 *                  -   otp
 *              properties:
 *                  mobile:
 *                      type: string
 *                      description: user mobile number
 *                  otp:
 *                      type: string
 *                      description: user otp code
 *
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
 *  /api/v1/auth/mobile/get-otp/:
 *      post:
 *          tags: [ Auth(API) ]
 *          summary: get otp code
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/getOtp'
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
 *                          $ref: '#/components/schemas/verifyOtp'
 *          responses:
 *              200:
 *                  description: auth controller result
 */


/**
 * @swagger
 *  /api/v1/auth/email/verify-account/{verificationToken}/:
 *      post:
 *          tags: [ Auth(API) ]
 *          summary: verify account
 *          parameters:
 *              - in: path
 *                name: verificationToken
 *                type: string
 *          responses:
 *              200:
 *                  description: auth controller result
 */

/**
 * @swagger
 *  /api/v1/auth/email/resend-code/{token}/:
 *      post:
 *          tags: [ Auth(API) ]
 *          summary: resend verification code
 *          parameters:
 *              - in: path
 *                name: token
 *                type: string
 *          responses:
 *              200:
 *                  description: auth controller result
 */

/**
 * @swagger
 *  /api/v1/auth/email/logout/{accessToken}/:
 *      post:
 *          tags: [ Auth(API) ]
 *          summary: logout from account
 *          parameters:
 *              - in: path
 *                name: accessToken
 *                type: string
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
 *  /api/v1/auth/email/get-reset-password/:
 *      post:
 *          tags: [ Auth(API) ]
 *          summary: get reset password link
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