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

    <div
      class="mb-3"
      v-if="!showEditCategory && !showAddCategory && !initialLoading"
    >
      <div class="d-block d-md-none mb-3">
        <button class="btn btn-primary w-100 py-2" @click="handleAddCategory">
          <i class="bi bi-plus-circle me-2"></i>
          إضافة فئة جديدة
        </button>
      </div>

      <div class="search-container my-3">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="البحث في الفئات |   يمكنك البحث بالاسم أو الوصف"
            v-model="searchQuery"
            aria-label="البحث في الفئات"
          />
          <span class="input-group-text">
            <i class="bi bi-search text-muted"></i>
          </span>
        </div>
      </div>
    </div>

    <!-- Mobile View -->
    <div
      class="d-block d-md-none"
      v-if="!showEditCategory && !showAddCategory && !initialLoading"
    >
      <div v-if="filteredCategories.length === 0" class="text-center py-4">
        <i class="bi bi-search text-muted" style="font-size: 2rem"></i>
        <p class="text-muted mt-2 mb-0">لا توجد فئات تطابق البحث</p>
        <small class="text-muted">جرب مصطلحات بحث أخرى</small>
      </div>

      <div class="row g-3" v-else>
        <div
          class="col-12"
          v-for="category in filteredCategories"
          :key="category.id"
        >
          <div class="card">
            <div class="card-body">
              <div
                class="d-flex justify-content-between align-items-start mb-2"
              >
                <h6 class="card-title mb-1">{{ category.name }}</h6>
                <span class="badge bg-primary">{{ category.id }}</span>
              </div>
              <p class="card-text text-muted small mb-2">
                {{
                  category.description && category.description.length > 80
                    ? category.description.substring(0, 77) + "..."
                    : category.description || "لا يوجد وصف"
                }}
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <small class="text-muted">
                    تاريخ الإنشاء: {{ formatDate(category.createdAt) }}
                  </small>
                </div>
                <div class="d-flex gap-1">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    :title="'تعديل ' + category.name"
                    @click="handleEditCategory(category)"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    :title="'حذف ' + category.name"
                    @click="showDeleteConfirmation(category.id)"
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

    <!-- Desktop View -->
    <div
      class="d-none d-md-block table-responsive flex-grow-1"
      v-if="!showEditCategory && !showAddCategory && !initialLoading"
    >
      <div v-if="filteredCategories.length === 0" class="text-center py-5">
        <i class="bi bi-search text-muted" style="font-size: 3rem"></i>
        <h5 class="text-muted mt-3 mb-2">لا توجد فئات تطابق البحث</h5>
        <p class="text-muted">
          جرب مصطلحات بحث أخرى أو امسح مربع البحث لعرض جميع الفئات
        </p>
      </div>

      <table class="table table-hover mb-0" v-else>
        <thead class="thead-primary sticky-top">
          <tr class="bg-primary text-white">
            <th scope="col" class="d-none d-lg-table-cell" style="width: 60px">
              <div class="text-primary">الرقم</div>
            </th>
            <th scope="col" style="min-width: 200px">
              <div class="text-primary">اسم الفئة</div>
            </th>
            <th
              scope="col"
              class="d-none d-lg-table-cell"
              style="min-width: 400px"
            >
              <div class="text-primary">الوصف</div>
            </th>
            <th scope="col" class="d-none d-xl-table-cell" style="width: 120px">
              <div class="text-primary">تاريخ الإنشاء</div>
            </th>
            <th scope="col" style="width: 100px">
              <div class="text-primary">الإجراءات</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="category in filteredCategories"
            :key="category.id"
            class="align-middle"
          >
            <th scope="row" class="fw-normal d-none d-lg-table-cell">
              {{ category.id }}
            </th>
            <td
              class="text-truncate"
              style="max-width: 120px"
              :title="category.name"
            >
              {{ category.name }}

              <br class="d-md-block d-xl-none" />
              <small class="text-muted d-md-inline d-xl-none">{{
                formatDate(category.createdAt)
              }}</small>
            </td>
            <td
              class="text-truncate d-none d-lg-table-cell"
              style="max-width: 200px"
              :title="category.description"
            >
              {{
                category.description && category.description.length > 50
                  ? category.description.substring(0, 47) + "..."
                  : category.description || "لا يوجد وصف"
              }}
            </td>
            <td class="text-nowrap d-none d-xl-table-cell">
              {{ formatDate(category.createdAt) }}
            </td>
            <td>
              <div class="d-flex gap-1 justify-content-center">
                <button
                  class="btn btn-sm btn-outline-primary"
                  :title="'تعديل ' + category.name"
                  @click="handleEditCategory(category)"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  :title="'حذف ' + category.name"
                  @click="showDeleteConfirmation(category.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="mt-3 border-top pt-3 d-none d-md-block"
      v-if="!showAddCategory && !showEditCategory && !initialLoading"
    >
      <button
        class="btn btn-primary w-100 py-2 mb-2"
        @click="handleAddCategory"
      >
        <i class="bi bi-plus-circle me-2"></i>
        إضافة فئة جديدة
      </button>
    </div>

    <!-- Edit/ Add Category Modal -->
    <div class="" v-if="showEditCategory || showAddCategory">
      <h3 class="border-bottom border-2 border-dark my-3 text-center">
        {{ showEditCategory ? "تعديل الفئة" : "إضافة فئة جديدة" }}
      </h3>
      <form
        @submit.prevent="showEditCategory ? updateCategory() : addCategory()"
      >
        <div class="mb-3">
          <label for="categoryName" class="form-label">اسم الفئة *</label>
          <input
            type="text"
            class="form-control"
            id="categoryName"
            v-model="editingCategory.name"
            required
            :class="{
              'is-invalid': showAddCategory && !editingCategory.name.trim(),
            }"
          />
          <div
            class="invalid-feedback"
            v-if="showAddCategory && !editingCategory.name.trim()"
          >
            اسم الفئة مطلوب
          </div>
        </div>
        <div class="mb-3">
          <label for="categoryDescription" class="form-label">الوصف</label>
          <textarea
            class="form-control"
            id="categoryDescription"
            v-model="editingCategory.description"
            rows="3"
            placeholder="وصف اختياري للفئة..."
          ></textarea>
          <small class="text-muted"
            >يمكنك ترك هذا الحقل فارغاً إذا لم تكن تريد إضافة وصف</small
          >
        </div>
        <div class="d-flex justify-content-center gap-2">
          <button
            type="submit"
            class="btn btn-primary mb-3"
            :disabled="loading || (showAddCategory && !isFormValid)"
            @click.prevent="showEditCategory ? updateCategory() : addCategory()"
          >
            {{ showEditCategory ? "تحديث الفئة" : "إضافة الفئة" }}
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
            @click="
              showEditCategory = false;
              showAddCategory = false;
            "
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
const categories = ref([]);
const editingCategory = ref({
  name: "",
  description: "",
});
const loading = ref(false);
const showEditCategory = ref(false);
const showAddCategory = ref(false);
const searchQuery = ref("");
const initialLoading = ref(true);

// Computed property for filtered categories
const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return categories.value;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return categories.value.filter(
    (category) =>
      category.name.toLowerCase().includes(query) ||
      (category.description &&
        category.description.toLowerCase().includes(query))
  );
});

// Computed property to check if form is valid
const isFormValid = computed(() => {
  return editingCategory.value.name.trim() !== "";
});

const handleAddCategory = () => {
  editingCategory.value = {
    name: "",
    description: "",
  };
  showEditCategory.value = false;
  showAddCategory.value = true;
};

const handleEditCategory = (category) => {
  editingCategory.value = { ...category };
  showEditCategory.value = true;
  showAddCategory.value = false;
};

const addCategory = async () => {
  try {
    // Comprehensive validation
    if (!editingCategory.value.name.trim()) {
      showMessage("اسم الفئة مطلوب", "danger");
      return;
    }

    loading.value = true;

    const categoryData = {
      name: editingCategory.value.name.trim(),
      description: editingCategory.value.description.trim() || null,
    };

    await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/category`,
      categoryData,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    showMessage("تم إضافة الفئة بنجاح");
    fetchAllCategories();

    // Reset form after successful addition
    editingCategory.value = {
      name: "",
      description: "",
    };
    showAddCategory.value = false;
  } catch (error) {
    console.error("Error adding category:", error);
    showMessage("حدث خطأ في إضافة الفئة", "danger");
  } finally {
    loading.value = false;
  }
};

const updateCategory = async () => {
  try {
    loading.value = true;

    const categoryData = {
      name: editingCategory.value.name.trim(),
      description: editingCategory.value.description.trim() || null,
    };

    await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/category/${editingCategory.value.id}`,
      categoryData,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Update the category in the categories array
    const index = categories.value.findIndex(
      (category) => category.id === editingCategory.value.id
    );
    if (index !== -1) {
      categories.value[index] = { ...editingCategory.value, ...categoryData };
    }

    // Reset form
    editingCategory.value = {
      name: "",
      description: "",
    };
    showEditCategory.value = false;
    showMessage("تم تحديث الفئة بنجاح");
    fetchAllCategories(); // Refresh the category list
  } catch (error) {
    console.error("Error updating category:", error);
    showMessage("خطأ في تحديث الفئة", "danger");
  } finally {
    loading.value = false;
  }
};

const showDeleteConfirmation = (categoryId) => {
  if (confirm("هل أنت متأكد أنك تريد حذف هذه الفئة؟")) {
    deleteCategory(categoryId);
  }
};

const deleteCategory = async (categoryId) => {
  try {
    await axios.delete(
      `${process.env.VUE_APP_API_BASE_URL}/category/${categoryId}`,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );

    categories.value = categories.value.filter(
      (category) => category.id !== categoryId
    );
    showMessage("تم حذف الفئة بنجاح");
  } catch (error) {
    if (error.status === 400) {
      showMessage(
        "لا يمكن حذف الفئة لأنها تحتوي على منتجات، أزل منتجات الفئة أولاً",
        "danger"
      );
    } else {
      console.error("Error deleting category:", error);
      showMessage("خطأ في حذف الفئة", "danger");
    }
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

const fetchAllCategories = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/category`
    );
    categories.value = response.data;
    initialLoading.value = false;
  } catch (error) {
    console.error("Error fetching categories:", error);
    showMessage("خطأ في تحميل الفئات", "danger");
  }
};

onMounted(() => {
  initialLoading.value = true;
  fetchAllCategories();
});
</script>
