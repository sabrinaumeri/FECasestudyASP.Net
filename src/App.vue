<template>
<div>
  <Brand />
<div class="footer">
best viewed on mobile device — Sabrina Umeri &copy;{{
new Date().getFullYear()
}}
</div>
</div>
</template>
<script setup>
import Brand from './components/Brand.vue'
</script>
<style>
#app {
font-family: Avenir, Helvetica, Arial, sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
text-align: center;
color: #2c3e50;
}
</style>
