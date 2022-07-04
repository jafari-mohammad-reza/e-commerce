/**
 * @swagger
 *  definitions:
 *      ListOfRoles:
 *          type: object
 *          properties:
 *              statusCode:
 *                  type: integer
 *                  example: 200
 *              data:
 *                  type: object
 *                  properties:
 *                      role:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      example: "62822e4ff68cdded54aa928d"
 *                                  title:
 *                                      type: string
 *                                      example: "title of role"
 *                                  permission:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              _id:
 *                                                  type: string
 *                                                  example: "62822e4ff68cdded54aa928d"
 *                                              title:
 *                                                  type: string
 *                                                  example: "title of permission"
 *
 */
/**
 * @swagger
 *  components:
 *      schemas:
 *          Role:
 *              type: object
 *              required:
 *                  -   title
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of role
 *                  permissions:
 *                      type: array
 *                      description: the permissionsID for role
 */
/**
 * @swagger
 *  components:
 *      schemas:
 *          Edit-Role:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of role
 *                  permissions:
 *                      type: array
 *                      description: the permissionsID for role
 */
/**
 * @swagger
 *  /admin/roles/:
 *      get:
 *          tags: [RBAC(AdminPanel)]
 *          summary: get all Role
 *          responses:
 *              200:
 *                  description: get all Role
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/ListOfRoles'
 *
 */
/**
 * @swagger
 *  /admin/roles/:
 *      post:
 *          tags: [RBAC(AdminPanel)]
 *          summary: create new Role
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/Role'
 *
 *          responses:
 *              201:
 *                  description: created new Role
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 *
 */
/**
 * @swagger
 *  /admin/roles/{id}:
 *      patch:
 *          tags: [RBAC(AdminPanel)]
 *          summary: edit the Role
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/Edit-Role'
 *
 *          responses:
 *              200:
 *                  description: edited the Role
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 *
 */
/**
 * @swagger
 *  /admin/roles/{id}:
 *      delete:
 *          tags: [RBAC(AdminPanel)]
 *          summary: remove the Role
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *                  description: send title of role or objectId of role for remove that
 *          responses:
 *              200:
 *                  description: removed the Role
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 *
 */
