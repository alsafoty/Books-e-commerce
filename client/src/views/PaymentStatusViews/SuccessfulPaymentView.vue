<template>
  <div class="payment-success-page">
    <Navbar />

    <!-- Success Section -->
    <div class="success-section py-5" dir="rtl">
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <!-- Success Card -->
            <div
              class="success-card text-center p-5 rounded-4 shadow-lg border-0"
            >
              <!-- Success Message -->
              <h1 class="display-4 fw-bold text-success mb-3">
                تم الدفع بنجاح! 🎉
              </h1>

              <h4 class="fw-semibold text-dark mb-4">
                شكراً لك على الشراء من متجرنا
              </h4>

              <p class="text-muted fs-5 mb-4 lh-lg">
                تم استلام دفعتك وتأكيد طلبك بنجاح. سنبدأ في تحضير طلبك فوراً
                وسوف نقوم بإرساله إليك في أقرب وقت ممكن.
              </p>

              <!-- Loading -->
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">جاري التحميل...</span>
                </div>
                <p class="mt-3 text-muted">جاري تحميل تفاصيل الطلب...</p>
              </div>

              <div
                v-if="orderDetails"
                class="card shadow-sm border-0 rounded-4 mb-4"
                dir="rtl"
              >
                <div class="card-body bg-white rounded-4">
                  <h5
                    class="fw-bold text-primary mb-4 d-flex align-items-center"
                  >
                    <i class="bi bi-receipt ms-2"></i>
                    تفاصيل الطلب
                  </h5>

                  <div class="row g-4 text-md-end text-center">
                    <!-- العمود الأول -->
                    <div class="col-md-6">
                      <p class="mb-2">
                        <span class="fw-semibold text-secondary"
                          >رقم الطلب:</span
                        >
                        <span class="text-primary fw-bold ms-2">
                          #{{ orderDetails.id?.slice(-8).toUpperCase() }}
                        </span>
                      </p>
                      <p class="mb-2">
                        <span class="fw-semibold text-secondary ms-2"
                          >التاريخ:</span
                        >
                        <span class="text-dark">
                          {{ formatDate(orderDetails.createdAt) }}
                        </span>
                      </p>
                    </div>

                    <!-- العمود الثاني -->
                    <div class="col-md-6">
                      <p class="mb-2">
                        <span class="fw-semibold text-secondary ms-2"
                          >المبلغ المدفوع:</span
                        >
                        <span class="text-success fw-bold">
                          {{ orderDetails.totalAmount?.toFixed(2) }} د. أ
                        </span>
                      </p>
                      <p class="mb-2">
                        <span class="fw-semibold text-secondary ms-2"
                          >حالة الطلب:</span
                        >
                        <span class="badge bg-info rounded-pill px-3 py-2">
                          تم التأكيد
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- What's Next Section -->
              <div
                class="whats-next bg-primary bg-opacity-10 rounded-4 p-4 mb-4"
              >
                <h5 class="fw-bold text-primary mb-3">
                  <i class="bi bi-clock-history me-2"></i>
                  ماذا بعد؟
                </h5>
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <div class="step-item">
                      <div
                        class="step-icon bg-primary text-white rounded-4 mb-2"
                      >
                        <i class="bi bi-box-seam"></i>
                      </div>
                      <h6 class="fw-semibold">تحضير الطلب</h6>
                      <small class="text-muted"
                        >سنبدأ في تحضير وتغليف منتجاتك</small
                      >
                    </div>
                  </div>
                  <div class="col-md-4 mb-3">
                    <div class="step-item">
                      <div class="step-icon bg-info text-white rounded-4 mb-2">
                        <i class="bi bi-truck"></i>
                      </div>
                      <h6 class="fw-semibold">الشحن</h6>
                      <small class="text-muted"
                        >سيتم شحن الطلب خلال 1-2 أيام عمل</small
                      >
                    </div>
                  </div>
                  <div class="col-md-4 mb-3">
                    <div class="step-item">
                      <div
                        class="step-icon bg-success text-white rounded-4 mb-2"
                      >
                        <i class="bi bi-house-door"></i>
                      </div>
                      <h6 class="fw-semibold">التسليم</h6>
                      <small class="text-muted"
                        >ستصلك المنتجات خلال 3-5 أيام</small
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div
                class="action-buttons d-flex flex-column flex-sm-row gap-3 justify-content-center"
              >
                <router-link
                  to="/orders"
                  class="btn btn-primary btn-lg rounded-pill px-4"
                >
                  <i class="bi bi-bag-check me-2"></i>
                  عرض طلباتي
                </router-link>

                <router-link
                  to="/"
                  class="btn btn-outline-primary btn-lg rounded-pill px-4"
                >
                  <i class="bi bi-house me-2"></i>
                  العودة للرئيسية
                </router-link>
              </div>
            </div>

            <!-- Additional Info Cards -->
            <div class="row g-4 mt-4">
              <div class="col-md-4">
                <div
                  class="info-card text-center p-4 rounded-4 shadow-sm border-0 h-100"
                >
                  <i class="bi bi-shield-check display-4 text-success mb-3"></i>
                  <h5 class="fw-bold">دفع آمن</h5>
                  <p class="text-muted small">
                    معاملتك محمية بأحدث تقنيات الأمان
                  </p>
                </div>
              </div>
              <div class="col-md-4">
                <div
                  class="info-card text-center p-4 rounded-4 shadow-sm border-0 h-100"
                >
                  <i class="bi bi-award display-4 text-primary mb-3"></i>
                  <h5 class="fw-bold">جودة مضمونة</h5>
                  <p class="text-muted small">
                    جميع منتجاتنا أصلية ومضمونة الجودة
                  </p>
                </div>
              </div>
              <div class="col-md-4">
                <div
                  class="info-card text-center p-4 rounded-4 shadow-sm border-0 h-100"
                >
                  <i class="bi bi-headset display-4 text-info mb-3"></i>
                  <h5 class="fw-bold">دعم مستمر</h5>
                  <p class="text-muted small">
                    فريق خدمة العملاء متاح 24/7 لمساعدتك
                  </p>
                </div>
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
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import Navbar from "@/components/Navbar.vue";

const router = useRouter();
const route = useRoute();

document.title = "متجر الكتب | عملية شراء ناجحة";

// State
const orderDetails = ref(null);
const loading = ref(false);

// Get order details from query params or API
const getOrderDetails = async () => {
  try {
    loading.value = true;

    // Check if order ID is in query params
    const orderId = route.query.orderId;

    if (orderId) {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/order/${orderId}`,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          orderDetails.value = response.data.order;
        }
      }
    } else {
      // If no specific order ID, create a generic success message
      orderDetails.value = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        totalAmount: 0,
      };
    }
    console.log("Order Details:", orderDetails.value);
  } catch (error) {
    console.error("Error fetching order details:", error);
    // Still show success page even if we can't fetch order details
    orderDetails.value = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      totalAmount: 0,
    };
  } finally {
    loading.value = false;
  }
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "الآن";

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
    return "الآن";
  }
};

// Component mounted
onMounted(() => {
  getOrderDetails();

  // Add confetti effect
  if (typeof confetti !== "undefined") {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
});
</script>
