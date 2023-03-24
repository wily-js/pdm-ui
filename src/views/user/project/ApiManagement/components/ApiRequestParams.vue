<template>
    <div class="api-param">
        <table-form :initData="params"></table-form>
    </div>
</template>
  
<script setup>
import { ref, watch, defineExpose } from "vue";
import { useStore } from "vuex";
import TableForm from "./TableForm.vue";

const store = useStore()

const params = ref([])


const getData = () => {
    return JSON.stringify(params.value);
};
// 暴露方法，以供父组件进行调用
defineExpose({
    getData,
});

watch(
    () => store.getters.getCaseInfo.params,
    () => {
        console.log("param ", store.getters.getCaseInfo.params);
        if (store.getters.getCaseInfo.params) {
            params.value = JSON.parse(store.getters.getCaseInfo.params)
        } else {
            params.value = []
        }
    },
    { immediate: true } // immediate选项可以开启首次赋值监听
)

</script>
  
<style scoped></style>
  