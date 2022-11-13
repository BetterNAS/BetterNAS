const logsView = (req, res) => {

  res.render("logs", {
    navLink: "logs",
    user: req.user
  });
};

module.exports = {
  logsView,
};