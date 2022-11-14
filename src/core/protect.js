const protectRoute = (req, res, next) =>{
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('Please log in to continue');
  res.redirect('/login');
}
// const allowIf = (req, res) =>{
//   if (!req.isAuthenticated()) {
//     console.log('test4');
//     return next();
//   }
//   res.redirect('/dashboard');
// }
module.exports = {
  protectRoute,
  //allowIf,
};