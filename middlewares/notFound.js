const notFound = (req, res) => {
  return res.status(404).json({ msg: "We can not serve you in this route" });
};
module.exports = notFound