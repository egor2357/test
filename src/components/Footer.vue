<script setup></script>
<template>
  <div class="footer">
    <p class="footer-text">{{ new Date().getFullYear() }} Артем Бобровский</p>
  </div>
</template>
<style>
.footer {
  width: 100%;
  height: 100px;
  background-color: #6ad7f8;
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: auto;
}
.footer-text {
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  color: white;
}
</style>
