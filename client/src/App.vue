<template>
  <div id="app" class="bg-light min-vh-100" dir="rtl">
    <router-view :key="$route.fullPath" />
    <Footer />
  </div>
</template>

<script setup>
import Footer from "@/components/Footer.vue";
</script>

<style>
* {
  font-family: "El Messiri", "Noto Kufi Arabic", "Tajawal", sans-serif;
}
</style>
