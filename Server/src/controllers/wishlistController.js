const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        error: "userId and productId are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingWishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId: userId,
        productId: parseInt(productId),
      },
    });

    if (existingWishlistItem) {
      return res.status(400).json({ error: "Product already in wishlist" });
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: userId,
        productId: parseInt(productId),
      },
      include: {
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        Product: {
          include: {
            Category: true,
            ProductImages: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Product added to wishlist successfully",
      wishlistItem,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's wishlist
const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: userId },
      include: {
        Product: {
          include: {
            Category: true,
            ProductImages: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      wishlistItems,
    });
  } catch (error) {
    console.error("Get user wishlist error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { wishlistId } = req.params;

    const wishlistItem = await prisma.wishlist.findUnique({
      where: { id: wishlistId },
    });

    if (!wishlistItem) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }

    await prisma.wishlist.delete({
      where: { id: wishlistId },
    });

    res.status(200).json({
      message: "Product removed from wishlist successfully",
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove product from wishlist by userId and productId
const removeFromWishlistByProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        error: "userId and productId are required",
      });
    }

    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId: userId,
        productId: parseInt(productId),
      },
    });

    if (!wishlistItem) {
      return res.status(404).json({ error: "Product not found in wishlist" });
    }

    await prisma.wishlist.delete({
      where: { id: wishlistItem.id },
    });

    res.status(200).json({
      message: "Product removed from wishlist successfully",
    });
  } catch (error) {
    console.error("Remove from wishlist by product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Clear entire wishlist for user
const clearWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const deletedItems = await prisma.wishlist.deleteMany({
      where: { userId: userId },
    });

    res.status(200).json({
      message: "Wishlist cleared successfully",
    });
  } catch (error) {
    console.error("Clear wishlist error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
  removeFromWishlistByProduct,
  clearWishlist,
};
