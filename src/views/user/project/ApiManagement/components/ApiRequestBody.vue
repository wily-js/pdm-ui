<template>
    <div class="api-body">
        <el-tabs type="card" v-model="bodyType" class="response">
            <el-tab-pane label="none" :name="0">
                <div style="text-align: center;color:slategray;">此请求没有正文</div>
            </el-tab-pane>
            <el-tab-pane label="json" :name="1">
                <api-coder :lang="'json'" :initHeight="'250px'" :content="bodyJson"
                    @updateScript="updateContent"></api-coder>
            </el-tab-pane>
            <el-tab-pane label="form-data" :name="2">
                <!-- <div style="text-align: center;color:slategray;">form-data</div> -->
                <table-form :initData="bodyFormData"></table-form>
            </el-tab-pane>
            <el-tab-pane label="binary" :name="3">
                <input type="file" placeholder="上传文件" ref="file" />
                <!-- <div style="text-align: center;color:slategray;">binary</div> -->
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
  
<script setup>
import { ref, watch, defineExpose, onMounted } from 'vue';
import { useStore } from 'vuex';
import ApiCoder from '../../../../../components/apiManagement/ApiCoder.vue';
import TableForm from './TableForm.vue';

const store = useStore()

// 请求体类型
const bodyType = ref(store.getters.getCaseInfo.bodyType)


// 请求体 form-data
const bodyFormData = ref([])

// 请求体 json
const bodyJson = ref("")


const updateContent = (content) => {
    bodyJson.value = content
    console.log("content = ", content);
};


// 获取请求体数据
const getData = () => {
    switch (bodyType.value) {
        case 1:
            return bodyJson.value;
        case 2:
            return JSON.stringify(bodyFormData.value);
        default:
            return "";
    }
};
// 暴露方法，以供父组件进行调用
defineExpose({
    bodyType,
    getData,
});

// 监听请求体数据变化
watch(
    () => store.getters.getCaseInfo,
    () => {
        bodyJson.value = ""
        bodyFormData.value = []
        bodyType.value = store.getters.getCaseInfo.bodyType
        console.log("body ", store.getters.getCaseInfo.body);
        console.log("bodyType = ", store.getters.getCaseInfo.bodyType);
        if (bodyType.value === 1) {//  json格式
            if (store.getters.getCaseInfo.body) {
                bodyJson.value = store.getters.getCaseInfo.body
            }
        } else if (bodyType.value === 2) {// form-data格式
            if (store.getters.getCaseInfo.body) {
                bodyFormData.value = JSON.parse(store.getters.getCaseInfo.body)
            }
        }

    },
    { immediate: true } // immediate选项可以开启首次赋值监听
)
</script>

<style scoped></style>
  