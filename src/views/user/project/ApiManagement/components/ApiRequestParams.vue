<template>
    <div class="api-param">
        <table-form :initData="initData"></table-form>
    </div>
</template>
  
<script setup>
import { ref } from "vue";
import TableForm from "./TableForm.vue";

const initData = ref([
    {
        key: "id",
        value: "1",
        description: "id号",
    },
]);
</script>
  
<style scoped></style>
  