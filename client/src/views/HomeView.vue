<template>
  <div class="home">
    <Navbar />
    <Bannerslider />
    <CategoryHomeList />
    <ProductHomeList />
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";

import Bannerslider from "@/components/Bannerslider.vue";
import ProductHomeList from "@/components/ProductHomeList.vue";
import CategoryHomeList from "@/components/CategoryHomeList.vue";

document.title = "متجر الكتب | الصفحة الرئيسية";
</script>
