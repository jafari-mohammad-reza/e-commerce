/**
 * @swagger
 *  components:
 *      schemas:
 *          Update-Index:
 *              type: object
 *              properties:
 *                  firstName:
 *                      type: string
 *                      description: the first_name of user
 *                      example: Mohammad
 *                  lastName:
 *                      type: string
 *                      description: the last_name of user
 *                      example: Jafari
 *                  username:
 *                      type: string
 *                      description: the email of user
 *                      example: mohammad@gmail.com
 *                  birthday:
 *                      type: Date
 *                      example: MohammadJafari
 *                      description: the username of user
 *          createUser:
 *              type: object
 *              properties:
 *                  email:
 *                      type: email
 *                      description: user email
 *                  username:
 *                      type: string
 *                      description: user username
 *                  mobileNumber:
 *                      type: string
 *                      description: user mobileNumber
 *                      example: +989037418138
 *                  Role:
 *                      type: string
 *                      description: user Role
 *                      example: USER
 *                  password:
 *                      type: string
 *                      description: user password
 */
/**
 * @swagger
 *  definitions:
 *      ListOfUsers:
 *          type: object
 *          properties:
 *              statusCode:
 *                  type: integer
 *                  example: 200
 *              data:
 *                  type: object
 *                  properties:
 *                      users:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      example: "62822e4ff68cdded54aa928d"
 *                                  firstName:
 *                                      type: string
 *                                      example: "user first_name"
 *                                  lastName:
 *                                      type: string
 *                                      example: "user last_name"
 *                                  username:
 *                                      type: string
 *                                      example: "username"
 *                                  email:
 *                                      type: string
 *                                      example: "the_user_email@example.com"
 *                                  mobileNumber:
 *                                      type: string
 *                                      example: "09121212121"
 */
/**
 * @swagger
 *  /admin/users/:
 *      get:
 *          tags: [Users(AdminPanel)]
 *          summary: get all of users
 *          parameters:
 *              -   in: query
 *                  name: search
 *                  type: string
 *                  description: search in user first_name, last_name, username, mobile, email
 *          responses :
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/ListOfUsers'
 */
/**
 * @swagger
 *  /admin/users/{id}:
 *      get:
 *          tags: [Users(AdminPanel)]
 *          summary: get user profile
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  required: true
 *                  type: string
 *          responses :
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /admin/users/:
 *      put:
 *          tags: [Users(AdminPanel)]
 *          summary: update user detail and profile
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/Update-Index'
 *          responses:
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 */


/**
 * @swagger
 *  /admin/users/:
 *      post:
 *          tags: [Users(AdminPanel)]
 *          summary: create new user
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/createUser'
 *          responses:
 *              200:
 *                  description: success
 */


/**
 * @swagger
 *  /admin/users/ban-user/{id}:
 *      post:
 *          tags: [Users(AdminPanel)]
 *          summary: ban exist user
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                description: exist user id
 *          responses:
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 */
