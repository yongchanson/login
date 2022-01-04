import express from "express";
import {
  home,
  getjoin,
  postjoin,
  getlogin,
  postlogin,
  getprofile,
  postprofile
} from "./userController";

const userRouter = express.Router();

// Add your magic here!

userRouter.get("/", home);
userRouter.route("/join").get(getjoin).post(postjoin);
userRouter.route("/login").get(getlogin).post(postlogin);
// userRouter.get("/profile", getprofile);
userRouter.route("/profile").get(getprofile).post(postprofile);

export default userRouter;
