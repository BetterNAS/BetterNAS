const settingsView = (req, res) => {

  res.render("settings", {
    navLink: "settings",
    user: req.user
  });
};

module.exports = {
  settingsView,
};