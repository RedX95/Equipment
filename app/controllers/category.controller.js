const db = require("../models");
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
