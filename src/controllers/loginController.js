const bcrypt = require("bcryptjs");
const passport = require('passport');

//For Register Page
const registerView = (req, res) => {
  res.render("register", {
    navLink: ''
  } );
}

const registerUser = (req, res) => {
  const { name, email, password, confirm } = req.body;
  if (!name || !email || !password || !confirm) {
    console.log("Fill empty fields");
  }
  //Confirm Passwords
  if (password !== confirm) {
    console.log("Password must match");
  } else {
    //Validation
    BetterNAS.models.user.query().findOne({ email: email })
      .then(user => {
        if (user) {
          console.log("email exists");
          res.render("register", {
            navLink: '',
            name,
            email,
            password,
            confirm,
          });
        } else {
          //Validation
          const newUser = {
            name,
            email,
            password,
          };
          //Password Hashing
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              console.log(newUser);
              BetterNAS.models.user.query().insert(newUser)
                .then(res.redirect("/login"))
                .catch((err) => console.log(err));
              ;
            })
          );
        }
      });
  }
};

// For View
const loginView = (req, res) => {
  res.render("login", {
    user: req.user,
    navLink: ''
  } ) ;
}

//Logging in Function
const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  //Required
  if (!email || !password) {
    console.log("Please fill in all the fields");
    res.render("login", {
      navLink: '',
      email,
      password,
    });
  } else {
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
    })(req, res, next);
  }
};

module.exports =  {
  registerView,
  registerUser,
  loginView,
  loginUser
};