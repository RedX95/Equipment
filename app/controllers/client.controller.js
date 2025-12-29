const db = require("../models");
const { QueryTypes } = require("sequelize");
const Client = db.Client;

// CREATE
exports.create = async (req, res) => {
  try {
    if (!req.body.fullName || !req.body.phone) {
      return res.status(400).json({ message: "fullName and phone are required" });
    }

    const client = await Client.create({
      fullName: req.body.fullName,
      phone: req.body.phone
    });

    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
exports.findAll = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const client = await Client.findByPk(id, {
      include: [{ model: db.Order, as: "orders" }]
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Client.update(req.body, {
      where: { id }
    });

    if (result[0] === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({ message: "Client updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ONE
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Client.destroy({
      where: { id }
    });

    if (!result) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ALL
exports.deleteAll = async (req, res) => {
  try {
    await Client.destroy({ where: {}, truncate: false });
    res.json({ message: "All clients deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FIND ALL PAGED
exports.findAllPaged = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const offset = (page - 1) * size;

    const { count, rows } = await Client.findAndCountAll({
      limit: size,
      offset: offset
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      clients: rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET TOP CLIENTS (Raw SQL)
exports.getTopClients = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topClients = await db.sequelize.query(
      `SELECT 
        c.id,
        c.full_name,
        c.phone,
        COUNT(o.id) as order_count,
        SUM(COALESCE(p.amount, 0)) as total_paid
      FROM clients c
      LEFT JOIN orders o ON c.id = o.client_id
      LEFT JOIN payments p ON o.id = p.order_id
      GROUP BY c.id, c.full_name, c.phone
      ORDER BY order_count DESC, total_paid DESC
      LIMIT :limit`,
      {
        type: QueryTypes.SELECT,
        replacements: { limit }
      }
    );

    res.json(topClients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET CLIENT DEBT (Raw SQL)
exports.getClientDebt = async (req, res) => {
  try {
    const clientId = req.params.id;

    const debt = await db.sequelize.query(
      `SELECT 
        c.id,
        c.full_name,
        COALESCE(SUM(oe.quantity * oe.rent_price), 0) as total_order_amount,
        COALESCE(SUM(p.amount), 0) as total_paid,
        COALESCE(SUM(oe.quantity * oe.rent_price), 0) - COALESCE(SUM(p.amount), 0) as debt
      FROM clients c
      LEFT JOIN orders o ON c.id = o.client_id
      LEFT JOIN order_equipment oe ON o.id = oe.order_id
      LEFT JOIN payments p ON o.id = p.order_id
      WHERE c.id = :clientId
      GROUP BY c.id, c.full_name`,
      {
        type: QueryTypes.SELECT,
        replacements: { clientId }
      }
    );

    if (debt.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(debt[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

