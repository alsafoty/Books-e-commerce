<template>
  <div class="cart-page">
    <Navbar />

    <div class="cart-header bg-light py-4" dir="rtl">
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row align-items-center">
          <div class="col-md-12">
            <div
              class="d-flex flex-row justify-content-between align-items-center"
            >
              <h1 class="display-6 fw-bold text-primary mb-2">
                <i class="bi bi-cart-fill me-3"></i>
                سلة التسوق
              </h1>

              <div class="text-start">
                <button
                  v-if="cartItems.length > 0"
                  @click="clearCart"
                  class="btn btn-outline-danger"
                  :disabled="loading"
                >
                  <i class="bi bi-trash me-2"></i>
                  مسح الكل
                </button>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center">
              <p class="text-muted mb-0">
                {{ cartItems.length }}
                {{ cartItems.length === 1 ? "عنصر" : "عنصر" }} في السلة
              </p>
              <p
                v-if="cartData && cartData.totalAmount"
                class="h5 mb-0 text-success fw-bold"
              >
                الإجمالي: {{ cartData.totalAmount.toFixed(2) }} د. أ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">جاري التحميل...</span>
      </div>
      <p class="mt-3 text-muted">جاري تحميل سلة التسوق...</p>
    </div>

    <div
      v-else-if="cartItems.length === 0"
      class="empty-cart text-center py-5"
      dir="rtl"
    >
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="empty-state-card p-5 rounded-4 shadow-sm bg-light">
              <i class="bi bi-cart display-1 text-muted mb-4"></i>
              <h3 class="fw-bold text-dark mb-3">سلة التسوق فارغة</h3>
              <p class="text-muted mb-4">
                ابدأ بإضافة المنتجات التي تريد شراؤها إلى سلة التسوق.
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

    <div v-else class="cart-items py-5" dir="rtl">
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row">
          <div class="col-lg-8">
            <div class="row g-4">
              <div v-for="item in cartItems" :key="item.id" class="col-12">
                <div
                  class="cart-item-card bg-white rounded-4 shadow-sm border-0 p-4"
                >
                  <div class="row align-items-center">
                    <!-- Product Image -->
                    <div class="col-md-3">
                      <div class="product-image-container">
                        <img
                          @click="
                            router.push({
                              name: 'product-detail',
                              params: {
                                productId: item.Product.id,
                                categoryId: item.Product.categoryId,
                              },
                            })
                          "
                          :src="getProductImage(item.Product)"
                          :alt="item.Product.name"
                          class="img-fluid rounded-3"
                          style="height: 300px; width: 100%; object-fit: cover"
                        />
                      </div>
                    </div>

                    <div class="col-md-5">
                      <h5
                        class="fw-bold text-dark mb-2"
                        @click="
                          router.push({
                            name: 'product-detail',
                            params: {
                              productId: item.Product.id,
                              categoryId: item.Product.categoryId,
                            },
                          })
                        "
                      >
                        {{ item.Product.name }}
                      </h5>
                      <p
                        class="text-muted mb-2"
                        @click="
                          router.push({
                            name: 'product-detail',
                            params: {
                              productId: item.Product.id,
                              categoryId: item.Product.categoryId,
                            },
                          })
                        "
                      >
                        {{
                          item.Product.description.length > 100
                            ? item.Product.description.substring(0, 97) + "..."
                            : item.Product.description
                        }}
                      </p>
                      <p class="h6 text-success mb-0">
                        {{ item.Product.price.toFixed(2) }} د. أ
                      </p>
                    </div>

                    <div class="col-md-2">
                      <div
                        class="quantity-controls d-flex align-items-center justify-content-center"
                      >
                        <button
                          @click="updateQuantity(item.id, item.quantity - 1)"
                          class="btn btn-outline-secondary btn-sm"
                          :disabled="item.quantity <= 1 || updating === item.id"
                        >
                          <i class="bi bi-dash"></i>
                        </button>
                        <span class="mx-3 fw-bold">{{ item.quantity }}</span>
                        <button
                          @click="updateQuantity(item.id, item.quantity + 1)"
                          class="btn btn-outline-secondary btn-sm"
                          :disabled="updating === item.id"
                        >
                          <i class="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>

                    <div class="col-md-2 text-center">
                      <button
                        @click="removeFromCart(item.id)"
                        class="btn btn-outline-danger btn-sm"
                        :disabled="removing === item.id"
                      >
                        <i class="bi bi-trash"></i>
                        إزالة
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div
              class="row cart-summary bg-white rounded-4 shadow-sm border-0 p-4 sticky-top mb-2"
            >
              <div class="">
                <label for="address" class="form-label w-100"
                  >اختر عنوان الشحن</label
                >
                <select
                  id="address"
                  class="form-select"
                  v-model="selectedAddress"
                  @click="selectAddress"
                  required
                >
                  <option value="">اختر عنوانًا</option>
                  <option
                    v-for="address in addresses"
                    :key="address.id"
                    :value="address.id"
                  >
                    {{ address.state }}, {{ address.city }},
                    {{ address.addressLine1 }}
                  </option>
                </select>
                <button
                  class="btn btn-primary btn-lg w-100 rounded-pill mt-3"
                  @click="router.push('/profile')"
                >
                  إضافة عنوان جديد
                </button>
              </div>
            </div>

            <div class="row">
              <div
                class="cart-summary bg-white rounded-4 shadow-sm border-0 p-4 sticky-top"
                style="top: 20px"
              >
                <h4 class="fw-bold text-dark mb-4">ملخص الطلب</h4>

                <div class="summary-row d-flex justify-content-between mb-3">
                  <span class="text-muted">عدد العناصر:</span>
                  <span class="fw-bold">{{ cartItems.length }}</span>
                </div>

                <div class="summary-row d-flex justify-content-between mb-3">
                  <span class="text-muted">الإجمالي الفرعي:</span>
                  <span class="fw-bold"
                    >{{
                      cartData ? cartData.totalAmount.toFixed(2) : "0.00"
                    }}
                    د. أ</span
                  >
                </div>

                <div class="summary-row d-flex justify-content-between mb-3">
                  <span class="text-muted">الشحن:</span>
                  <span class="text-success">مجاني</span>
                </div>

                <hr class="my-4" />

                <div class="summary-row d-flex justify-content-between mb-4">
                  <span class="h5 fw-bold">الإجمالي:</span>
                  <span class="h5 fw-bold text-success"
                    >{{
                      cartData ? cartData.totalAmount.toFixed(2) : "0.00"
                    }}
                    د. أ</span
                  >
                </div>

                <button
                  class="btn btn-primary btn-lg w-100 rounded-pill mb-3"
                  :disabled="cartItems.length === 0 || loadingCheckout"
                  @click="checkout"
                >
                  <i class="bi bi-credit-card me-2" v-if="!loadingCheckout"></i>
                  <div
                    class="spinner-border text-light spinner-border-sm"
                    role="status"
                    v-if="loadingCheckout"
                  >
                    <span class="visually-hidden">جاري التحميل...</span>
                  </div>

                  إتمام الشراء
                </button>

                <router-link
                  to="/"
                  class="btn btn-outline-primary w-100 rounded-pill"
                >
                  <i class="bi bi-arrow-right me-2"></i>
                  متابعة التسوق
                </router-link>
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
      style="
        top: 100px;
        right: 50%;
        transform: translateX(50%);
        z-index: 1050;
        min-width: 300px;
      "
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

const cartData = ref(null);
const cartItems = ref([]);
const loading = ref(true);
const loadingCheckout = ref(false);
const removing = ref(null);
const updating = ref(null);
const message = ref("");
const messageType = ref("success");
const addresses = ref([]);
const selectedAddress = ref("");

const userId = ref(
  localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).id
    : null
);

document.title = "متجر الكتب | سلة التسوق";

const selectAddress = () => {};

// Get addresses for user
const fetchAddresses = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/address/user/${userId}`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    addresses.value = response.data || [];
  } catch (error) {
    console.error("Error fetching addresses:", error);
    showMessage("حدث خطأ في تحميل العناوين", "danger");
  } finally {
  }
};

const fetchCart = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("token");

    if (!userId.value) {
      showMessage("يجب تسجيل الدخول لعرض سلة التسوق", "danger");
      loading.value = false;
      return;
    }

    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/cart/user/${userId.value}`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.cart) {
      cartData.value = response.data.cart;
      cartItems.value = response.data.cart.CartItem || [];
    } else {
      // Cart doesn't exist, create one
      await createCart();
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    if (error.response?.status === 404) {
      // Cart doesn't exist, create one
      await createCart();
    } else {
      showMessage("حدث خطأ في تحميل سلة التسوق", "danger");
    }
  } finally {
    loading.value = false;
  }
};

const createCart = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!userId.value) return;

    const response = await axios.post(
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

    if (response.data && response.data.cart) {
      cartData.value = response.data.cart;
      cartItems.value = response.data.cart.CartItem || [];
    }
  } catch (error) {
    console.error("Error creating cart:", error);
    showMessage("حدث خطأ في إنشاء سلة التسوق", "danger");
  }
};

const updateQuantity = async (cartItemId, newQuantity) => {
  if (newQuantity < 1) return;

  try {
    updating.value = cartItemId;
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/cart/item/${cartItemId}`,
      {
        quantity: newQuantity,
      },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.error) {
      // Update local state
      const item = cartItems.value.find((item) => item.id === cartItemId);
      if (item) {
        item.quantity = newQuantity;
        updateCartTotal();
      }
      showMessage("تم تحديث الكمية بنجاح", "success");
    } else {
      showMessage("حدث خطأ في تحديث الكمية", "danger");
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    showMessage("حدث خطأ في الاتصال بالخادم", "danger");
  } finally {
    updating.value = null;
  }
};

const removeFromCart = async (cartItemId) => {
  try {
    removing.value = cartItemId;
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${process.env.VUE_APP_API_BASE_URL}/cart/item/${cartItemId}`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.error) {
      // Remove from local state
      cartItems.value = cartItems.value.filter(
        (item) => item.id !== cartItemId
      );
      updateCartTotal();
      showMessage("تم إزالة العنصر من السلة", "success");
    } else {
      showMessage("حدث خطأ في إزالة العنصر", "danger");
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    showMessage("حدث خطأ في الاتصال بالخادم", "danger");
  } finally {
    removing.value = null;
  }
};

const clearCart = async () => {
  if (!confirm("هل أنت متأكد من مسح جميع العناصر من السلة؟")) {
    return;
  }

  try {
    loading.value = true;
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${process.env.VUE_APP_API_BASE_URL}/cart/${cartData.value.id}/clear`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.error) {
      cartItems.value = [];
      updateCartTotal();
      showMessage("تم مسح السلة بنجاح", "success");
    } else {
      showMessage("حدث خطأ في مسح السلة", "danger");
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    showMessage("حدث خطأ في الاتصال بالخادم", "danger");
  } finally {
    loading.value = false;
  }
};

const updateCartTotal = () => {
  if (cartData.value) {
    const totalAmount = cartItems.value.reduce((total, item) => {
      return total + item.Product.price * item.quantity;
    }, 0);

    cartData.value.totalAmount = parseFloat(totalAmount.toFixed(2));
    cartData.value.itemCount = cartItems.value.length;
  }
};

const getProductImage = (product) => {
  if (product.ProductImages && product.ProductImages.length > 0) {
    return product.ProductImages[0].url;
  }
  return "/placeholder-image.jpg";
};

const checkout = async () => {
  if (cartItems.value.length === 0) {
    showMessage("لا يمكن إتمام الشراء، السلة فارغة", "warning");
    return;
  }
  if (!selectedAddress.value) {
    showMessage("يرجى اختيار عنوان الشحن قبل إتمام الشراء", "warning");
    return;
  }
  loadingCheckout.value = true;
  try {
    const token = localStorage.getItem("token");

    const createdOrder = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/order`,
      {
        addressId: selectedAddress.value,
        userId: userId.value,
      },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const items = cartItems.value.map((item) => ({
      quantity: item.quantity,
      price: item.Product.price,
      name: item.Product.name,
      image: item.Product.ProductImages[0]?.url
        ? item.Product.ProductImages[0]?.url
        : "https://res.cloudinary.com/dihjdsjrg/image/upload/v1755029330/ecommerce/products/Image_1755029329331_S.png",
    }));

    const response = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/order/checkout`,
      {
        items: items,
        orderId: createdOrder.data.order.id,
      },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.id) {
      // Redirect to Stripe checkout
      await axios.put(
        `${process.env.VUE_APP_API_BASE_URL}/order/${createdOrder.data.order.id}/session`,
        { sessionId: response.data.id },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      window.location.href = response.data.url;
    } else {
      showMessage("حدث خطأ في إتمام عملية الشراء", "danger");
    }

    loadingCheckout.value = false;
  } catch (error) {
    console.error("Error during checkout:", error);
    showMessage("حدث خطأ في الاتصال بالخادم", "danger");
  }
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
  fetchCart();
  fetchAddresses();
});
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.cart-header {
  border-bottom: 1px solid #e9ecef;
}

.cart-item-card {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.cart-item-card:hover {
  border-color: #dee2e6;
  transform: translateY(-2px);
}

.quantity-controls button {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-summary {
  border: 1px solid #e9ecef;
}

.summary-row {
  font-size: 1rem;
}

.empty-state-card {
  border: 1px solid #e9ecef;
}

.product-image-container {
  border-radius: 12px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .cart-summary {
    margin-top: 2rem;
    position: static !important;
  }

  .quantity-controls {
    margin: 1rem 0;
  }
}
</style>
