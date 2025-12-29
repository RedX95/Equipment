const db = require("../models");
const { QueryTypes } = require("sequelize");
const Order = db.Order;

// CREATE
exports.create = async (req, res) => {
  try {
    if (!req.body.dateStart || !req.body.dateEnd || !req.body.status || !req.body.clientId) {
      return res.status(400).json({ message: "dateStart, dateEnd, status, and clientId are required" });
    }

    const order = await Order.create({
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      status: req.body.status,
      clientId: req.body.clientId,
      priceCategoryId: req.body.priceCategoryId || null
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
exports.findAll = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: db.Client, as: "client" },
        { model: db.PriceCategory, as: "priceCategory" },
        {
          model: db.Equipment,
          as: "equipment",
          through: { attributes: ["quantity", "rentPrice"] }
        }
      ]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findByPk(id, {
      include: [
        { model: db.Client, as: "client" },
        { model: db.PriceCategory, as: "priceCategory" },
        {
          model: db.Equipment,
          as: "equipment",
          through: { attributes: ["quantity", "rentPrice"] }
        },
        { model: db.Payment, as: "payments" }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Order.update(req.body, {
      where: { id }
    });

    if (result[0] === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ONE
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Order.destroy({
      where: { id }
    });

    if (!result) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ALL
exports.deleteAll = async (req, res) => {
  try {
    await Order.destroy({ where: {}, truncate: false });
    res.json({ message: "All orders deleted" });
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

    const { count, rows } = await Order.findAndCountAll({
      limit: size,
      offset: offset,
      include: [
        { model: db.Client, as: "client" },
        { model: db.PriceCategory, as: "priceCategory" }
      ]
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      orders: rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ACTIVE ORDERS (Raw SQL)
exports.getActiveOrders = async (req, res) => {
  try {
    const active = await db.sequelize.query(
      `SELECT 
        o.*,
        c.full_name as client_name,
        c.phone as client_phone,
        COUNT(DISTINCT oe.equipment_id) as equipment_count,
        SUM(oe.quantity * oe.rent_price) as total_amount
      FROM orders o
      INNER JOIN clients c ON o.client_id = c.id
      LEFT JOIN order_equipment oe ON o.id = oe.order_id
      WHERE o.status NOT IN ('completed', 'cancelled')
      GROUP BY o.id, c.full_name, c.phone
      ORDER BY o.date_start DESC`,
      { type: QueryTypes.SELECT }
    );

    res.json(active);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ORDERS BY PERIOD (Raw SQL)
exports.getOrdersByPeriod = async (req, res) => {
  try {
    const startDate = req.query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = req.query.endDate || new Date().toISOString();

    const orders = await db.sequelize.query(
      `SELECT 
        o.*,
        c.full_name as client_name,
        COUNT(DISTINCT oe.equipment_id) as equipment_count,
        SUM(oe.quantity * oe.rent_price) as total_amount
      FROM orders o
      INNER JOIN clients c ON o.client_id = c.id
      LEFT JOIN order_equipment oe ON o.id = oe.order_id
      WHERE o.date_start >= :startDate AND o.date_start <= :endDate
      GROUP BY o.id, c.full_name
      ORDER BY o.date_start DESC`,
      {
        type: QueryTypes.SELECT,
        replacements: { startDate, endDate }
      }
    );

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CALCULATE ORDER TOTAL (Raw SQL)
exports.calculateOrderTotal = async (req, res) => {
  try {
    const orderId = req.params.id;

    const result = await db.sequelize.query(
      `SELECT 
        o.id,
        o.date_start,
        o.date_end,
        SUM(oe.quantity * oe.rent_price) as total_amount,
        COALESCE(SUM(p.amount), 0) as total_paid,
        SUM(oe.quantity * oe.rent_price) - COALESCE(SUM(p.amount), 0) as remaining_amount
      FROM orders o
      LEFT JOIN order_equipment oe ON o.id = oe.order_id
      LEFT JOIN payments p ON o.id = p.order_id
      WHERE o.id = :orderId
      GROUP BY o.id, o.date_start, o.date_end`,
      {
        type: QueryTypes.SELECT,
        replacements: { orderId }
      }
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

