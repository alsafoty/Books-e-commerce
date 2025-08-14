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
    <!-- Header Section with Search and Mobile Add Button -->
    <div
      class="mb-3"
      v-if="!showEditProduct && !showAddProduct && !initialLoading"
    >
      <!-- Mobile Add Button (visible only on small screens) -->
      <div class="d-block d-md-none mb-3">
        <button class="btn btn-primary w-100 py-2" @click="handleAddProduct">
          <i class="bi bi-plus-circle me-2"></i>
          إضافة منتج جديد
        </button>
      </div>

      <!-- Search Bar -->
      <div class="search-container my-3">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="  اسم المنتج، الوصف، الفئة"
            v-model="searchQuery"
            aria-label="البحث في المنتجات"
          />
          <span class="input-group-text">
            <i class="bi bi-search text-muted"></i>
          </span>
        </div>
        <small class="text-muted d-block mt-1"> </small>
      </div>
    </div>
    <!-- Mobile Cards View (visible on small screens) -->
    <div
      class="d-block d-md-none"
      v-if="!showEditProduct && !showAddProduct && !initialLoading"
    >
      <!-- No results message for mobile -->
      <div v-if="filteredProducts.length === 0" class="text-center py-4">
        <i class="bi bi-search text-muted" style="font-size: 2rem"></i>
        <p class="text-muted mt-2 mb-0">لا توجد منتجات تطابق البحث</p>
        <small class="text-muted">جرب مصطلحات بحث أخرى</small>
      </div>

      <div class="row g-3" v-else>
        <div
          class="col-12"
          v-for="product in filteredProducts"
          :key="product.id"
        >
          <div class="card">
            <div class="card-body">
              <div
                class="d-flex justify-content-between align-items-start mb-2"
              >
                <h6 class="card-title mb-1">{{ product.name }}</h6>
                <span class="badge bg-primary">{{ product.id }}</span>
              </div>
              <p class="card-text text-muted small mb-2">
                {{ getCategoryTitle(product.categoryId) }}
              </p>
              <p class="card-text small mb-2">
                {{
                  product.description.length > 80
                    ? product.description.substring(0, 77) + "..."
                    : product.description
                }}
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <span class="fw-bold text-primary"
                    >{{ product.price.toFixed(2) }} د. أ</span
                  >
                  <br />
                  <small class="text-muted">المخزون: {{ product.stock }}</small>
                </div>
                <div class="d-flex gap-1">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    :title="'تعديل ' + product.name"
                    @click="handleEditProduct(product)"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    :title="'حذف ' + product.name"
                    @click="showDeleteConfirmation(product.id)"
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

    <!-- Desktop Table View (hidden on small screens) -->
    <div
      class="d-none d-md-block table-responsive flex-grow-1"
      v-if="!showEditProduct && !showAddProduct && !initialLoading"
    >
      <!-- No results message for desktop -->
      <div v-if="filteredProducts.length === 0" class="text-center py-5">
        <i class="bi bi-search text-muted" style="font-size: 3rem"></i>
        <h5 class="text-muted mt-3 mb-2">لا توجد منتجات تطابق البحث</h5>
        <p class="text-muted">
          جرب مصطلحات بحث أخرى أو امسح مربع البحث لعرض جميع المنتجات
        </p>
      </div>

      <table class="table table-hover mb-0" v-else>
        <thead class="thead-primary sticky-top">
          <tr class="bg-primary text-white">
            <th scope="col" class="d-none d-lg-table-cell" style="width: 60px">
              <div class="text-primary">الرقم</div>
            </th>
            <th scope="col" style="min-width: 200px">
              <div class="text-primary">الإسم</div>
            </th>
            <th scope="col" class="d-none d-xl-table-cell" style="width: 100px">
              <div class="text-primary">الفئة</div>
            </th>
            <th
              scope="col"
              class="d-none d-lg-table-cell"
              style="min-width: 400px"
            >
              <div class="text-primary">الوصف</div>
            </th>
            <th scope="col" style="width: 80px">
              <div class="text-primary">السعر</div>
            </th>
            <th scope="col" class="d-none d-lg-table-cell" style="width: 80px">
              <div class="text-primary">المخزون</div>
            </th>
            <th scope="col" style="width: 100px">
              <div class="text-primary">الإجراءات</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in filteredProducts"
            :key="product.id"
            class="align-middle"
          >
            <th scope="row" class="fw-normal d-none d-lg-table-cell">
              {{ product.id }}
            </th>
            <td
              class="text-truncate"
              style="max-width: 120px"
              :title="product.name"
            >
              {{ product.name }}
              <!-- Show category on medium screens -->
              <br class="d-md-block d-xl-none" />
              <small class="text-muted d-md-inline d-xl-none">{{
                getCategoryTitle(product.categoryId)
              }}</small>
            </td>
            <td
              class="text-truncate d-none d-xl-table-cell"
              style="max-width: 100px"
              :title="getCategoryTitle(product.categoryId)"
            >
              {{ getCategoryTitle(product.categoryId) }}
            </td>
            <td
              class="text-truncate d-none d-lg-table-cell"
              style="max-width: 150px"
              :title="product.description"
            >
              {{
                product.description.length > 50
                  ? product.description.substring(0, 47) + "..."
                  : product.description
              }}
            </td>
            <td class="text-nowrap">
              {{ product.price.toFixed(2) }} د. أ
              <!-- Show stock on medium screens -->
              <br class="d-md-block d-lg-none" />
              <small class="text-muted d-md-inline d-lg-none">{{
                product.stock
              }}</small>
            </td>
            <td class="text-center d-none d-lg-table-cell">
              {{ product.stock }}
            </td>
            <td>
              <div class="d-flex gap-1 justify-content-center">
                <button
                  class="btn btn-sm btn-outline-primary"
                  :title="'تعديل ' + product.name"
                  @click="handleEditProduct(product)"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  :title="'حذف ' + product.name"
                  @click="showDeleteConfirmation(product.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Product Button (Desktop only) -->
    <div
      class="mt-3 border-top pt-3 d-none d-md-block"
      v-if="!showAddProduct && !showEditProduct && !initialLoading"
    >
      <button class="btn btn-primary w-100 py-2 mb-2" @click="handleAddProduct">
        <i class="bi bi-plus-circle me-2"></i>
        إضافة منتج جديد
      </button>
    </div>

    <!-- Edit/ Add Product Modal -->
    <div class="" v-if="showEditProduct || showAddProduct">
      <h3 class="border-bottom border-2 border-dark my-3 text-center">
        {{ showEditProduct ? "تعديل المنتج" : "إضافة منتج جديد" }}
      </h3>
      <form @submit.prevent="showEditProduct ? updateProduct() : addProduct()">
        <div class="mb-3">
          <label for="productName" class="form-label">اسم المنتج</label>
          <input
            type="text"
            class="form-control"
            id="productName"
            v-model="editingProduct.name"
            required
          />
        </div>
        <div class="mb-3">
          <label for="productPrice" class="form-label">السعر</label>
          <input
            type="number"
            step="0.01"
            class="form-control"
            id="productPrice"
            v-model="editingProduct.price"
            required
          />
        </div>
        <div class="mb-3">
          <label for="productCategory" class="form-label">الفئة</label>
          <select
            class="form-select"
            id="productCategory"
            v-model="editingProduct.categoryId"
            required
          >
            <option value="" disabled required>اختر فئة</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="productStock" class="form-label">المخزون المتوفر</label>
          <input
            type="number"
            class="form-control"
            id="productStock"
            v-model="editingProduct.stock"
            required
          />
        </div>
        <div class="mb-3">
          <label for="productDescription" class="form-label">الوصف</label>
          <textarea
            class="form-control"
            id="productDescription"
            v-model="editingProduct.description"
            required
          ></textarea>
        </div>
        <!-- add images -->
        <div class="mb-3">
          <label for="productImages" class="form-label">صور المنتج</label>
          <!-- current images -->
          <div class="mb-2">
            <div
              v-for="(image, index) in editingProduct.ProductImages"
              :key="index"
              class="d-inline-block me-2 mb-2"
            >
              <img
                :src="image.url"
                alt="Product Image"
                class="img-thumbnail"
                style="width: 100px; height: 100px; object-fit: cover"
              />
            </div>
          </div>
          <input
            type="file"
            class="form-control"
            id="productImages"
            multiple
            @change="onImageChange"
          />
        </div>
        <div class="d-flex justify-content-center gap-2">
          <button
            type="submit"
            class="btn btn-primary mb-3"
            :disabled="loading"
            @click.prevent="showEditProduct ? updateProduct() : addProduct()"
          >
            {{ showEditProduct ? "تحديث المنتج" : "إضافة المنتج" }}
            <div
              class="spinner-border text-light spinner-border-sm"
              role="status"
              v-if="loading"
            >
              <span class="visually-hidden"></span>
            </div>
          </button>
          <button
            type="button"
            class="btn btn-warning mb-3 ms-2"
            @click="
              showEditProduct = false;
              showAddProduct = false;
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
const products = ref([]);
const categories = ref([]);
const editingProduct = ref({
  name: "",
  price: 0,
  stock: 0,
  description: "",
  categoryId: null,
  ProductImages: [],
});
const newImages = ref([]);
const loading = ref(false);
const showEditProduct = ref(false);
const showAddProduct = ref(false);
const searchQuery = ref("");
const initialLoading = ref(true);

// Computed property for filtered products
const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) {
    return products.value;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return products.value.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      getCategoryTitle(product.categoryId).toLowerCase().includes(query)
  );
});

const handleAddProduct = () => {
  editingProduct.value = {
    name: "",
    price: 0,
    stock: 0,
    description: "",
    categoryId: null,
    ProductImages: [],
  };
  showEditProduct.value = false;
  showAddProduct.value = true;
};

const handleEditProduct = (product) => {
  editingProduct.value = { ...product };
  showEditProduct.value = true;
  showAddProduct.value = false;
};
const addProduct = async () => {
  try {
    loading.value = true;
    const newProduct = new FormData();
    newProduct.append("name", editingProduct.value.name);
    newProduct.append("price", editingProduct.value.price);
    newProduct.append("stock", editingProduct.value.stock);
    newProduct.append("description", editingProduct.value.description);
    newProduct.append("categoryId", editingProduct.value.categoryId);
    if (newImages.value.length > 0) {
      newImages.value.forEach((image) => {
        newProduct.append("images", image.file);
      });
    }
    console.log(
      "New product data:",
      newImages.value.filter((image) => image.file)
    );
    await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/product`,
      newProduct,

      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    showMessage("تم إضافة المنتج بنجاح");
    fetchAllProducts();
    showAddProduct.value = false;
  } catch (error) {
    console.error("Error adding product:", error);
    showAddProduct.value = false;
  } finally {
    loading.value = false;
  }
};

const updateProduct = async () => {
  try {
    loading.value = true;

    if (newImages.value.length > 0) {
      const formData = new FormData();
      newImages.value.forEach((image) => {
        formData.append("images", image.file);
      });
      const response = await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/product/${editingProduct.value.id}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      editingProduct.value.ProductImages = response.data;
    }

    await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/product/${parseInt(
        editingProduct.value.id
      )}`,
      {
        name: editingProduct.value.name,
        price: editingProduct.value.price,
        stock: editingProduct.value.stock,
        description: editingProduct.value.description,
        categoryId: editingProduct.value.categoryId,
      },
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          //   "Content-Type": "application/json",
        },
      }
    );
    // Update the product in the products array
    const index = products.value.findIndex(
      (product) => product.id === editingProduct.value.id
    );
    if (index !== -1) {
      products.value[index] = editingProduct.value;
    }
    // Reset the editing product
    editingProduct.value = {
      name: "",
      price: 0,
      stock: 0,
      description: "",
      categoryId: null,
      ProductImages: [],
    };
    showEditProduct.value = false;
    showMessage("تم تحديث المنتج بنجاح");
    fetchAllProducts(); // Refresh the product list
  } catch (error) {
    console.error("Error updating product:", error);
    showMessage("خطأ في تحديث المنتج", "danger");
  } finally {
    loading.value = false;
  }
};

const showDeleteConfirmation = (productId) => {
  if (confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟")) {
    deleteProduct(productId);
  }
};

const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(
      `${process.env.VUE_APP_API_BASE_URL}/product/${productId}`,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );

    products.value = products.value.filter(
      (product) => product.id !== productId
    );
    showMessage("تم حذف المنتج بنجاح");
  } catch (error) {
    console.error("Error deleting product:", error.response.data.error);
    if (error.status === 400) {
      showMessage("لا يمكن حذف المنتج لأنه ضمن بعض الطلبات", "danger");
    } else {
      showMessage("خطأ في حذف المنتج", "danger");
    }
  }
};

// Show message
const showMessage = (text, type = "success") => {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

const onImageChange = (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    newImages.value = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file), // Create a local URL for preview
    }));
    editingProduct.value.ProductImages = [
      ...editingProduct.value.ProductImages,
      ...newImages.value,
    ];
  }
};
const getCategoryTitle = (categoryId) => {
  const category = categories.value.find((cat) => cat.id === categoryId);
  return category ? category.name : "غير معروف";
};

const fetchAllProducts = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/product`
    );
    products.value = response.data;

    const categoriesResponse = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/category`
    );
    categories.value = categoriesResponse.data;
    initialLoading.value = false;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

onMounted(() => {
  initialLoading.value = true;
  fetchAllProducts();
});
</script>
