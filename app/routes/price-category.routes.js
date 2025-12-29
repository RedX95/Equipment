/**
 * @swagger
 * components:
 *   schemas:
 *     PriceCategory:
 *       type: object
 *       required:
 *         - dateStart
 *         - dateEnd
 *       properties:
 *         id:
 *           type: integer
 *         dateStart:
 *           type: string
 *           format: date-time
 *         dateEnd:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = app => {
  const priceCategories = require("../controllers/price-category.controller");
  const router = require("express").Router();

  /**
   * @swagger
   * /api/price-categories:
   *   post:
   *     summary: Create new price category
   *     tags: [PriceCategories]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PriceCategory'
   *     responses:
   *       201:
   *         description: Price category created
   *       400:
   *         description: Bad request
   */
  router.post("/", priceCategories.create);

  /**
   * @swagger
   * /api/price-categories:
   *   get:
   *     summary: Get all price categories
   *     tags: [PriceCategories]
   *     responses:
   *       200:
   *         description: List of price categories
   */
  router.get("/", priceCategories.findAll);

  /**
   * @swagger
   * /api/price-categories/paged:
   *   get:
   *     summary: Get paginated price categories
   *     tags: [PriceCategories]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Paginated price categories
   */
  router.get("/paged", priceCategories.findAllPaged);

  /**
   * @swagger
   * /api/price-categories/{id}:
   *   get:
   *     summary: Get price category by id
   *     tags: [PriceCategories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Price category found
   *       404:
   *         description: Price category not found
   */
  router.get("/:id", priceCategories.findOne);

  /**
   * @swagger
   * /api/price-categories/{id}:
   *   put:
   *     summary: Update price category
   *     tags: [PriceCategories]
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
   *             $ref: '#/components/schemas/PriceCategory'
   *     responses:
   *       200:
   *         description: Price category updated
   *       404:
   *         description: Price category not found
   */
  router.put("/:id", priceCategories.update);

  /**
   * @swagger
   * /api/price-categories/{id}:
   *   delete:
   *     summary: Delete price category
   *     tags: [PriceCategories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Price category deleted
   *       404:
   *         description: Price category not found
   */
  router.delete("/:id", priceCategories.delete);

  /**
   * @swagger
   * /api/price-categories:
   *   delete:
   *     summary: Delete all price categories
   *     tags: [PriceCategories]
   *     responses:
   *       200:
   *         description: All price categories deleted
   */
  router.delete("/", priceCategories.deleteAll);

  app.use("/api/price-categories", router);
};

