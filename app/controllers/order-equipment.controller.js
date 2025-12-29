const db = require("../models");
const OrderEquipment = db.OrderEquipment;

// CREATE
exports.create = async (req, res) => {
  try {
    if (!req.body.quantity || !req.body.rentPrice || !req.body.orderId || !req.body.equipmentId) {
      return res.status(400).json({ message: "quantity, rentPrice, orderId, and equipmentId are required" });
    }

    const orderEquipment = await OrderEquipment.create({
      quantity: req.body.quantity,
      rentPrice: req.body.rentPrice,
      orderId: req.body.orderId,
      equipmentId: req.body.equipmentId
    });

    res.status(201).json(orderEquipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
exports.findAll = async (req, res) => {
  try {
    const orderEquipment = await OrderEquipment.findAll({
      include: [
        { model: db.Order, as: "order" },
        { model: db.Equipment, as: "equipment" }
      ]
    });
    res.json(orderEquipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const orderEquipment = await OrderEquipment.findByPk(id, {
      include: [
        { model: db.Order, as: "order" },
        { model: db.Equipment, as: "equipment" }
      ]
    });

    if (!orderEquipment) {
      return res.status(404).json({ message: "OrderEquipment not found" });
    }

    res.json(orderEquipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await OrderEquipment.update(req.body, {
      where: { id }
    });

    if (result[0] === 0) {
      return res.status(404).json({ message: "OrderEquipment not found" });
    }

    res.json({ message: "OrderEquipment updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ONE
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await OrderEquipment.destroy({
      where: { id }
    });

    if (!result) {
      return res.status(404).json({ message: "OrderEquipment not found" });
    }

    res.json({ message: "OrderEquipment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ALL
exports.deleteAll = async (req, res) => {
  try {
    await OrderEquipment.destroy({ where: {}, truncate: false });
    res.json({ message: "All order equipment deleted" });
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

    const { count, rows } = await OrderEquipment.findAndCountAll({
      limit: size,
      offset: offset,
      include: [
        { model: db.Order, as: "order" },
        { model: db.Equipment, as: "equipment" }
      ]
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      orderEquipment: rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

