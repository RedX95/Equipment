/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - dateStart
 *         - dateEnd
 *         - status
 *         - clientId
 *       properties:
 *         id:
 *           type: integer
 *         dateStart:
 *           type: string
 *           format: date-time
 *         dateEnd:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           maxLength: 30
 *         clientId:
 *           type: integer
 *         priceCategoryId:
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
  const orders = require("../controllers/order.controller");
  const router = require("express").Router();

  /**
   * @swagger
   * /api/orders:
   *   post:
   *     summary: Create new order
   *     tags: [Orders]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Order'
   *     responses:
   *       201:
   *         description: Order created
   *       400:
   *         description: Bad request
   */
  router.post("/", orders.create);

  /**
   * @swagger
   * /api/orders:
   *   get:
   *     summary: Get all orders
   *     tags: [Orders]
   *     responses:
   *       200:
   *         description: List of orders
   */
  router.get("/", orders.findAll);

  /**
   * @swagger
   * /api/orders/paged:
   *   get:
   *     summary: Get paginated orders
   *     tags: [Orders]
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
   *         description: Paginated orders
   */
  router.get("/paged", orders.findAllPaged);

  /**
   * @swagger
   * /api/orders/active:
   *   get:
   *     summary: Get active (non-completed) orders
   *     tags: [Orders]
   *     responses:
   *       200:
   *         description: Active orders
   */
  router.get("/active", orders.getActiveOrders);

  /**
   * @swagger
   * /api/orders/period:
   *   get:
   *     summary: Get orders by period
   *     tags: [Orders]
   *     parameters:
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date-time
   *     responses:
   *       200:
   *         description: Orders in period
   */
  router.get("/period", orders.getOrdersByPeriod);

  /**
   * @swagger
   * /api/orders/{id}:
   *   get:
   *     summary: Get order by id
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Order found
   *       404:
   *         description: Order not found
   */
  router.get("/:id", orders.findOne);

  /**
   * @swagger
   * /api/orders/{id}/total:
   *   get:
   *     summary: Calculate order total
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Order total calculated
   *       404:
   *         description: Order not found
   */
  router.get("/:id/total", orders.calculateOrderTotal);

  /**
   * @swagger
   * /api/orders/{id}:
   *   put:
   *     summary: Update order
   *     tags: [Orders]
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
   *             $ref: '#/components/schemas/Order'
   *     responses:
   *       200:
   *         description: Order updated
   *       404:
   *         description: Order not found
   */
  router.put("/:id", orders.update);

  /**
   * @swagger
   * /api/orders/{id}:
   *   delete:
   *     summary: Delete order
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Order deleted
   *       404:
   *         description: Order not found
   */
  router.delete("/:id", orders.delete);

  /**
   * @swagger
   * /api/orders:
   *   delete:
   *     summary: Delete all orders
   *     tags: [Orders]
   *     responses:
   *       200:
   *         description: All orders deleted
   */
  router.delete("/", orders.deleteAll);

  app.use("/api/orders", router);
};

