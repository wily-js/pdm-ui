<template>
    <div class="table-form">
        <el-table :data="data">
            <template #empty>
                <div style="padding: 30px">
                    <IconEmpty />
                    <el-button type="primary" style="display: block; margin: auto" @click="addParam">新增
                    </el-button>
                </div>
            </template>
            <el-table-column type="selection" />
            <el-table-column label="键" prop="key">
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
                <template #default="scope">
                    <el-button :icon="Plus" type="primary" style="margin-right: 10px;" @click="addParam">
                    </el-button>
                    <el-button :icon="Minus" type="danger" @click="deleteParam(scope.$index)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
  
<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { Plus, Minus } from '@element-plus/icons-vue';
import IconEmpty from "../../../../../assets/IconEmpty.vue";
const props = defineProps({
    // 表格初始化数据
    initData: {
        type: Array,
    },
});
const data = ref([]);
watch(
    () => props.initData,
    () => {
        data.value = props.initData;
    },
    { immediate: true } // immediate选项可以开启首次赋值监听
);
// 表格数据结构
const dataStruct = reactive({
    key: "",
    value: "",
    description: "",
}
)
const addParam = () => {
    data.value.push(dataStruct);
};
const deleteParam = (index) => {
    data.value.splice(index, 1);
};
</script>
  
<style  scoped></style>
  