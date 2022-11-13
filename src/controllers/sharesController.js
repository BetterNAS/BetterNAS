const sharesView = (req, res) => {

  res.render("shares", {
    navLink: "shares",
    user: req.user
  });
};

module.exports = {
  sharesView,
};