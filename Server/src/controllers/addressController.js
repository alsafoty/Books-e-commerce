const { PrismaClient } = require("../../generated/prisma/client");

const prisma = new PrismaClient();

// Create a address
const createAddress = async (req, res) => {
  try {
    const newAddress = await prisma.address.create({
      data: req.body,
    });

    res.status(201).json({ newAddress });
  } catch (error) {
    console.error("Address creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all addresses
const getAddressByUserId = (req, res) => {
  prisma.address
    .findMany({
      where: { userId: req.user.userId },
      orderBy: {
        id: "asc",
      },
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
};

// Get a address by ID
const getAddressById = async (req, res) => {
  const id = req.params.id;

  prisma.address
    .findUnique({
      where: { id: id },
    })
    .then((result) => {
      if (!result) {
        return res
          .status(400)
          .json({ error: "address with given id doesn't exist" });
      }
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
};

// Update a address by ID
const updateAddressById = (req, res) => {
  const id = req.params.id;

  prisma.address
    .findUnique({
      where: { id: id },
    })
    .then((result) => {
      if (!result) {
        return res
          .status(400)
          .json({ error: "address with given id doesn't exist" });
      }

      prisma.address
        .update({
          where: { id: id },
          data: req.body,
        })
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
};

// Delete a address by ID
const deleteAddressById = (req, res) => {
  const id = req.params.id;

  prisma.address
    .delete({
      where: { id: id },
    })
    .then((result) => {
      if (!result) {
        return res
          .status(400)
          .json({ error: "address with given id doesn't exist" });
      }
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
};

module.exports = {
  createAddress,
  getAddressByUserId,
  getAddressById,
  updateAddressById,
  deleteAddressById,
};
