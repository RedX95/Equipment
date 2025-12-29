const db = require("../models");
const PriceCategory = db.PriceCategory;

// CREATE
exports.create = async (req, res) => {
  try {
    if (!req.body.dateStart || !req.body.dateEnd) {
      return res.status(400).json({ message: "dateStart and dateEnd are required" });
    }

    const priceCategory = await PriceCategory.create({
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd
    });

    res.status(201).json(priceCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
exports.findAll = async (req, res) => {
  try {
    const priceCategories = await PriceCategory.findAll({
      include: [{ model: db.Order, as: "orders" }]
    });
    res.json(priceCategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const priceCategory = await PriceCategory.findByPk(id, {
      include: [{ model: db.Order, as: "orders" }]
    });

    if (!priceCategory) {
      return res.status(404).json({ message: "PriceCategory not found" });
    }

    res.json(priceCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await PriceCategory.update(req.body, {
      where: { id }
    });

    if (result[0] === 0) {
      return res.status(404).json({ message: "PriceCategory not found" });
    }

    res.json({ message: "PriceCategory updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ONE
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await PriceCategory.destroy({
      where: { id }
    });

    if (!result) {
      return res.status(404).json({ message: "PriceCategory not found" });
    }

    res.json({ message: "PriceCategory deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ALL
exports.deleteAll = async (req, res) => {
  try {
    await PriceCategory.destroy({ where: {}, truncate: false });
    res.json({ message: "All price categories deleted" });
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

    const { count, rows } = await PriceCategory.findAndCountAll({
      limit: size,
      offset: offset
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      priceCategories: rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

