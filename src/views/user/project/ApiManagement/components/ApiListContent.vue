<template>
    <el-card>
        <div class="head" style="display: flex; border-bottom: 1px silver solid;">
            <h2>{{ apiForm.name }}</h2>
            <el-button class="head-button" type="primary" style="margin-left: auto;" @click="send">发送</el-button>
            <el-button class="head-button" type="success" @click="save">保存</el-button>
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
                        <api-request-params ref="apiParam"></api-request-params>
                    </el-tab-pane>
                    <el-tab-pane label="授权" name="request-authorization">
                        <div style="text-align: center;color:slategray;">authorization</div>
                    </el-tab-pane>
                    <el-tab-pane label="请求头" name="request-header">
                        <api-request-headers ref="apiHeader"></api-request-headers>
                    </el-tab-pane>
                    <el-tab-pane label="请求体" name="request-body">
                        <api-request-body ref="apiBody"></api-request-body>
                    </el-tab-pane>
                    <el-tab-pane label="预请求脚本" name="request-before">
                        <div style="text-align: center;color:slategray;">预请求脚本</div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div style="min-height: 180px;">
                <el-tabs v-model="responseTab" class="response">
                    <el-tab-pane label="响应体" name="response-body">
                        <api-coder :lang="'json'" :initHeight="'250px'" :content="respData.body"
                            :read-only="true"></api-coder>
                    </el-tab-pane>
                    <el-tab-pane label="响应头" name="response-header">
                        <api-resp-headers :initData="respData.header"></api-resp-headers>
                    </el-tab-pane>
                    <el-tab-pane label="Cookies" name="response-cookies">cookies</el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </el-card>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import ApiRequestHeaders from './ApiRequestHeaders.vue';
import ApiRequestParams from './ApiRequestParams.vue';
import ApiRequestBody from './ApiRequestBody.vue';
import ApiRespHeaders from './ApiRespHeaders.vue'
import ApiCoder from '../../../../../components/apiManagement/ApiCoder.vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const store = useStore()

const apiForm = reactive({
    id: 0,
    name: "",
    description: "",
    method: 0,
    path: "",
    params: "",
    headers: "",
    bodyType: 0,
    body: ""
})
const requestTab = ref('request-params')
const responseTab = ref('response-body')

const apiParam = ref()
const apiHeader = ref()
const apiBody = ref()

const respData = reactive({
    header: [],
    body: "",
    cookie: ""
})
const send = () => {
    apiForm.params = apiParam.value.getData()
    apiForm.headers = apiHeader.value.getData()
    apiForm.bodyType = apiBody.value.bodyType
    apiForm.body = apiBody.value.getData()
    axios.post("/api/case/send", apiForm).then(({ data }) => {
        ElMessage.success({ message: "发送成功", duration: 2000, showClose: true })
        console.log(data);
        console.log("header = ", JSON.parse(data.header));
        respData.body = data.body
        respData.header = JSON.parse(data.header)
    }).catch((err) => {
        console.log("err = ", err);
        ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
    })
}

const save = () => {
    apiForm.params = apiParam.value.getData()
    apiForm.headers = apiHeader.value.getData()
    apiForm.bodyType = apiBody.value.bodyType
    apiForm.body = apiBody.value.getData()
    axios.post("/api/case/edit", apiForm).then(({ data }) => {
        ElMessage.success({ message: "保存成功", duration: 2000, showClose: true })
        store.commit("saveCaseBodyType", apiForm.bodyType)
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
    })
}

// 给表单数据赋值
const giveValue = (data) => {
    apiForm.id = data.id
    apiForm.name = data.name
    apiForm.description = data.description
    apiForm.method = data.method
    apiForm.path = data.path
    apiForm.params = data.params
    apiForm.headers = data.headers
    apiForm.bodyType = data.bodyType
    apiForm.body = data.body
}

// 获取接口用例详细信息
const getInfo = (id) => {
    if (!id) {
        return
    }
    axios.get(`/api/case/info?id=${id}`).then(({ data }) => {
        giveValue(data)
        requestTab.value = "request-params"
        store.commit("saveCaseInfo", data)
        store.commit("saveCaseId", 0)
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
    })
}

watch(
    () => store.getters.getCaseId,
    () => {
        getInfo(store.getters.getCaseId)
    },
    { immediate: true } // immediate选项可以开启首次赋值监听
)
onMounted(() => {
})

</script>

<style  scoped>
.head-button {
    margin-top: 20px;
}
</style>