/**
 * @swagger
 * components:
 *   schemas:
 *     Equipment:
 *       type: object
 *       required:
 *         - name
 *         - inventoryNumber
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *           maxLength: 50
 *         inventoryNumber:
 *           type: string
 *           maxLength: 40
 *         categoryId:
 *           type: integer
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = app => {
  const equipment = require("../controllers/equipment.controller");
  const router = require("express").Router();

  /**
   * @swagger
   * /api/equipment:
   *   post:
   *     summary: Create new equipment
   *     tags: [Equipment]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Equipment'
   *     responses:
   *       201:
   *         description: Equipment created
   *       400:
   *         description: Bad request
   *       500:
   *         description: Server error
   */
  router.post("/", equipment.create);

  /**
   * @swagger
   * /api/equipment:
   *   get:
   *     summary: Get all equipment
   *     tags: [Equipment]
   *     responses:
   *       200:
   *         description: List of equipment
   *       500:
   *         description: Server error
   */
  router.get("/", equipment.findAll);

  /**
   * @swagger
   * /api/equipment/paged:
   *   get:
   *     summary: Get paginated equipment
   *     tags: [Equipment]
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
   *         description: Paginated equipment
   */
  router.get("/paged", equipment.findAllPaged);

  /**
   * @swagger
   * /api/equipment/available:
   *   get:
   *     summary: Get available equipment for rent
   *     tags: [Equipment]
   *     parameters:
   *       - in: query
   *         name: dateStart
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: dateEnd
   *         schema:
   *           type: string
   *           format: date-time
   *     responses:
   *       200:
   *         description: Available equipment
   */
  router.get("/available", equipment.getAvailableEquipment);

  /**
   * @swagger
   * /api/equipment/price-range:
   *   get:
   *     summary: Get equipment by price range
   *     tags: [Equipment]
   *     parameters:
   *       - in: query
   *         name: minPrice
   *         schema:
   *           type: number
   *       - in: query
   *         name: maxPrice
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: Equipment in price range
   */
  router.get("/price-range", equipment.getEquipmentByPriceRange);

  /**
   * @swagger
   * /api/equipment/{id}:
   *   get:
   *     summary: Get equipment by id
   *     tags: [Equipment]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Equipment found
   *       404:
   *         description: Equipment not found
   */
  router.get("/:id", equipment.findOne);

  /**
   * @swagger
   * /api/equipment/{id}/rental-history:
   *   get:
   *     summary: Get equipment rental history
   *     tags: [Equipment]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Rental history
   */
  router.get("/:id/rental-history", equipment.getEquipmentRentalHistory);

  /**
   * @swagger
   * /api/equipment/{id}:
   *   put:
   *     summary: Update equipment
   *     tags: [Equipment]
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
   *             $ref: '#/components/schemas/Equipment'
   *     responses:
   *       200:
   *         description: Equipment updated
   *       404:
   *         description: Equipment not found
   */
  router.put("/:id", equipment.update);

  /**
   * @swagger
   * /api/equipment/{id}:
   *   delete:
   *     summary: Delete equipment
   *     tags: [Equipment]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Equipment deleted
   *       404:
   *         description: Equipment not found
   */
  router.delete("/:id", equipment.delete);

  /**
   * @swagger
   * /api/equipment:
   *   delete:
   *     summary: Delete all equipment
   *     tags: [Equipment]
   *     responses:
   *       200:
   *         description: All equipment deleted
   */
  router.delete("/", equipment.deleteAll);

  app.use("/api/equipment", router);
};

