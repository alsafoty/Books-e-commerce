<template>
  <div class="category-home-list mt-4">
    <div
      class="container-fluid px-3 px-md-4"
      style="max-width: 1400px; margin: 0 auto"
    >
      <div
        class="d-flex flex-row justify-content-between align-items-start align-items-md-center border-bottom border-2 border-primary mb-4 pb-3"
      >
        <h1 class="fw-bold mb-3 mb-0">آخر المنتجات</h1>
        <button
          class="btn btn-outline-primary fs-5 fs-md-4"
          @click="router.push('/products')"
        >
          عرض الكل
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">جاري التحميل...</span>
        </div>
        <p class="mt-3 text-muted">جاري تحميل المنتجات...</p>
      </div>

      <!-- Products Grid -->
      <div class="products-content" dir="rtl" v-else>
        <div class="row g-3 g-md-4">
          <div
            v-for="product in products.slice(0, 16)"
            :key="product.id"
            class="col-6 col-md-4 col-lg-3 col-xl-3"
          >
            <div
              class="product-card h-100 bg-white rounded-3 rounded-md-4 shadow-sm border-0 overflow-hidden position-relative"
            >
              <!-- Stock Badge -->
              <div
                class="position-absolute top-0 start-0 m-1 m-md-2 z-index-2"
                style="z-index: 10"
              >
                <span
                  class="badge fs-6 fs-md-7"
                  :class="product.stock > 0 ? 'bg-success' : 'bg-danger'"
                >
                  <span class="d-none d-md-inline">{{
                    product.stock > 0 ? `متوفر (${product.stock})` : "غير متوفر"
                  }}</span>
                  <span class="d-md-none">{{
                    product.stock > 0 ? `متوفر` : "غير متوفر"
                  }}</span>
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
                  style="height: 200px; width: 100%; object-fit: cover"
                />

                <!-- Overlay on hover (hidden on mobile) -->
                <div
                  class="overlay position-absolute top-0 start-0 w-100 h-100 d-none d-md-flex align-items-center justify-content-center opacity-0"
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
                <h5
                  class="fw-bold text-dark mb-1 mb-md-2"
                  style="font-size: 0.9rem"
                >
                  <span
                    class="d-block"
                    style="line-height: 1.2; height: 2.4rem; overflow: hidden"
                  >
                    {{ product.name }}
                  </span>
                </h5>

                <p
                  class="text-muted mb-2 mb-md-3 d-none d-md-block"
                  style="min-height: 60px; font-size: 0.9rem"
                >
                  {{
                    product.description?.length > 80
                      ? product.description.substring(0, 80) + "..."
                      : product.description
                  }}
                </p>

                <div
                  class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-2 mb-md-3"
                >
                  <span
                    class="h6 h5-md text-success fw-bold mb-1 mb-md-0"
                    style="font-size: 0.9rem"
                  >
                    {{ product.price.toFixed(2) }} د. أ
                  </span>
                  <span class="text-muted small d-none d-md-inline">
                    {{ product.Category.name }}
                  </span>
                </div>

                <!-- Mobile Action Buttons Row -->
                <div class="d-flex d-md-none gap-1 mb-2">
                  <button
                    @click="addToWishlist(product)"
                    class="btn btn-outline-danger btn-sm flex-fill"
                    :disabled="addingToWishlist === product.id"
                  >
                    <i class="bi bi-heart" style="font-size: 0.8rem"></i>
                  </button>
                  <button
                    @click="
                      router.push(
                        `/category/${product.Category.id}/product/${product.id}`
                      )
                    "
                    class="btn btn-outline-info btn-sm flex-fill"
                  >
                    <i class="bi bi-eye" style="font-size: 0.8rem"></i>
                  </button>
                </div>

                <!-- Action Buttons -->
                <div class="d-grid gap-2">
                  <button
                    @click="addToCart(product)"
                    :disabled="
                      product.stock === 0 || addingToCart === product.id
                    "
                    class="btn btn-primary btn-sm"
                    style="font-size: 0.8rem"
                  >
                    <i class="bi bi-cart-plus me-1 me-md-2"></i>
                    <span class="d-none d-md-inline">{{
                      addingToCart === product.id
                        ? "جاري الإضافة..."
                        : product.stock === 0
                        ? "غير متوفر"
                        : "إضافة للسلة"
                    }}</span>
                    <span class="d-md-none">{{
                      addingToCart === product.id
                        ? "جاري..."
                        : product.stock === 0
                        ? "غير متوفر"
                        : "أضف"
                    }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-4 d-flex justify-content-center">
          <nav aria-label="Page navigation">
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
                <li class="page-item">
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
      style="
        top: 80px;
        right: 10px;
        left: 10px;
        z-index: 1050;
        max-width: calc(100% - 20px);
      "
      class="mx-auto"
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
import axios from "axios";
import router from "@/router";
const loading = ref(true);
const products = ref([]);
const currentPage = ref(1);
const totalProducts = ref(0);
const productsPerPage = ref(16);
const addingToCart = ref(null);
const addingToWishlist = ref(null);
const message = ref("");
const messageType = ref("success");
const cartId = ref("");
const userId = ref(
  localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).id
    : null
);

const getProductImage = (product) => {
  if (product.ProductImages && product.ProductImages.length > 0) {
    return product.ProductImages[0].url;
  }
  return "/placeholder-image.jpg";
};
const changePage = (page) => {
  if (
    page < 1 ||
    page > Math.ceil(totalProducts.value / productsPerPage.value)
  ) {
    return;
  }
  currentPage.value = page;
  fetchCategoryProducts();
};

const fetchCategoryProducts = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("token");

    // Fetch products for this category
    const productsResponse = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/product/browse?
      &limit=${parseInt(productsPerPage.value)}&page=${currentPage.value}`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (productsResponse.data && productsResponse.data.products) {
      products.value = productsResponse.data.products;
    } else {
      products.value = [];
    }
  } catch (error) {
    console.error("Error fetching category products:", error);
    if (error.response?.status === 404) {
      showMessage("الفئة المطلوبة غير موجودة", "danger");
      router.push("/categories");
    } else {
      showMessage("حدث خطأ في تحميل المنتجات", "danger");
    }
  } finally {
    loading.value = false;
  }
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

const showMessage = (msg, type = "success") => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = "";
  }, 5000);
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
    if (error.response.data.error === "Product already in wishlist") {
      showMessage("المنتج موجود بالفعل في المفضلة", "warning");
    } else {
      showMessage("حدث خطأ في إضافة المنتج للمفضلة", "danger");
    }
  } finally {
    addingToWishlist.value = null;
  }
};

onMounted(async () => {
  axios
    .get(`${process.env.VUE_APP_API_BASE_URL}/product`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => (totalProducts.value = res.data.length));

  // Fetch products for this category
  await fetchCategoryProducts();
});
</script>

<style scoped>
.category-products-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.category-products-header {
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

/* Mobile responsive adjustments */
@media (max-width: 767px) {
  .product-card {
    border-radius: 0.75rem !important;
  }

  .product-card .p-2 {
    padding: 0.5rem !important;
  }

  .overlay {
    display: none !important;
  }
}

@media (min-width: 768px) {
  .product-card:hover .overlay {
    opacity: 1;
  }
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
