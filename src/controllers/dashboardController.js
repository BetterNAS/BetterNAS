const os = require('os');
const si = require('systeminformation');

const dashboardView = async (req, res) => {

  var motherboard;

  si.baseboard()
    .then(data => motherboard = data)
    .catch(error => console.error(error));

  res.render("dashboard", {
    navLink: "dashboard",
    user: req.user,
    cpuStats: [{cpu: 50},{cpu: 50},{cpu: 50},{cpu: 50},{cpu: 50},{cpu: 50},{cpu: 50}],
    cpus: os.cpus(),
    cpuLoad: await si.currentLoad(),
    motherboard: await si.baseboard(),
    bios: await si.bios(),
    mem: await si.mem(),
    memLayout: await si.memLayout(),
  });

};

module.exports = {
  dashboardView,
};