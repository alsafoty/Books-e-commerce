const { PrismaClient } = require("../../generated/prisma/client");

const prisma = new PrismaClient();

const verifyPass = async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!user) return res.status(400).send("User not found");

  if (!user.passwordResetable) {
    return res.status(400).send("You cannot reset your password.");
  }

  if (req.body.password?.length < 8) {
    return res.status(400).send("Password must be at least 8 characters long");
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).send("Passwords do not match");
  }
  const expiration = user.passwordResetAt;
  if (Date.now() >= expiration.getTime()) {
    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        passwordResetToken: null,
        passwordResetAt: null,
        passwordResetable: false,
      },
    });
    return res.status(400).send("Session expired, please try again.");
  }

  next();
};

module.exports = { verifyPass };
