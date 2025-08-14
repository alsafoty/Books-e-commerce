<template>
  <div class="min-vh-100 bg-light">
    <Navbar />

    <!-- Loading -->
    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center"
      style="min-height: 60vh"
    >
      <div class="text-center">
        <div
          class="spinner-border text-primary mb-3"
          role="status"
          style="width: 3rem; height: 3rem"
        >
          <span class="visually-hidden">جاري التحميل...</span>
        </div>
        <p class="text-muted fs-5">جاري تحميل تفاصيل المنتج...</p>
      </div>
    </div>

    <!-- Product Not Found -->
    <div
      v-else-if="!product && !loading"
      class="d-flex justify-content-center align-items-center"
      style="min-height: 60vh"
      dir="rtl"
    >
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">
            <div class="card border-0 shadow-lg text-center">
              <div class="card-body p-5">
                <i
                  class="bi bi-exclamation-triangle display-1 text-warning mb-4"
                ></i>
                <h3 class="fw-bold text-dark mb-3">المنتج غير موجود</h3>
                <p class="text-muted mb-4 lead">
                  عذراً، لا يمكن العثور على المنتج المطلوب.
                </p>
                <router-link to="/" class="btn btn-primary btn-lg px-4">
                  <i class="bi bi-house ms-2"></i>
                  العودة للرئيسية
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Details -->
    <div v-else-if="product" class="py-4" dir="rtl">
      <div class="container-fluid px-3 px-md-4">
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mb-4">
          <ol class="breadcrumb bg-white px-3 py-2 rounded shadow-sm">
            <li class="breadcrumb-item">
              <router-link to="/" class="text-decoration-none text-primary">
                <i class="bi bi-house ms-1"></i>الرئيسية /
              </router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link
                :to="`/category/${product.Category.id}`"
                class="text-decoration-none text-primary"
              >
                {{ product.Category.name }}
              </router-link>
            </li>
            <li class="breadcrumb-item active text-muted" aria-current="page">
              {{ product.name }}
            </li>
          </ol>
        </nav>

        <!-- Alert Message -->
        <div
          v-if="message"
          class="alert alert-dismissible"
          :class="`alert-${messageType}`"
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

        <!-- Main Product Card -->
        <div class="card border-0 shadow-lg mb-4">
          <div class="card-body p-4 p-md-5">
            <div class="row g-4 g-lg-5">
              <!-- Product Images Column -->
              <div class="col-12 col-lg-6">
                <!-- Main Image -->
                <div class="position-relative mb-3">
                  <div
                    class="border rounded-3 overflow-hidden position-relative bg-white"
                    style="aspect-ratio: 1"
                  >
                    <img
                      :src="currentImage || '../placeholder-image.jpg'"
                      :alt="product.name"
                      class="w-100 h-100 object-fit-cover"
                      style="cursor: pointer"
                      @click="openImageModal"
                    />

                    <!-- Stock Badge -->
                    <div class="position-absolute top-0 start-0 m-2">
                      <span
                        v-if="product.stock > 0"
                        class="badge bg-success fs-6 px-3 py-2 rounded-pill"
                      >
                        <i class="bi bi-check-circle ms-1"></i>متوفر
                      </span>
                      <span
                        v-else
                        class="badge bg-danger fs-6 px-3 py-2 rounded-pill"
                      >
                        <i class="bi bi-x-circle ms-1"></i>غير متوفر
                      </span>
                    </div>

                    <!-- Zoom Button -->
                    <div class="position-absolute top-0 end-0 m-2">
                      <button
                        @click="openImageModal"
                        class="btn btn-light btn-sm rounded-circle"
                      >
                        <i class="bi bi-arrows-fullscreen"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Thumbnail Images -->
                <div
                  v-if="
                    product.ProductImages && product.ProductImages.length > 1
                  "
                  class="row g-2"
                >
                  <div
                    v-for="(image, index) in product.ProductImages"
                    :key="image.id"
                    class="col-3"
                  >
                    <div
                      class="border rounded-2 overflow-hidden position-relative"
                      :class="
                        currentImage === image.url
                          ? 'border-primary border-3'
                          : 'border-light'
                      "
                      style="aspect-ratio: 1; cursor: pointer"
                      @click="currentImage = image.url"
                    >
                      <img
                        :src="image.url"
                        :alt="`${product.name} - ${index + 1}`"
                        class="w-100 h-100 object-fit-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Product Info Column -->
              <div class="col-12 col-lg-6">
                <!-- Product Title & Category -->
                <div class="mb-3">
                  <router-link
                    :to="`/category/${product.Category.id}`"
                    class="text-decoration-none"
                  >
                    <span class="badge bg-primary mb-2 fs-6 px-3 py-2">
                      <i class="bi bi-tag ms-1"></i>{{ product.Category.name }}
                    </span>
                  </router-link>
                  <h1 class="display-6 fw-bold text-dark mb-0">
                    {{ product.name }}
                  </h1>
                </div>

                <!-- Price -->
                <div class="mb-4">
                  <div class="d-flex align-items-baseline gap-2">
                    <span class="display-5 fw-bold text-success">{{
                      product.price.toFixed(2)
                    }}</span>
                    <span class="text-success fs-4 fw-semibold">د. أ</span>
                  </div>
                  <small class="text-muted">شامل ضريبة القيمة المضافة</small>
                </div>

                <!-- Stock Status -->
                <div class="mb-4">
                  <div class="d-flex align-items-center gap-3 flex-wrap">
                    <div class="d-flex align-items-center">
                      <i
                        :class="
                          product.stock > 0
                            ? 'bi bi-check-circle text-success'
                            : 'bi bi-x-circle text-danger'
                        "
                        class="fs-5 ms-2"
                      ></i>
                      <span
                        :class="
                          product.stock > 0 ? 'text-success' : 'text-danger'
                        "
                        class="fw-semibold"
                      >
                        {{
                          product.stock > 0
                            ? "متوفر في المخزن"
                            : "غير متوفر حالياً"
                        }}
                      </span>
                    </div>

                    <div v-if="product.stock > 0 && product.stock <= 5">
                      <span class="badge bg-warning text-dark fs-6 px-3 py-2">
                        <i class="bi bi-exclamation-triangle ms-1"></i>متبقي
                        {{ product.stock }} قطع
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Quantity & Actions -->
                <div v-if="product.stock > 0" class="mb-4">
                  <!-- Quantity Selector -->
                  <div class="mb-3">
                    <label class="form-label fw-semibold mb-2">الكمية:</label>
                    <div
                      class="d-flex align-items-center gap-2"
                      style="max-width: 200px"
                    >
                      <button
                        @click="decrementQuantity"
                        class="btn btn-outline-secondary"
                        :disabled="selectedQuantity <= 1"
                      >
                        <i class="bi bi-dash"></i>
                      </button>
                      <input
                        v-model.number="selectedQuantity"
                        type="number"
                        class="form-control text-center fw-semibold"
                        :min="1"
                        :max="product.stock"
                        style="max-width: 80px"
                      />
                      <button
                        @click="incrementQuantity"
                        class="btn btn-outline-secondary"
                        :disabled="selectedQuantity >= product.stock"
                      >
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                    <small class="text-muted"
                      >الحد الأقصى: {{ product.stock }} قطعة</small
                    >
                  </div>

                  <!-- Action Buttons -->
                  <div class="d-grid gap-2 d-sm-flex">
                    <button
                      @click="addToCart"
                      class="btn btn-primary btn-lg flex-fill"
                      :disabled="addingToCart === product.id"
                    >
                      <span
                        v-if="addingToCart === product.id"
                        class="spinner-border spinner-border-sm ms-2"
                      ></span>
                      <i v-else class="bi bi-cart-plus ms-2"></i>
                      {{
                        addingToCart === product.id
                          ? "جاري الإضافة..."
                          : "إضافة للسلة"
                      }}
                    </button>

                    <button
                      @click="addToWishlist"
                      class="btn btn-outline-danger btn-lg"
                      :disabled="addingToWishlist === product.id"
                    >
                      <span
                        v-if="addingToWishlist === product.id"
                        class="spinner-border spinner-border-sm ms-2"
                      ></span>
                      <i
                        v-else
                        :class="
                          isInWishlist ? 'bi bi-heart-fill' : 'bi bi-heart'
                        "
                        class="ms-2"
                      ></i>
                      {{ isInWishlist ? "في المفضلة" : "المفضلة" }}
                    </button>

                    <button
                      @click="shareProduct"
                      class="btn btn-outline-info btn-lg"
                    >
                      <i class="bi bi-share ms-2"></i>مشاركة
                    </button>
                  </div>
                </div>

                <!-- Out of Stock Button -->
                <div v-else class="mb-4">
                  <button class="btn btn-secondary btn-lg w-100" disabled>
                    <i class="bi bi-x-circle ms-2"></i>غير متوفر حالياً
                  </button>
                </div>

                <!-- Product Meta Info -->
                <div class="row g-3 mb-4">
                  <div class="col-6">
                    <div class="bg-light p-3 rounded-3 text-center">
                      <div class="text-muted small mb-1">تاريخ الإضافة</div>
                      <div class="fw-semibold">
                        {{ formatDate(product.createdAt) }}
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="bg-light p-3 rounded-3 text-center">
                      <div class="text-muted small mb-1">رمز المنتج</div>
                      <div class="fw-semibold">
                        #{{ product.id.toString().padStart(6, "0") }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Product Description -->
                <div class="card border-1 border-primary mb-4">
                  <div class="card-header bg-primary text-white">
                    <h5 class="mb-0 fw-bold">
                      <i class="bi bi-info-circle ms-2"></i>وصف المنتج
                    </h5>
                  </div>
                  <div class="card-body p-4">
                    <p class="mb-0 lh-lg fs-5">{{ product.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Service Features -->
        <div class="row g-4">
          <div class="col-12 col-md-4">
            <div class="card border-0 shadow-sm h-100 text-center">
              <div class="card-body p-4">
                <div
                  class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style="width: 80px; height: 80px"
                >
                  <i class="bi bi-truck text-primary display-6"></i>
                </div>
                <h5 class="fw-bold">شحن سريع</h5>
                <p class="text-muted mb-0">توصيل مجاني للطلبات فوق 50 د. أ</p>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="card border-0 shadow-sm h-100 text-center">
              <div class="card-body p-4">
                <div
                  class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style="width: 80px; height: 80px"
                >
                  <i class="bi bi-shield-check text-success display-6"></i>
                </div>
                <h5 class="fw-bold">ضمان الجودة</h5>
                <p class="text-muted mb-0">
                  جميع منتجاتنا أصلية ومضمونة الجودة
                </p>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="card border-0 shadow-sm h-100 text-center">
              <div class="card-body p-4">
                <div
                  class="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style="width: 80px; height: 80px"
                >
                  <i class="bi bi-arrow-clockwise text-info display-6"></i>
                </div>
                <h5 class="fw-bold">إرجاع مجاني</h5>
                <p class="text-muted mb-0">يمكنك إرجاع المنتج خلال 14 يوم</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div
      v-if="showImageModal"
      class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style="background-color: rgba(0, 0, 0, 0.9); z-index: 1055"
      @click="closeImageModal"
    >
      <div
        class="position-relative"
        @click.stop
        style="max-width: 90vw; max-height: 90vh"
      >
        <button
          @click="closeImageModal"
          class="btn btn-light position-absolute top-0 end-0 rounded-circle"
          style="transform: translate(50%, -50%); z-index: 1"
        >
          <i class="bi bi-x-lg"></i>
        </button>
        <img
          :src="currentImage"
          :alt="product?.name"
          class="img-fluid rounded"
          style="max-height: 90vh; max-width: 90vw"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import Navbar from "@/components/Navbar.vue";

const router = useRouter();
const route = useRoute();

// State
const product = ref(null);
const loading = ref(false);
const message = ref("");
const messageType = ref("success");
const currentImage = ref("");
const selectedQuantity = ref(1);
const addingToCart = ref(null);
const addingToWishlist = ref(null);
const isInWishlist = ref(false);
const showImageModal = ref(false);
const cartId = ref("");

// User ID from localStorage
const userId = ref(
  localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).id
    : null
);

// Computed properties
const productId = computed(() => route.params.productId);

// Utility function to show messages
const showMessage = (msg, type = "success") => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Fetch product details
const fetchProduct = async () => {
  try {
    loading.value = true;
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/product/${productId.value}`
    );

    if (response.data) {
      product.value = response.data;

      // Set the first image as current
      if (
        product.value.ProductImages &&
        product.value.ProductImages.length > 0
      ) {
        currentImage.value = product.value.ProductImages[0].url;
      }

      // Check if product is in wishlist
      if (userId.value) {
        await checkWishlistStatus();
      }
    } else {
      showMessage("لا يمكن العثور على المنتج", "danger");
    }
    document.title = `متجر الكتب | ${product.value.name}`;
  } catch (error) {
    console.error("Error fetching product:", error);
    if (error.response?.status === 404) {
      showMessage("المنتج غير موجود", "danger");
    } else {
      showMessage("حدث خطأ في تحميل المنتج", "danger");
    }
  } finally {
    loading.value = false;
  }
};

// Check if product is in wishlist
const checkWishlistStatus = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/wishlist/user/${userId.value}`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success && response.data.wishlist) {
      const wishlistItems = response.data.wishlist;
      isInWishlist.value = wishlistItems.some(
        (item) => item.productId === parseInt(productId.value)
      );
    }
  } catch (error) {
    console.error("Error checking wishlist status:", error);
  }
};

// Quantity controls
const incrementQuantity = () => {
  if (selectedQuantity.value < product.value.stock) {
    selectedQuantity.value++;
  }
};

const decrementQuantity = () => {
  if (selectedQuantity.value > 1) {
    selectedQuantity.value--;
  }
};

// Add to cart (following AllProductsView.vue pattern)
const addToCart = async () => {
  if (!userId.value) {
    showMessage("يجب تسجيل الدخول لإضافة المنتجات للسلة", "danger");
    router.push("/login");
    return;
  }

  try {
    addingToCart.value = product.value.id;
    const token = localStorage.getItem("token");

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
        productId: product.value.id,
        quantity: selectedQuantity.value,
      },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.error) {
      showMessage("تم إضافة المنتج إلى السلة بنجاح", "success");
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

// Add to wishlist (following AllProductsView.vue pattern)
const addToWishlist = async () => {
  if (!userId.value) {
    showMessage("يجب تسجيل الدخول لإضافة المنتجات للمفضلة", "danger");
    router.push("/login");
    return;
  }

  try {
    addingToWishlist.value = product.value.id;
    const token = localStorage.getItem("token");

    if (isInWishlist.value) {
      // Remove from wishlist
      await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/wishlist`, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        data: {
          userId: userId.value,
          productId: product.value.id,
        },
      });
      isInWishlist.value = false;
      showMessage("تم إزالة المنتج من المفضلة", "info");
    } else {
      // Add to wishlist
      const response = await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/wishlist`,
        {
          userId: userId.value,
          productId: product.value.id,
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.error) {
        isInWishlist.value = true;
        showMessage("تم إضافة المنتج إلى المفضلة", "success");
      } else {
        showMessage(
          response.data.error || "حدث خطأ في إضافة المنتج للمفضلة",
          "danger"
        );
      }
    }
  } catch (error) {
    console.error("Error updating wishlist:", error);
    showMessage("حدث خطأ في الاتصال بالخادم", "danger");
  } finally {
    addingToWishlist.value = null;
  }
};

// Share product
const shareProduct = () => {
  if (navigator.share) {
    navigator.share({
      title: product.value.name,
      text: product.value.description,
      url: window.location.href,
    });
  } else {
    // Fallback: copy URL to clipboard
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        showMessage("تم نسخ رابط المنتج", "success");
      })
      .catch(() => {
        showMessage("لا يمكن مشاركة المنتج", "danger");
      });
  }
};

// Image modal controls
const openImageModal = () => {
  showImageModal.value = true;
};

const closeImageModal = () => {
  showImageModal.value = false;
};

// Initialize component
onMounted(() => {
  fetchProduct();
});
</script>
