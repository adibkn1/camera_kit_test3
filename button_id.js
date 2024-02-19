// /api/button_id.js
module.exports = (req, res) => {
    const { button_pressed } = req.query;
    res.status(200).json({ message: `Button ${button_pressed} was pressed` });
  };
  