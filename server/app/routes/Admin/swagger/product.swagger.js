/**
 * @swagger
 *  components:
 *      schemas:
 *          Color:
 *              type: array
 *              items:
 *                  type: string
 *                  enum:
 *                      -   black
 *                      -   white
 *                      -   gray
 *                      -   red
 *                      -   blue
 *                      -   green
 *                      -   orange
 *                      -   purple
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Product:
 *              type: object
 *              required:
 *                  -   title
 *                  -   overView
 *                  -   description
 *                  -   tags
 *                  -   category
 *                  -   price
 *                  -   discount
 *                  -   stockCount
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of product
 *                  overView:
 *                      type: string
 *                      description: the title of product
 *                  description:
 *                      type: string
 *                      description: the title of product
 *                  tags:
 *                      type: array
 *                      description: the title of product
 *                  category:
 *                      type: string
 *                      description: the title of product
 *                  price:
 *                      type: string
 *                      description: the title of product
 *                  discount:
 *                      type: string
 *                      description: the title of product
 *                  stockCount:
 *                      type: string
 *                      description: the title of product
 *                  images:
 *                      type: array
 *                      items:
 *                          type: string
 *                          format: binary
 *                  height:
 *                      type: string
 *                      description: the height of product packet
 *                  weight:
 *                      type: string
 *                      description: the weight of product packet
 *                  width:
 *                      type: string
 *                      description: the with of product packet
 *                  length:
 *                      type: string
 *                      description: the length of product packet
 *                  colors:
 *                      $ref: '#/components/schemas/Color'
 *
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Edit-Product:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of product
 *                  overView:
 *                      type: string
 *                      description: the title of product
 *                  description:
 *                      type: string
 *                      description: the title of product
 *                  tags:
 *                      type: array
 *                      description: the title of product
 *                  category:
 *                      type: string
 *                      description: the title of product
 *                  price:
 *                      type: string
 *                      description: the title of product
 *                  discount:
 *                      type: string
 *                      description: the title of product
 *                  stockCount:
 *                      type: string
 *                      description: the title of product
 *                  images:
 *                      type: array
 *                      items:
 *                          type: string
 *                          format: binary
 *                  height:
 *                      type: string
 *                      description: the height of product packet
 *                  weight:
 *                      type: string
 *                      description: the weight of product packet
 *                  width:
 *                      type: string
 *                      description: the with of product packet
 *                  length:
 *                      type: string
 *                      description: the length of product packet
 *                  colors:
 *                      $ref: '#/components/schemas/Color'
 *
 */

/**
 * @swagger
 *  /admin/products/:
 *      post:
 *          tags: [Product(AdminPanel)]
 *          summary: create and save product
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *
 *          responses:
 *              201:
 *                  description: created new Product
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 */

/**
 * @swagger
 *  /admin/products/:
 *      get:
 *          tags: [Product(AdminPanel)]
 *          summary: get all products
 *          parameters:
 *              -   in: query
 *                  name: search
 *                  type: string
 *                  description: description for search in title, description, overView of (product)
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /admin/products/{id}:
 *      get:
 *          tags: [Product(AdminPanel)]
 *          summary: get one products
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  description: objectId of product
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /admin/products/{id}:
 *      delete:
 *          tags: [Product(AdminPanel)]
 *          summary: delete One products
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  description: objectId of product
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
 *  /admin/products/{id}:
 *      put:
 *          tags: [Product(AdminPanel)]
 *          summary: create and save product
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *                  description: id of product for update product
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/Edit-Product'
 *
 *          responses:
 *              200:
 *                  description: updated Product
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 */
