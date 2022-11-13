const usersView = (req, res) => {

  res.render("users", {
    navLink: "users",
    user: req.user
  });
};

module.exports = {
  usersView,
};