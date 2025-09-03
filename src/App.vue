<script setup lang="ts">
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="app-container">
    <NavBar />
    <router-view />
  </div>
</template>

<style>
::-webkit-scrollbar {
  display: none;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5; /* background outside the app */
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.app-container {
  width: 95vw;
  max-height: 95vh;
  background: #fff; /* inner app background */
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
