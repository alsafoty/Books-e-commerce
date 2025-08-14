<template>
  <div class="category-home-list">
    <div
      class="container-fluid px-3 px-md-4"
      style="max-width: 1400px; margin: 0 auto"
    >
      <div
        class="d-flex flex-row justify-content-between align-items-start align-items-md-center border-bottom border-2 border-primary mb-4 pb-3"
      >
        <h1 class="fw-bold mb-3 mb-0">تسوق حسب الفئة</h1>
        <button
          class="btn btn-outline-primary fs-5 fs-md-4"
          @click="goToCategories"
        >
          عرض الكل
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">جاري التحميل...</span>
        </div>
        <p class="mt-3 text-muted">جاري تحميل الفئات...</p>
      </div>

      <!-- Categories Grid -->
      <div class="categories-content" dir="rtl" v-else>
        <div class="row g-3 g-md-4 justify-content-center">
          <div
            v-for="category in categories.slice(0, 9)"
            :key="category.id"
            class="col-4 col-md-3 col-lg-2"
          >
            <!-- Category Image -->
            <div
              class="category-image-container position-relative overflow-hidden border-5 border-secondary"
            >
              <img
                :src="category.CategoryImage?.url || 'placeholder-image.jpg'"
                :alt="category.name"
                class="img-fluid category-img"
                style="width: 100%; object-fit: cover"
              />

              <!-- Overlay -->
              <div
                class="overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center opacity-0"
                style="background: rgba(0, 0, 0, 0.3)"
              >
                <button
                  @click="goToCategory(category)"
                  class="btn btn-light btn-sm rounded-3 px-2 px-md-3 py-1 py-md-2"
                  style="font-size: 0.7rem"
                >
                  <div class="fw-bold text-center">{{ category.name }}</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const loading = ref(true);
const categories = ref([]);
const router = useRouter();

const fetchCategories = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("token");

    // Fetch categories for this category
    const categoriesResponse = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/category/`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (categoriesResponse.data && categoriesResponse.data.length > 0) {
      categories.value = categoriesResponse.data;
    } else {
      categories.value = [];
    }
  } catch (error) {
    console.error("Error fetching category categories:", error);
    if (error.response?.status === 404) {
      showMessage("الفئة المطلوبة غير موجودة", "danger");
      router.push("/categories");
    }
  } finally {
    loading.value = false;
  }
};
const goToCategories = () => {
  router.push("/categories");
};
const goToCategory = (category) => {
  router.push(`/category/${category.id}`);
};

onMounted(async () => {
  // Fetch categories for this category
  await fetchCategories();
});
</script>

<style scoped>
.category-img {
  height: 120px;
}

@media (min-width: 768px) {
  .category-img {
    height: 160px;
  }
}

@media (min-width: 992px) {
  .category-img {
    height: 180px;
  }
}

.category-image-container {
  transition: all 0.3s ease;
  border: 1px solid transparent;
  border-radius: 100%;
}

.category-category-image-container:hover {
  border-color: #dee2e6;
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  border-radius: 100%;
}

.category-image-container:hover .overlay {
  opacity: 1 !important;
  border-radius: 100%;
}

.overlay {
  background: rgba(0, 0, 0, 0.6);
  transition: opacity 0.3s ease;
  border-radius: 100%;
}

.category-image-container {
  border-radius: 100%;
  overflow: hidden;
}

.empty-state-card {
  border: 1px solid #e9ecef;
  border-radius: 100%;
}

.z-index-2 {
  z-index: 2;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .category-image-container {
    margin-bottom: 1rem;
    border-radius: 100%;
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

.category-image-container {
  animation: fadeIn 0.5s ease forwards;
  border-radius: 100%;
}
</style>
