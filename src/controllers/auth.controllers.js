import passport from "passport";
import User from "../models/User.js";

export const renderSignUpForm = (req, res) => res.render("auth/signup");

export const signup = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password } = req.body;
  if (password !== confirm_password) {
    errors.push({ text: "Passwords do not match." });
  }
  if (password.length < 4) {
    errors.push({ text: "Passwords must be at least 4 characters." });
  }
  if (errors.length > 0) {
    return res.render("auth/signup", {
      errors,
      name,
      email,
      password,
      confirm_password,
    });
  }

  try {
    // Check if email exists
    const userFound = await User.findOne({ where: { email } });
    if (userFound) {
      req.flash("error_msg", "The Email is already in use.");
      return res.redirect("/auth/signup");
    }

    // Create new user
    const newUser = User.build({ name, email });
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();
    
    req.flash("success_msg", "You are registered.");
    res.redirect("/auth/signin");
  } catch (error) {
    console.error("Error during signup:", error);
    req.flash("error_msg", "Error during registration");
    res.redirect("/auth/signup");
  }
};

export const renderSigninForm = (req, res) => res.render("auth/signin");

export const signin = passport.authenticate("local", {
  successRedirect: "/notes",
  failureRedirect: "/auth/signin",
  failureFlash: true,
});

export const logout = async (req, res, next) => {
  await req.logout((err) => {
    if (err) return next(err);
    req.flash("success_msg", "You are logged out now.");
    res.redirect("/auth/signin");
  });
};
