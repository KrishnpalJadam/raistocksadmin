import React, { useState } from "react";

const MarketSetupForm = () => {
  const breakoutOptions = [
    "Formation",
    "Neckline Broken",
    "Neckline Retested",
    "Breakout",
    "Breakdown",
    "Retest",
    "Confirmation",
  ];

  const [formData, setFormData] = useState({
    onWhat: "",
    price: "",
    support: { S1: "", S2: "", S3: "", comment: "" },
    resistance: { R1: "", R2: "", R3: "", comment: "" },
    phase: "Accumulation",
    phaseComment: "",
    trend: "Bullish",
    trendComment: "",
    chartPattern: "Head & Shoulder",
    chartPatternComment: "",
    candlePattern: "Bullish Marubozu",
    candlePatternComment: "",
    breakoutEvents: [{ formation: breakoutOptions[0], eventComment: "" }],
    image: null,
  });

  const chartPatterns = [
    "Head & Shoulder",
    "Inverted Head & Shoulder",
    "Cup & Handle",
    "Inverted Cup & Handle",
    "Pole & Flag",
    "Inverted Pole & Flag",
    "Double Top",
    "Double Bottom",
    "Triple Top",
    "Triple Bottom",
    "Rising Wedge",
    "Falling Wedge",
    "Ascending Triangle",
    "Descending Triangle",
    "Symmetrical Triangle",
    "Pennant or Flag",
    "Others",
  ];

  const candlePatterns = [
    "Bullish Marubozu",
    "Bearish Marubozu",
    "Doji",
    "Spinning Top",
    "Hammer",
    "Hanging Man",
    "Shooting Star",
    "Bullish Engulfing",
    "Bearish Engulfing",
    "Bullish Harami",
    "Bearish Harami",
    "Piercing Pattern",
    "Dark Cloud Cover",
    "Morning Star",
    "Evening Star",
    "Others",
  ];

  const phases = ["Accumulation", "Distribution", "Greed", "Fear"];
  const trends = ["Bullish", "Bearish", "Sideways"];

  const addBreakoutEvent = () => {
    setFormData({
      ...formData,
      breakoutEvents: [
        ...formData.breakoutEvents,
        { formation: breakoutOptions[0], eventComment: "" },
      ],
    });
  };

  const removeBreakoutEvent = (index) => {
    const updatedEvents = formData.breakoutEvents.filter((_, i) => i !== index);
    setFormData({ ...formData, breakoutEvents: updatedEvents });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["S1", "S2", "S3"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        support: { ...prev.support, [name]: value },
      }));
    } else if (["R1", "R2", "R3"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        resistance: { ...prev.resistance, [name]: value },
      }));
    } else if (name === "supportComment") {
      setFormData((prev) => ({
        ...prev,
        support: { ...prev.support, comment: value },
      }));
    } else if (name === "resistanceComment") {
      setFormData((prev) => ({
        ...prev,
        resistance: { ...prev.resistance, comment: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBreakoutChange = (index, field, value) => {
    const updatedEvents = [...formData.breakoutEvents];
    updatedEvents[index][field] = value;
    setFormData({ ...formData, breakoutEvents: updatedEvents });
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Convert the individual levels into arrays
    const supportLevels = [
      Number(formData.support.S1),
      Number(formData.support.S2),
      Number(formData.support.S3),
    ];
    const resistanceLevels = [
      Number(formData.resistance.R1),
      Number(formData.resistance.R2),
      Number(formData.resistance.R3),
    ];

    data.append("on", formData.onWhat);
    data.append("price", formData.price);
    data.append("supportLevels", JSON.stringify(supportLevels));
    data.append("resistanceLevels", JSON.stringify(resistanceLevels));
    data.append("supportResistanceComment", formData.resistance.comment);
    data.append("phase", formData.phase);
    data.append("phaseComment", formData.phaseComment);
    data.append("trend", formData.trend);
    data.append("trendComment", formData.trendComment);
    data.append("chartPattern", formData.chartPattern);
    data.append("chartPatternComment", formData.chartPatternComment);
    data.append("candlePattern", formData.candlePattern);
    data.append("candlePatternComment", formData.candlePatternComment);
    data.append("breakoutEvents", JSON.stringify(formData.breakoutEvents));

    if (formData.image) data.append("image", formData.image);

    try {
      const res = await fetch("https://tradingapi-production-a52b.up.railway.app/api/marketsetup", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        alert("✅ Market setup submitted successfully!");
        console.log("Response:", result);
      } else {
        alert("❌ Failed to submit. Check console.");
        console.error(result);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="container my-4">
      <form onSubmit={handleSubmit}>
        {/* On What */}
        <div className="mb-3 row">
          <div className="col-sm-6">
            <label className="form-label">On What</label>
            <input
              type="text"
              className="form-control"
              name="onWhat"
              value={formData.onWhat}
              onChange={handleChange}
              placeholder="e.g., Bank Nifty"
            />
          </div>
          <div className="col-sm-6">
            <label className="form-label">Price</label>
            <input
              type="text"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Support */}
        <h5>Support Levels</h5>
        <div className="row">
          {["S1", "S2", "S3"].map((level) => (
            <div className="mb-2 col-sm-4" key={level}>
              <label className="form-label">{level}</label>
              <input
                type="text"
                className="form-control"
                name={level}
                value={formData.support[level]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        {/* Resistance */}
        <h5>Resistance Levels</h5>
        <div className="row">
          {["R1", "R2", "R3"].map((level) => (
            <div className="mb-2 col-sm-4" key={level}>
              <label className="form-label">{level}</label>
              <input
                type="text"
                className="form-control"
                name={level}
                value={formData.resistance[level]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label className="form-label">Support / Resistance Comment</label>
          <textarea
            className="form-control"
            name="resistanceComment"
            value={formData.resistance.comment}
            onChange={handleChange}
          />
        </div>

        <hr />

        {/* Phase */}
        <div className="mb-3">
          <label className="form-label">Phase</label>
          <select
            className="form-select"
            value={formData.phase}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phase: e.target.value }))
            }
          >
            {phases.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Phase Comment"
            value={formData.phaseComment}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phaseComment: e.target.value }))
            }
          />
        </div>

        {/* Trend */}
        <div className="mb-3">
          <label className="form-label">Trend</label>
          <select
            className="form-select"
            value={formData.trend}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, trend: e.target.value }))
            }
          >
            {trends.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Trend Comment"
            value={formData.trendComment}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, trendComment: e.target.value }))
            }
          />
        </div>

        {/* Chart Pattern */}
        <div className="mb-3">
          <label className="form-label">Chart Pattern</label>
          <select
            className="form-select"
            value={formData.chartPattern}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, chartPattern: e.target.value }))
            }
          >
            {chartPatterns.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Chart Pattern Comment"
            value={formData.chartPatternComment}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                chartPatternComment: e.target.value,
              }))
            }
          />
        </div>

        {/* Candle Pattern */}
        <div className="mb-3">
          <label className="form-label">Candle Pattern</label>
          <select
            className="form-select"
            value={formData.candlePattern}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                candlePattern: e.target.value,
              }))
            }
          >
            {candlePatterns.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Candle Pattern Comment"
            value={formData.candlePatternComment}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                candlePatternComment: e.target.value,
              }))
            }
          />
        </div>

        {/* Breakout / Retest Events */}
        <div className="border rounded p-3 mt-4 bg-white shadow-sm">
          <h5 className="mb-3">Breakout / Retest Events</h5>

          {formData.breakoutEvents.map((event, index) => (
            <div className="mb-3 border p-3 rounded" key={index}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label m-0">Event {index + 1}</label>
                {formData.breakoutEvents.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeBreakoutEvent(index)}
                  >
                    ❌ Remove
                  </button>
                )}
              </div>

              <select
                className="form-select mb-2"
                value={event.formation}
                onChange={(e) =>
                  handleBreakoutChange(index, "formation", e.target.value)
                }
              >
                {breakoutOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <input
                type="text"
                className="form-control"
                placeholder="Event Comment"
                value={event.eventComment}
                onChange={(e) =>
                  handleBreakoutChange(index, "eventComment", e.target.value)
                }
              />
            </div>
          ))}

          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={addBreakoutEvent}
          >
            ➕ Add Event
          </button>
        </div>

        {/* Image Upload */}
        <div className="mb-4 mt-3">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Market Setup
        </button>
      </form>
    </div>
  );
};

export default MarketSetupForm;
