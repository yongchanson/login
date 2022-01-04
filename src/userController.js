/*
You DONT have to import the User with your username.
Because it's a default export we can nickname it whatever we want.
So import User from "./models"; will work!
You can do User.find() or whatever you need like normal!
*/
import User from "./models/User";
import bcrypt from "bcrypt";
// Add your magic here!

export const home = async (req, res) => {
  const users = await User.find({});
  return res.render("home", { pageTitle: "Home", users });
};

export const getjoin = (req, res) => res.render("join", { pageTitle: "Join" });

export const postjoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(404).render("join", {
      pageTitle,
      errorMessage: "Password reTry plz."
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(404).render("join", {
      pageTitle,
      errorMessage: "This username/email is boom."
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: error._message
    });
  }
};

export const getlogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postlogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "username does not exists."
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password"
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  // console.log(req.session.user);
  return res.redirect("/");
};

// export const getprofile = async (req, res) => {
//   // const { id } = req.params;
//   // const users = await User.findOne({ username });
//   // const users = await User.findById(id);
//   const { username, name } = req.body;
//   const user = await User.findOne({ username, name });
//   // console.log(user);
//   // console.log(name);
//   console.log(req.session.user);
//   const sss = req.session.user;
//   console.log(sss.name);
//   // console.log(user.name);
//   // const sssname = sss.name;
//   // sss.name = name;
//   return res.render("profile", { pageTitle: "ProFile", user});
//   // return res.render("profile", { pageTitle: req.session.user, name: req.session.user, "username": user.username});
// };

// export const postprofile = async (req, res) => {
//   // const { id } = req.params;
//   // const { name, email, usersname, location } = req.body;
//   const users = await User.findOne({ usersname });
//   console.log(users);
//   // users.name = name;
//   // users.email = email;
//   // users.usersname = usersname;
//   // users.location = location;
//   return res.render("profile", { pageTitle: "ProFile", users});
// };

export const getprofile = async (req, res) => {
  // const { id } = req.params;
  // const user = await User.findById(id);
  // console.log(user.location);
  // return res.render("profile", { pageTitle: `ProFile: ${user.name}`, user });
  // return res.render("profile", { pageTitle: "profile" , user });
  return res.render("profile", { pageTitle: "profile" });
};

export const postprofile = async (req, res) => {
  // const { id } = req.params;
  const {
    session: {
      user: { _id }
    },
    body: { name, email, username, location }
  } = req;
  // const id = req.session.user._id
  // const { name, email, usersname, location } = req.body;
  // const user = await User.findById(id);
  // if (!user) {
  //   return res.render("404", { pageTitle: "404 found." });
  // }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      username,
      location
    },
    { new: true }
  );
  req.session.user = updatedUser;
  // await User.findByIdAndUpdate(_id, {
  //   name, email, usersname, password, location
  // });
  return res.redirect("/profile");
};
