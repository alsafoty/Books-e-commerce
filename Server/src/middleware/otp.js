const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const verifyOTP = async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (!user) return res.status(400).send("User not found");

  const token = user.passwordResetToken;

  if (!token) return res.status(400).send("Invalid OTP or expired");

  const isValid = bcrypt.compareSync(req.body.otp, token);
  if (!isValid) return res.status(400).send("Invalid OTP or expired");

  const expiration = user.passwordResetAt;
  if (Date.now() >= expiration.getTime()) {
    await prisma.user.update({
      where: {
        email: req.body.email,
      },
      data: {
        passwordResetToken: null,
        passwordResetAt: null,
        passwordResetable: false,
      },
    });
    return res.status(400).send("Invalid OTP or expired");
  }

  next();
};

module.exports = { verifyOTP };
