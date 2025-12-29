/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - amount
 *         - paymentDate
 *         - paymentType
 *         - orderId
 *       properties:
 *         id:
 *           type: integer
 *         amount:
 *           type: number
 *           format: decimal
 *         paymentDate:
 *           type: string
 *           format: date-time
 *         paymentType:
 *           type: string
 *           maxLength: 30
 *         orderId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = app => {
  const payments = require("../controllers/payment.controller");
  const router = require("express").Router();

  /**
   * @swagger
   * /api/payments:
   *   post:
   *     summary: Create new payment
   *     tags: [Payments]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Payment'
   *     responses:
   *       201:
   *         description: Payment created
   *       400:
   *         description: Bad request
   */
  router.post("/", payments.create);

  /**
   * @swagger
   * /api/payments:
   *   get:
   *     summary: Get all payments
   *     tags: [Payments]
   *     responses:
   *       200:
   *         description: List of payments
   */
  router.get("/", payments.findAll);

  /**
   * @swagger
   * /api/payments/paged:
   *   get:
   *     summary: Get paginated payments
   *     tags: [Payments]
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
   *         description: Paginated payments
   */
  router.get("/paged", payments.findAllPaged);

  /**
   * @swagger
   * /api/payments/stats/monthly:
   *   get:
   *     summary: Get payment statistics by month
   *     tags: [Payments]
   *     responses:
   *       200:
   *         description: Monthly payment statistics
   */
  router.get("/stats/monthly", payments.getPaymentStatsByMonth);

  /**
   * @swagger
   * /api/payments/unpaid-orders:
   *   get:
   *     summary: Get orders with unpaid payments
   *     tags: [Payments]
   *     responses:
   *       200:
   *         description: Unpaid orders
   */
  router.get("/unpaid-orders", payments.getUnpaidOrders);

  /**
   * @swagger
   * /api/payments/{id}:
   *   get:
   *     summary: Get payment by id
   *     tags: [Payments]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Payment found
   *       404:
   *         description: Payment not found
   */
  router.get("/:id", payments.findOne);

  /**
   * @swagger
   * /api/payments/{id}:
   *   put:
   *     summary: Update payment
   *     tags: [Payments]
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
   *             $ref: '#/components/schemas/Payment'
   *     responses:
   *       200:
   *         description: Payment updated
   *       404:
   *         description: Payment not found
   */
  router.put("/:id", payments.update);

  /**
   * @swagger
   * /api/payments/{id}:
   *   delete:
   *     summary: Delete payment
   *     tags: [Payments]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Payment deleted
   *       404:
   *         description: Payment not found
   */
  router.delete("/:id", payments.delete);

  /**
   * @swagger
   * /api/payments:
   *   delete:
   *     summary: Delete all payments
   *     tags: [Payments]
   *     responses:
   *       200:
   *         description: All payments deleted
   */
  router.delete("/", payments.deleteAll);

  app.use("/api/payments", router);
};

