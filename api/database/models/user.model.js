const mongoose = require("mongoose");
const _ = require("lodash");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const jwtSecret = "asdfdfdfggfddrfgthkolvgunhtbgtfg";
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 10,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  },
  sessions: [
    {
      token: {
        type: String,
        required: true,
      },
      expiresAt: {
        type: Number,
        required: true,
      },
    },
  ],
});

// Instancs

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  // return info without pass and email
  return _.omit(userObject, ["password", "sessions"]);
};

UserSchema.methods.generateAccessAuthToken = function () {
  const user = this;
  return new Promise((resolve, reject) => {
    jwt.sign(
      { _id: user._id.toHexString() },
      jwtSecret,
      { expiresIn: "15m" },
      (err, token) => {
        if (!err) {
          resolve(token);
        } else {
          reject();
        }
      }
    );
  });
};

UserSchema.methods.generateRefreshAuthToken = function () {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (!err) {
        let token = buf.toString("hex");
        return resolve(token);
      }
    });
  });
};

UserSchema.methods.createSession = function () {
  let user = this;

  return user
    .generateRefreshAuthToken()
    .then((refreshToken) => {
      return saveSessionToDatabase(user, refreshToken);
    })
    .then((refreshToken) => {
      return refreshToken;
    })
    .catch((e) => {
      return Promise.reject("failed");
    });
};

let saveSessionToDatabase = (user, refreshToken) => {
  return new Promise((resolve, reject) => {
    let expiresAt = generateRefreshTokenExpiryTime();
    user.sessions.push({ token: refreshToken, expiresAt });
    user
      .save()
      .then(() => {
        return resolve(refreshToken);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

let generateRefreshTokenExpiryTime = () => {
  let day = "10";
  let untilExp = day * 24 * 60 * 60;
  return Date.now() / 1000 + untilExp;
};

UserSchema.statics.findByIdAndToken = function (_id, token) {
  const user = this;
  return user.findOne({
    _id,
    "sessions.token": token,
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  let user = this;
  return user.findOne({ email }).then(user);
};

UserSchema.pre("save", function (next) {
  let user = this;

  let costFactor = 10;

  if (user.isModified("password")) {
    bcryptjs.genSalt(costFactor, (err, salt) => {
      bcryptjs.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});
