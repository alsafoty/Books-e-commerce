<template>
  <div>
    <!-- Main Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light" dir="rtl">
      <div
        class="container-fluid justify-content-between"
        style="max-width: 1400px; margin: 0 auto"
      >
        <!-- Brand -->
        <a class="navbar-brand d-flex align-items-center" href="/">
          <img
            src="@/assets/logo.png"
            alt="Logo"
            width="80"
            height="40"
            class="d-inline-block align-text-top"
          />
          <h2 class="ms-2 text-primary mb-0 d-none d-md-block">متجر الكتب</h2>
          <h5 class="ms-2 text-primary mb-0 d-md-none">متجر الكتب</h5>
        </a>

        <!-- Mobile toggle button -->
        <button
          class="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Collapsible content -->
        <div
          class="collapse navbar-collapse justify-content-between"
          id="navbarContent"
        >
          <!-- Search Form -->
          <form
            class="d-flex mx-auto my-3 my-lg-0"
            style="max-width: 400px; width: 100%"
          >
            <div class="input-group">
              <input
                class="form-control"
                type="search"
                placeholder="اسم كتاب / مؤلف"
                aria-label="Search"
                v-model="searchQuery"
              />
              <button
                class="btn btn-outline-primary"
                type="submit"
                @click="searchBooks"
              >
                <i class="bi bi-search"></i>
              </button>
            </div>
          </form>

          <!-- Navigation Items -->
          <div
            class="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 justify-content-end"
          >
            <!-- Cart -->
            <router-link
              to="/cart"
              class="btn btn-light text-primary d-flex flex-row flex-lg-column align-items-center fw-bold text-decoration-none"
            >
              <i class="bi bi-cart-fill fs-5 ms-2 me-lg-0"></i>
              <span class="d-lg-block">المشتريات</span>
            </router-link>

            <!-- Wishlist -->
            <router-link
              to="/wishlist"
              class="btn btn-light text-primary d-flex flex-row flex-lg-column align-items-center fw-bold text-decoration-none"
            >
              <i class="bi bi-heart-fill fs-5 ms-2 me-lg-0"></i>
              <span class="d-lg-block">المفضلة</span>
            </router-link>

            <!-- Login/Profile Section -->
            <router-link
              v-if="!isLoggedIn"
              to="/login"
              class="btn btn-light text-primary d-flex flex-row flex-lg-column align-items-center fw-bold text-decoration-none"
            >
              <i class="bi bi-box-arrow-in-right fs-5 ms-2 me-lg-0"></i>
              <span class="d-lg-block">تسجيل الدخول</span>
            </router-link>

            <!-- User Menu when logged in -->
            <div v-else class="dropdown">
              <button
                @click="toggleUserDropdown"
                class="btn btn-light text-primary fw-bold d-flex flex-row flex-lg-column align-items-center"
                type="button"
                :aria-expanded="isUserDropdownOpen"
                data-bs-toggle="dropdown"
              >
                <i class="bi bi-person-circle fs-5 ms-2 me-lg-0"></i>
                <span class="d-lg-block">{{ userInfo.firstName }}</span>
              </button>
              <ul
                class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3"
                :class="{ show: isUserDropdownOpen }"
                @click="closeUserDropdown"
              >
                <li>
                  <router-link
                    to="/profile"
                    class="dropdown-item text-primary d-flex align-items-center"
                  >
                    <i class="bi bi-person ms-2"></i>
                    الملف الشخصي
                  </router-link>
                </li>
                <li v-if="isAdmin">
                  <router-link
                    to="/dashboard"
                    class="dropdown-item text-primary d-flex align-items-center"
                  >
                    <i class="bi bi-gear ms-2"></i>
                    لوحة التحكم
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/orders"
                    class="dropdown-item text-primary d-flex align-items-center"
                  >
                    <i class="bi bi-bag ms-2"></i>
                    طلباتي
                  </router-link>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <button
                    @click="logout"
                    class="dropdown-item text-primary d-flex align-items-center w-100 border-0 bg-transparent"
                  >
                    <i class="bi bi-box-arrow-right ms-2"></i>
                    تسجيل الخروج
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Categories Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-secondary" dir="rtl">
      <div
        class="container-fluid"
        style="max-width: 1400px; margin: 0 auto; width: 100%"
      >
        <!-- Categories - Desktop (Full Width) -->
        <div
          class="d-none d-lg-flex w-100 justify-content-between align-items-center"
        >
          <!-- Categories taking most of the space -->
          <div
            class="d-flex flex-wrap gap-2 flex-grow-1 justify-content-between"
          >
            <div v-for="category in categories.slice(0, 7)" :key="category.id">
              <router-link
                class="btn btn-secondary text-light fw-bold border-0 text-decoration-none px-3 py-2"
                :to="`/category/${category.id}`"
              >
                {{ category.name }}
              </router-link>
            </div>
            <div v-if="categories.length > 7" class="dropdown flex-shrink-0">
              <button
                class="btn btn-secondary text-light fw-bold border-0 px-3 py-2"
                @click="toggleMoreDropdown"
              >
                المزيد
                <i class="bi bi-chevron-left ms-1"></i>
              </button>
            </div>
          </div>

          <!-- "المزيد" dropdown taking remaining space -->
        </div>

        <!-- Categories - Mobile -->
        <div class="d-lg-none w-100">
          <button
            class="navbar-toggler w-100 border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#categoriesMenu"
            aria-controls="categoriesMenu"
            aria-expanded="false"
            aria-label="Toggle categories"
          >
            <span class="text-light fw-bold">الفئات</span>
            <i class="bi bi-chevron-down text-light ms-2"></i>
          </button>
          <div class="collapse" id="categoriesMenu">
            <div class="d-flex flex-column gap-2 py-3">
              <div
                v-for="category in categories.slice(0, 5)"
                :key="category.id"
              >
                <router-link
                  class="btn btn-outline-light w-100 text-start fw-bold text-decoration-none"
                  :to="`/category/${category.id}`"
                >
                  {{ category.name }}
                </router-link>
              </div>
              <div v-if="categories.length > 5">
                <router-link
                  class="btn btn-outline-light w-100 text-start fw-bold text-decoration-none"
                  to="/categories"
                >
                  عرض المزيد
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, onUnmounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const categories = ref([]);
const isUserDropdownOpen = ref(false);
const isMoreDropdownOpen = ref(false); // Added for "المزيد" dropdown
const userInfo = ref({});

const isAdmin = computed(() => {
  const user = localStorage.getItem("userInfo");
  return user && JSON.parse(user).role === "ADMIN";
});

const isLoggedIn = computed(() => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("userInfo");
  return token && user;
});

const searchQuery = ref("");

const searchBooks = async (event) => {
  event.preventDefault();

  if (!searchQuery.value.trim()) {
    return;
  }

  router.push({
    path: "/products",
    query: { search: searchQuery.value.trim() },
  });
};

const getUserInfo = () => {
  const userInfoString = localStorage.getItem("userInfo");
  if (userInfoString) {
    try {
      userInfo.value = JSON.parse(userInfoString);
    } catch (error) {
      console.error("Error parsing user info:", error);
      userInfo.value = {};
    }
  }
};

const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value;
};

const closeUserDropdown = () => {
  isUserDropdownOpen.value = false;
};

// Added functions for "المزيد" dropdown
const toggleMoreDropdown = () => {
  router.push("/categories");
};

const closeMoreDropdown = () => {
  isMoreDropdownOpen.value = false;
};

const handleClickOutside = (event) => {
  const dropdown = event.target.closest(".dropdown");
  if (!dropdown) {
    isUserDropdownOpen.value = false;
    isMoreDropdownOpen.value = false; // Close both dropdowns
  }
};

const logout = () => {
  closeUserDropdown();
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  userInfo.value = {};
  location.reload();
};

onMounted(async () => {
  getUserInfo();
  document.addEventListener("click", handleClickOutside);

  try {
    const { data } = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/category`
    );
    categories.value = data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    categories.value = [];
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
