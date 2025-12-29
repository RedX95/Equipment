/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - fullName
 *         - phone
 *       properties:
 *         id:
 *           type: integer
 *         fullName:
 *           type: string
 *           maxLength: 50
 *         phone:
 *           type: string
 *           maxLength: 40
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = app => {
  const clients = require("../controllers/client.controller");
  const router = require("express").Router();

  /**
   * @swagger
   * /api/clients:
   *   post:
   *     summary: Create new client
   *     tags: [Clients]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Client'
   *     responses:
   *       201:
   *         description: Client created
   *       400:
   *         description: Bad request
   */
  router.post("/", clients.create);

  /**
   * @swagger
   * /api/clients:
   *   get:
   *     summary: Get all clients
   *     tags: [Clients]
   *     responses:
   *       200:
   *         description: List of clients
   */
  router.get("/", clients.findAll);

  /**
   * @swagger
   * /api/clients/paged:
   *   get:
   *     summary: Get paginated clients
   *     tags: [Clients]
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
   *         description: Paginated clients
   */
  router.get("/paged", clients.findAllPaged);

  /**
   * @swagger
   * /api/clients/top:
   *   get:
   *     summary: Get top clients by order count
   *     tags: [Clients]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: Top clients
   */
  router.get("/top", clients.getTopClients);

  /**
   * @swagger
   * /api/clients/{id}:
   *   get:
   *     summary: Get client by id
   *     tags: [Clients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Client found
   *       404:
   *         description: Client not found
   */
  router.get("/:id", clients.findOne);

  /**
   * @swagger
   * /api/clients/{id}/debt:
   *   get:
   *     summary: Get client debt
   *     tags: [Clients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Client debt information
   *       404:
   *         description: Client not found
   */
  router.get("/:id/debt", clients.getClientDebt);

  /**
   * @swagger
   * /api/clients/{id}:
   *   put:
   *     summary: Update client
   *     tags: [Clients]
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
   *             $ref: '#/components/schemas/Client'
   *     responses:
   *       200:
   *         description: Client updated
   *       404:
   *         description: Client not found
   */
  router.put("/:id", clients.update);

  /**
   * @swagger
   * /api/clients/{id}:
   *   delete:
   *     summary: Delete client
   *     tags: [Clients]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Client deleted
   *       404:
   *         description: Client not found
   */
  router.delete("/:id", clients.delete);

  /**
   * @swagger
   * /api/clients:
   *   delete:
   *     summary: Delete all clients
   *     tags: [Clients]
   *     responses:
   *       200:
   *         description: All clients deleted
   */
  router.delete("/", clients.deleteAll);

  app.use("/api/clients", router);
};

