/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated id of the category
 *         name:
 *           type: string
 *           maxLength: 50
 *           description: Category name
 *         baseCategoryId:
 *           type: integer
 *           nullable: true
 *           description: Parent category id
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = app => {
  const categories = require("../controllers/category.controller");
  const router = require("express").Router();

  /**
   * @swagger
   * /api/categories:
   *   post:
   *     summary: Create a new category
   *     tags: [Categories]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *               baseCategoryId:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Category created successfully
   *       400:
   *         description: Bad request
   *       500:
   *         description: Server error
   */
  router.post("/", categories.create);

  /**
   * @swagger
   * /api/categories:
   *   get:
   *     summary: Get all categories
   *     tags: [Categories]
   *     responses:
   *       200:
   *         description: List of all categories
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Category'
   *       500:
   *         description: Server error
   */
  router.get("/", categories.findAll);

  /**
   * @swagger
   * /api/categories/paged:
   *   get:
   *     summary: Get paginated categories
   *     tags: [Categories]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: Paginated categories
   *       500:
   *         description: Server error
   */
  router.get("/paged", categories.findAllPaged);

  /**
   * @swagger
   * /api/categories/stats:
   *   get:
   *     summary: Get category statistics
   *     tags: [Categories]
   *     description: Returns statistics for each category including equipment count and average rent price
   *     responses:
   *       200:
   *         description: Category statistics
   *       500:
   *         description: Server error
   */
  router.get("/stats", categories.getCategoryStats);

  /**
   * @swagger
   * /api/categories/popular:
   *   get:
   *     summary: Get most popular categories
   *     tags: [Categories]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 5
   *     responses:
   *       200:
   *         description: Most popular categories
   *       500:
   *         description: Server error
   */
  router.get("/popular", categories.getMostPopularCategories);

  /**
   * @swagger
   * /api/categories/{id}:
   *   get:
   *     summary: Get category by id
   *     tags: [Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Category found
   *       404:
   *         description: Category not found
   *       500:
   *         description: Server error
   */
  router.get("/:id", categories.findOne);

  /**
   * @swagger
   * /api/categories/{id}:
   *   put:
   *     summary: Update category
   *     tags: [Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Category'
   *     responses:
   *       200:
   *         description: Category updated
   *       404:
   *         description: Category not found
   *       500:
   *         description: Server error
   */
  router.put("/:id", categories.update);

  /**
   * @swagger
   * /api/categories/{id}:
   *   delete:
   *     summary: Delete category by id
   *     tags: [Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Category deleted
   *       404:
   *         description: Category not found
   *       500:
   *         description: Server error
   */
  router.delete("/:id", categories.delete);

  /**
   * @swagger
   * /api/categories:
   *   delete:
   *     summary: Delete all categories
   *     tags: [Categories]
   *     responses:
   *       200:
   *         description: All categories deleted
   *       500:
   *         description: Server error
   */
  router.delete("/", categories.deleteAll);

  app.use("/api/categories", router);
};
