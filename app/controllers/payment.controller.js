const db = require("../models");
const { QueryTypes } = require("sequelize");
const Payment = db.Payment;

// CREATE
exports.create = async (req, res) => {
  try {
    if (!req.body.amount || !req.body.paymentDate || !req.body.paymentType || !req.body.orderId) {
      return res.status(400).json({ message: "amount, paymentDate, paymentType, and orderId are required" });
    }

    const payment = await Payment.create({
      amount: req.body.amount,
      paymentDate: req.body.paymentDate,
      paymentType: req.body.paymentType,
      orderId: req.body.orderId
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
exports.findAll = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [{ model: db.Order, as: "order" }]
    });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const payment = await Payment.findByPk(id, {
      include: [{ model: db.Order, as: "order" }]
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Payment.update(req.body, {
      where: { id }
    });

    if (result[0] === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ONE
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Payment.destroy({
      where: { id }
    });

    if (!result) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ALL
exports.deleteAll = async (req, res) => {
  try {
    await Payment.destroy({ where: {}, truncate: false });
    res.json({ message: "All payments deleted" });
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

    const { count, rows } = await Payment.findAndCountAll({
      limit: size,
      offset: offset,
      include: [{ model: db.Order, as: "order" }]
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      payments: rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET PAYMENT STATS BY MONTH (Raw SQL)
exports.getPaymentStatsByMonth = async (req, res) => {
  try {
    const stats = await db.sequelize.query(
      `SELECT 
        TO_CHAR(payment_date, 'YYYY-MM') as month,
        COUNT(*) as payment_count,
        SUM(amount) as total_amount,
        AVG(amount) as avg_amount
      FROM payments
      GROUP BY TO_CHAR(payment_date, 'YYYY-MM')
      ORDER BY month DESC`,
      { type: QueryTypes.SELECT }
    );

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET UNPAID ORDERS (Raw SQL)
exports.getUnpaidOrders = async (req, res) => {
  try {
    const unpaid = await db.sequelize.query(
      `SELECT 
        o.id,
        o.date_start,
        o.date_end,
        o.status,
        c.full_name as client_name,
        c.phone as client_phone,
        SUM(oe.quantity * oe.rent_price) as total_amount,
        COALESCE(SUM(p.amount), 0) as total_paid,
        SUM(oe.quantity * oe.rent_price) - COALESCE(SUM(p.amount), 0) as debt
      FROM orders o
      INNER JOIN clients c ON o.client_id = c.id
      LEFT JOIN order_equipment oe ON o.id = oe.order_id
      LEFT JOIN payments p ON o.id = p.order_id
      GROUP BY o.id, c.full_name, c.phone
      HAVING SUM(oe.quantity * oe.rent_price) > COALESCE(SUM(p.amount), 0)
      ORDER BY debt DESC`,
      { type: QueryTypes.SELECT }
    );

    res.json(unpaid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

