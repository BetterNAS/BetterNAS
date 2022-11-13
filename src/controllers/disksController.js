const disksView = (req, res) => {

  res.render("disks", {
    navLink: "disks",
    user: req.user
  });
};

module.exports = {
  disksView,
};