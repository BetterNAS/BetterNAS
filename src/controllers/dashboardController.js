const dashboardView = (req, res) => {

  var cpuStats = require('cpu-stats');

  cpuStats(500, function (error, result) {
    res.render("dashboard", {
      navLink: "dashboard",
      user: req.user,
      cpuStats: result
    });
  })
};

module.exports = {
  dashboardView,
};