const Joi = require("joi");
const userModel = require("./users.schema");
const {
  hashPassword,
  findUser,
  updateToken,
  greatAvatar,
  imageMinify,
  removeAvatar,
} = require("./user.helpers");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const sendMail = require("./send.email");

require("dotenv").config();

module.exports = class usersControllers {
  // Registration user
  static async registerUser(req, res, next) {
    try {
      const verificationToken = uuidv4();
      const { email, password } = req.body;
      const userExsist = await findUser(email);
      if (!userExsist) {
        await sendMail(email, verificationToken);
        await greatAvatar(email);
        await imageMinify();
        await removeAvatar(`${email}.png`);
        const newUser = await userModel.create({
          email,
          avatarURL: `http://localhost:3000/images/${email}.png`,
          password: await hashPassword(password),
          verificationToken,
        });
        return res.status(201).json({
          user: {
            email: newUser.email,
            avatarURL: newUser.avatarURL,
            subscription: newUser.subscription,
          },
        });
      }
      return res.status(409).json({ message: "Email in use" });
    } catch (err) {
      next(err);
    }
  }

  // login User
  static async loginUser(req, res, next) {
    try {
      const { email, password, id } = req.body;
      const user = await findUser(email);
      if (!user) {
        return res.status(401).json({ message: "Email or password is wrong" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Password is wrong" });
      }
      const token = await jwt.sign(
        { id: user._id },
        process.env.JWT_SECURE_KEY,
        { expiresIn: "1d" }
      );
      updateToken(user._id, token);
      return res.json({
        token: token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // logout User
  static async logoutUser(req, res, next) {
    try {
      const user = req.user;
      updateToken(user._id, null);
      return res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  // Get current user
  static async getCurrentUser(req, res, next) {
    try {
      const user = req.user;
      return res.json({
        email: user.email,
        subscription: user.subscription,
      });
    } catch (err) {
      next(err);
    }
  }

  // Update current user
  static async updateCurrentUser(req, res, next) {
    try {
      const user = await userModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({
        email: user.email,
        subscription: user.subscription,
      });
    } catch (err) {
      next(err);
    }
  }

  // Add Avatar
  static async addAvatar(req, res, next) {
    try {
      await imageMinify();
      await removeAvatar(req.file.filename);
      return res.status(200).json({
        avatarURL: `http://localhost:3000/images/${req.file.filename}`,
      });
    } catch (err) {
      next(err);
    }
  }

  // Validate user
  static validateUser(req, res, next) {
    const createUserRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const result = createUserRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details);
    }
    next();
  }

  // Validate subscription type
  static subscriptionType(req, res, next) {
    const createSubscriptionRules = Joi.object({
      subscription: Joi.string().valid("free", "pro", "premium"),
    });
    const result = createSubscriptionRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details);
    }
    next();
  }

  // Autorization user
  static async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECURE_KEY).id;
      } catch (err) {
        return res.status(401).json({ message: "Not authorized" });
      }
      const user = await userModel.findById(userId);
      if (!user || user.token !== token) {
        return res.status(401).json({ message: "Not authorized" });
      }
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      next(err);
    }
  }

  // Verification Token
  static async verificateEmailUser(req, res, next) {
    try {
      const verificationToken = req.params.verificationToken;
      const user = await userModel.findOneAndUpdate(
        { verificationToken },
        {
          verificationToken: null,
        }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ message: "Email Verificated" });
    } catch (err) {
      next(err);
    }
  }
};
