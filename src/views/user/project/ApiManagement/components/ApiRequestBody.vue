<template>
    <div class="api-body">
        <el-tabs type="card" v-model="bodyTab" class="response">
            <el-tab-pane label="none" name="none">
                <div style="text-align: center;color:slategray;">此请求没有正文</div>
            </el-tab-pane>
            <el-tab-pane label="json" name="json">
                <api-coder :lang="'json'" :initHeight="'250px'"></api-coder>
            </el-tab-pane>
            <el-tab-pane label="form-data" name="form-data">
                <!-- <div style="text-align: center;color:slategray;">form-data</div> -->
                <table-form :initData="initData"></table-form>
            </el-tab-pane>
            <el-tab-pane label="binary" name="binary">
                <input type="file" placeholder="上传文件" ref="file" />
                <!-- <div style="text-align: center;color:slategray;">binary</div> -->
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
  
<script setup>
import { ref } from 'vue';
import ApiCoder from '../../../../../components/apiManagement/ApiCoder.vue';
import TableForm from './TableForm.vue';
const bodyTab = ref("none")
const initData = ref([
    {
        key: "id",
        value: "1",
        description: "id",
    },
]);

</script>

<style scoped></style>
  