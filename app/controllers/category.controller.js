const db = require("../models");
const { QueryTypes } = require("sequelize");
const Category = db.Category;

// CREATE
exports.create = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).send({ message: "Name is required" });
    }

    const category = await Category.create({
      name: req.body.name,
      baseCategoryId: req.body.baseCategoryId || null
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
exports.findAll = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Category.update(req.body, {
      where: { id }
    });

    if (result[0] === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ONE
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Category.destroy({
      where: { id }
    });

    if (!result) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ALL
exports.deleteAll = async (req, res) => {
  try {
    await Category.destroy({ where: {}, truncate: false });
    res.json({ message: "All categories deleted" });
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

    const { count, rows } = await Category.findAndCountAll({
      limit: size,
      offset: offset
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      categories: rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET CATEGORY STATS (Raw SQL)
exports.getCategoryStats = async (req, res) => {
  try {
    const stats = await db.sequelize.query(
      `SELECT 
        c.id,
        c.name,
        COUNT(e.id) as equipment_count,
        COALESCE(AVG(oe.rent_price), 0) as avg_rent_price
      FROM categories c
      LEFT JOIN equipment e ON c.id = e.category_id
      LEFT JOIN order_equipment oe ON e.id = oe.equipment_id
      GROUP BY c.id, c.name
      ORDER BY equipment_count DESC`,
      { type: QueryTypes.SELECT }
    );

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET MOST POPULAR CATEGORIES (Raw SQL)
exports.getMostPopularCategories = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const popular = await db.sequelize.query(
      `SELECT 
        c.id,
        c.name,
        COUNT(DISTINCT o.id) as order_count,
        SUM(oe.quantity) as total_rented_quantity
      FROM categories c
      INNER JOIN equipment e ON c.id = e.category_id
      INNER JOIN order_equipment oe ON e.id = oe.equipment_id
      INNER JOIN orders o ON oe.order_id = o.id
      GROUP BY c.id, c.name
      ORDER BY order_count DESC, total_rented_quantity DESC
      LIMIT :limit`,
      {
        type: QueryTypes.SELECT,
        replacements: { limit }
      }
    );

    res.json(popular);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
