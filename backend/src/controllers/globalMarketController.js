 import GlobalMarket from "../models/globalMarketModel.js";

// @desc    Create a new global market entry
// @route   POST /api/globalMarket
// @access  Public
export const createGlobalMarket = async (req, res) => {
  try {
    const { country, currency, value, comment } = req.body;

    const newEntry = await GlobalMarket.create({
      country,
      currency,
      value,
      comment,
    });

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all global market entries
// @route   GET /api/globalMarket
// @access  Public
export const getGlobalMarkets = async (req, res) => {
  try {
    const markets = await GlobalMarket.find().sort({ date: -1 });
    res.status(200).json(markets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single market entry by ID
// @route   GET /api/globalMarket/:id
// @access  Public
export const getGlobalMarketById = async (req, res) => {
  try {
    const market = await GlobalMarket.findById(req.params.id);
    if (!market) {
      return res.status(404).json({ message: "Market entry not found" });
    }
    res.status(200).json(market);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a global market entry
// @route   PUT /api/globalMarket/:id
// @access  Public
export const updateGlobalMarket = async (req, res) => {
  try {
    const updatedMarket = await GlobalMarket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMarket) {
      return res.status(404).json({ message: "Market entry not found" });
    }

    res.status(200).json(updatedMarket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a global market entry
// @route   DELETE /api/globalMarket/:id
// @access  Public
export const deleteGlobalMarket = async (req, res) => {
  try {
    const market = await GlobalMarket.findByIdAndDelete(req.params.id);

    if (!market) {
      return res.status(404).json({ message: "Market entry not found" });
    }

    res.status(200).json({ message: "Market entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
