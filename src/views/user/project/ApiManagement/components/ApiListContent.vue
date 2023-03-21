<template>
    <el-card>
        <div class="head" style="display: flex; border-bottom: 1px silver solid;">
            <h2>接口名称</h2>
            <el-button class="head-button" type="primary" style="margin-left: auto;">发送</el-button>
            <el-button class="head-button" type="success">保存</el-button>
        </div>
        <div class="api" style="margin-top: 10px;">
            <el-form :model="apiForm" label-width="120px">
                <el-form-item label="名称/描述：" style="display: flex;">
                    <el-input v-model="apiForm.name" style="width: 40%;" placeholder="请输入名称" />
                    <el-input v-model="apiForm.description" style="width: 60%;" placeholder="请输入描述" />
                </el-form-item>
                <el-form-item label="方法/路径：" style="display: flex;">
                    <el-select v-model="apiForm.method" style="width: 20%;" placeholder="请选择请求方法">
                        <el-option label="GET" :value="0"></el-option>
                        <el-option label="POST" :value="1"></el-option>
                        <el-option label="PUT" :value="2"></el-option>
                        <el-option label="DELETE" :value="3"></el-option>
                    </el-select>
                    <el-input v-model="apiForm.path" style="width: 80%;" placeholder="请输入请求路径" />
                </el-form-item>
            </el-form>
            <div style="min-height: 180px;">
                <el-tabs v-model="requestTab" class="request">
                    <el-tab-pane label="请求参数" name="request-params">
                        <api-request-params></api-request-params>
                    </el-tab-pane>
                    <el-tab-pane label="授权" name="request-authorization">authorization</el-tab-pane>
                    <el-tab-pane label="请求头" name="request-header">
                        <api-request-headers></api-request-headers>
                    </el-tab-pane>
                    <el-tab-pane label="请求体" name="request-body">
                        <api-request-body></api-request-body>
                    </el-tab-pane>
                    <el-tab-pane label="预请求脚本" name="request-before">Task</el-tab-pane>
                </el-tabs>
            </div>
            <div style="min-height: 180px;">
                <el-tabs v-model="responseTab" class="response">
                    <el-tab-pane label="响应体" name="response-body">
                        <api-coder :lang="'json'" :initHeight="'250px'"></api-coder>
                    </el-tab-pane>
                    <el-tab-pane label="响应头" name="response-header">
                        <api-resp-headers :init-data="initData"></api-resp-headers>
                    </el-tab-pane>
                    <el-tab-pane label="Cookies" name="response-cookies">cookies</el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ApiRequestHeaders from './ApiRequestHeaders.vue';
import ApiRequestParams from './ApiRequestParams.vue';
import ApiRequestBody from './ApiRequestBody.vue';
import ApiRespHeaders from './ApiRespHeaders.vue'
import ApiCoder from '../../../../../components/apiManagement/ApiCoder.vue';
const apiForm = reactive({
    name: "",
    description: "",
    method: "",
    path: ""
})
const requestTab = ref('request-params')
const responseTab = ref('response-body')

const initData = ref([
    {
        key: "id",
        value: "1",
        description: "id",
    },
]);


</script>

<style  scoped>
.head-button {
    margin-top: 20px;
}
</style>