/**
 * @swagger
 * components:
 *   schemas:
 *     OrderEquipment:
 *       type: object
 *       required:
 *         - quantity
 *         - rentPrice
 *         - orderId
 *         - equipmentId
 *       properties:
 *         id:
 *           type: integer
 *         quantity:
 *           type: integer
 *         rentPrice:
 *           type: number
 *           format: decimal
 *         orderId:
 *           type: integer
 *         equipmentId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = app => {
  const orderEquipment = require("../controllers/order-equipment.controller");
  const router = require("express").Router();

  /**
   * @swagger
   * /api/order-equipment:
   *   post:
   *     summary: Create new order-equipment relation
   *     tags: [OrderEquipment]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/OrderEquipment'
   *     responses:
   *       201:
   *         description: Order-equipment relation created
   *       400:
   *         description: Bad request
   */
  router.post("/", orderEquipment.create);

  /**
   * @swagger
   * /api/order-equipment:
   *   get:
   *     summary: Get all order-equipment relations
   *     tags: [OrderEquipment]
   *     responses:
   *       200:
   *         description: List of order-equipment relations
   */
  router.get("/", orderEquipment.findAll);

  /**
   * @swagger
   * /api/order-equipment/paged:
   *   get:
   *     summary: Get paginated order-equipment relations
   *     tags: [OrderEquipment]
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
   *         description: Paginated order-equipment relations
   */
  router.get("/paged", orderEquipment.findAllPaged);

  /**
   * @swagger
   * /api/order-equipment/{id}:
   *   get:
   *     summary: Get order-equipment relation by id
   *     tags: [OrderEquipment]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Order-equipment relation found
   *       404:
   *         description: Order-equipment relation not found
   */
  router.get("/:id", orderEquipment.findOne);

  /**
   * @swagger
   * /api/order-equipment/{id}:
   *   put:
   *     summary: Update order-equipment relation
   *     tags: [OrderEquipment]
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
   *             $ref: '#/components/schemas/OrderEquipment'
   *     responses:
   *       200:
   *         description: Order-equipment relation updated
   *       404:
   *         description: Order-equipment relation not found
   */
  router.put("/:id", orderEquipment.update);

  /**
   * @swagger
   * /api/order-equipment/{id}:
   *   delete:
   *     summary: Delete order-equipment relation
   *     tags: [OrderEquipment]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Order-equipment relation deleted
   *       404:
   *         description: Order-equipment relation not found
   */
  router.delete("/:id", orderEquipment.delete);

  /**
   * @swagger
   * /api/order-equipment:
   *   delete:
   *     summary: Delete all order-equipment relations
   *     tags: [OrderEquipment]
   *     responses:
   *       200:
   *         description: All order-equipment relations deleted
   */
  router.delete("/", orderEquipment.deleteAll);

  app.use("/api/order-equipment", router);
};

