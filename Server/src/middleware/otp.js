const { PrismaClient } = require("../../generated/prisma/client");

const prisma = new PrismaClient();

const verifyOTP = async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.userId,
    },
  });

  if (!user) return res.status(400).send("User not found");

  const token = user.passwordResetToken;
  if (!token || token !== req.body.otp)
    return res.status(400).send("Invalid OTP or expired");

  const expiration = user.passwordResetAt;
  if (Date.now() >= expiration.getTime()) {
    await prisma.user.update({
      where: {
        id: user.id,
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
