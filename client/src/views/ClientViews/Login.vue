<template>
  <div
    class="min-vh-100 d-flex align-items-center justify-content-center py-5"
    dir="rtl"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5" dir="rtl">
              <!-- Header -->
              <div class="text-center mb-4">
                <h2 class="fw-bold text-primary mb-2">
                  {{ setHeader(currentView) }}
                </h2>
                <p class="text-muted">
                  {{ setDescription(currentView) }}
                </p>
              </div>

              <!-- Login Form -->
              <form v-if="currentView === 'login'" @submit.prevent="login">
                <div class="mb-3">
                  <label class="form-label fw-semibold"
                    >البريد الإلكتروني</label
                  >
                  <input
                    v-model="loginForm.email"
                    type="email"
                    class="form-control form-control-lg rounded-3"
                    :class="{ 'is-invalid': errors.loginEmail }"
                    placeholder="example@gmail.com"
                    required
                  />
                  <div v-if="errors.loginEmail" class="invalid-feedback">
                    {{ errors.loginEmail }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">كلمة المرور</label>
                  <div class="position-relative">
                    <input
                      v-model="loginForm.password"
                      :type="showLoginPassword ? 'text' : 'password'"
                      class="form-control form-control-lg rounded-3"
                      :class="{ 'is-invalid': errors.loginPassword }"
                      placeholder="أدخل كلمة المرور"
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-link position-absolute top-50 start-0 translate-middle-y ms-2"
                      @click="showLoginPassword = !showLoginPassword"
                    >
                      <i
                        :class="
                          showLoginPassword ? 'bi bi-eye-slash' : 'bi bi-eye'
                        "
                      ></i>
                    </button>
                  </div>
                  <div v-if="errors.loginPassword" class="invalid-feedback">
                    {{ errors.loginPassword }}
                  </div>
                </div>

                <div
                  class="d-flex justify-content-between align-items-center mb-4"
                >
                  <div class="form-check" dir="rtl">
                    <label class="form-check-label text-muted" for="rememberMe">
                      تذكرني
                    </label>
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                    />
                  </div>
                  <button
                    type="button"
                    class="btn btn-link text-decoration-none p-0"
                    @click="currentView = 'forgot'"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary btn-lg w-100 rounded-3 mb-3"
                  :disabled="loading"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  تسجيل الدخول
                </button>

                <div class="text-center">
                  <span class="text-muted">ليس لديك حساب؟ </span>
                  <button
                    type="button"
                    class="btn btn-link text-decoration-none p-0"
                    @click="currentView = 'register'"
                  >
                    إنشاء حساب جديد
                  </button>
                </div>
              </form>

              <!-- Register Form -->
              <form
                v-if="currentView === 'register'"
                @submit.prevent="register"
              >
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">الاسم الأول</label>
                    <input
                      v-model="registerForm.firstName"
                      type="text"
                      class="form-control form-control-lg rounded-3"
                      :class="{ 'is-invalid': errors.firstName }"
                      placeholder="الاسم الأول"
                      required
                    />
                    <div v-if="errors.firstName" class="invalid-feedback">
                      {{ errors.firstName }}
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">الاسم الأخير</label>
                    <input
                      v-model="registerForm.lastName"
                      type="text"
                      class="form-control form-control-lg rounded-3"
                      :class="{ 'is-invalid': errors.lastName }"
                      placeholder="الاسم الأخير"
                      required
                    />
                    <div v-if="errors.lastName" class="invalid-feedback">
                      {{ errors.lastName }}
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">رقم الهاتف</label>
                  <input
                    v-model="registerForm.mobile"
                    type="tel"
                    class="form-control form-control-lg rounded-3"
                    :class="{ 'is-invalid': errors.mobile }"
                    placeholder="0799999999"
                    required
                  />
                  <div v-if="errors.mobile" class="invalid-feedback">
                    {{ errors.mobile }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold"
                    >البريد الإلكتروني</label
                  >
                  <input
                    v-model="registerForm.email"
                    type="email"
                    class="form-control form-control-lg rounded-3"
                    :class="{ 'is-invalid': errors.email }"
                    placeholder="example@gmail.com"
                    required
                  />
                  <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">اسم المستخدم</label>
                  <input
                    v-model="registerForm.username"
                    type="text"
                    class="form-control form-control-lg rounded-3"
                    :class="{ 'is-invalid': errors.username }"
                    placeholder="اسم المستخدم"
                    required
                  />
                  <div v-if="errors.username" class="invalid-feedback">
                    {{ errors.username }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">كلمة المرور</label>
                  <div class="position-relative">
                    <input
                      v-model="registerForm.password"
                      :type="showRegisterPassword ? 'text' : 'password'"
                      class="form-control form-control-lg rounded-3"
                      :class="{ 'is-invalid': errors.password }"
                      placeholder="كلمة مرور قوية"
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-link position-absolute top-50 start-0 translate-middle-y ms-2"
                      @click="showRegisterPassword = !showRegisterPassword"
                    >
                      <i
                        :class="
                          showRegisterPassword ? 'bi bi-eye-slash' : 'bi bi-eye'
                        "
                      ></i>
                    </button>
                  </div>
                  <div v-if="errors.password" class="invalid-feedback">
                    {{ errors.password }}
                  </div>
                  <div class="form-text">
                    يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص وتكون 8 أحرف
                    على الأقل
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold"
                    >تأكيد كلمة المرور</label
                  >
                  <input
                    v-model="registerForm.confirmPassword"
                    :type="showRegisterPassword ? 'text' : 'password'"
                    class="form-control form-control-lg rounded-3"
                    :class="{ 'is-invalid': errors.confirmPassword }"
                    placeholder="تأكيد كلمة المرور"
                    required
                  />
                  <div v-if="errors.confirmPassword" class="invalid-feedback">
                    {{ errors.confirmPassword }}
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary btn-lg w-100 rounded-3 mb-3"
                  :disabled="loading"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  إنشاء حساب
                </button>

                <div class="text-center">
                  <span class="text-muted">لديك حساب بالفعل؟ </span>
                  <button
                    type="button"
                    class="btn btn-link text-decoration-none p-0"
                    @click="currentView = 'login'"
                  >
                    تسجيل الدخول
                  </button>
                </div>
              </form>

              <!-- Forgot Password Form -->
              <form
                v-if="currentView === 'forgot'"
                @submit.prevent="forgotPassword"
              >
                <div class="mb-3">
                  <label class="form-label fw-semibold"
                    >البريد الإلكتروني</label
                  >
                  <input
                    v-model="forgotForm.email"
                    type="email"
                    class="form-control form-control-lg rounded-3"
                    :class="{ 'is-invalid': errors.forgotEmail }"
                    placeholder="example@gmail.com"
                    required
                  />
                  <div v-if="errors.forgotEmail" class="invalid-feedback">
                    {{ errors.forgotEmail }}
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary btn-lg w-100 rounded-3 mb-3"
                  :disabled="loading"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  إرسال رمز التحقق
                </button>

                <div class="text-center">
                  <button
                    type="button"
                    class="btn btn-link text-decoration-none"
                    @click="currentView = 'login'"
                  >
                    العودة لتسجيل الدخول
                  </button>
                </div>
              </form>

              <!-- OTP Verification Form -->
              <form v-if="currentView === 'otp'" @submit.prevent="verifyOtp">
                <div class="mb-3">
                  <label class="form-label fw-semibold">رمز التحقق</label>
                  <input
                    v-model="otpForm.otp"
                    type="text"
                    class="form-control form-control-lg rounded-3 text-center"
                    :class="{ 'is-invalid': errors.otp }"
                    placeholder="123456"
                    maxlength="6"
                    required
                  />
                  <div v-if="errors.otp" class="invalid-feedback">
                    {{ errors.otp }}
                  </div>
                  <div class="form-text text-center">
                    تم إرسال رمز التحقق إلى {{ forgotForm.email }}
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary btn-lg w-100 rounded-3 mb-3"
                  :disabled="loading"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  التحقق من الرمز
                </button>

                <div class="text-center">
                  <button
                    type="button"
                    class="btn btn-link text-decoration-none"
                    @click="currentView = 'forgot'"
                  >
                    إرسال رمز جديد
                  </button>
                </div>
              </form>

              <!-- Reset Password Form -->
              <form
                v-if="currentView === 'reset'"
                @submit.prevent="resetPassword"
              >
                <div class="mb-3">
                  <label class="form-label fw-semibold"
                    >كلمة المرور الجديدة</label
                  >
                  <div class="position-relative">
                    <input
                      v-model="resetForm.password"
                      :type="showResetPassword ? 'text' : 'password'"
                      class="form-control form-control-lg rounded-3"
                      :class="{ 'is-invalid': errors.resetPassword }"
                      placeholder="كلمة مرور قوية"
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-link position-absolute top-50 start-0 translate-middle-y ms-2"
                      @click="showResetPassword = !showResetPassword"
                    >
                      <i
                        :class="
                          showResetPassword ? 'bi bi-eye-slash' : 'bi bi-eye'
                        "
                      ></i>
                    </button>
                  </div>
                  <div v-if="errors.resetPassword" class="invalid-feedback">
                    {{ errors.resetPassword }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold"
                    >تأكيد كلمة المرور</label
                  >
                  <input
                    v-model="resetForm.confirmPassword"
                    :type="showResetPassword ? 'text' : 'password'"
                    class="form-control form-control-lg rounded-3"
                    :class="{ 'is-invalid': errors.resetConfirmPassword }"
                    placeholder="تأكيد كلمة المرور"
                    required
                  />
                  <div
                    v-if="errors.resetConfirmPassword"
                    class="invalid-feedback"
                  >
                    {{ errors.resetConfirmPassword }}
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary btn-lg w-100 rounded-3 mb-3"
                  :disabled="loading"
                >
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  تحديث كلمة المرور
                </button>
              </form>

              <!-- Alert Messages -->
              <div
                v-if="message"
                class="alert"
                :class="
                  messageType === 'success' ? 'alert-success' : 'alert-danger'
                "
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

document.title = "متجر الكتب | تسجيل الدخول";
const router = useRouter();

// Current view state
const currentView = ref("login"); // login, register, forgot, otp, reset
const loading = ref(false);
const message = ref("");
const messageType = ref("success");

// Password visibility toggles
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);
const showResetPassword = ref(false);

// Form data
const loginForm = reactive({
  email: "",
  password: "",
});

const registerForm = reactive({
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
});

const forgotForm = reactive({
  email: "",
});

const otpForm = reactive({
  otp: "",
});

const resetForm = reactive({
  password: "",
  confirmPassword: "",
});

// Errors
const errors = reactive({});

const setHeader = (view) => {
  switch (view) {
    case "login":
      return "تسجيل الدخول";
    case "register":
      return "إنشاء حساب جديد";
    case "forgot":
      return "إعادة تعيين كلمة المرور";
    case "otp":
      return "التحقق من الرمز";
    case "reset":
      return "كلمة مرور جديدة";
  }
};

const setDescription = (view) => {
  switch (view) {
    case "login":
      return "قم بتسجيل الدخول إلى حسابك";
    case "register":
      return "أنشئ حسابًا جديدًا للبدء";
    case "forgot":
      return "أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور";
    case "otp":
      return "أدخل رمز التحقق المرسل إلى بريدك الإلكتروني";
    case "reset":
      return "قم بتعيين كلمة مرور جديدة لحسابك";
  }
};
// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validateMobile = (mobile) => {
  const mobileRegex = /^07\d{8}$/;
  return mobileRegex.test(mobile);
};

const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

const clearErrors = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);
};

const showMessage = (text, type = "success") => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

// API functions
const login = async () => {
  clearErrors();

  // Validation
  if (!validateEmail(loginForm.email)) {
    errors.loginEmail = "يرجى إدخال بريد إلكتروني صحيح";
    return;
  }

  if (!loginForm.password) {
    errors.loginPassword = "يرجى إدخال كلمة المرور";
    return;
  }

  loading.value = true;

  try {
    const response = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/user/login`,
      {
        email: loginForm.email,
        password: loginForm.password,
      }
    );

    showMessage("تم تسجيل الدخول بنجاح", "success");

    // Store token and user info
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    // Store user information
    if (response.data.user) {
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
    }

    // Redirect to home or dashboard
    setTimeout(() => {
      router.push("/");
    }, 1500);
  } catch (error) {
    console.error("Login error:", error);
    if (error.response.data?.error === "Inactive user") {
      showMessage(" الحساب غير فعّال، يرجى التواصل مع الدعم الفني ", "danger");
      return;
    } else if (error.response.data?.error === "Invalid credentials") {
      showMessage("البريد الإلكتروني أو كلمة المرور غير صحيحة", "danger");
    } else {
      showMessage("حدث خطأ غير متوقع", "danger");
    }
  } finally {
    loading.value = false;
  }
};

const register = async () => {
  clearErrors();

  // Validation
  if (!registerForm.firstName.trim()) {
    errors.firstName = "يرجى إدخال الاسم الأول";
    return;
  }

  if (!registerForm.lastName.trim()) {
    errors.lastName = "يرجى إدخال الاسم الأخير";
    return;
  }

  if (!validateMobile(registerForm.mobile)) {
    errors.mobile = "يرجى إدخال رقم هاتف صحيح يبدأ بـ 07";
    return;
  }

  if (!validateEmail(registerForm.email)) {
    errors.email = "يرجى إدخال بريد إلكتروني صحيح";
    return;
  }

  if (!validateUsername(registerForm.username)) {
    errors.username = "يرجى إدخال اسم مستخدم صحيح";
    return;
  }

  if (!validatePassword(registerForm.password)) {
    errors.password =
      "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل وحرف كبير وصغير ورقم ورمز خاص";
    return;
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    errors.confirmPassword = "كلمة المرور غير متطابقة";
    return;
  }

  loading.value = true;

  try {
    const response = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/user/Register`,
      {
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        mobile: registerForm.mobile,
        email: registerForm.email,
        username: registerForm.username,
        password: registerForm.password,
      }
    );

    showMessage("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول", "success");

    setTimeout(() => {
      currentView.value = "login";
      loginForm.email = registerForm.email;
    }, 2000);
  } catch (error) {
    showMessage(
      error.response?.data?.message || "خطأ في إنشاء الحساب",
      "error"
    );
  } finally {
    loading.value = false;
  }
};

const forgotPassword = async () => {
  clearErrors();

  if (!validateEmail(forgotForm.email)) {
    errors.forgotEmail = "يرجى إدخال بريد إلكتروني صحيح";
    return;
  }

  loading.value = true;

  try {
    await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/user/password-reset`,
      {
        email: forgotForm.email,
      }
    );

    showMessage("تم إرسال رمز التحقق إلى بريدك الإلكتروني", "success");
    currentView.value = "otp";
  } catch (error) {
    showMessage(
      error.response?.data?.message || "خطأ في إرسال رمز التحقق",
      "error"
    );
  } finally {
    loading.value = false;
  }
};

const verifyOtp = async () => {
  clearErrors();

  if (!otpForm.otp || otpForm.otp.length !== 6) {
    errors.otp = "يرجى إدخال رمز التحقق المكون من 6 أرقام";
    return;
  }

  loading.value = true;

  try {
    const response = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/user/otp/verify`,
      {
        otp: otpForm.otp,
        email: forgotForm.email,
      }
    );

    showMessage("تم التحقق من الرمز بنجاح", "success");
    currentView.value = "reset";
  } catch (error) {
    showMessage(
      error.response?.data?.message || "رمز التحقق غير صحيح",
      "error"
    );
  } finally {
    loading.value = false;
  }
};

const resetPassword = async () => {
  clearErrors();

  if (!validatePassword(resetForm.password)) {
    errors.resetPassword =
      "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل وحرف كبير وصغير ورقم ورمز خاص";
    return;
  }

  if (resetForm.password !== resetForm.confirmPassword) {
    errors.resetConfirmPassword = "كلمة المرور غير متطابقة";
    return;
  }

  loading.value = true;

  try {
    await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/user/password-resetting`,
      {
        password: resetForm.password,
        confirmPassword: resetForm.confirmPassword,
        email: forgotForm.email,
      }
    );

    showMessage(
      "تم تحديث كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول",
      "success"
    );

    setTimeout(() => {
      currentView.value = "login";
      loginForm.email = forgotForm.email;
    }, 2000);
  } catch (error) {
    showMessage(
      error.response?.data?.message || "خطأ في تحديث كلمة المرور",
      "error"
    );
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.card {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}

.btn-link {
  color: #0d6efd;
  font-weight: 500;
}

.btn-link:hover {
  color: #0a58ca;
}

.position-relative .btn-link {
  border: none;
  background: none;
  color: #6c757d;
  padding: 0;
  width: auto;
  height: auto;
}

.position-relative .btn-link:hover {
  color: #0d6efd;
}

.alert {
  border-radius: 0.75rem;
  border: none;
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
}

@media (max-width: 576px) {
  .card-body {
    padding: 2rem !important;
  }
}
</style>
