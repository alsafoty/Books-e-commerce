<template>
  <div class="min-vh-100" dir="rtl">
    <Navbar />

    <div class="container-fluid py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-xl-10">
          <!-- Profile Header -->
          <div class="card shadow-lg border-0 rounded-4 mb-2">
            <div class="card-body p-4">
              <!-- Profile Header -->
              <div class="bg-secondary rounded-4 mb-4 overflow-hidden shadow">
                <!-- Dashboard Title -->
                <div
                  class="text-white text-center py-3 border-bottom border-white border-opacity-25"
                >
                  <h2 class="mb-0 fw-bold">لوحة التحكّم</h2>
                </div>

                <!-- Navigation Tabs - Desktop -->
                <div class="d-none d-lg-block">
                  <ul class="nav nav-pills nav-fill bg-white m-3 rounded-3 p-1">
                    <li class="nav-item">
                      <button
                        class="nav-link rounded-2 fw-semibold"
                        @click="selectTab('home')"
                        :class="{
                          'active bg-secondary text-white':
                            selectedTab === 'home',
                          'text-secondary': selectedTab !== 'home',
                        }"
                      >
                        الرئيسية
                      </button>
                    </li>
                    <li class="nav-item">
                      <button
                        class="nav-link rounded-2 fw-semibold"
                        @click="selectTab('products')"
                        :class="{
                          'active bg-secondary text-white':
                            selectedTab === 'products',
                          'text-secondary': selectedTab !== 'products',
                        }"
                      >
                        البضائع
                      </button>
                    </li>
                    <li class="nav-item">
                      <button
                        class="nav-link rounded-2 fw-semibold"
                        @click="selectTab('categories')"
                        :class="{
                          'active bg-secondary text-white':
                            selectedTab === 'categories',
                          'text-secondary': selectedTab !== 'categories',
                        }"
                      >
                        الفئات
                      </button>
                    </li>
                    <li class="nav-item">
                      <button
                        class="nav-link rounded-2 fw-semibold"
                        @click="selectTab('users')"
                        :class="{
                          'active bg-secondary text-white':
                            selectedTab === 'users',
                          'text-secondary': selectedTab !== 'users',
                        }"
                      >
                        المستخدمين
                      </button>
                    </li>
                    <li class="nav-item">
                      <button
                        class="nav-link rounded-2 fw-semibold"
                        @click="selectTab('orders')"
                        :class="{
                          'active bg-secondary text-white':
                            selectedTab === 'orders',
                          'text-secondary': selectedTab !== 'orders',
                        }"
                      >
                        الطلبات
                      </button>
                    </li>
                  </ul>
                </div>

                <!-- Navigation Tabs - Mobile (Vertical List) -->
                <div class="d-lg-none">
                  <div class="bg-white m-3 rounded-3 p-2">
                    <ul
                      class="nav nav-pills gap-2"
                      style="list-style-type: none; margin: 0; padding: 0"
                    >
                      <li class="nav-item w-100">
                        <button
                          class="nav-link w-100 text-end rounded-2 fw-semibold"
                          @click="selectTab('home')"
                          :class="{
                            'active bg-secondary text-white':
                              selectedTab === 'home',
                            'text-secondary': selectedTab !== 'home',
                          }"
                        >
                          الرئيسية
                        </button>
                      </li>
                      <li class="nav-item w-100">
                        <button
                          class="nav-link w-100 text-end rounded-2 fw-semibold"
                          @click="selectTab('products')"
                          :class="{
                            'active bg-secondary text-white':
                              selectedTab === 'products',
                            'text-secondary': selectedTab !== 'products',
                          }"
                        >
                          البضائع
                        </button>
                      </li>
                      <li class="nav-item w-100">
                        <button
                          class="nav-link w-100 text-end rounded-2 fw-semibold"
                          @click="selectTab('categories')"
                          :class="{
                            'active bg-secondary text-white':
                              selectedTab === 'categories',
                            'text-secondary': selectedTab !== 'categories',
                          }"
                        >
                          الفئات
                        </button>
                      </li>
                      <li class="nav-item w-100">
                        <button
                          class="nav-link w-100 text-end rounded-2 fw-semibold"
                          @click="selectTab('users')"
                          :class="{
                            'active bg-secondary text-white':
                              selectedTab === 'users',
                            'text-secondary': selectedTab !== 'users',
                          }"
                        >
                          المستخدمين
                        </button>
                      </li>
                      <li class="nav-item w-100">
                        <button
                          class="nav-link w-100 text-end rounded-2 fw-semibold"
                          @click="selectTab('orders')"
                          :class="{
                            'active bg-secondary text-white':
                              selectedTab === 'orders',
                            'text-secondary': selectedTab !== 'orders',
                          }"
                        >
                          الطلبات
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Tab Content -->
              <div class="tab-content">
                <div v-if="selectedTab === 'home'">
                  <HomeDashboard />
                </div>
                <div v-if="selectedTab === 'products'">
                  <ProductsDashboard />
                </div>
                <div v-if="selectedTab === 'categories'">
                  <CategoriesDashboard />
                </div>
                <div v-if="selectedTab === 'users'">
                  <UsersDashboard />
                </div>
                <div v-if="selectedTab === 'orders'">
                  <OrdersDashboard />
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
import Navbar from "@/components/Navbar.vue";
import ProductsDashboard from "@/components/Dashboard/ProductsDashboard.vue";
import UsersDashboard from "@/components/Dashboard/UsersDashboard.vue";
import CategoriesDashboard from "@/components/Dashboard/CategoriesDashboard.vue";
import HomeDashboard from "@/components/Dashboard/HomeDashboard.vue";
import OrdersDashboard from "@/components/Dashboard/OrdersDashboard.vue";

import { ref } from "vue";

document.title = "متجر الكتب | لوحة التحكم";

const selectedTab = ref("home");

const selectTab = (tab) => {
  selectedTab.value = tab;
};
</script>
