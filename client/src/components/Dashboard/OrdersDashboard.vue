<template>
  <div
    dir="rtl"
    class="container-fluid border rounded-2 d-flex flex-column h-100 bg-light"
  >
    <!-- Loading -->
    <div v-if="initialLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">جاري التحميل...</span>
      </div>
      <p class="mt-3 text-muted">جاري تحميل البيانات...</p>
    </div>

    <!-- Header Section with Search -->
    <div
      class="my-3"
      v-if="!showEditOrder && !initialLoading && !showOrderDetails"
    >
      <!-- Search Bar -->
      <div class="search-container">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="ابحث في الطلبات | يمكنك البحث بالعميل، رقم الطلب، أو الحالة"
            v-model="searchQuery"
            aria-label="البحث في الطلبات"
          />
          <span class="input-group-text">
            <i class="bi bi-search text-muted"></i>
          </span>
        </div>
      </div>
    </div>

    <!-- Status Filter Pills -->
    <div
      class="mb-3"
      v-if="!showEditOrder && !initialLoading && !showOrderDetails"
    >
      <div class="d-flex flex-wrap gap-2 justify-content-center">
        <button
          class="btn btn-sm"
          :class="
            selectedStatus === 'ALL' ? 'btn-primary' : 'btn-outline-primary'
          "
          @click="filterByStatus('ALL')"
        >
          جميع الطلبات ({{ orders.length }})
        </button>
        <button
          v-for="status in orderStatuses"
          :key="status.value"
          class="btn btn-sm"
          :class="
            selectedStatus === status.value
              ? `btn-${status.color}`
              : `btn-outline-${status.color}`
          "
          @click="filterByStatus(status.value)"
        >
          {{ status.label }} ({{ getStatusCount(status.value) }})
        </button>
      </div>
    </div>

    <!-- Mobile Cards View (visible on small screens) -->
    <div
      class="d-block d-md-none"
      v-if="!showEditOrder && !initialLoading && !showOrderDetails"
    >
      <!-- No results message for mobile -->
      <div v-if="filteredOrders.length === 0" class="text-center py-4">
        <i class="bi bi-search text-muted" style="font-size: 2rem"></i>
        <p class="text-muted mt-2 mb-0">لا توجد طلبات تطابق البحث</p>
        <small class="text-muted">جرب مصطلحات بحث أخرى أو غير الفلتر</small>
      </div>

      <div class="row g-3" v-else>
        <div class="col-12" v-for="order in filteredOrders" :key="order.id">
          <div class="card">
            <div class="card-body">
              <div
                class="d-flex justify-content-between align-items-start mb-2"
              >
                <div>
                  <h6 class="card-title mb-1">
                    {{ order.User.firstName }} {{ order.User.lastName }}
                  </h6>
                  <small class="text-muted">{{ order.User.email }}</small>
                </div>
                <div class="d-flex flex-column align-items-end gap-1">
                  <span
                    class="badge"
                    :class="getStatusBadgeClass(order.status)"
                  >
                    {{ getStatusLabel(order.status) }}
                  </span>
                  <span class="badge bg-info">
                    {{ order.totalAmount.toFixed(2) }} د. أ
                  </span>
                </div>
              </div>
              <p class="card-text text-muted small mb-2">
                رقم الطلب: {{ order.id.substring(0, 8) }}...
              </p>
              <p class="card-text text-muted small mb-2">
                العناصر: {{ order.OrderItem.length }} منتج
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <small class="text-muted">
                    تاريخ الطلب: {{ formatDate(order.createdAt) }}
                  </small>
                </div>
                <div class="d-flex gap-1">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    :title="'عرض تفاصيل الطلب'"
                    @click="handleViewOrder(order)"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-warning"
                    :title="'تعديل حالة الطلب'"
                    @click="handleEditOrder(order)"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    :title="'حذف الطلب'"
                    @click="showDeleteConfirmation(order.id)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>

              <!-- Order Items Preview (Mobile) -->
              <div class="mt-2 pt-2 border-top">
                <small class="text-muted fw-bold">المنتجات:</small>
                <div class="mt-1">
                  <div
                    v-for="item in order.OrderItem.slice(0, 2)"
                    :key="item.id"
                    class="d-flex justify-content-between text-muted small"
                  >
                    <span>{{ item.Product.name }}</span>
                    <span
                      >{{ item.quantity }}x {{ item.price.toFixed(2) }} د.
                      أ</span
                    >
                  </div>
                  <small
                    v-if="order.OrderItem.length > 2"
                    class="text-muted fst-italic"
                  >
                    و {{ order.OrderItem.length - 2 }} منتج آخر...
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Table View (hidden on small screens) -->
    <div
      class="d-none d-md-block table-responsive flex-grow-1"
      v-if="!showEditOrder && !initialLoading && !showOrderDetails"
    >
      <!-- No results message for desktop -->
      <div v-if="filteredOrders.length === 0" class="text-center py-5">
        <i class="bi bi-search text-muted" style="font-size: 3rem"></i>
        <h5 class="text-muted mt-3 mb-2">لا توجد طلبات تطابق البحث</h5>
        <p class="text-muted">
          جرب مصطلحات بحث أخرى أو امسح مربع البحث لعرض جميع الطلبات
        </p>
      </div>

      <table class="table table-hover mb-0" v-else>
        <thead class="thead-primary sticky-top">
          <tr class="bg-primary text-white">
            <th scope="col" style="width: 120px">
              <div class="text-primary">رقم الطلب</div>
            </th>
            <th scope="col" style="min-width: 150px">
              <div class="text-primary">العميل</div>
            </th>
            <th
              scope="col"
              class="d-none d-lg-table-cell"
              style="min-width: 180px"
            >
              <div class="text-primary">البريد الإلكتروني</div>
            </th>
            <th scope="col" style="width: 100px">
              <div class="text-primary">الحالة</div>
            </th>
            <th scope="col" style="width: 120px">
              <div class="text-primary">المبلغ الإجمالي</div>
            </th>
            <th scope="col" class="d-none d-xl-table-cell" style="width: 100px">
              <div class="text-primary">العناصر</div>
            </th>
            <th scope="col" class="d-none d-lg-table-cell" style="width: 130px">
              <div class="text-primary">تاريخ الطلب</div>
            </th>
            <th scope="col" style="width: 150px">
              <div class="text-primary">الإجراءات</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            class="align-middle"
          >
            <td
              class="text-truncate"
              style="max-width: 120px"
              :title="order.id"
            >
              {{ order.id.substring(0, 8) }}...
            </td>
            <td
              class="text-truncate"
              style="max-width: 150px"
              :title="order.User.firstName + ' ' + order.User.lastName"
            >
              {{ order.User.firstName }} {{ order.User.lastName }}
              <!-- Show email on medium screens -->
              <br class="d-md-block d-lg-none" />
              <small class="text-muted d-md-inline d-lg-none">{{
                order.User.email
              }}</small>
            </td>
            <td
              class="text-truncate d-none d-lg-table-cell"
              style="max-width: 180px"
              :title="order.User.email"
            >
              {{ order.User.email }}
            </td>
            <td class="text-center">
              <span class="badge" :class="getStatusBadgeClass(order.status)">
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
            <td class="text-center fw-bold">
              {{ order.totalAmount.toFixed(2) }} د. أ
            </td>
            <td class="text-center d-none d-xl-table-cell">
              {{ order.OrderItem.length }} منتج
            </td>
            <td class="text-nowrap d-none d-lg-table-cell">
              {{ formatDate(order.createdAt) }}
            </td>
            <td>
              <div class="d-flex gap-1 justify-content-center">
                <button
                  class="btn btn-sm btn-outline-primary"
                  :title="'عرض تفاصيل الطلب'"
                  @click="handleViewOrder(order)"
                  :class="{ disabled: loading }"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-warning"
                  :title="'تعديل حالة الطلب'"
                  @click="handleEditOrder(order)"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  :title="'حذف الطلب'"
                  @click="showDeleteConfirmation(order.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showOrderDetails">
      <h3 class="border-bottom border-2 border-dark my-3 text-center">
        تفاصيل الطلب
      </h3>
      <div class="row">
        <div class="col-md-6">
          <div class="card mb-3">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">معلومات الطلب</h5>
            </div>
            <div class="card-body">
              <p><strong>رقم الطلب:</strong> {{ viewingOrder.id }}</p>
              <p>
                <strong>العميل:</strong> {{ viewingOrder.User.firstName }}
                {{ viewingOrder.User.lastName }}
              </p>
              <p>
                <strong>البريد الإلكتروني:</strong>
                {{ viewingOrder.User.email }}
              </p>
              <p>
                <strong>الحالة:</strong>
                <span
                  class="badge"
                  :class="getStatusBadgeClass(viewingOrder.status)"
                >
                  {{ getStatusLabel(viewingOrder.status) }}
                </span>
              </p>
              <p>
                <strong>المبلغ الإجمالي:</strong>
                {{ viewingOrder.totalAmount.toFixed(2) }} د. أ
              </p>
              <p>
                <strong>تاريخ الطلب:</strong>
                {{ formatDate(viewingOrder.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Address Information -->
          <div class="card mb-3" v-if="viewingOrder.Address">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0">عنوان التوصيل</h5>
            </div>
            <div class="card-body">
              <p>
                <strong>العنوان الأول:</strong>
                {{ viewingOrder.Address.addressLine1 }}
              </p>
              <p v-if="viewingOrder.Address.addressLine2">
                <strong>العنوان الثاني:</strong>
                {{ viewingOrder.Address.addressLine2 }}
              </p>
              <p><strong>المدينة:</strong> {{ viewingOrder.Address.city }}</p>
              <p><strong>المحافظة:</strong> {{ viewingOrder.Address.state }}</p>
              <p>
                <strong>الرمز البريدي:</strong> {{ viewingOrder.Address.zip }}
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <!-- Order Items -->
          <div class="card mb-3">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0">
                عناصر الطلب ({{ viewingOrder.OrderItem.length }} منتج)
              </h5>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-sm mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>المنتج</th>
                      <th class="text-center">الكمية</th>
                      <th class="text-center">السعر</th>
                      <th class="text-center">المجموع</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in viewingOrder.OrderItem" :key="item.id">
                      <td>{{ item.Product.name }}</td>
                      <td class="text-center">{{ item.quantity }}</td>
                      <td class="text-center">
                        {{ item.price.toFixed(2) }} د. أ
                      </td>
                      <td class="text-center fw-bold">
                        {{ (item.quantity * item.price).toFixed(2) }} د. أ
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="table-dark">
                    <tr>
                      <th colspan="3" class="text-end">المجموع الإجمالي:</th>
                      <th class="text-center">
                        {{ viewingOrder.totalAmount.toFixed(2) }} د. أ
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-center gap-2">
        <button
          type="button"
          class="btn btn-secondary mb-3"
          @click="closeOrderDetails"
        >
          إغلاق
        </button>
      </div>
    </div>

    <!-- Edit Order Status Modal -->
    <div v-if="showEditOrder">
      <h3 class="border-bottom border-2 border-dark my-3 text-center">
        تعديل حالة الطلب
      </h3>
      <form @submit.prevent="updateOrderStatus()">
        <div class="row">
          <div class="col-md-6 mx-auto">
            <div class="card">
              <div class="card-header bg-warning text-dark">
                <h5 class="mb-0">معلومات الطلب</h5>
              </div>
              <div class="card-body">
                <p><strong>رقم الطلب:</strong> {{ editingOrder.id }}</p>
                <p>
                  <strong>العميل:</strong> {{ editingOrder.User.firstName }}
                  {{ editingOrder.User.lastName }}
                </p>
                <p>
                  <strong>المبلغ الإجمالي:</strong>
                  {{ editingOrder.totalAmount.toFixed(2) }} د. أ
                </p>
                <p>
                  <strong>الحالة الحالية:</strong>
                  <span
                    class="badge"
                    :class="getStatusBadgeClass(editingOrder.status)"
                  >
                    {{ getStatusLabel(editingOrder.status) }}
                  </span>
                </p>
              </div>
            </div>

            <div class="mt-3">
              <label for="orderStatus" class="form-label"
                >الحالة الجديدة *</label
              >
              <select
                class="form-select"
                id="orderStatus"
                v-model="editingOrder.newStatus"
                required
              >
                <option value="">اختر الحالة الجديدة</option>
                <option
                  v-for="status in orderStatuses"
                  :key="status.value"
                  :value="status.value"
                >
                  {{ status.label }}
                </option>
              </select>
              <div class="form-text">
                اختر الحالة الجديدة للطلب بناءً على مرحلة التنفيذ
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-center gap-2 mt-4">
          <button
            type="submit"
            class="btn btn-primary mb-3"
            :disabled="loading || !editingOrder.newStatus"
          >
            تحديث حالة الطلب
            <div
              class="spinner-border text-light spinner-border-sm ms-2"
              role="status"
              v-if="loading"
            >
              <span class="visually-hidden"></span>
            </div>
          </button>
          <button
            type="button"
            class="btn btn-secondary mb-3"
            @click="cancelEdit"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>

    <!-- Success/Error Messages -->
    <div
      v-if="message"
      class="position-fixed top-0 start-50 translate-middle-x mt-3"
      style="z-index: 1050"
    >
      <div
        class="alert"
        :class="messageType === 'success' ? 'alert-success' : 'alert-danger'"
        role="alert"
      >
        <i
          :class="
            messageType === 'success'
              ? 'bi bi-check-circle'
              : 'bi bi-exclamation-triangle'
          "
        ></i>
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import axios from "axios";

// Data refs
const orders = ref([]);
const editingOrder = ref({
  id: "",
  User: { firstName: "", lastName: "" },
  totalAmount: 0,
  status: "",
  newStatus: "",
});
const viewingOrder = ref({
  id: "",
  User: { firstName: "", lastName: "", email: "" },
  totalAmount: 0,
  status: "",
  OrderItem: [],
  Address: null,
});

// UI state
const initialLoading = ref(false);
const loading = ref(false);
const showEditOrder = ref(false);
const showOrderDetails = ref(false);
const searchQuery = ref("");
const selectedStatus = ref("ALL");
const message = ref("");
const messageType = ref("success");

// Order statuses configuration
const orderStatuses = ref([
  { value: "PENDING", label: "قيد الانتظار", color: "warning" },
  { value: "CONFIRMED", label: "مؤكد", color: "info" },
  { value: "DELIVERED", label: "تم التوصيل", color: "success" },
  { value: "CANCELLED", label: "ملغي", color: "danger" },
  { value: "REFUNDED", label: "مسترد", color: "secondary" },
]);

const token = localStorage.getItem("token");

// Computed properties
const filteredOrders = computed(() => {
  let filtered = orders.value;

  // Filter by status
  if (selectedStatus.value !== "ALL") {
    filtered = filtered.filter(
      (order) => order.status === selectedStatus.value
    );
  }

  // Filter by search query
  if (!searchQuery.value.trim()) {
    return filtered;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return filtered.filter(
    (order) =>
      order.User.firstName.toLowerCase().includes(query) ||
      order.User.lastName.toLowerCase().includes(query) ||
      order.User.email.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query) ||
      getStatusLabel(order.status).toLowerCase().includes(query) ||
      (order.User.firstName + " " + order.User.lastName)
        .toLowerCase()
        .includes(query)
  );
});

// Helper functions
const getStatusLabel = (status) => {
  const statusObj = orderStatuses.value.find((s) => s.value === status);
  return statusObj ? statusObj.label : status;
};

const getStatusBadgeClass = (status) => {
  const statusObj = orderStatuses.value.find((s) => s.value === status);
  return statusObj ? `bg-${statusObj.color}` : "bg-secondary";
};

const getStatusCount = (status) => {
  return orders.value.filter((order) => order.status === status).length;
};

const filterByStatus = (status) => {
  selectedStatus.value = status;
};

// Order management functions
const handleViewOrder = async (order) => {
  loading.value = true;
  const vieworder = await axios
    .get(`${process.env.VUE_APP_API_BASE_URL}/order/${order.id}`, {
      headers: {
        Authorization: `${token}`,
      },
    })
    .then((response) => (viewingOrder.value = response.data.order))
    .catch((error) => {
      console.error("Error fetching order details:", error);
      showMessage("خطأ في تحميل تفاصيل الطلب", "danger");
    });
  loading.value = false;
  showOrderDetails.value = true;
  showEditOrder.value = false;
};

const handleEditOrder = (order) => {
  editingOrder.value = {
    ...order,
    newStatus: order.status,
  };
  showEditOrder.value = true;
  showOrderDetails.value = false;
};

const closeOrderDetails = () => {
  fetchAllOrders();
  showOrderDetails.value = false;
  viewingOrder.value = {
    id: "",
    User: { firstName: "", lastName: "", email: "" },
    totalAmount: 0,
    status: "",
    OrderItem: [],
    Address: null,
  };
};

const cancelEdit = () => {
  showEditOrder.value = false;
  editingOrder.value = {
    id: "",
    User: { firstName: "", lastName: "" },
    totalAmount: 0,
    status: "",
    newStatus: "",
  };
};

const updateOrderStatus = async () => {
  try {
    if (!editingOrder.value.newStatus) {
      showMessage("يرجى اختيار الحالة الجديدة", "danger");
      return;
    }

    loading.value = true;

    await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/order/${editingOrder.value.id}/status`,
      { status: editingOrder.value.newStatus },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Update the order in the orders array
    const index = orders.value.findIndex(
      (order) => order.id === editingOrder.value.id
    );
    if (index !== -1) {
      orders.value[index].status = editingOrder.value.newStatus;
    }

    cancelEdit();
    showMessage("تم تحديث حالة الطلب بنجاح");
  } catch (error) {
    console.error("Error updating order status:", error);
    if (error.response?.status === 400) {
      showMessage("خطأ في البيانات المرسلة", "danger");
    } else {
      showMessage("خطأ في تحديث حالة الطلب", "danger");
    }
  } finally {
    loading.value = false;
  }
};

const showDeleteConfirmation = (orderId) => {
  const order = orders.value.find((o) => o.id === orderId);
  if (
    confirm(
      `هل أنت متأكد أنك تريد حذف طلب ${order.User.firstName} ${order.User.lastName}؟\n\nتحذير: هذا الإجراء لا يمكن التراجع عنه!`
    )
  ) {
    deleteOrder(orderId);
  }
};

const deleteOrder = async (orderId) => {
  try {
    await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/order/${orderId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    orders.value = orders.value.filter((order) => order.id !== orderId);
    showMessage("تم حذف الطلب بنجاح");
  } catch (error) {
    console.error("Error deleting order:", error);
    showMessage("خطأ في حذف الطلب", "danger");
  }
};

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Show message
const showMessage = (text, type = "success") => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

// Fetch orders
const fetchAllOrders = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/order`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    orders.value = response.data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    showMessage("خطأ في تحميل بيانات الطلبات", "danger");
  }
};

onMounted(async () => {
  initialLoading.value = true;
  try {
    await fetchAllOrders();
  } finally {
    initialLoading.value = false;
  }
});
</script>
