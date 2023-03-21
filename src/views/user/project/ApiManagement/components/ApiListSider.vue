<template>
    <div class="body">
        <div style="display: flex;margin-top: 5px;margin-bottom: 10px;">
            <el-button type="primary" :icon="Plus" link style="margin-left: 5px;margin-right: 5px;">
            </el-button>
            <el-input style="margin-right: 5px;" placeholder="输入名称或路径查询"></el-input>
        </div>
        <el-tree ref="tree" :data="treeData" :props="defaultProps" :load="loadNode" lazy></el-tree>
    </div>
</template>
  
<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue';
import axios from 'axios';
import { forEach } from 'lodash';
import { onMounted, ref } from 'vue';

// 树形结构数据
const treeData = ref()

const defaultProps = {
    children: 'children',
    label: 'name',
}

// 懒加载
const loadNode = (node, resolve) => {
}

// 获取树形根目录数据
const getTree = () => {
    treeData.value = [{
        name: "pdm",
        path: "",
        type: "dir",
    }]
}


onMounted(() => {
    getTree()
})
</script>

<style scoped>
.body {
    margin-left: 5px;
    margin-right: 5px;
}
</style>