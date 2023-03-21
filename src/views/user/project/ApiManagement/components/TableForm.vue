<template>
    <div class="table-form">
        <el-table :data="data">
            <el-table-column type="selection" />
            <el-table-column label="键">
                <template #default="scope">
                    <el-input v-model="scope.row.key"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="值" prop="value">
                <template #default="scope">
                    <el-input v-model="scope.row.value"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="描述" prop="description">
                <template #default="scope">
                    <el-input v-model="scope.row.description"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" prop="action">
                <el-button :icon="Plus" type="primary" style="margin-right: 10px;" @click="addParam">
                </el-button>
                <el-button :icon="Minus" type="danger" @click="deleteParam(index)">
                </el-button>
            </el-table-column>
        </el-table>
    </div>
</template>
  
<script setup>
import { onMounted, ref } from "vue";
import { Plus, Minus } from '@element-plus/icons-vue';

const props = defineProps({
    // 表格初始化数据
    initData: {
        type: Array,
    },
    // 表格数据结构
    dataStruct: {
        type: Object,
        default: () => {
            return {
                key: "",
                value: "",
                description: "",
            };
        },
    },
});
const data = ref([]);
onMounted(() => {
    data.value = props.initData;
    console.log(data.value);
});

const addParam = () => {
    data.value.push(props.dataStruct);
};
const deleteParam = (index) => {
    data.value.splice(index, 1);
    console.log(index);
};
</script>
  
<style  scoped></style>
  