/**
 * @swagger
 *  components:
 *      schemas:
 *          Blog:
 *              type: object
 *              required:
 *                  -   title
 *                  -   short_text
 *                  -   text
 *                  -   tags
 *                  -   category
 *                  -   image
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of category
 *                  overView:
 *                      type: string
 *                      description: the overView of blogs
 *                  content:
 *                      type: string
 *                      description: the content of blogs
 *                  tags:
 *                      type: string
 *                      description: the list of tags for example(tag1#tag2#tag_foo)
 *                  category:
 *                      type: string
 *                      description: the id of category for foreign field in blogs
 *                  image:
 *                      type: file
 *                      description: the index picture of blogs
 *          BlogUpdate:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of category
 *                  overView:
 *                      type: string
 *                      description: the overView of blogs
 *                  content:
 *                      type: string
 *                      description: the content of blogs
 *                  tags:
 *                      type: string
 *                      description: the list of tags for example(tag1#tag2#tag_foo)
 *                  category:
 *                      type: string
 *                      description: the id of category for foreign Field in blogs
 *                  image:
 *                      type: file
 *                      description: the index picture of blogs
 */


/**
 * @swagger
 *  /admin/blogs:
 *      get:
 *          tags: [ Blog(AdminPanel)]
 *          summary: get all blogs
 *          responses:
 *              200:
 *                  description: success - get array of blogs
 */
/**
 * @swagger
 *  /admin/blogs/:
 *      post:
 *          tags: [ Blog(AdminPanel)]
 *          summary: create Blog document
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/Blog'
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Blog'
 *          responses:
 *              201:
 *                  description: created
 */
/**
 * @swagger
 *  /admin/blogs/{id}:
 *      patch:
 *          tags: [ Blog(AdminPanel)]
 *          summary: update  Blog document by id
 *          consumes:
 *              -   multipart/form-data
 *          parameters:
 *              -   in: path
 *                  required: true
 *                  name: id
 *                  type: string
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/BlogUpdate'
 *          responses:
 *              200:
 *                  description: success
 */

/**
 * @swagger
 *  /admin/blogs/{id}:
 *      get:
 *          summary: get blogs by ID and populate this field
 *          tags: [ Blog(AdminPanel) ]
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /admin/blogs/{id}:
 *      delete:
 *          summary: remove blogs by ID
 *          tags: [ Blog(AdminPanel) ]
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */