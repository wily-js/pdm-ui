<template>
    <div class="api-resp-headers">
        <el-table :data="data">
            <el-table-column label="键" prop="key">
            </el-table-column>
            <el-table-column label="值" prop="value">
            </el-table-column>
        </el-table>
    </div>
</template>
  
<script setup>
import { computed, onMounted, ref } from "vue";

const props = defineProps({
    // 表格初始化数据
    initData: {
        type: Array,
    },
});
const data = ref([]);
onMounted(() => {
    data.value = props.initData;
});

</script>
  
<style  scoped></style>
  