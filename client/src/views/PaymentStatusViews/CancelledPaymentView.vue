<template>
  <div class="payment-cancelled-page">
    <Navbar />

    <!-- Cancelled Section -->
    <div class="cancelled-section py-5" dir="rtl">
      <div class="container-fluid" style="max-width: 1400px; margin: 0 auto">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <!-- Cancelled Card -->
            <div
              class="cancelled-card text-center p-5 rounded-4 shadow-lg border-0"
            >
              <!-- Cancelled Message -->
              <h1 class="display-4 fw-bold text-warning mb-3">
                تم إلغاء عملية الدفع 😔
              </h1>

              <h4 class="fw-semibold text-dark mb-4">لم تكتمل عملية الشراء</h4>

              <p class="text-muted fs-5 mb-4 lh-lg">
                تم إلغاء عملية الدفع ولم يتم خصم أي مبلغ من حسابك. منتجاتك ما
                زالت محفوظة في قائمة الطلبات ويمكنك إكمال عملية الشراء في أي
                وقت.
              </p>

              <div class="card shadow-sm border-0 rounded-4 mb-4" dir="rtl">
                <div class="card-body bg-light rounded-4">
                  <h5
                    class="fw-bold text-danger mb-4 d-flex align-items-center"
                  >
                    <i class="bi bi-info-circle ms-2"></i>
                    أسباب محتملة للإلغاء
                  </h5>

                  <div class="row g-4 text-md-end text-center">
                    <!-- العمود الأول -->
                    <div class="col-md-6">
                      <ul class="list-unstyled m-0">
                        <li class="mb-2">
                          <i class="bi bi-check text-muted ms-2"></i>
                          إغلاق صفحة الدفع قبل الانتهاء
                        </li>
                        <li class="mb-2">
                          <i class="bi bi-check text-muted ms-2"></i>
                          انتهاء مهلة الدفع
                        </li>
                        <li class="mb-2">
                          <i class="bi bi-check text-muted ms-2"></i>
                          مشكلة في بيانات البطاقة
                        </li>
                      </ul>
                    </div>

                    <!-- العمود الثاني -->
                    <div class="col-md-6">
                      <ul class="list-unstyled m-0">
                        <li class="mb-2">
                          <i class="bi bi-check text-muted ms-2"></i>
                          رصيد غير كافي
                        </li>
                        <li class="mb-2">
                          <i class="bi bi-check text-muted ms-2"></i>
                          مشكلة في الاتصال
                        </li>
                        <li class="mb-2">
                          <i class="bi bi-check text-muted ms-2"></i>
                          إلغاء متعمد من المستخدم
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Next Steps Section -->
              <div
                class="next-steps bg-warning bg-opacity-10 rounded-4 p-4 mb-4"
              >
                <h5 class="fw-bold text-warning mb-3">
                  <i class="bi bi-lightbulb me-2"></i>
                  ماذا يمكنك فعله الآن؟
                </h5>
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <div class="step-item">
                      <div
                        class="step-icon bg-warning text-white rounded-4 mb-2"
                      >
                        <i class="bi bi-cart-check"></i>
                      </div>
                      <h6 class="fw-semibold">مراجعة السلة</h6>
                      <small class="text-muted"
                        >تأكد من المنتجات والكميات</small
                      >
                    </div>
                  </div>
                  <div class="col-md-4 mb-3">
                    <div class="step-item">
                      <div class="step-icon bg-info text-white rounded-4 mb-2">
                        <i class="bi bi-credit-card"></i>
                      </div>
                      <h6 class="fw-semibold">تحقق من الدفع</h6>
                      <small class="text-muted"
                        >تأكد من بيانات البطاقة والرصيد</small
                      >
                    </div>
                  </div>
                  <div class="col-md-4 mb-3">
                    <div class="step-item">
                      <div
                        class="step-icon bg-success text-white rounded-4 mb-2"
                      >
                        <i class="bi bi-arrow-repeat"></i>
                      </div>
                      <h6 class="fw-semibold">إعادة المحاولة</h6>
                      <small class="text-muted">جرب عملية الدفع مرة أخرى</small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div
                class="action-buttons d-flex flex-column flex-sm-row gap-3 justify-content-center"
              >
                <router-link
                  to="/cart"
                  class="btn btn-primary btn-lg rounded-pill px-4"
                >
                  <i class="bi bi-cart me-2"></i>
                  العودة للسلة
                </router-link>

                <router-link
                  to="/"
                  class="btn btn-outline-primary btn-lg rounded-pill px-4"
                >
                  <i class="bi bi-house me-2"></i>
                  الصفحة الرئيسية
                </router-link>
              </div>
            </div>

            <!-- Payment Methods Info -->
            <div class="row g-4 mt-4">
              <div class="col-md-4">
                <div
                  class="info-card text-center p-4 rounded-4 shadow-sm border-0 h-100"
                >
                  <i class="bi bi-shield-check display-4 text-success mb-3"></i>
                  <h5 class="fw-bold">دفع آمن</h5>
                  <p class="text-muted small">جميع عمليات الدفع محمية ومشفرة</p>
                </div>
              </div>
              <div class="col-md-4">
                <div
                  class="info-card text-center p-4 rounded-4 shadow-sm border-0 h-100"
                >
                  <i class="bi bi-credit-card display-4 text-primary mb-3"></i>
                  <h5 class="fw-bold">طرق دفع متعددة</h5>
                  <p class="text-muted small">
                    نقبل جميع أنواع البطاقات والمحافظ الرقمية
                  </p>
                </div>
              </div>
              <div class="col-md-4">
                <div
                  class="info-card text-center p-4 rounded-4 shadow-sm border-0 h-100"
                >
                  <i
                    class="bi bi-arrow-clockwise display-4 text-warning mb-3"
                  ></i>
                  <h5 class="fw-bold">يمكنك المحاولة مرة أخرى</h5>
                  <p class="text-muted small">
                    لا توجد رسوم على المحاولات المتعددة
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
import Navbar from "@/components/Navbar.vue";

const router = useRouter();
const route = useRoute();

document.title = "متجر الكتب | عملية شراء ملغاة";

// Get cancellation reason from query params
const getCancellationReason = () => {
  const reason = route.query.reason;
  const sessionId = route.query.session_id;

  // Log the cancellation for analytics
  if (reason || sessionId) {
    console.log("Payment cancelled:", { reason, sessionId });
  }
};

// Component mounted
onMounted(() => {
  getCancellationReason();
});
</script>
