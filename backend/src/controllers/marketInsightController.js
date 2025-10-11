import MarketInsight from "../models/marketInsightModel.js";

// @desc    Create a new Market Insight
// @route   POST /api/market-insights
// @access  Public or Private based on your auth
export const createMarketInsight = async (req, res) => {
  try {
    const { marketInfo, title, comment, sentiment, date } = req.body;

    const newInsight = await MarketInsight.create({
      marketInfo,
      title,
      comment,
      sentiment,
      date,
    });

    res.status(201).json(newInsight);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all Market Insights
// @route   GET /api/market-insights
// @access  Public
export const getAllMarketInsights = async (req, res) => {
  try {
    const insights = await MarketInsight.find().sort({ date: -1 });
    res.status(200).json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single Market Insight by ID
// @route   GET /api/market-insights/:id
// @access  Public
export const getMarketInsightById = async (req, res) => {
  try {
    const insight = await MarketInsight.findById(req.params.id);
    if (!insight) {
      return res.status(404).json({ message: "Market Insight not found" });
    }
    res.status(200).json(insight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a Market Insight
// @route   PUT /api/market-insights/:id
// @access  Public or Private
export const updateMarketInsight = async (req, res) => {
  try {
    const updatedInsight = await MarketInsight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedInsight) {
      return res.status(404).json({ message: "Market Insight not found" });
    }

    res.status(200).json(updatedInsight);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a Market Insight
// @route   DELETE /api/market-insights/:id
// @access  Public or Private
export const deleteMarketInsight = async (req, res) => {
  try {
    const deletedInsight = await MarketInsight.findByIdAndDelete(req.params.id);

    if (!deletedInsight) {
      return res.status(404).json({ message: "Market Insight not found" });
    }

    res.status(200).json({ message: "Market Insight deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
