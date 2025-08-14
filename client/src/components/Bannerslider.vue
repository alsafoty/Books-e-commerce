<template>
  <div
    id="carouselBanners"
    class="carousel slide carousel-fade my-3"
    data-bs-ride="carousel"
    style="max-width: 1400px; margin: 0 auto"
  >
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">جاري التحميل...</span>
      </div>
    </div>

    <div v-else-if="activeBanners.length === 0" class="text-center py-5">
      <i class="bi bi-image text-muted" style="font-size: 3rem"></i>
      <p class="text-muted mt-3">لا توجد صور عرض متاحة حالياً</p>
    </div>

    <div v-else>
      <div class="carousel-inner rounded-3 shadow">
        <div
          v-for="(banner, index) in activeBanners"
          :key="banner.id"
          class="carousel-item"
          :class="{ active: index === 0 }"
        >
          <a
            v-if="banner.href"
            :href="banner.href"
            target="_blank"
            rel="noopener noreferrer"
            class="d-block text-decoration-none"
          >
            <img
              :src="banner.url"
              class="d-block w-100 banner-image"
              :alt="'Banner ' + (index + 1)"
              loading="lazy"
            />
          </a>

          <img
            v-else
            :src="banner.url"
            class="d-block w-100 banner-image"
            :alt="'Banner ' + (index + 1)"
            loading="lazy"
          />
        </div>
      </div>

      <template v-if="activeBanners.length > 1">
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselBanners"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">السابق</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselBanners"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">التالي</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { routeLocationKey } from "vue-router";

const activeBanners = ref([]);
const loading = ref(true);

const fetchActiveBanners = async () => {
  try {
    loading.value = true;
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/banner/active`
    );
    activeBanners.value = response.data.banners || [];
  } catch (error) {
    console.error("Error fetching active banners:", error);
    activeBanners.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchActiveBanners();
});
</script>

<style scoped>
.banner-image {
  height: 600px;
  object-fit: cover;
  object-position: center;
}

/* Responsive banner heights */
@media (max-width: 767.98px) {
  .banner-image {
    height: 250px;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .banner-image {
    height: 350px;
  }
}

@media (min-width: 992px) and (max-width: 1199.98px) {
  .banner-image {
    height: 450px;
  }
}

@media (min-width: 1200px) {
  .banner-image {
    height: 600px;
  }
}

/* Carousel enhancements */
.carousel-item {
  transition: transform 0.6s ease-in-out;
}

.carousel-control-prev,
.carousel-control-next {
  width: 5%;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.carousel-control-prev:hover,
.carousel-control-next:hover {
  opacity: 1;
}

.carousel-indicators {
  bottom: 10px;
}

.carousel-indicators [data-bs-target] {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 3px;
}

/* Loading and empty states */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Ensure carousel maintains aspect ratio */
.carousel-inner {
  position: relative;
  overflow: hidden;
}

/* Link styling for banners */
a.d-block:hover .banner-image {
  transform: scale(1.02);
  transition: transform 0.3s ease;
}
</style>
