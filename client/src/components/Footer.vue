<template>
  <footer class="bg-dark text-light py-4 mt-auto" dir="rtl">
    <div class="container">
      <div class="row">
        <!-- معلومات الشركة -->
        <div class="col-lg-4 col-md-6 mb-3">
          <h5 class="mb-3">متجر الكتب</h5>
          <p class="text-light">
            مكتبتك المفضلة للكتب الأصلية والمتميزة. نقدم لك أفضل الكتب في جميع
            المجالات من أشهر الكتاب والمؤلفين.
          </p>
        </div>

        <!-- روابط سريعة -->
        <div class="col-lg-2 col-md-6 mb-3">
          <ul class="list-unstyled">
            <li><h6 class="mb-3 text-decoration-underline">روابط سريعة</h6></li>
            <li class="list-group-item">
              <a href="#" class="text-light text-decoration-none hover-link"
                >الرئيسية</a
              >
            </li>
            <li class="list-group-item">
              <a
                href="#/products"
                class="text-decoration-none text-light hover-link"
                >الكتب</a
              >
            </li>
            <li class="list-group-item">
              <a
                href="#/cart"
                class="text-decoration-none text-light hover-link"
                >السلة</a
              >
            </li>
            <li class="list-group-item">
              <a
                href="#/wishlist"
                class="text-decoration-none text-light hover-link"
                >المفضلة</a
              >
            </li>
          </ul>
        </div>

        <!-- خدمة العملاء -->
        <div class="col-lg-3 col-md-6 mb-3">
          <ul class="list-unstyled">
            <li>
              <h6 class="mb-3 text-decoration-underline">خدمة العملاء</h6>
            </li>
            <li class="list-group-item">
              <a href="#" class="text-light text-decoration-none hover-link"
                >سياسة الإرجاع</a
              >
            </li>
            <li class="list-group-item">
              <a href="#" class="text-light text-decoration-none hover-link"
                >طرق الدفع</a
              >
            </li>
            <li class="list-group-item">
              <a href="#" class="text-decoration-none text-light hover-link"
                >التوصيل والشحن</a
              >
            </li>
            <li class="list-group-item">
              <a href="#" class="text-decoration-none text-light hover-link"
                >اتصل بنا</a
              >
            </li>
          </ul>
        </div>

        <!-- معلومات الاتصال -->
        <div class="col-lg-3 col-md-6 mb-3">
          <ul class="list-unstyled">
            <li><h6 class="mb-3 text-decoration-underline">تواصل معنا</h6></li>
            <li class="list-group-item">
              <i class="bi bi-telephone ms-2"></i>
              <span dir="ltr">+962 78 123 456</span>
            </li>
            <li class="list-group-item">
              <i class="bi bi-envelope ms-2"></i>
              <span>info@bookstore.com</span>
            </li>
            <li class="list-group-item">
              <i class="bi bi-geo-alt ms-2"></i>
              <span>عمان، الأردن</span>
            </li>
          </ul>
        </div>
      </div>

      <hr class="my-4 border-secondary" />

      <!-- وسائل التواصل الاجتماعي وحقوق النشر -->
      <div class="row align-items-center">
        <div class="col-md-6 text-center text-md-start mb-2 mb-md-0">
          <div class="social-links">
            <a href="#" class="text-light ms-3 hover-link">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="#" class="text-light ms-3 hover-link">
              <i class="bi bi-instagram"></i>
            </a>
            <a href="#" class="text-light ms-3 hover-link">
              <i class="bi bi-twitter"></i>
            </a>
            <a href="#" class="text-light hover-link">
              <i class="bi bi-whatsapp"></i>
            </a>
          </div>
        </div>
        <div class="col-md-6 text-center text-md-end">
          <small class="text-light">
            © {{ currentYear }} متجر الكتب. جميع الحقوق محفوظة.
          </small>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from "vue";

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.hover-link {
  transition: color 0.3s ease;
}

.hover-link:hover {
  color: #fff !important;
}

.social-links a {
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: #007bff !important;
}

footer {
  border-top: 1px solid #333;
}

footer ul li {
  margin-bottom: 0.5rem;
}
</style>
