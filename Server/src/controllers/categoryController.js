const { PrismaClient } = require("../../generated/prisma/client");

const prisma = new PrismaClient();

// Create a category
const createCategory = async (req, res) => {
  try {
    const newCategory = await prisma.category.create({
      data: req.body,
    });

    res.status(201).json({ newCategory });
  } catch (error) {
    console.error("Category creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all categories
const getAllCategories = (req, res) => {
  prisma.category
    .findMany({
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

// Get a category by ID
const getCategoryById = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid category ID" });
  }

  prisma.category
    .findUnique({
      where: { id: id },
      include: {
        Product: true,
      },
    })
    .then((result) => {
      if (!result) {
        return res
          .status(400)
          .json({ error: "category with given id doesn't exist" });
      }
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
};

// Update a category by ID
const updateCategoryById = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid category ID" });
  }

  prisma.category
    .findUnique({
      where: { id: id },
    })
    .then((result) => {
      if (!result) {
        return res
          .status(400)
          .json({ error: "category with given id doesn't exist" });
      }

      prisma.category
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

// Delete a category by ID
const deleteCategoryById = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid category ID" });
  }

  prisma.category
    .delete({
      where: { id: id },
    })
    .then((result) => {
      if (!result) {
        return res
          .status(400)
          .json({ error: "category with given id doesn't exist" });
      }
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
