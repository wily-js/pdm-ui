<template>
    <div class="common-layout">
        <el-container>
            <el-aside>
                <api-list-sider></api-list-sider>
            </el-aside>
            <el-main>
                <api-list-content></api-list-content>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import ApiListSider from './components/ApiListSider.vue';
import ApiListContent from './components/ApiListContent.vue';
</script>

<style  scoped></style>