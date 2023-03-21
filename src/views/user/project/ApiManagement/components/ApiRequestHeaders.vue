<template>
    <div class="api-header">
        <table-form :initData="initData"></table-form>
    </div>
</template>
  
<script setup>
import { ref } from "vue";
import TableForm from "./TableForm.vue";

const initData = ref([
    {
        key: "name",
        value: "zs",
        description: "姓名zs",
    },
]);
</script>
  
<style scoped></style>
  