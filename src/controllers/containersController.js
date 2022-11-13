const containersView = (req, res) => {

  res.render("containers", {
    navLink: "containers",
    user: req.user
  });
};

module.exports = {
  containersView,
};