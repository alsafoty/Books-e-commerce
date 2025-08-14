<template>
  <div
    class="dashboard container d-flex flex-column bg-light rounded-3"
    style="width: 1250px; margin: 0 auto; padding: 0"
  >
    <div class="row mb-4">
      <div class="col-12">
        <div class="bg-secondary text-light p-3 rounded-top">
          <h3 class="mb-0 fw-bold text-center">إحصائات المبيعات</h3>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4" style="width: 95%; margin: 0 auto">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-info text-white text-center py-3">
            <i class="bi bi-box fs-4 mb-2"></i>
            <h5 class="mb-0 fw-bold">عدد المنتجات</h5>
          </div>
          <div class="card-body text-center py-4">
            <h2 class="text-info fw-bold mb-0">{{ productCount }}</h2>
            <small class="text-muted">منتج متاح</small>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-success text-white text-center py-3">
            <i class="bi bi-cart fs-4 mb-2"></i>
            <h5 class="mb-0 fw-bold">عدد عمليات البيع</h5>
          </div>
          <div class="card-body text-center py-4">
            <h2 class="text-success fw-bold mb-0">{{ orderCount }}</h2>
            <small class="text-muted">عملية بيع مكتملة</small>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-warning text-white text-center py-3">
            <i class="bi bi-currency-dollar fs-4 mb-2"></i>
            <h5 class="mb-0 fw-bold">إجمالي المبيعات</h5>
          </div>
          <div class="card-body text-center py-4">
            <h2 class="text-warning fw-bold mb-0">
              {{ totalSales.toFixed(2) }}
            </h2>
            <small class="text-muted">د. أ</small>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-12">
        <div class="bg-secondary text-light p-3">
          <h3 class="mb-0 fw-bold text-center">التحكم في صور العرض</h3>
        </div>
      </div>
    </div>

    <!-- Banner Management Section -->
    <div class="row" style="width: 95%; margin: 0 auto">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-0">
            <!-- Loading -->
            <div v-if="initialLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">جاري التحميل...</span>
              </div>
              <p class="mt-3 text-muted">جاري تحميل البيانات...</p>
            </div>

            <!-- Banner Management Content -->
            <div v-else class="p-3">
              <!-- Header Section with Search and Mobile Add Button -->
              <div class="mb-3" v-if="!showEditBanner && !showAddBanner">
                <!-- Mobile Add Button (visible only on small screens) -->
                <div class="d-block d-md-none mb-3">
                  <button
                    class="btn btn-primary w-100 py-2"
                    @click="handleAddBanner"
                  >
                    <i class="bi bi-plus-circle me-2"></i>
                    إضافة صورة عرض جديدة
                  </button>
                </div>
              </div>

              <!-- Mobile Cards View (visible on small screens) -->
              <div
                class="d-block d-md-none"
                v-if="!showEditBanner && !showAddBanner"
              >
                <!-- No results message for mobile -->
                <div
                  v-if="filteredBanners.length === 0"
                  class="text-center py-4"
                >
                  <i
                    class="bi bi-search text-muted"
                    style="font-size: 2rem"
                  ></i>
                  <p class="text-muted mt-2 mb-0">
                    لا توجد صور عرض تطابق البحث
                  </p>
                  <small class="text-muted">جرب مصطلحات بحث أخرى</small>
                </div>

                <div class="row g-3" v-else>
                  <div
                    class="col-12"
                    v-for="banner in filteredBanners"
                    :key="banner.id"
                  >
                    <div class="card">
                      <div class="card-body">
                        <div class="row align-items-center">
                          <div class="col-4">
                            <img
                              :src="banner.url"
                              class="img-fluid rounded"
                              style="
                                height: 80px;
                                object-fit: cover;
                                width: 100%;
                              "
                              :alt="'Banner ' + banner.id"
                            />
                          </div>
                          <div class="col-8">
                            <div
                              class="d-flex justify-content-between align-items-start mb-2"
                            >
                              <div>
                                <span
                                  class="badge"
                                  :class="
                                    banner.isActive
                                      ? 'bg-success'
                                      : 'bg-warning'
                                  "
                                >
                                  {{ banner.isActive ? "نشط" : "غير نشط" }}
                                </span>
                              </div>
                            </div>
                            <p
                              class="card-text text-muted small mb-2"
                              v-if="banner.href"
                            >
                              الرابط:
                              {{
                                banner.href.length > 30
                                  ? banner.href.substring(0, 30) + "..."
                                  : banner.href
                              }}
                            </p>
                            <p class="card-text text-muted small mb-2" v-else>
                              لا يوجد رابط
                            </p>
                            <div class="d-flex gap-1">
                              <button
                                class="btn btn-sm btn-outline-warning"
                                :title="
                                  banner.isActive
                                    ? 'إلغاء تفعيل الصورة'
                                    : 'تفعيل الصورة'
                                "
                                @click="toggleBannerStatus(banner)"
                              >
                                <i
                                  :class="
                                    banner.isActive
                                      ? 'bi bi-eye-slash'
                                      : 'bi bi-eye'
                                  "
                                ></i>
                              </button>
                              <button
                                class="btn btn-sm btn-outline-primary"
                                :title="'تعديل الصورة'"
                                @click="handleEditBanner(banner)"
                              >
                                <i class="bi bi-pencil-square"></i>
                              </button>
                              <button
                                class="btn btn-sm btn-outline-danger"
                                :title="'حذف الصورة'"
                                @click="showDeleteConfirmation(banner.id)"
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
              </div>

              <!-- Desktop Table View (hidden on small screens) -->
              <div
                class="d-none d-md-block table-responsive"
                v-if="!showEditBanner && !showAddBanner"
              >
                <!-- Desktop Add Button -->
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <h5 class="mb-0">إدارة صور العرض</h5>
                  <button class="btn btn-primary" @click="handleAddBanner">
                    <i class="bi bi-plus-circle me-2"></i>
                    إضافة صورة عرض جديدة
                  </button>
                </div>

                <!-- No results message for desktop -->
                <div
                  v-if="filteredBanners.length === 0"
                  class="text-center py-5"
                >
                  <i
                    class="bi bi-search text-muted"
                    style="font-size: 3rem"
                  ></i>
                  <h5 class="text-muted mt-3 mb-2">
                    لا توجد صور عرض تطابق البحث
                  </h5>
                  <p class="text-muted">
                    جرب مصطلحات بحث أخرى أو امسح مربع البحث لعرض جميع الصور
                  </p>
                </div>

                <table class="table table-hover mb-0" v-else>
                  <thead class="table-light">
                    <tr>
                      <th scope="col" style="width: 120px">معاينة الصورة</th>
                      <th scope="col">الرابط</th>
                      <th scope="col" style="width: 100px">الحالة</th>
                      <th scope="col" style="width: 120px">تاريخ الإضافة</th>
                      <th scope="col" style="width: 150px">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="banner in filteredBanners"
                      :key="banner.id"
                      class="align-middle"
                    >
                      <td>
                        <img
                          :src="banner.url"
                          class="img-thumbnail"
                          style="height: 60px; width: 100px; object-fit: cover"
                          :alt="'Banner ' + banner.id"
                        />
                      </td>
                      <td class="text-truncate" style="max-width: 200px">
                        <span v-if="banner.href" :title="banner.href">
                          {{ banner.href }}
                        </span>
                        <span v-else class="text-muted fst-italic"
                          >لا يوجد رابط</span
                        >
                      </td>
                      <td class="text-center">
                        <span
                          class="badge"
                          :class="banner.isActive ? 'bg-success' : 'bg-warning'"
                        >
                          {{ banner.isActive ? "نشط" : "غير نشط" }}
                        </span>
                      </td>
                      <td class="text-nowrap">
                        {{ formatDate(banner.createdAt) }}
                      </td>
                      <td>
                        <div class="d-flex gap-1 justify-content-center">
                          <button
                            class="btn btn-sm btn-outline-warning"
                            :title="
                              banner.isActive
                                ? 'إلغاء تفعيل الصورة'
                                : 'تفعيل الصورة'
                            "
                            @click="toggleBannerStatus(banner)"
                          >
                            <i
                              :class="
                                banner.isActive
                                  ? 'bi bi-eye-slash'
                                  : 'bi bi-eye'
                              "
                            ></i>
                          </button>
                          <button
                            class="btn btn-sm btn-outline-primary"
                            :title="'تعديل الصورة'"
                            @click="handleEditBanner(banner)"
                          >
                            <i class="bi bi-pencil-square"></i>
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            :title="'حذف الصورة'"
                            @click="showDeleteConfirmation(banner.id)"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Add Banner Form -->
              <div v-if="showAddBanner">
                <h3 class="border-bottom border-2 border-dark my-3 text-center">
                  إضافة صورة عرض جديدة
                </h3>
                <form @submit.prevent="addBanner()">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="bannerImage" class="form-label"
                          >صورة العرض *</label
                        >
                        <input
                          type="file"
                          class="form-control"
                          id="bannerImage"
                          accept="image/*"
                          ref="bannerImageInput"
                          @change="handleImageChange"
                          required
                          :class="{ 'is-invalid': imageError }"
                        />
                        <div class="form-text">
                          الحجم المطلوب: 1400 × 600 بكسل بالضبط
                        </div>
                        <div class="invalid-feedback" v-if="imageError">
                          {{ imageError }}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="bannerHref" class="form-label"
                          >رابط الانتقال (اختياري)</label
                        >
                        <input
                          type="url"
                          class="form-control"
                          id="bannerHref"
                          v-model="newBanner.href"
                          placeholder="https://example.com"
                        />
                        <div class="form-text">
                          الرابط الذي سيتم الانتقال إليه عند النقر على الصورة
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Image Preview -->
                  <div class="mb-3" v-if="imagePreview">
                    <label class="form-label">معاينة الصورة:</label>
                    <div class="border rounded p-2">
                      <img
                        :src="imagePreview"
                        class="img-fluid rounded"
                        style="max-height: 200px; width: auto"
                        alt="معاينة صورة العرض"
                      />
                      <div class="mt-2">
                        <small class="text-muted">
                          الأبعاد: {{ imageDimensions.width }} ×
                          {{ imageDimensions.height }} بكسل
                        </small>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex justify-content-center gap-2">
                    <button
                      type="submit"
                      class="btn btn-primary mb-3"
                      :disabled="loading || !isAddFormValid"
                    >
                      إضافة صورة العرض
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
                      @click="cancelAdd"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>

              <!-- Edit Banner Form -->
              <div v-if="showEditBanner">
                <h3 class="border-bottom border-2 border-dark my-3 text-center">
                  تعديل صورة العرض
                </h3>
                <form @submit.prevent="updateBanner()">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label">الصورة الحالية:</label>
                        <div class="border rounded p-2">
                          <img
                            :src="editingBanner.url"
                            class="img-fluid rounded"
                            style="max-height: 150px; width: auto"
                            :alt="'Current banner'"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="editBannerHref" class="form-label"
                          >رابط الانتقال</label
                        >
                        <input
                          type="url"
                          class="form-control"
                          id="editBannerHref"
                          v-model="editingBanner.href"
                          placeholder="https://example.com"
                        />
                        <div class="form-text">
                          الرابط الذي سيتم الانتقال إليه عند النقر على الصورة
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="editBannerActive"
                        v-model="editingBanner.isActive"
                      />
                      <label class="form-check-label" for="editBannerActive">
                        صورة العرض نشطة
                      </label>
                    </div>
                    <small class="text-muted">
                      الصور غير النشطة لن تظهر في صور العرض الرئيسية
                    </small>
                  </div>

                  <div class="d-flex justify-content-center gap-2">
                    <button
                      type="submit"
                      class="btn btn-primary mb-3"
                      :disabled="loading"
                    >
                      تحديث صورة العرض
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
import { ref, onMounted, computed } from "vue";
import axios from "axios";

// Stats data
const productCount = ref(0);
const orderCount = ref(0);
const totalSales = ref(0);

// Banner management data
const banners = ref([]);
const newBanner = ref({
  href: "",
});
const editingBanner = ref({
  id: "",
  href: "",
  isActive: true,
});

// UI state
const initialLoading = ref(false);
const loading = ref(false);
const showAddBanner = ref(false);
const showEditBanner = ref(false);
const searchQuery = ref("");
const message = ref("");
const messageType = ref("success");

// Image handling
const imagePreview = ref("");
const imageDimensions = ref({ width: 0, height: 0 });
const imageError = ref("");
const bannerImageInput = ref(null);

const token = localStorage.getItem("token");

// Computed property for filtered banners
const filteredBanners = computed(() => {
  if (!searchQuery.value.trim()) {
    return banners.value;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return banners.value.filter(
    (banner) =>
      (banner.href && banner.href.toLowerCase().includes(query)) ||
      banner.id.toLowerCase().includes(query)
  );
});

// Computed property to check if add form is valid
const isAddFormValid = computed(() => {
  return imagePreview.value && !imageError.value;
});

// Image handling functions
const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (!file) {
    imagePreview.value = "";
    imageDimensions.value = { width: 0, height: 0 };
    imageError.value = "";
    return;
  }

  // Check file type
  if (!file.type.startsWith("image/")) {
    imageError.value = "يرجى اختيار ملف صورة صحيح";
    imagePreview.value = "";
    return;
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    imageError.value = "حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت";
    imagePreview.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      imageError.value = "";
      imagePreview.value = e.target.result;
      imageDimensions.value = { width: img.width, height: img.height };
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

// Banner management functions
const handleAddBanner = () => {
  newBanner.value = {
    href: "",
  };
  imagePreview.value = "";
  imageDimensions.value = { width: 0, height: 0 };
  imageError.value = "";
  showAddBanner.value = true;
  showEditBanner.value = false;
};

const handleEditBanner = (banner) => {
  editingBanner.value = { ...banner };
  showEditBanner.value = true;
  showAddBanner.value = false;
};

const cancelAdd = () => {
  showAddBanner.value = false;
  newBanner.value = { href: "" };
  imagePreview.value = "";
  imageError.value = "";
  if (bannerImageInput.value) {
    bannerImageInput.value.value = "";
  }
};

const cancelEdit = () => {
  showEditBanner.value = false;
  editingBanner.value = { id: "", href: "", isActive: true };
};

const addBanner = async () => {
  try {
    if (!bannerImageInput.value?.files[0]) {
      showMessage("يرجى اختيار صورة للإضافة", "danger");
      return;
    }

    if (imageError.value) {
      showMessage("يرجى تصحيح أخطاء الصورة قبل المتابعة", "danger");
      return;
    }

    loading.value = true;

    const formData = new FormData();
    formData.append("image", bannerImageInput.value.files[0]);
    if (newBanner.value.href.trim()) {
      formData.append("href", newBanner.value.href.trim());
    }

    await axios.post(`${process.env.VUE_APP_API_BASE_URL}/banner`, formData, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // Reset form
    cancelAdd();
    showMessage("تم إضافة صورة العرض بنجاح");
    fetchBanners(); // Refresh the banners list
  } catch (error) {
    console.error("Error adding banner:", error);
    if (error.response?.status === 400) {
      showMessage("خطأ في البيانات المرسلة", "danger");
    } else {
      showMessage("خطأ في إضافة صورة العرض", "danger");
    }
  } finally {
    loading.value = false;
  }
};

const updateBanner = async () => {
  try {
    loading.value = true;

    const updateData = {
      href: editingBanner.value.href?.trim() || null,
      isActive: editingBanner.value.isActive,
    };

    await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/banner/${editingBanner.value.id}`,
      updateData,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Update the banner in the banners array
    const index = banners.value.findIndex(
      (banner) => banner.id === editingBanner.value.id
    );
    if (index !== -1) {
      banners.value[index] = { ...banners.value[index], ...updateData };
    }

    cancelEdit();
    showMessage("تم تحديث صورة العرض بنجاح");
  } catch (error) {
    console.error("Error updating banner:", error);
    showMessage("خطأ في تحديث صورة العرض", "danger");
  } finally {
    loading.value = false;
  }
};

const toggleBannerStatus = async (banner) => {
  try {
    const newStatus = !banner.isActive;
    const confirmMessage = newStatus
      ? `هل أنت متأكد من تفعيل صورة العرض؟`
      : `هل أنت متأكد من إلغاء تفعيل صورة العرض؟`;

    if (!confirm(confirmMessage)) {
      return;
    }

    await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/banner/${banner.id}/status`,
      { isActive: newStatus },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Update the banner in the banners array
    const index = banners.value.findIndex((b) => b.id === banner.id);
    if (index !== -1) {
      banners.value[index].isActive = newStatus;
    }

    showMessage(
      newStatus
        ? "تم تفعيل صورة العرض بنجاح"
        : "تم إلغاء تفعيل صورة العرض بنجاح"
    );
  } catch (error) {
    console.error("Error toggling banner status:", error);
    showMessage("خطأ في تغيير حالة صورة العرض", "danger");
  }
};

const showDeleteConfirmation = (bannerId) => {
  if (
    confirm(
      "هل أنت متأكد أنك تريد حذف صورة العرض؟\n\nتحذير: هذا الإجراء لا يمكن التراجع عنه!"
    )
  ) {
    deleteBanner(bannerId);
  }
};

const deleteBanner = async (bannerId) => {
  try {
    await axios.delete(
      `${process.env.VUE_APP_API_BASE_URL}/banner/${bannerId}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    banners.value = banners.value.filter((banner) => banner.id !== bannerId);
    showMessage("تم حذف صورة العرض بنجاح");
  } catch (error) {
    console.error("Error deleting banner:", error);
    showMessage("خطأ في حذف صورة العرض", "danger");
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

// Fetch data functions
const fetchBanners = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/banner`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    banners.value = response.data.banners || [];
  } catch (error) {
    console.error("Error fetching banners:", error);
    showMessage("خطأ في تحميل بيانات صور العرض", "danger");
  }
};

const fetchDashboardStats = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/order/stats`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    const productcount = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/product/count`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    orderCount.value = response.data.orders.length;
    totalSales.value = response.data.totalAmount;
    productCount.value = productcount.data.totalProducts;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

onMounted(async () => {
  initialLoading.value = true;
  try {
    await Promise.all([fetchDashboardStats(), fetchBanners()]);
  } finally {
    initialLoading.value = false;
  }
});
</script>

<style scoped>
.table th {
  font-size: 0.875rem;
  font-weight: 600;
}

.table td {
  font-size: 0.8rem;
  vertical-align: middle;
}

.table-responsive {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  border-radius: 0.375rem;
}

/* Table responsive improvements */
@media (max-width: 991.98px) {
  .table th,
  .table td {
    font-size: 0.75rem;
    padding: 0.5rem 0.25rem;
  }

  .table-responsive {
    font-size: 0.8rem;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .table th,
  .table td {
    padding: 0.4rem 0.3rem;
  }
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

/* Mobile card styling */
.card {
  border: 1px solid #dee2e6;
  transition: box-shadow 0.15s ease-in-out;
}

.card:hover {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* Search container styling */
.search-container {
  position: relative;
}

.search-container .input-group-text {
  background-color: #f8f9fa;
  border-left: none;
}

.search-container .form-control {
  border-right: none;
}

.search-container .form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.search-container .form-control:focus + .input-group-text {
  border-color: #0d6efd;
}

/* Mobile specific optimizations */
@media (max-width: 767.98px) {
  .dashboard {
    width: 100% !important;
    margin: 0.5rem !important;
    padding: 0.75rem !important;
  }

  .card {
    margin-bottom: 0.75rem;
  }

  .btn-sm {
    padding: 0.125rem 0.375rem;
    font-size: 0.7rem;
  }

  /* Form optimizations for mobile */
  .form-control,
  .form-select {
    font-size: 16px; /* Prevents zoom on iOS */
    padding: 0.5rem 0.75rem;
  }

  .form-label {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .btn {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
}

/* Responsive container width */
@media (min-width: 768px) {
  .dashboard {
    max-width: 750px !important;
  }
}

@media (min-width: 992px) {
  .dashboard {
    max-width: 750px !important;
  }
}

@media (min-width: 1200px) {
  .dashboard {
    max-width: 1200px !important;
  }
}

/* Image preview styling */
.img-thumbnail {
  border: 2px solid #dee2e6;
  border-radius: 0.375rem;
}

/* Banner preview in forms */
.banner-preview {
  max-width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* Form validation styling */
.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
}

/* Dashboard stats cards */
.dashboard .card-header {
  border-bottom: none;
}

.dashboard .card-body h2 {
  font-size: 2.5rem;
}

@media (max-width: 767.98px) {
  .dashboard .card-body h2 {
    font-size: 2rem;
  }
}
</style>
