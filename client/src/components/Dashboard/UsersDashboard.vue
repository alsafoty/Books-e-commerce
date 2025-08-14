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
    <div class="my-3" v-if="!showEditUser && !initialLoading">
      <!-- Search Bar -->
      <div class="search-container">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="ابحث عن مستخدم | يمكنك البحث بالاسم، البريد الإلكتروني، أو اسم المستخدم"
            v-model="searchQuery"
            aria-label="البحث في المستخدمين"
          />
          <span class="input-group-text">
            <i class="bi bi-search text-muted"></i>
          </span>
        </div>
      </div>
    </div>

    <!-- Mobile Cards View (visible on small screens) -->
    <div class="d-block d-md-none" v-if="!showEditUser && !initialLoading">
      <!-- No results message for mobile -->
      <div v-if="filteredUsers.length === 0" class="text-center py-4">
        <i class="bi bi-search text-muted" style="font-size: 2rem"></i>
        <p class="text-muted mt-2 mb-0">لا توجد مستخدمين تطابق البحث</p>
        <small class="text-muted">جرب مصطلحات بحث أخرى</small>
      </div>

      <div class="row g-3" v-else>
        <div class="col-12" v-for="user in filteredUsers" :key="user.id">
          <div class="card">
            <div class="card-body">
              <div
                class="d-flex justify-content-between align-items-start mb-2"
              >
                <div>
                  <h6 class="card-title mb-1">
                    {{ user.firstName }} {{ user.lastName }}
                  </h6>
                  <small class="text-muted">@{{ user.username }}</small>
                </div>
                <div class="d-flex flex-column align-items-end gap-1">
                  <span
                    class="badge"
                    :class="
                      user.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary'
                    "
                  >
                    {{ user.role === "ADMIN" ? "مدير" : "عميل" }}
                  </span>
                  <span
                    class="badge"
                    :class="user.isActive ? 'bg-success' : 'bg-warning'"
                  >
                    {{ user.isActive ? "نشط" : "غير نشط" }}
                  </span>
                </div>
              </div>
              <p class="card-text text-muted small mb-2">
                {{ user.email }}
              </p>
              <p class="card-text text-muted small mb-2">
                الهاتف: {{ user.mobile }}
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <small class="text-muted">
                    انضم في: {{ formatDate(user.createdAt) }}
                  </small>
                </div>
                <div class="d-flex gap-1">
                  <button
                    class="btn btn-sm btn-outline-warning"
                    :title="
                      user.isActive ? 'إلغاء تفعيل المستخدم' : 'تفعيل المستخدم'
                    "
                    @click="toggleUserStatus(user)"
                  >
                    <i
                      :class="
                        user.isActive ? 'bi bi-person-x' : 'bi bi-person-check'
                      "
                    ></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-primary"
                    :title="'تعديل ' + user.firstName"
                    @click="handleEditUser(user)"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    :title="'حذف ' + user.firstName"
                    @click="showDeleteConfirmation(user.id)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Table View (hidden on small screens) -->
    <div
      class="d-none d-md-block table-responsive flex-grow-1 bg-light"
      v-if="!showEditUser && !initialLoading"
      style="background-color: #faf9f6"
    >
      <!-- No results message for desktop -->
      <div v-if="filteredUsers.length === 0" class="text-center py-5">
        <i class="bi bi-search text-muted" style="font-size: 3rem"></i>
        <h5 class="text-muted mt-3 mb-2">لا توجد مستخدمين تطابق البحث</h5>
        <p class="text-muted">
          جرب مصطلحات بحث أخرى أو امسح مربع البحث لعرض جميع المستخدمين
        </p>
      </div>

      <table
        class="table table-hover mb-0 bg-light rounded-2"
        v-else
        style="background-color: #faf9f6"
      >
        <thead class="sticky-top rounded-2" style="background-color: #faf9f6">
          <tr class="bg-primary text-white">
            <th scope="col" style="min-width: 180px">
              <div class="text-primary">الاسم</div>
            </th>
            <th
              scope="col"
              class="d-none d-lg-table-cell"
              style="min-width: 160px"
            >
              <div class="text-primary">اسم المستخدم</div>
            </th>
            <th
              scope="col"
              class="d-none d-xl-table-cell"
              style="min-width: 220px"
            >
              <div class="text-primary">البريد الإلكتروني</div>
            </th>
            <th scope="col" class="d-none d-lg-table-cell" style="width: 120px">
              <div class="text-primary">الهاتف</div>
            </th>
            <th scope="col" style="width: 80px">
              <div class="text-primary">الدور</div>
            </th>
            <th scope="col" style="width: 80px">
              <div class="text-primary">الحالة</div>
            </th>
            <th scope="col" class="d-none d-xl-table-cell" style="width: 120px">
              <div class="text-primary">تاريخ التسجيل</div>
            </th>
            <th scope="col" style="width: 120px">
              <div class="text-primary">الإجراءات</div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-light">
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="align-middle bg-light"
          >
            <td
              class="text-truncate"
              style="max-width: 150px"
              :title="user.firstName + ' ' + user.lastName"
            >
              {{ user.firstName }} {{ user.lastName }}
              <!-- Show username on medium screens -->
              <br class="d-md-block d-lg-none" />
              <small class="text-muted d-md-inline d-lg-none"
                >@{{ user.username }}</small
              >
            </td>
            <td
              class="text-truncate d-none d-lg-table-cell"
              style="max-width: 120px"
              :title="user.username"
            >
              @{{ user.username }}
            </td>
            <td
              class="text-truncate d-none d-xl-table-cell"
              style="max-width: 180px"
              :title="user.email"
            >
              {{ user.email }}
            </td>
            <td class="text-nowrap d-none d-lg-table-cell">
              {{ user.mobile }}
            </td>
            <td class="text-center">
              <span
                class="badge"
                :class="user.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary'"
              >
                {{ user.role === "ADMIN" ? "مدير" : "عميل" }}
              </span>
              <!-- Show email on medium screens -->
              <br class="d-md-block d-xl-none" />
              <small class="text-muted d-md-inline d-xl-none">{{
                user.email
              }}</small>
            </td>
            <td class="text-center">
              <span
                class="badge"
                :class="user.isActive ? 'bg-success' : 'bg-warning'"
              >
                {{ user.isActive ? "نشط" : "غير نشط" }}
              </span>
            </td>
            <td class="text-nowrap d-none d-xl-table-cell">
              {{ formatDate(user.createdAt) }}
            </td>
            <td>
              <div class="d-flex gap-1 justify-content-center">
                <button
                  class="btn btn-sm btn-outline-warning"
                  :title="
                    user.isActive ? 'إلغاء تفعيل المستخدم' : 'تفعيل المستخدم'
                  "
                  @click="toggleUserStatus(user)"
                >
                  <i
                    :class="
                      user.isActive ? 'bi bi-person-x' : 'bi bi-person-check'
                    "
                  ></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-primary"
                  :title="'تعديل ' + user.firstName"
                  @click="handleEditUser(user)"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  :title="'حذف ' + user.firstName"
                  @click="showDeleteConfirmation(user.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit User Modal -->
    <div class="bg-light" v-if="showEditUser">
      <h3 class="border-bottom border-2 border-dark my-3 text-center">
        تعديل بيانات المستخدم
      </h3>
      <form @submit.prevent="updateUser()">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="firstName" class="form-label">الاسم الأول *</label>
              <input
                type="text"
                class="form-control"
                id="firstName"
                v-model="editingUser.firstName"
                required
                :class="{ 'is-invalid': !editingUser.firstName.trim() }"
              />
              <div
                class="invalid-feedback"
                v-if="!editingUser.firstName.trim()"
              >
                الاسم الأول مطلوب
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="lastName" class="form-label">الاسم الأخير *</label>
              <input
                type="text"
                class="form-control"
                id="lastName"
                v-model="editingUser.lastName"
                required
                :class="{ 'is-invalid': !editingUser.lastName.trim() }"
              />
              <div class="invalid-feedback" v-if="!editingUser.lastName.trim()">
                الاسم الأخير مطلوب
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="username" class="form-label">اسم المستخدم *</label>
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="editingUser.username"
                required
                :class="{ 'is-invalid': !editingUser.username.trim() }"
              />
              <div class="invalid-feedback" v-if="!editingUser.username.trim()">
                اسم المستخدم مطلوب
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="email" class="form-label">البريد الإلكتروني *</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="editingUser.email"
                required
                :class="{
                  'is-invalid':
                    !editingUser.email.trim() ||
                    !isValidEmail(editingUser.email),
                }"
              />
              <div
                class="invalid-feedback"
                v-if="
                  !editingUser.email.trim() || !isValidEmail(editingUser.email)
                "
              >
                البريد الإلكتروني صحيح مطلوب
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="mobile" class="form-label">رقم الهاتف *</label>
              <input
                type="tel"
                class="form-control"
                id="mobile"
                v-model="editingUser.mobile"
                required
                :class="{ 'is-invalid': !editingUser.mobile.trim() }"
              />
              <div class="invalid-feedback" v-if="!editingUser.mobile.trim()">
                رقم الهاتف مطلوب
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="role" class="form-label">الدور *</label>
              <select
                class="form-select"
                id="role"
                v-model="editingUser.role"
                required
              >
                <option value="CLIENT">عميل</option>
                <option value="ADMIN">مدير</option>
              </select>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="isActive"
              v-model="editingUser.isActive"
            />
            <label class="form-check-label" for="isActive">
              المستخدم نشط
            </label>
          </div>
          <small class="text-muted">
            المستخدمون غير النشطين لن يتمكنوا من تسجيل الدخول
          </small>
        </div>
        <div class="d-flex justify-content-center gap-2">
          <button
            type="submit"
            class="btn btn-primary mb-3"
            :disabled="loading || !isFormValid"
            @click.prevent="updateUser()"
          >
            تحديث المستخدم
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
            @click="showEditUser = false"
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

const message = ref("");
const messageType = ref("success");
const users = ref([]);
const editingUser = ref({
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  mobile: "",
  role: "CLIENT",
  isActive: true,
});
const loading = ref(false);
const showEditUser = ref(false);
const searchQuery = ref("");
const initialLoading = ref(true);
// Computed property for filtered users
const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) {
    return users.value;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return users.value.filter(
    (user) =>
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.firstName + " " + user.lastName).toLowerCase().includes(query)
  );
});

// Computed property to check if form is valid
const isFormValid = computed(() => {
  return (
    editingUser.value.firstName.trim() !== "" &&
    editingUser.value.lastName.trim() !== "" &&
    editingUser.value.username.trim() !== "" &&
    editingUser.value.email.trim() !== "" &&
    isValidEmail(editingUser.value.email) &&
    editingUser.value.mobile.trim() !== ""
  );
});

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleEditUser = (user) => {
  editingUser.value = { ...user };
  showEditUser.value = true;
};

const updateUser = async () => {
  try {
    // Comprehensive validation
    if (!editingUser.value.firstName.trim()) {
      showMessage("الاسم الأول مطلوب", "danger");
      return;
    }

    if (!editingUser.value.lastName.trim()) {
      showMessage("الاسم الأخير مطلوب", "danger");
      return;
    }

    if (!editingUser.value.username.trim()) {
      showMessage("اسم المستخدم مطلوب", "danger");
      return;
    }

    if (
      !editingUser.value.email.trim() ||
      !isValidEmail(editingUser.value.email)
    ) {
      showMessage("البريد الإلكتروني صحيح مطلوب", "danger");
      return;
    }

    if (!editingUser.value.mobile.trim()) {
      showMessage("رقم الهاتف مطلوب", "danger");
      return;
    }

    loading.value = true;

    const userData = {
      firstName: editingUser.value.firstName.trim(),
      lastName: editingUser.value.lastName.trim(),
      username: editingUser.value.username.trim(),
      email: editingUser.value.email.trim(),
      mobile: editingUser.value.mobile.trim(),
      role: editingUser.value.role,
      isActive: editingUser.value.isActive,
    };

    await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/user/${editingUser.value.id}`,
      userData,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Update the user in the users array
    const index = users.value.findIndex(
      (user) => user.id === editingUser.value.id
    );
    if (index !== -1) {
      users.value[index] = { ...editingUser.value, ...userData };
    }

    // Reset form
    editingUser.value = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      mobile: "",
      role: "CLIENT",
      isActive: true,
    };
    showEditUser.value = false;
    showMessage("تم تحديث بيانات المستخدم بنجاح");
    fetchAllUsers(); // Refresh the users list
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.response?.status === 400) {
      showMessage("اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل", "danger");
    } else {
      showMessage("خطأ في تحديث بيانات المستخدم", "danger");
    }
  } finally {
    loading.value = false;
  }
};

const toggleUserStatus = async (user) => {
  try {
    const newStatus = !user.isActive;
    const confirmMessage = newStatus
      ? `هل أنت متأكد من تفعيل المستخدم ${user.firstName} ${user.lastName}؟`
      : `هل أنت متأكد من إلغاء تفعيل المستخدم ${user.firstName} ${user.lastName}؟`;

    if (!confirm(confirmMessage)) {
      return;
    }

    await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/user/${user.id}`,
      { isActive: newStatus },
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Update the user in the users array
    const index = users.value.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users.value[index].isActive = newStatus;
    }

    showMessage(
      newStatus ? "تم تفعيل المستخدم بنجاح" : "تم إلغاء تفعيل المستخدم بنجاح"
    );
  } catch (error) {
    console.error("Error toggling user status:", error);
    showMessage("خطأ في تغيير حالة المستخدم", "danger");
  }
};

const showDeleteConfirmation = (userId) => {
  const user = users.value.find((u) => u.id === userId);
  if (
    confirm(
      `هل أنت متأكد أنك تريد حذف المستخدم ${user.firstName} ${user.lastName}؟\n\nتحذير: هذا الإجراء لا يمكن التراجع عنه!`
    )
  ) {
    deleteUser(userId);
  }
};

const deleteUser = async (userId) => {
  try {
    await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/user/${userId}`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    });

    users.value = users.value.filter((user) => user.id !== userId);
    showMessage("تم حذف المستخدم بنجاح");
  } catch (error) {
    console.error("Error deleting user:", error);
    showMessage("خطأ في حذف المستخدم", "danger");
  }
};

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
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

const fetchAllUsers = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/user`,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );
    users.value = response.data;
    initialLoading.value = false;
  } catch (error) {
    console.error("Error fetching users:", error);
    showMessage("خطأ في تحميل بيانات المستخدمين", "danger");
  }
};

onMounted(() => {
  initialLoading.value = true;
  fetchAllUsers();
  // initialLoading.value = false;
});
</script>

<style scoped>
.table {
  background-color: transparent;
}

.th {
  background-color: transparent;
}
</style>
