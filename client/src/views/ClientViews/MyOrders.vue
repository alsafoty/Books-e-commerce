<template>
  <div class="orders-page">
    <Navbar />

    <!-- Header Section -->
    <div class="orders-header bg-light py-4" dir="rtl">
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row align-items-center">
          <div class="col-md-12">
            <div
              class="d-flex flex-row justify-content-between align-items-center"
            >
              <h1 class="display-6 fw-bold text-primary mb-2">
                <i class="bi bi-bag-fill me-3"></i>
                طلباتي
              </h1>

              <div class="text-start z-index-10" style="z-index: 10">
                <div class="dropdown">
                  <div class="btn-group dropstart">
                    <button
                      type="button"
                      class="btn text-start btn-primary dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      dir="ltr"
                    >
                      فلترة حسب الحالة
                      <i class="bi bi-funnel me-2"></i>
                    </button>
                    <ul class="dropdown-menu z-index-10" id="orderStatusFilter">
                      <li>
                        <a class="dropdown-item" @click="filterByStatus('')">
                          جميع الطلبات
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          @click="filterByStatus('PENDING')"
                        >
                          قيد الانتظار
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          @click="filterByStatus('CONFIRMED')"
                        >
                          مؤكد
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          @click="filterByStatus('DELIVERED')"
                        >
                          تم التسليم
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          @click="filterByStatus('CANCELLED')"
                        >
                          ملغي
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center">
              <p class="text-muted mb-0">
                {{ filteredOrders.length }}
                {{ filteredOrders.length === 1 ? "طلب" : "طلب" }}
                {{ statusFilter ? `- ${getStatusText(statusFilter)}` : "" }}
              </p>
              <p
                v-if="totalOrdersValue > 0"
                class="h5 mb-0 text-success fw-bold"
              >
                إجمالي المشتريات: {{ totalOrdersValue.toFixed(2) }} د. أ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Message -->
    <div
      v-if="message"
      class="container-fluid py-3"
      style="max-width: 1400px; margin: 0 auto"
      dir="rtl"
    >
      <div class="alert" :class="`alert-${messageType}`" role="alert">
        {{ message }}
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">جاري التحميل...</span>
      </div>
      <p class="mt-3 text-muted">جاري تحميل طلباتك...</p>
    </div>

    <!-- Empty Orders -->
    <div
      v-else-if="orders.length === 0"
      class="empty-orders text-center py-5"
      dir="rtl"
    >
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="empty-state-card p-5 rounded-4 shadow-sm bg-light">
              <i class="bi bi-bag display-1 text-muted mb-4"></i>
              <h3 class="fw-bold text-dark mb-3">لا توجد طلبات بعد</h3>
              <p class="text-muted mb-4">
                ابدأ بإضافة المنتجات إلى سلة التسوق وأتمم عملية الشراء لتظهر
                طلباتك هنا.
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

    <!-- No Filtered Results -->
    <div
      v-else-if="filteredOrders.length === 0"
      class="empty-filter text-center py-5"
      dir="rtl"
    >
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="empty-state-card p-5 rounded-4 shadow-sm bg-light">
              <i class="bi bi-search display-1 text-muted mb-4"></i>
              <h3 class="fw-bold text-dark mb-3">لا توجد طلبات بهذا الفلتر</h3>
              <p class="text-muted mb-4">
                لا توجد طلبات بحالة "{{ getStatusText(statusFilter) }}" حالياً.
              </p>
              <button
                @click="clearFilter"
                class="btn btn-primary btn-lg rounded-pill px-4"
              >
                <i class="bi bi-arrow-clockwise me-2"></i>
                عرض جميع الطلبات
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div v-else class="orders-list py-5" dir="rtl" style="z-index: 5">
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row g-4">
          <div v-for="order in filteredOrders" :key="order.id" class="col-12">
            <div
              class="order-card bg-white rounded-4 shadow-sm border-0 p-4 z-index-5"
            >
              <!-- Order Header -->
              <div class="row align-items-center mb-3">
                <div class="col-md-8">
                  <div
                    class="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2"
                  >
                    <h5 class="mb-0 fw-bold text-dark">
                      طلب #{{ order.id.slice(-8).toUpperCase() }}
                    </h5>
                    <span
                      class="badge"
                      :class="getStatusBadgeClass(order.status)"
                    >
                      {{ getStatusText(order.status) }}
                    </span>
                  </div>
                  <small class="text-muted">
                    تاريخ الطلب: {{ formatDate(order.createdAt) }}
                  </small>
                </div>
                <div class="col-md-4 text-start">
                  <h5 class="mb-0 text-success fw-bold">
                    {{ order.totalAmount.toFixed(2) }} د. أ
                  </h5>
                  <small class="text-muted">
                    {{ order.OrderItem.length }}
                    {{ order.OrderItem.length === 1 ? "منتج" : "منتج" }}
                  </small>
                </div>
              </div>

              <!-- Order Items -->
              <!-- <div class="order-items mb-3">
                <div class="row g-3">
                  <div
                    v-for="item in order.OrderItem"
                    :key="item.id"
                    class="col-12"
                  >
                    <div
                      class="order-item d-flex align-items-center p-3 bg-light rounded-3"
                    >
                      <div class="product-image ms-3">
                        <img
                          :src="getProductImage(item.Product)"
                          :alt="item.Product.name"
                          class="rounded-2"
                          style="width: 60px; height: 60px; object-fit: cover"
                        />
                      </div>
                      <div class="product-details flex-grow-1">
                        <h6 class="mb-1 fw-semibold">
                          {{ item.Product.name }}
                        </h6>
                        <p class="mb-1 text-muted small">
                          الكمية: {{ item.quantity }} ×
                          {{ item.price.toFixed(2) }} د. أ
                        </p>
                        <p class="mb-0 text-success fw-semibold">
                          المجموع:
                          {{ (item.quantity * item.price).toFixed(2) }} د. أ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> -->

              <!-- Shipping Address -->
              <div v-if="order.Address" class="shipping-address mb-3">
                <h6 class="mb-2 fw-semibold">
                  <i class="bi bi-geo-alt me-2"></i>
                  عنوان التسليم:
                </h6>
                <div class="address-details p-3 bg-light rounded-3">
                  <p class="mb-1">{{ order.Address.addressLine1 }}</p>
                  <p v-if="order.Address.addressLine2" class="mb-1">
                    {{ order.Address.addressLine2 }}
                  </p>
                  <p class="mb-0 text-muted">
                    {{ order.Address.city }}، {{ order.Address.state }}
                  </p>
                </div>
              </div>

              <!-- Order Actions -->
              <div class="order-actions d-flex gap-2 justify-content-end">
                <button
                  @click="viewOrderDetails(order)"
                  class="btn btn-outline-primary btn-sm"
                >
                  <i class="bi bi-eye me-1"></i>
                  تفاصيل
                </button>

                <button
                  v-if="order.status === 'PENDING'"
                  @click="cancelOrder(order.id)"
                  class="btn btn-outline-danger btn-sm"
                  :disabled="cancelling === order.id"
                >
                  <span
                    v-if="cancelling === order.id"
                    class="spinner-border spinner-border-sm me-1"
                  ></span>
                  <i v-else class="bi bi-x-circle me-1"></i>
                  إلغاء الطلب
                </button>

                <button
                  v-if="
                    order.status === 'DELIVERED' ||
                    order.status === 'CONFIRMED' ||
                    order.status === 'CANCELLED' ||
                    order.status === 'REFUNDED'
                  "
                  @click="reorderItems(order)"
                  class="btn btn-outline-success btn-sm"
                >
                  <i class="bi bi-arrow-repeat me-1"></i>
                  إعادة الطلب
                </button>
                <button
                  v-if="order.status === 'PENDING'"
                  @click="proceedToCheckout(order)"
                  class="btn btn-outline-warning btn-sm"
                >
                  <i class="bi bi-credit-card me-1"></i>
                  متابعة الدفع
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal" dir="rtl">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">
            تفاصيل الطلب #{{ selectedOrder?.id?.slice(-8).toUpperCase() }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            aria-label="Close"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body" v-if="selectedOrder">
          <!-- Order Summary -->
          <div class="order-summary mb-4">
            <div class="row">
              <div class="col-md-6">
                <h6 class="fw-semibold mb-2">معلومات الطلب</h6>
                <p class="mb-1">
                  <strong>رقم الطلب:</strong>
                  #{{ selectedOrder.id.slice(-8).toUpperCase() }}
                </p>
                <p class="mb-1">
                  <strong>تاريخ الطلب:</strong>
                  {{ formatDate(selectedOrder.createdAt) }}
                </p>
                <p class="mb-1">
                  <strong>حالة الطلب:</strong>
                  <span
                    class="badge ms-2"
                    :class="getStatusBadgeClass(selectedOrder.status)"
                  >
                    {{ getStatusText(selectedOrder.status) }}
                  </span>
                </p>
              </div>
              <div class="col-md-6">
                <h6 class="fw-semibold mb-2">الملخص المالي</h6>
                <p class="mb-1">
                  <strong>عدد المنتجات:</strong>
                  {{ selectedOrder.OrderItem.length }}
                </p>
                <p class="mb-1">
                  <strong>إجمالي المبلغ:</strong>
                  <span class="text-success fw-bold">
                    {{ selectedOrder.totalAmount.toFixed(2) }} د. أ
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Items Details -->
          <div class="items-details mb-4">
            <h6 class="fw-semibold mb-3">المنتجات المطلوبة</h6>
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>المنتج</th>
                    <th>السعر</th>
                    <th>الكمية</th>
                    <th>المجموع</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedOrder.OrderItem" :key="item.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <img
                          :src="getProductImage(item.Product)"
                          :alt="item.Product.name"
                          class="ms-2 rounded"
                          style="width: 40px; height: 40px; object-fit: cover"
                        />
                        <span>{{ item.Product.name }}</span>
                      </div>
                    </td>
                    <td>{{ item.price.toFixed(2) }} د. أ</td>
                    <td>{{ item.quantity }}</td>
                    <td class="fw-semibold">
                      {{ (item.quantity * item.price).toFixed(2) }} د. أ
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Shipping Address -->
          <div v-if="selectedOrder.Address" class="shipping-details">
            <h6 class="fw-semibold mb-3">عنوان التسليم</h6>
            <div class="address-card p-3 bg-light rounded-3">
              <p class="mb-1">{{ selectedOrder.Address.addressLine1 }}</p>
              <p v-if="selectedOrder.Address.addressLine2" class="mb-1">
                {{ selectedOrder.Address.addressLine2 }}
              </p>
              <p class="mb-0 text-muted">
                {{ selectedOrder.Address.city }}،
                {{ selectedOrder.Address.state }}
              </p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Navbar from "@/components/Navbar.vue";

const router = useRouter();

// State
const orders = ref([]);
const selectedOrder = ref(null);
const showModal = ref(false);
const loading = ref(false);
const cancelling = ref(null);
const message = ref("");
const messageType = ref("success");
const statusFilter = ref("");

// User ID from localStorage
const userId = ref(
  localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).id
    : null
);

document.title = "متجر الكتب | طلباتي";

// Computed properties
const filteredOrders = computed(() => {
  if (!statusFilter.value) {
    return orders.value;
  }
  return orders.value.filter((order) => order.status === statusFilter.value);
});

const totalOrdersValue = computed(() => {
  return orders.value.reduce((total, order) => total + order.totalAmount, 0);
});

// Fetch user orders
const fetchOrders = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/order/my-orders`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    orders.value = response.data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    showMessage("حدث خطأ في تحميل الطلبات", "danger");
  } finally {
    loading.value = false;
  }
};

// Cancel order
const cancelOrder = async (orderId) => {
  if (!confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) return;

  try {
    cancelling.value = orderId;
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/order/${orderId}/status`,
      { status: "CANCELLED" },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      // Update order status locally
      const orderIndex = orders.value.findIndex(
        (order) => order.id === orderId
      );
      if (orderIndex !== -1) {
        orders.value[orderIndex].status = "CANCELLED";
      }
      showMessage("تم إلغاء الطلب بنجاح", "success");
    }
  } catch (error) {
    console.error("Error cancelling order:", error);
    showMessage("حدث خطأ في إلغاء الطلب", "danger");
  } finally {
    cancelling.value = null;
  }
};

// Reorder items
const reorderItems = async (order) => {
  try {
    const token = localStorage.getItem("token");

    const cartId = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/cart/user/${userId.value}`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Add all items from this order to cart
    for (const item of order.OrderItem) {
      await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/cart/item`,
        {
          productId: item.productId,
          quantity: item.quantity,
          cartId: cartId.data.cart.id,
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    showMessage("تم إضافة المنتجات إلى سلة التسوق", "success");
    router.push("/cart");
  } catch (error) {
    console.error("Error reordering items:", error);
    showMessage("حدث خطأ في إعادة الطلب", "danger");
  }
};

const proceedToCheckout = async (order) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/order/checkout`,
      { orderId: order.id },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (
      response.data.url &&
      response.data.message === "Session already created"
    ) {
      window.open(response.data.url, "_blank").focus();
    }
  } catch (error) {
    console.error("Error proceeding to checkout:", error);
    showMessage("حدث خطأ في متابعة الدفع", "danger");
  }
};

// View order details
const viewOrderDetails = (order) => {
  selectedOrder.value = order;
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  selectedOrder.value = null;
};

// Filter functions
const filterByStatus = (status) => {
  statusFilter.value = status;
};

const clearFilter = () => {
  statusFilter.value = "";
};

// Helper functions
const getStatusText = (status) => {
  const statusMap = {
    PENDING: "قيد الانتظار",
    CONFIRMED: "مؤكد",
    DELIVERED: "تم التسليم",
    CANCELLED: "ملغي",
    REFUNDED: "مسترجع",
  };
  return statusMap[status] || status;
};

const getStatusBadgeClass = (status) => {
  const classMap = {
    PENDING: "bg-warning text-dark",
    CONFIRMED: "bg-info text-white",
    DELIVERED: "bg-success text-white",
    CANCELLED: "bg-danger text-white",
    REFUNDED: "bg-secondary text-white",
  };
  return classMap[status] || "bg-secondary text-white";
};

const formatDate = (dateString) => {
  if (!dateString) return "غير محدد";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-JO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "غير محدد";
  }
};

const getProductImage = (product) => {
  if (product && product.ProductImages && product.ProductImages.length > 0) {
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

// Check authentication
const checkAuth = () => {
  if (!userId.value) {
    router.push("/login");
  }
};

// Component mounted
onMounted(() => {
  checkAuth();
  fetchOrders();
});
</script>

<style scoped>
.orders-header {
  backdrop-filter: blur(10px);
  background-color: rgba(248, 249, 250, 0.95) !important;
}

.order-card {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

.order-item {
  transition: background-color 0.2s ease;
}

.order-item:hover {
  background-color: #e9ecef !important;
}

.empty-state-card {
  backdrop-filter: blur(10px);
  background-color: rgba(248, 249, 250, 0.95) !important;
  transition: transform 0.2s ease;
}

.empty-state-card:hover {
  transform: translateY(-2px);
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.alert {
  border-radius: 0.75rem;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.badge {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
}

.product-image img {
  transition: transform 0.2s ease;
}

.product-image img:hover {
  transform: scale(1.05);
}

.address-card,
.address-details {
  border-left: 4px solid #6c757d;
}

.table th {
  background-color: #f8f9fa;
  border: none;
  font-weight: 600;
}

.table td {
  border-color: #e9ecef;
  vertical-align: middle;
}

/* Custom Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  animation: fadeIn 0.2s ease;
}

.modal-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 90%;
  max-height: 90%;
  width: 800px;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #e9ecef;
  background-color: #f8f9fa;
  border-radius: 1rem 1rem 0 0;
}

.modal-title {
  flex-grow: 1;
  margin: 0;
  font-weight: 600;
  color: #212529;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background-color: #e9ecef;
  color: #000;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 2px solid #e9ecef;
  background-color: #f8f9fa;
  border-radius: 0 0 1rem 1rem;
  display: flex;
  justify-content: end;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .order-card {
    margin-bottom: 1rem;
  }

  .order-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .order-actions .btn {
    width: 100%;
  }

  .d-flex.justify-content-between {
    flex-direction: column;
    align-items: start !important;
    gap: 0.5rem;
  }
}
</style>
