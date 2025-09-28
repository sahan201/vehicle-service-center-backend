import Inventory from '../models/Inventory.js';

/**
 * @desc    Create a new inventory item
 * @route   POST /api/inventory
 * @access  Private (Manager)
 */
export const createInventoryItem = async (req, res) => {
  try {
    const { name, quantity, unit, lowStockThreshold, supplier, costPrice, salePrice } = req.body;

    const newItem = new Inventory({
      name,
      quantity,
      unit,
      lowStockThreshold,
      supplier,
      costPrice,
      salePrice,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ message: 'Server error while creating inventory item.' });
  }
};

/**
 * @desc    Get all inventory items
 * @route   GET /api/inventory
 * @access  Private (Manager, Mechanic)
 */
export const getAllInventoryItems = async (req, res) => {
  try {
    const items = await Inventory.find({}).sort({ name: 1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({ message: 'Server error while fetching inventory.' });
  }
};

/**
 * @desc    Get a single inventory item by ID
 * @route   GET /api/inventory/:id
 * @access  Private (Manager, Mechanic)
 */
export const getInventoryItemById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * @desc    Update an inventory item
 * @route   PUT /api/inventory/:id
 * @access  Private (Manager)
 */
export const updateInventoryItem = async (req, res) => {
  try {
    const { name, quantity, unit, lowStockThreshold, supplier, costPrice, salePrice } = req.body;

    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    item.name = name || item.name;
    item.quantity = quantity !== undefined ? quantity : item.quantity;
    item.unit = unit || item.unit;
    item.lowStockThreshold = lowStockThreshold !== undefined ? lowStockThreshold : item.lowStockThreshold;
    item.supplier = supplier || item.supplier;
    item.costPrice = costPrice !== undefined ? costPrice : item.costPrice;
    item.salePrice = salePrice !== undefined ? salePrice : item.salePrice;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ message: 'Server error while updating inventory item.' });
  }
};

/**
 * @desc    Delete an inventory item
 * @route   DELETE /api/inventory/:id
 * @access  Private (Manager)
 */
export const deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    await item.deleteOne(); // Mongoose v6+ uses deleteOne() on the document
    res.json({ message: 'Inventory item removed successfully.' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ message: 'Server error while deleting inventory item.' });
  }
};

