<template>
    <div class="api-header">
        <table-form :initData="headers"></table-form>
    </div>
</template>
  
<script setup>
import { ref, watch, defineExpose } from "vue";
import { useStore } from "vuex";
import TableForm from "./TableForm.vue";

const store = useStore()

const headers = ref([])

const getData = () => {
    return JSON.stringify(headers.value);
};
// 暴露方法，以供父组件进行调用
defineExpose({
    getData,
});


watch(
    () => store.getters.getCaseInfo.headers,
    () => {
        // console.log("header ", store.getters.getCaseInfo.headers);
        if (store.getters.getCaseInfo.headers) {
            headers.value = JSON.parse(store.getters.getCaseInfo.headers)
            console.log("header ", JSON.parse(store.getters.getCaseInfo.headers));
        } else {
            headers.value = []
        }
    },
    { immediate: true } // immediate选项可以开启首次赋值监听
)
</script>
  
<style scoped></style>
  