// MarketSetupForm.jsx
import React, { useState } from "react";

const MarketSetupForm = () => {
  const [formData, setFormData] = useState({
    onWhat: "",
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
    breakoutEvents: [
      { event: "Formation", comment: "" },
      { event: "Formation", comment: "" },
    ],
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
  const breakoutOptions = ["Formation", "Neckline Broken", "Neckline Retested", "Breakout", "Breakdown", "Retest", "Confirmation"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("S") || name.startsWith("R") || name.endsWith("Comment")) {
      // Support/Resistance/Comment handling
      const section = name.includes("S") || name.includes("R") ? name[0] === "S" ? "support" : "resistance" : null;
      if (section) {
        setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBreakoutChange = (index, key, value) => {
    const updatedEvents = [...formData.breakoutEvents];
    updatedEvents[index][key] = value;
    setFormData((prev) => ({ ...prev, breakoutEvents: updatedEvents }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can send formData to backend API
    console.log("Form Data:", formData);
    alert("Market setup submitted! Check console for data.");
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
              name="Price"

              placeholder=""
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
            type="text"
            className="form-control"
            value={formData.resistance.comment}
            onChange={(e) => setFormData((prev) => ({ ...prev, resistance: { ...prev.resistance, comment: e.target.value } }))}
          />
        </div>
<hr />
        {/* Phase */}
        <div className="mb-3">
          <label className="form-label">Phase</label>
          <select className="form-select" value={formData.phase} onChange={(e) => setFormData((prev) => ({ ...prev, phase: e.target.value }))}>
            {phases.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Phase Comment"
            value={formData.phaseComment}
            onChange={(e) => setFormData((prev) => ({ ...prev, phaseComment: e.target.value }))}
          />
        </div>

        {/* Trend */}
        <div className="mb-3">
          <label className="form-label">Trend</label>
          <select className="form-select" value={formData.trend} onChange={(e) => setFormData((prev) => ({ ...prev, trend: e.target.value }))}>
            {trends.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Trend Comment"
            value={formData.trendComment}
            onChange={(e) => setFormData((prev) => ({ ...prev, trendComment: e.target.value }))}
          />
        </div>

        {/* Chart Pattern */}
        <div className="mb-3">
          <label className="form-label">Chart Pattern</label>
          <select className="form-select" value={formData.chartPattern} onChange={(e) => setFormData((prev) => ({ ...prev, chartPattern: e.target.value }))}>
            {chartPatterns.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Chart Pattern Comment"
            value={formData.chartPatternComment}
            onChange={(e) => setFormData((prev) => ({ ...prev, chartPatternComment: e.target.value }))}
          />
        </div>

        {/* Candle Pattern */}
        <div className="mb-3">
          <label className="form-label">Candle Pattern</label>
          <select className="form-select" value={formData.candlePattern} onChange={(e) => setFormData((prev) => ({ ...prev, candlePattern: e.target.value }))}>
            {candlePatterns.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Candle Pattern Comment"
            value={formData.candlePatternComment}
            onChange={(e) => setFormData((prev) => ({ ...prev, candlePatternComment: e.target.value }))}
          />
        </div>

        {/* Breakout / Retest Events */}
        <h5>Breakout / Retest Events</h5>
        {formData.breakoutEvents.map((event, index) => (
          <div className="mb-3" key={index}>
            <label className="form-label">Event {index + 1}</label>
            <select className="form-select mb-2" value={event.event} onChange={(e) => handleBreakoutChange(index, "event", e.target.value)}>
              {breakoutOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="Event Comment"
              value={event.comment}
              onChange={(e) => handleBreakoutChange(index, "comment", e.target.value)}
            />
          </div>
        ))}

        {/* Image Upload */}
        <div className="mb-4">
          <label className="form-label">Upload Image</label>
          <input type="file" className="form-control" onChange={handleImageChange} />
        </div>

        <button type="submit" className="btn btn-primary">Submit Market Setup</button>
      </form>
    </div>
  );
};

export default MarketSetupForm;
