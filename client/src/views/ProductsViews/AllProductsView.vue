<template>
  <div class="all-products-page">
    <Navbar />

    <!-- Header Section -->
    <div class="all-products-header bg-light py-3 py-md-4" dir="rtl">
      <div
        class="container-fluid px-3 px-md-4"
        style="max-width: 1400px; margin: 0 auto"
      >
        <div class="row align-items-start">
          <div class="col-12">
            <!-- Breadcrumb -->
            <nav aria-label="breadcrumb" class="mb-3">
              <ol class="breadcrumb gap-1 mb-0">
                <li class="breadcrumb-item">
                  <router-link to="/" class="text-decoration-none">
                    <i class="bi bi-house ms-1"></i>
                    <span class="d-none d-md-inline">الرئيسية /</span>
                    <span class="d-md-none">الرئيسية /</span>
                  </router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  <span class="d-none d-md-inline">جميع المنتجات</span>
                  <span class="d-md-none">المنتجات</span>
                </li>
              </ol>
            </nav>

            <!-- Title and Search Row -->
            <div
              class="row g-3 align-items-center justify-content-md-between mb-3"
            >
              <div class="col-12 col-lg-4">
                <h1 class="h4 h2-md fw-bold text-primary mb-0">
                  <i class="bi bi-box-seam ms-2"></i>
                  <span class="d-none d-md-inline">جميع المنتجات</span>
                  <span class="d-md-none">المنتجات</span>
                </h1>
              </div>
              <div class="col-12 col-lg-3">
                <form class="d-flex">
                  <input
                    class="form-control form-control-sm"
                    type="search"
                    placeholder="ابحث..."
                    aria-label="Search"
                    v-model="searchQuery"
                  />
                  <button
                    class="btn btn-outline-primary btn-sm ms-1"
                    type="submit"
                    @click.prevent="fetchAllProducts"
                  >
                    <i class="bi bi-search"></i>
                  </button>
                </form>
              </div>
              <!-- Filters Row -->
              <div class="row col-md-12 col-lg-4 g-2 me-md-auto">
                <!-- Sort Filter -->
                <div class="col-6">
                  <div
                    class="d-flex flex-column flex-md-row align-items-end align-items-md-center gap-1"
                  >
                    <label class="text-primary fw-bold small d-none d-md-block"
                      >ترتيب:</label
                    >
                    <select
                      class="form-select form-select-sm"
                      v-model="sortingInput"
                      @change="handleSortChange"
                    >
                      <option value="latest">الأحدث</option>
                      <option value="oldest">الأقدم</option>
                      <option value="alphabetical">أبجدي</option>
                      <option value="price_low">سعر ↑</option>
                      <option value="price_high">سعر ↓</option>
                    </select>
                  </div>
                </div>
                <!-- Products per page Filter -->
                <div class="col-6">
                  <div
                    class="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-1"
                  >
                    <label class="text-primary fw-bold small d-none d-md-block"
                      >عدد:</label
                    >
                    <select
                      class="form-select form-select-sm"
                      v-model="productsPerPage"
                      @change="handleSortChange"
                    >
                      <option value="16">16</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">جاري التحميل...</span>
      </div>
      <p class="mt-3 text-muted">جاري تحميل المنتجات...</p>
    </div>

    <!-- Empty Products -->
    <div
      v-else-if="products.length === 0"
      class="empty-products text-center py-5"
      dir="rtl"
    >
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="empty-state-card p-5 rounded-4 shadow-sm bg-light">
              <i class="bi bi-box display-1 text-muted mb-4"></i>
              <h3 class="fw-bold text-dark mb-3">لا توجد منتجات متاحة</h3>
              <p class="text-muted mb-4">
                لا توجد منتجات متاحة في الوقت الحالي.
              </p>
              <router-link
                to="/"
                class="btn btn-primary btn-lg rounded-pill px-4"
              >
                <i class="bi bi-house ms-2"></i>
                العودة للرئيسية
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-else class="products-content py-5" dir="rtl">
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row g-4">
          <div
            v-for="product in products"
            :key="product.id"
            class="col-6 col-md-4 col-lg-3 col-xl-3"
          >
            <div
              class="product-card h-100 bg-white rounded-4 shadow-sm border-0 overflow-hidden position-relative"
            >
              <!-- Stock Badge -->
              <div
                class="position-absolute top-0 start-0 m-2 z-index-2"
                style="z-index: 10"
              >
                <span
                  class="badge"
                  :class="product.stock > 0 ? 'bg-success' : 'bg-danger'"
                >
                  {{
                    product.stock > 0 ? `متوفر (${product.stock})` : "غير متوفر"
                  }}
                </span>
              </div>

              <!-- Product Image -->
              <div
                class="product-image-container position-relative overflow-hidden"
              >
                <img
                  :src="getProductImage(product)"
                  :alt="product.name"
                  class="img-fluid"
                  style="height: 250px; width: 100%; object-fit: cover"
                />

                <!-- Overlay on hover -->
                <div
                  class="overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center opacity-0"
                >
                  <div class="d-flex gap-2">
                    <button
                      @click="addToWishlist(product)"
                      class="btn btn-light btn-sm rounded-circle"
                      :disabled="addingToWishlist === product.id"
                      title="إضافة للمفضلة"
                    >
                      <i class="bi bi-heart text-danger"></i>
                    </button>
                    <button
                      @click="
                        router.push(
                          `/category/${product.Category.id}/product/${product.id}`
                        )
                      "
                      class="btn btn-light btn-sm rounded-circle"
                      title="عرض التفاصيل"
                    >
                      <i class="bi bi-eye text-primary"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Product Details -->
              <div class="p-2 p-md-4">
                <h6 class="fw-bold text-dark mb-2" style="min-height: 40px">
                  <span class="d-md-none">{{
                    product.name.length > 25
                      ? product.name.substring(0, 25) + "..."
                      : product.name
                  }}</span>
                  <span class="d-none d-md-inline">{{ product.name }}</span>
                </h6>

                <p class="text-muted mb-3 small" style="min-height: 45px">
                  <span class="d-md-none">{{
                    product.description.length > 50
                      ? product.description.substring(0, 50) + "..."
                      : product.description
                  }}</span>
                  <span class="d-none d-md-inline" style="font-size: 0.9rem">{{
                    product.description.length > 80
                      ? product.description.substring(0, 80) + "..."
                      : product.description
                  }}</span>
                </p>

                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <span class="h6 text-success fw-bold mb-0">
                    {{ product.price.toFixed(2) }} د. أ
                  </span>
                  <span class="text-muted small d-none d-md-inline">
                    {{ product.Category.name }}
                  </span>
                </div>

                <!-- Action Buttons -->
                <div class="d-grid gap-2">
                  <button
                    @click="addToCart(product)"
                    :disabled="
                      product.stock === 0 || addingToCart === product.id
                    "
                    class="btn btn-primary btn-sm"
                  >
                    <i class="bi bi-cart-plus ms-1"></i>
                    <span class="d-none d-md-inline">{{
                      addingToCart === product.id
                        ? "جاري الإضافة..."
                        : product.stock === 0
                        ? "غير متوفر"
                        : "إضافة للسلة"
                    }}</span>
                    <span class="d-md-none">{{
                      addingToCart === product.id
                        ? "..."
                        : product.stock === 0
                        ? "غير متوفر"
                        : "إضافة"
                    }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 d-flex justify-content-center">
          <nav aria-label="Page navigation example">
            <ul class="pagination pagination-sm">
              <li class="page-item">
                <a
                  class="page-link"
                  @click="changePage(currentPage - 1)"
                  aria-label="Previous"
                >
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <div
                v-for="page in Math.ceil(totalProducts / productsPerPage)"
                :key="page"
              >
                <li class="page-item" v-if="shouldShowPage(page)">
                  <a
                    class="page-link"
                    @click="changePage(page)"
                    :class="{ active: currentPage === page }"
                    >{{ page }}</a
                  >
                </li>
              </div>

              <li class="page-item">
                <a
                  class="page-link"
                  @click="changePage(currentPage + 1)"
                  aria-label="Next"
                >
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div
      v-if="message"
      :class="`alert alert-${messageType} alert-dismissible fade show position-fixed`"
      style="top: 100px; right: 20px; z-index: 1050; min-width: 300px"
      role="alert"
    >
      {{ message }}
      <button
        type="button"
        class="btn-close"
        @click="message = ''"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import axios from "axios";

const router = useRouter();

const products = ref([]);
const loading = ref(true);
const addingToCart = ref(null);
const addingToWishlist = ref(null);
const message = ref("");
const messageType = ref("success");
const cartId = ref("");
const productsPerPage = ref(16);
const sortingInput = ref("latest");
const sortBy = ref("createdAt");
const sortOrder = ref("desc");
const searchQuery = ref(router.currentRoute.value.query.search || "");
const totalProducts = ref(0);
const currentPage = ref(1);

const userId = ref(
  localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).id
    : null
);

document.title = "متجر الكتب | جميع المنتجات";

const fetchAllProducts = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("token");
    await getProductsCount();
    // Fetch all products with search, sorting, and pagination
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/product/browse?limit=${parseInt(
        productsPerPage.value
      )}&sortBy=${sortBy.value}&order=${
        sortOrder.value
      }&searchTerm=${encodeURIComponent(searchQuery.value)}&page=${
        currentPage.value
      }`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.products) {
      products.value = response.data.products;
    } else {
      products.value = [];
      totalProducts.value = 0;
    }
  } catch (error) {
    console.error("Error fetching all products:", error);
    showMessage("حدث خطأ في تحميل المنتجات", "danger");
  } finally {
    loading.value = false;
  }
};

const handleSortChange = () => {
  currentPage.value = 1;
  switch (sortingInput.value) {
    case "price_low":
      sortOrder.value = "asc";
      sortBy.value = "price";
      break;
    case "price_high":
      sortOrder.value = "desc";
      sortBy.value = "price";
      break;
    case "oldest":
      sortOrder.value = "asc";
      sortBy.value = "createdAt";
      break;
    case "alphabetical":
      sortOrder.value = "asc";
      sortBy.value = "name";
      break;
    default:
      sortBy.value = "createdAt";
      sortOrder.value = "desc";
  }
  //   getProductsCount();
  fetchAllProducts();
};

const changePage = (page) => {
  if (
    page < 1 ||
    page > Math.ceil(totalProducts.value / productsPerPage.value)
  ) {
    return;
  }
  currentPage.value = page;
  fetchAllProducts();
};

const addToCart = async (product) => {
  try {
    addingToCart.value = product.id;
    const token = localStorage.getItem("token");

    if (!userId.value) {
      showMessage("يجب تسجيل الدخول لإضافة المنتجات للسلة", "danger");
      return;
    }

    // Create cart if it doesn't exist
    if (!cartId.value) {
      const cartResponse = await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/cart`,
        {
          userId: userId.value,
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (cartResponse.data && cartResponse.data.cart) {
        cartId.value = cartResponse.data.cart.id;
      } else {
        showMessage("حدث خطأ في إنشاء السلة", "danger");
        return;
      }
    }

    // Add item to cart
    const response = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/cart/item`,
      {
        cartId: cartId.value,
        productId: product.id,
        quantity: 1,
      },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.error) {
      showMessage("تم إضافة المنتج إلى السلة", "success");
    } else {
      showMessage(
        response.data.error || "حدث خطأ في إضافة المنتج للسلة",
        "danger"
      );
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    showMessage("حدث خطأ في الاتصال بالخادم", "danger");
  } finally {
    addingToCart.value = null;
  }
};

const addToWishlist = async (product) => {
  try {
    addingToWishlist.value = product.id;
    const token = localStorage.getItem("token");

    if (!userId.value) {
      showMessage("يجب تسجيل الدخول لإضافة المنتجات للمفضلة", "danger");
      return;
    }

    const response = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/wishlist`,
      {
        userId: userId.value,
        productId: product.id,
      },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.error) {
      showMessage("تم إضافة المنتج إلى المفضلة", "success");
    } else {
      showMessage(
        response.data.error || "حدث خطأ في إضافة المنتج للمفضلة",
        "danger"
      );
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error.response.data.error);
    showMessage("حدث خطأ في الاتصال بالخادم", "danger");
  } finally {
    addingToWishlist.value = null;
  }
};

const viewProduct = (productId) => {
  // Navigate to product details page (implement this route when you create it)
  showMessage("صفحة تفاصيل المنتج قيد التطوير", "info");
};

const getProductImage = (product) => {
  if (product.ProductImages && product.ProductImages.length > 0) {
    return product.ProductImages[0].url;
  }
  return "/placeholder-image.jpg";
};

const showMessage = (msg, type = "success") => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

// Helper function for responsive pagination
const shouldShowPage = (page) => {
  const totalPages = Math.ceil(totalProducts.value / productsPerPage.value);
  const current = currentPage.value;

  // Always show first page, last page, and current page
  if (page === 1 || page === totalPages || page === current) {
    return true;
  }

  // Show pages around current page (mobile: 1 on each side, desktop: 2 on each side)
  const range = window.innerWidth < 768 ? 1 : 2;
  return Math.abs(page - current) <= range;
};

const getProductsCount = async () => {
  try {
    axios
      .get(
        `${process.env.VUE_APP_API_BASE_URL}/product/browse?searchTerm=${searchQuery.value}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        totalProducts.value = res.data.totalCount;
      });
  } catch (error) {
    console.error("Error fetching products count:", error);
  }
};

// Lifecycle
onMounted(() => {
  //   getProductsCount();
  fetchAllProducts();
});
</script>

<style scoped>
.all-products-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.all-products-header {
  border-bottom: 1px solid #e9ecef;
}

.breadcrumb {
  background: none;
  padding: 0;
  margin: 0;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: "/";
  color: #6c757d;
}

.product-card {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.product-card:hover {
  border-color: #dee2e6;
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.product-card:hover .overlay {
  opacity: 1 !important;
}

.overlay {
  background: rgba(0, 0, 0, 0.6);
  transition: opacity 0.3s ease;
}

.product-image-container {
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.empty-state-card {
  border: 1px solid #e9ecef;
}

.z-index-2 {
  z-index: 2;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .product-card {
    margin-bottom: 1rem;
  }

  .breadcrumb {
    font-size: 0.9rem;
  }

  .display-6 {
    font-size: 1.5rem;
  }
}

/* Animation for loading */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-card {
  animation: fadeIn 0.5s ease forwards;
}
</style>
