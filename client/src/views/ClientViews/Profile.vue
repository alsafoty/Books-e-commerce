<template>
  <div class="min-vh-100" dir="rtl">
    <Navbar />

    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!-- Profile Header -->
          <div class="card shadow-lg border-0 rounded-4 mb-4">
            <div class="card-body p-4">
              <div class="d-flex align-items-center gap-3">
                <div
                  class="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                  style="width: 80px; height: 80px"
                >
                  <i class="bi bi-person-fill text-white fs-1"></i>
                </div>
                <div>
                  <h3 class="mb-1 fw-bold">
                    {{ userInfo.firstName }} {{ userInfo.lastName }}
                  </h3>

                  <small class="text-muted"
                    >عضو منذ {{ formatDate(userInfo.createdAt) }}</small
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Information -->
          <div class="card shadow-lg border-0 rounded-4 mb-4">
            <div class="card-header bg-transparent border-0 p-4">
              <h5 class="mb-0 fw-bold">
                <i class="bi bi-person-circle me-2"></i>
                المعلومات الشخصية
              </h5>
            </div>
            <div class="card-body p-4">
              <form @submit.prevent="updateProfile">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">الاسم الأول</label>
                    <input
                      v-model="editForm.firstName"
                      type="text"
                      class="form-control form-control-lg rounded-3"
                      :readonly="!editMode"
                      :class="{ 'form-control-plaintext': !editMode }"
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">الاسم الأخير</label>
                    <input
                      v-model="editForm.lastName"
                      type="text"
                      class="form-control form-control-lg rounded-3"
                      :readonly="!editMode"
                      :class="{ 'form-control-plaintext': !editMode }"
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold"
                    >البريد الإلكتروني</label
                  >
                  <input
                    v-model="editForm.email"
                    type="email"
                    class="form-control form-control-lg rounded-3"
                    :readonly="!editMode"
                    :class="{ 'form-control-plaintext': !editMode }"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">رقم الهاتف</label>
                  <input
                    v-model="editForm.mobile"
                    type="tel"
                    class="form-control form-control-lg rounded-3"
                    :readonly="!editMode"
                    :class="{ 'form-control-plaintext': !editMode }"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">اسم المستخدم</label>
                  <input
                    v-model="editForm.username"
                    type="text"
                    class="form-control form-control-lg rounded-3"
                    :readonly="!editMode"
                    :class="{ 'form-control-plaintext': !editMode }"
                  />
                </div>

                <div class="d-flex gap-2">
                  <button
                    v-if="!editMode"
                    type="button"
                    @click="enableEdit"
                    class="btn btn-primary btn-lg rounded-3"
                  >
                    <i class="bi bi-pencil me-2"></i>
                    تعديل المعلومات
                  </button>

                  <template v-else>
                    <button
                      type="submit"
                      class="btn btn-success btn-lg rounded-3"
                      :disabled="loading"
                    >
                      <span
                        v-if="loading"
                        class="spinner-border spinner-border-sm me-2"
                      ></span>
                      <i v-else class="bi bi-check-lg me-2"></i>
                      حفظ التغييرات
                    </button>
                    <button
                      type="button"
                      @click="cancelEdit"
                      class="btn btn-secondary btn-lg rounded-3"
                    >
                      <i class="bi bi-x-lg me-2"></i>
                      إلغاء
                    </button>
                  </template>
                </div>
              </form>
            </div>
          </div>

          <!-- Addresses Information -->
          <div class="card shadow-lg border-0 rounded-4 mb-4">
            <div class="card-header bg-transparent border-0 p-4">
              <h5 class="mb-0 fw-bold">
                <i class="bi bi-geo-alt me-2"></i>
                عناويني
              </h5>
            </div>
            <div class="card-body p-4">
              <!-- Add Address Form -->
              <div v-if="addMode" class="mb-4">
                <form @submit.prevent="handleAddressSubmit">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-semibold">المحافظة</label>
                      <input
                        v-model="addressForm.governorate"
                        type="text"
                        class="form-control form-control-lg rounded-3"
                        required
                      />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-semibold">المنطقة</label>
                      <input
                        v-model="addressForm.area"
                        type="text"
                        class="form-control form-control-lg rounded-3"
                        required
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-semibold">الشارع</label>
                      <input
                        v-model="addressForm.street"
                        type="text"
                        class="form-control form-control-lg rounded-3"
                        required
                      />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-semibold">المبنى</label>
                      <input
                        v-model="addressForm.building"
                        type="text"
                        class="form-control form-control-lg rounded-3"
                        required
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-semibold">الطابق</label>
                      <input
                        v-model="addressForm.floor"
                        type="text"
                        class="form-control form-control-lg rounded-3"
                      />
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label fw-semibold"
                        >الرمز البريدي</label
                      >
                      <input
                        v-model="addressForm.zip"
                        type="text"
                        class="form-control form-control-lg rounded-3"
                        required
                      />
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label fw-semibold">ملاحظات إضافية</label>
                    <textarea
                      v-model="addressForm.notes"
                      class="form-control form-control-lg rounded-3"
                      rows="3"
                      placeholder="أي تفاصيل إضافية لتسهيل الوصول"
                    ></textarea>
                  </div>

                  <!-- Form Action Buttons -->
                  <div class="d-flex gap-2">
                    <button
                      type="submit"
                      class="btn btn-success btn-lg rounded-3"
                      :disabled="addressLoading"
                    >
                      <span
                        v-if="addressLoading"
                        class="spinner-border spinner-border-sm me-2"
                      ></span>
                      <i v-else class="bi bi-check-lg me-2"></i>
                      {{ editAddressMode ? "تحديث العنوان" : "إضافة عنوان" }}
                    </button>
                    <button
                      type="button"
                      @click="cancelAddressEdit"
                      class="btn btn-secondary btn-lg rounded-3"
                    >
                      <i class="bi bi-x-lg me-2"></i>
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>

              <!-- Addresses List -->
              <div v-if="addressLoading && !addMode" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">جاري التحميل...</span>
                </div>
                <p class="text-muted mt-2">جاري تحميل العناوين...</p>
              </div>

              <div
                v-else-if="!addresses.length && !addMode && !addressLoading"
                class="text-center py-4"
              >
                <i class="bi bi-geo-alt text-muted" style="font-size: 3rem"></i>
                <p class="text-muted mt-3">لا توجد عناوين مسجلة</p>
              </div>

              <div v-else-if="addresses.length" class="row g-3 mb-4">
                <div
                  v-for="(address, index) in addresses"
                  :key="address.id"
                  class="col-md-6"
                >
                  <div class="card h-100">
                    <div class="card-body">
                      <div
                        class="d-flex justify-content-between align-items-start mb-2"
                      >
                        <h6 class="card-title fw-bold">
                          {{ " عنوان رقم " + (index + 1) }}
                        </h6>
                      </div>
                      <p class="card-text text-muted small mb-3">
                        {{ address.state }}، {{ address.city }}<br />
                        {{ address.addressLine1 }}
                        <span v-if="address.addressLine2">
                          <br />{{ address.addressLine2 }}
                        </span>
                        <span v-if="address.notes" class="text-muted">
                          <br />{{ address.notes }}
                        </span>
                      </p>
                      <div class="d-flex justify-content-between gap-2">
                        <button
                          @click="editAddress(address)"
                          class="btn btn-outline-primary btn-sm"
                        >
                          <i class="bi bi-pencil me-1"></i>تعديل
                        </button>
                        <button
                          @click="deleteAddress(address.id)"
                          class="btn btn-outline-danger btn-sm"
                          :disabled="addressLoading"
                        >
                          <i class="bi bi-trash me-1"></i>حذف
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="d-flex gap-2" v-if="!addMode">
                <button
                  type="button"
                  @click="enableAddressAdd"
                  class="btn btn-primary btn-lg rounded-3"
                >
                  <i class="bi bi-plus me-2"></i>
                  إضافة عنوان جديد
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-header bg-transparent border-0 p-4">
              <h5 class="mb-0 fw-bold">
                <i class="bi bi-lightning me-2"></i>
                إجراءات سريعة
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-md-6">
                  <router-link
                    to="/orders"
                    class="btn btn-outline-primary btn-lg w-100 rounded-3"
                  >
                    <i class="bi bi-bag me-2"></i>
                    طلباتي
                  </router-link>
                </div>
                <div class="col-md-6">
                  <router-link
                    to="/wishlist"
                    class="btn btn-outline-primary btn-lg w-100 rounded-3"
                  >
                    <i class="bi bi-heart me-2"></i>
                    المفضلة
                  </router-link>
                </div>
                <div class="col-md-6">
                  <router-link
                    to="/cart"
                    class="btn btn-outline-primary btn-lg w-100 rounded-3"
                  >
                    <i class="bi bi-cart me-2"></i>
                    سلة المشتريات
                  </router-link>
                </div>
                <div class="col-md-6">
                  <button
                    @click="changePassword"
                    class="btn btn-outline-warning btn-lg w-100 rounded-3"
                  >
                    <i class="bi bi-key me-2"></i>
                    تغيير كلمة المرور
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
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Navbar from "@/components/Navbar.vue";

document.title = "متجر الكتب | الملف الشخصي";

const router = useRouter();

// State
const userInfo = ref({});
const editForm = reactive({
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  username: "",
});
const editMode = ref(false);
const loading = ref(false);
const message = ref("");
const messageType = ref("success");
const addresses = ref([]);

// Address management state
const addMode = ref(false);
const editAddressMode = ref(false);
const addressLoading = ref(false);
const editingAddressId = ref(null);
const addressForm = reactive({
  zip: "",
  governorate: "",
  area: "",
  street: "",
  building: "",
  floor: "",
  notes: "",
});

// Get addresses for user
const fetchAddresses = async () => {
  try {
    addressLoading.value = true;
    const token = localStorage.getItem("token");
    const userId = userInfo.value.id;

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
    addressLoading.value = false;
  }
};

// Add new address
const addAddress = async () => {
  try {
    addressLoading.value = true;
    const token = localStorage.getItem("token");

    // Map frontend form fields to API expected fields
    const addressData = {
      userId: userInfo.value.id,
      addressLine1: `${addressForm.street}, مبنى ${addressForm.building}`,
      addressLine2: addressForm.floor ? `الطابق ${addressForm.floor}` : "",
      city: addressForm.area,
      state: addressForm.governorate,
      zip: addressForm.label, // Using label as a reference
    };

    if (addressForm.notes) {
      addressData.notes = addressForm.notes;
    }

    const response = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/address`,
      addressData,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201) {
      await fetchAddresses();
      resetAddressForm();
      addMode.value = false;
      showMessage("تم إضافة العنوان بنجاح", "success");
    }
  } catch (error) {
    console.error("Error adding address:", error);
    showMessage("حدث خطأ في إضافة العنوان", "danger");
  } finally {
    addressLoading.value = false;
  }
};

// Edit existing address
const editAddress = (address) => {
  editingAddressId.value = address.id;
  editAddressMode.value = true;
  addMode.value = true; // Use same form

  // Map API fields back to frontend form fields
  const parts = address.addressLine1?.split(", مبنى ") || [
    address.addressLine1,
  ];
  const buildingMatch = parts[1]?.match(/^(\d+)/);
  const floorMatch = address.addressLine2?.match(/الطابق (.+)/);

  addressForm.label = address.zip || "";
  addressForm.governorate = address.state || "";
  addressForm.area = address.city || "";
  addressForm.street = parts[0] || address.addressLine1 || "";
  addressForm.building = buildingMatch ? buildingMatch[1] : "";
  addressForm.floor = floorMatch ? floorMatch[1] : "";
  addressForm.notes = address.notes || "";
};

// Update existing address
const updateAddress = async () => {
  try {
    addressLoading.value = true;
    const token = localStorage.getItem("token");

    // Map frontend form fields to API expected fields
    const addressData = {
      addressLine1: `${addressForm.street}, مبنى ${addressForm.building}`,
      addressLine2: addressForm.floor ? `الطابق ${addressForm.floor}` : "",
      city: addressForm.area,
      state: addressForm.governorate,
      zip: addressForm.label,
    };

    if (addressForm.notes) {
      addressData.notes = addressForm.notes;
    }

    const response = await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/address/${editingAddressId.value}`,
      addressData,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      await fetchAddresses();
      resetAddressForm();
      addMode.value = false;
      editAddressMode.value = false;
      editingAddressId.value = null;
      showMessage("تم تحديث العنوان بنجاح", "success");
    }
  } catch (error) {
    console.error("Error updating address:", error);
    showMessage("حدث خطأ في تحديث العنوان", "danger");
  } finally {
    addressLoading.value = false;
  }
};

// Delete address
const deleteAddress = async (addressId) => {
  if (!confirm("هل أنت متأكد من حذف هذا العنوان؟")) return;

  try {
    addressLoading.value = true;
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${process.env.VUE_APP_API_BASE_URL}/address/${addressId}`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      await fetchAddresses();
      showMessage("تم حذف العنوان بنجاح", "success");
    }
  } catch (error) {
    console.error("Error deleting address:", error);
    showMessage("حدث خطأ في حذف العنوان", "danger");
  } finally {
    addressLoading.value = false;
  }
};

// Reset address form
const resetAddressForm = () => {
  Object.assign(addressForm, {
    label: "",
    governorate: "",
    area: "",
    street: "",
    building: "",
    floor: "",
    notes: "",
  });
  editingAddressId.value = null;
  editAddressMode.value = false;
};

// Cancel address edit
const cancelAddressEdit = () => {
  resetAddressForm();
  addMode.value = false;
};

// Handle address form submission
const handleAddressSubmit = () => {
  if (editAddressMode.value) {
    updateAddress();
  } else {
    addAddress();
  }
};

// Enable add address mode
const enableAddressAdd = () => {
  addMode.value = true;
  resetAddressForm();
};

// Cancel add address mode
const cancelAddressAdd = () => {
  addMode.value = false;
  resetAddressForm();
};

// Get user info from localStorage
const getUserInfo = () => {
  const userInfoString = localStorage.getItem("userInfo");
  if (userInfoString) {
    try {
      const userData = JSON.parse(userInfoString);
      userInfo.value = userData;

      // Populate edit form
      editForm.firstName = userData.firstName || "";
      editForm.lastName = userData.lastName || "";
      editForm.email = userData.email || "";
      editForm.mobile = userData.mobile || "";
      editForm.username = userData.username || "";
    } catch (error) {
      console.error("Error parsing user info:", error);
      router.push("/login");
    }
  } else {
    // No user info, redirect to login
    router.push("/login");
  }
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "غير محدد";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-JO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "غير محدد";
  }
};

// Enable edit mode
const enableEdit = () => {
  editMode.value = true;
};

// Cancel edit
const cancelEdit = () => {
  editMode.value = false;
  // Reset form to original values
  editForm.firstName = userInfo.value.firstName || "";
  editForm.lastName = userInfo.value.lastName || "";
  editForm.email = userInfo.value.email || "";
  editForm.mobile = userInfo.value.mobile || "";
  editForm.username = userInfo.value.username || "";
};

// Show message
const showMessage = (text, type = "success") => {
  message.value = text;
  messageType.value = type === "error" ? "danger" : type;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

// Update profile
const updateProfile = async () => {
  loading.value = true;

  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/user/${userInfo.value.id}`,
      {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        mobile: editForm.mobile,
        username: editForm.username,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    // Update user info in localStorage
    const updatedUser = { ...userInfo.value, ...editForm };
    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    userInfo.value = updatedUser;

    editMode.value = false;
    showMessage("تم تحديث المعلومات بنجاح", "success");
  } catch (error) {
    showMessage(
      error.response?.data?.message || "خطأ في تحديث المعلومات",
      "danger"
    );
  } finally {
    loading.value = false;
  }
};

// // Change password
// const changePassword = () => {
//   router.push("/login?mode=forgot");
// };

// Component mounted
onMounted(() => {
  getUserInfo();
  fetchAddresses();
});
</script>

<style scoped>
.form-control-plaintext {
  text-align: right;
}

.form-control:read-only {
  background-color: transparent;
  border-color: transparent;
  border-bottom: 1px solid #dee2e6;
  border-radius: 0;
}

.card {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
  transition: transform 0.2s ease;
}

.card:hover {
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

.bg-primary {
  background: linear-gradient(135deg, #8b4513 0%, #d2b48c 100%) !important;
}
</style>
