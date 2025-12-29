const db = require("../models");
const { QueryTypes } = require("sequelize");
const Equipment = db.Equipment;

// CREATE
exports.create = async (req, res) => {
  try {
    if (!req.body.name || !req.body.inventoryNumber) {
      return res.status(400).json({ message: "Name and inventoryNumber are required" });
    }

    const equipment = await Equipment.create({
      name: req.body.name,
      inventoryNumber: req.body.inventoryNumber,
      categoryId: req.body.categoryId || null
    });

    res.status(201).json(equipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
exports.findAll = async (req, res) => {
  try {
    const equipment = await Equipment.findAll({
      include: [{ model: db.Category, as: "category" }]
    });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const equipment = await Equipment.findByPk(id, {
      include: [{ model: db.Category, as: "category" }]
    });

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Equipment.update(req.body, {
      where: { id }
    });

    if (result[0] === 0) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.json({ message: "Equipment updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ONE
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Equipment.destroy({
      where: { id }
    });

    if (!result) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.json({ message: "Equipment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ALL
exports.deleteAll = async (req, res) => {
  try {
    await Equipment.destroy({ where: {}, truncate: false });
    res.json({ message: "All equipment deleted" });
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

    const { count, rows } = await Equipment.findAndCountAll({
      limit: size,
      offset: offset,
      include: [{ model: db.Category, as: "category" }]
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      equipment: rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET AVAILABLE EQUIPMENT (Raw SQL)
exports.getAvailableEquipment = async (req, res) => {
  try {
    const dateStart = req.query.dateStart || new Date().toISOString();
    const dateEnd = req.query.dateEnd || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const available = await db.sequelize.query(
      `SELECT DISTINCT e.*
      FROM equipment e
      WHERE e.id NOT IN (
        SELECT DISTINCT oe.equipment_id
        FROM order_equipment oe
        INNER JOIN orders o ON oe.order_id = o.id
        WHERE o.status != 'completed'
        AND (
          (o.date_start <= :dateEnd AND o.date_end >= :dateStart)
        )
      )`,
      {
        type: QueryTypes.SELECT,
        replacements: { dateStart, dateEnd }
      }
    );

    res.json(available);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET EQUIPMENT RENTAL HISTORY (Raw SQL)
exports.getEquipmentRentalHistory = async (req, res) => {
  try {
    const equipmentId = req.params.id;

    const history = await db.sequelize.query(
      `SELECT 
        o.id as order_id,
        o.date_start,
        o.date_end,
        o.status,
        oe.quantity,
        oe.rent_price,
        c.full_name as client_name,
        c.phone as client_phone
      FROM orders o
      INNER JOIN order_equipment oe ON o.id = oe.order_id
      INNER JOIN clients c ON o.client_id = c.id
      WHERE oe.equipment_id = :equipmentId
      ORDER BY o.date_start DESC`,
      {
        type: QueryTypes.SELECT,
        replacements: { equipmentId }
      }
    );

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET EQUIPMENT BY PRICE RANGE (Raw SQL)
exports.getEquipmentByPriceRange = async (req, res) => {
  try {
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || 999999;

    const equipment = await db.sequelize.query(
      `SELECT 
        e.*,
        AVG(oe.rent_price) as avg_rent_price,
        MIN(oe.rent_price) as min_rent_price,
        MAX(oe.rent_price) as max_rent_price
      FROM equipment e
      LEFT JOIN order_equipment oe ON e.id = oe.equipment_id
      GROUP BY e.id
      HAVING COALESCE(AVG(oe.rent_price), 0) BETWEEN :minPrice AND :maxPrice
      ORDER BY avg_rent_price ASC`,
      {
        type: QueryTypes.SELECT,
        replacements: { minPrice, maxPrice }
      }
    );

    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

