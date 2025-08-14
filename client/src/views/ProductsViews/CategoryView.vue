<template>
  <div class="category-page">
    <Navbar />

    <!-- Header Section -->
    <div class="category-header bg-light py-4" dir="rtl">
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row align-items-center">
          <div class="col-md-12">
            <div
              class="d-flex flex-row justify-content-between align-items-center"
            >
              <h1 class="display-6 fw-bold text-primary mb-2">
                <i class="bi bi-grid-fill ms-3"></i>
                الفئات
              </h1>

              <div class="text-start">
                <span class="badge bg-primary fs-6">
                  {{ categories.length }} فئة متاحة
                </span>
              </div>
            </div>

            <p class="text-muted mb-0">
              اكتشف منتجاتنا المنظمة حسب الفئات المختلفة
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
      <p class="mt-3 text-muted">جاري تحميل الفئات...</p>
    </div>

    <!-- Empty Categories -->
    <div
      v-else-if="categories.length === 0"
      class="empty-categories text-center py-5"
      dir="rtl"
    >
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="empty-state-card p-5 rounded-4 shadow-sm bg-light">
              <i class="bi bi-grid display-1 text-muted mb-4"></i>
              <h3 class="fw-bold text-dark mb-3">لا توجد فئات متاحة</h3>
              <p class="text-muted mb-4">
                لا توجد فئات منتجات متاحة في الوقت الحالي.
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

    <!-- Categories Grid -->
    <div v-else class="categories-content py-5" dir="rtl">
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row g-4">
          <div
            v-for="category in categories"
            :key="category.id"
            class="col-12 col-md-6 col-lg-4 col-xl-3"
          >
            <div
              class="category-card h-100 bg-white rounded-4 shadow-sm border-0 overflow-hidden position-relative"
            >
              <!-- Category Header -->
              <div class="category-header-card bg-secondary text-white p-4">
                <div class="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 class="fw-bold mb-1">{{ category.name }}</h5>
                    <small class="opacity-75">
                      {{ category.description || "وصف الفئة غير متوفر" }}
                    </small>
                  </div>
                  <img
                    class="category-image rounded-circle"
                    :src="
                      category.CategoryImage?.url || 'placeholder-image.jpg'
                    "
                    style="max-width: 25%; height: auto"
                    alt="Category Image"
                  />
                </div>
              </div>

              <!-- Category Content -->
              <div class="p-4">
                <!-- Action Buttons -->
                <div class="d-grid gap-2">
                  <button
                    @click="viewCategoryProducts(category.id)"
                    class="btn btn-primary"
                  >
                    <i class="bi bi-eye ms-2"></i>
                    عرض المنتجات
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

const categories = ref([]);
const loading = ref(true);
const message = ref("");
const messageType = ref("success");

document.title = "متجر الكتب | الفئات";

const fetchCategories = async () => {
  try {
    loading.value = true;

    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/category`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      categories.value = response.data || [];
    } else {
      showMessage("حدث خطأ في تحميل الفئات", "danger");
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    showMessage("حدث خطأ في الاتصال بالخادم", "danger");
  } finally {
    loading.value = false;
  }
};

const viewCategoryProducts = (categoryId) => {
  // Navigate to category products page
  router.push(`/category/${categoryId}`);
};

const getProductCount = (category) => {
  return category.Product ? category.Product.length : 0;
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
  fetchCategories();
});
</script>

<style scoped>
.category-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.category-header {
  border-bottom: 1px solid #e9ecef;
}

.category-card {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.category-card:hover {
  border-color: #dee2e6;
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.category-icon {
  opacity: 0.7;
}

.category-meta {
  border-top: 1px solid #e9ecef;
  padding-top: 0.75rem;
}

.empty-state-card {
  border: 1px solid #e9ecef;
}

.badge {
  font-size: 0.75rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .category-card {
    margin-bottom: 1rem;
  }

  .category-header-card {
    padding: 1rem;
  }

  .category-icon .bi {
    font-size: 2rem;
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

.category-card {
  animation: fadeIn 0.5s ease forwards;
}
</style>
