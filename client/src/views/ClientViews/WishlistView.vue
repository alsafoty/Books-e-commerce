<template>
  <div class="wishlist-page">
    <Navbar />

    <!-- Header Section -->
    <div class="wishlist-header bg-light py-4" dir="rtl">
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row align-items-center">
          <div class="col-md-12">
            <div
              class="d-flex flex-row justify-content-between align-items-center"
            >
              <h1 class="display-6 fw-bold text-primary mb-2">
                <i class="bi bi-heart-fill me-3"></i>
                قائمة المفضلة
              </h1>

              <div class="text-start">
                <button
                  v-if="wishlistItems.length > 0"
                  @click="clearWishlist"
                  class="btn btn-outline-danger"
                  :disabled="loading"
                >
                  <i class="bi bi-trash me-2"></i>
                  مسح الكل
                </button>
              </div>
            </div>

            <p class="text-muted mb-0">
              {{ wishlistItems.length }}
              {{ wishlistItems.length === 1 ? "عنصر" : "عنصر" }} محفوظ للاحقاً
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">جاري التحميل...</span>
      </div>
      <p class="mt-3 text-muted">جاري تحميل قائمة المفضلة...</p>
    </div>

    <!-- Empty Wishlist -->
    <div
      v-else-if="wishlistItems.length === 0"
      class="empty-wishlist text-center py-5"
      dir="rtl"
    >
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="empty-state-card p-5 rounded-4 shadow-sm bg-light">
              <i class="bi bi-heart display-1 text-muted mb-4"></i>
              <h3 class="fw-bold text-dark mb-3">قائمة المفضلة فارغة</h3>
              <p class="text-muted mb-4">
                ابدأ بإضافة المنتجات التي تحبها إلى قائمة المفضلة ولن تفقد أثرها
                مرة أخرى.
              </p>
              <router-link
                to="/"
                class="btn btn-primary btn-lg rounded-pill px-4"
              >
                <i class="bi bi-bag me-2"></i>
                ابدأ التسوق
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Wishlist Items -->
    <div v-else class="wishlist-items py-5" dir="rtl">
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row g-4">
          <div
            v-for="item in wishlistItems"
            :key="item.id"
            class="col-12 col-md-6 col-lg-4 col-xl-3"
          >
            <div
              class="wishlist-card h-100 bg-white rounded-4 shadow-sm border-0 overflow-hidden position-relative"
            >
              <button
                @click="removeFromWishlist(item.id)"
                class="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2 z-index-2"
                style="z-index: 10"
                :disabled="removing === item.id"
              >
                <i class="bi bi-x-lg"></i>
              </button>

              <div
                class="product-image-container position-relative overflow-hidden"
              >
                <img
                  :src="getProductImage(item.Product)"
                  :alt="item.Product.name"
                  class="card-img-top product-image"
                  style="
                    height: 350px;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                  "
                  @mouseover="$event.target.style.transform = 'scale(1.05)'"
                  @mouseleave="$event.target.style.transform = 'scale(1)'"
                />
                <div
                  class="overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center opacity-0"
                  style="
                    background: rgba(0, 0, 0, 0.5);
                    transition: opacity 0.3s ease;
                  "
                >
                  <router-link
                    :to="`/product/${item.Product.id}`"
                    class="btn btn-primary rounded-pill"
                  >
                    <i class="bi bi-eye me-2"></i>
                    عرض المنتج
                  </router-link>
                </div>
              </div>

              <div class="card-body p-4">
                <h3 class="card-title fw-bold text-dark mb-2 text-start">
                  {{ item.Product.name }}
                </h3>
                <div
                  class="d-flex justify-content-between align-items-start mb-2"
                >
                  <span
                    class="badge bg-light text-primary rounded-pill px-3 py-2"
                  >
                    {{ item.Product.Category?.name || "غير محدد" }}
                  </span>
                </div>

                <div class="d-flex justify-content-between align-items-center">
                  <div class="price">
                    <span class="h5 fw-bold text-primary mb-0">
                      {{ item.Product.price }} د. أ
                    </span>
                  </div>
                  <div class="stock-info">
                    <span
                      :class="
                        item.Product.stock > 0 ? 'text-success' : 'text-danger'
                      "
                      class="small fw-bold"
                    >
                      {{
                        item.Product.stock > 0
                          ? `متوفر (${item.Product.stock})`
                          : "غير متوفر"
                      }}
                    </span>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-3 d-grid gap-2">
                  <button
                    @click="addToCart(item.Product)"
                    :disabled="
                      item.Product.stock === 0 ||
                      addingToCart === item.Product.id
                    "
                    class="btn btn-primary"
                  >
                    <i class="bi bi-cart-plus me-2"></i>
                    {{
                      addingToCart === item.Product.id
                        ? "جاري الإضافة..."
                        : "إضافة للسلة"
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>
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

const wishlistItems = ref([]);
const loading = ref(true);
const removing = ref(null);
const addingToCart = ref(null);
const cartId = ref("");
const message = ref("");
const messageType = ref("success");

const userId = ref(
  localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).id
    : null
);

document.title = "متجر الكتب | المفضّلة";

const fetchWishlist = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/wishlist/user/${userId.value}`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      wishlistItems.value = response.data.wishlistItems || [];
    } else {
      showMessage("حدث خطأ في تحميل قائمة المفضلة", "danger");
    }
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    showMessage("حدث خطأ في الاتصال بالخادم", "danger");
  } finally {
    loading.value = false;
  }
};

const removeFromWishlist = async (wishlistId) => {
  try {
    removing.value = wishlistId;
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${process.env.VUE_APP_API_BASE_URL}/wishlist/wishlistId/${wishlistId}`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.error) {
      wishlistItems.value = wishlistItems.value.filter(
        (item) => item.id !== wishlistId
      );
      showMessage("تم حذف المنتج من المفضلة", "success");
    } else {
      showMessage("حدث خطأ في حذف المنتج", "danger");
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    showMessage("حدث خطأ في الاتصال بالخادم", "danger");
  } finally {
    removing.value = null;
  }
};

const clearWishlist = async () => {
  if (!confirm("هل أنت متأكد من حذف جميع المنتجات من قائمة المفضلة؟")) {
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${process.env.VUE_APP_API_BASE_URL}/wishlist/user/${userId.value}`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.error) {
      wishlistItems.value = [];
      showMessage("تم مسح قائمة المفضلة بالكامل", "success");
    } else {
      showMessage("حدث خطأ في مسح قائمة المفضلة", "danger");
    }
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    showMessage("حدث خطأ في الاتصال بالخادم", "danger");
  }
};

const addToCart = async (product) => {
  try {
    addingToCart.value = product.id;
    const token = localStorage.getItem("token");

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

      if (!cartResponse.data.error) {
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

// Lifecycle
onMounted(() => {
  fetchWishlist();
});
</script>

<style scoped>
.wishlist-card:hover .overlay {
  opacity: 1 !important;
}

.wishlist-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.wishlist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}

.product-image {
  transition: transform 0.3s ease;
}

.empty-state-card {
  border: 2px dashed #dee2e6;
}

.z-index-2 {
  z-index: 2;
}

[dir="rtl"] .text-start {
  text-align: right !important;
}

[dir="rtl"] .text-end {
  text-align: left !important;
}

/* Custom scrollbar for descriptions */
.card-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
