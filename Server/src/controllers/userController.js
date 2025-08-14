const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validator = require("validator");
const sendEmail = require("../middleware/sendEmail");
const { PrismaClient } = require("../../generated/prisma/client");

const prisma = new PrismaClient();

// Register a new user
const registerUser = async (req, res) => {
  if (!validator.isStrongPassword(req.body.password)) {
    return res.status(400).json({ error: "Enter a strong password" });
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  try {
    // Check if user already exists
    const existingUsername = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    const existingEmail = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (existingUsername || existingEmail) {
      return res
        .status(400)
        .json({ error: "username or email already exists" });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobile: req.body.mobile,
        role: req.body.role,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ newUser });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route to authenticate and log in a user
const loginUser = async (req, res) => {
  try {
    // Check if the email exists
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // console.log("User found:", user);
    // Compare passwords
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (!user.isActive) {
      return res.status(500).json({ error: "Inactive user" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, "secret", {
      expiresIn: "7d",
    });
    res.status(200).json({
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  prisma.user
    .findMany()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Get a user by ID
const getUserById = async (req, res) => {
  const id = req.params.id;
  const username = req.user.username;
  prisma.user
    .findUnique({
      where: { id: id },
    })
    .then((result) => {
      if (!result) {
        return res
          .status(400)
          .json({ error: "user with given id doesn't exist" });
      }
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Update a user by ID
const updateUserById = (req, res) => {
  let id = req.params.id;
  prisma.user
    .findUnique({
      where: { id: id },
    })
    .then((result) => {
      if (!result) {
        return res
          .status(400)
          .json({ error: "user with given id doesn't exist" });
      }
      id = result.id.toString();
      prisma.user
        .update({
          where: { id: id },
          data: req.body,
        })
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Delete a user by ID
const deleteUserById = (req, res) => {
  const id = req.params.id;
  prisma.user
    .delete({
      where: { id: id },
    })
    .then((result) => {
      if (!result) {
        return res
          .status(400)
          .json({ error: "user with given id doesn't exist" });
      }
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Resetting user passowrd
const passwordReset = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "user with given email doesn't exist" });
    }
    // let token = user.passwordResetToken;
    // if (!token) {
    token = crypto.randomInt(100000, 999999);

    // }

    const otp = `${token}`;
    try {
      sendEmail(user.email, "Password reset", otp);
    } catch (error) {
      return res.send("An error occured");
    }
    token = bcrypt.hashSync(token.toString(), 10);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordResetToken: token.toString(),
        passwordResetAt: new Date(Date.now() + 1000 * 60 * 10), // 10 mins
        passwordResetable: false,
      },
    });
    res.send("OTP sent to your email account");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

//OTP Validation
const otpVerify = async (req, res) => {
  try {
    await prisma.user.update({
      where: {
        email: req.body.email,
      },
      data: {
        passwordResetable: true,
      },
    });
    res.send("You can reset your password.");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

const passwordResetConfirm = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    await prisma.user.update({
      where: {
        email: req.body.email,
      },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetAt: null,
        passwordResetable: false,
      },
    });
    res.send("Password reset successfully");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  passwordReset,
  otpVerify,
  passwordResetConfirm,
};
