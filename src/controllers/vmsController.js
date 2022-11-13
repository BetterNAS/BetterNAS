const vmsView = (req, res) => {

  res.render("vms", {
    navLink: "vms",
    user: req.user
  });
};

module.exports = {
  vmsView,
};