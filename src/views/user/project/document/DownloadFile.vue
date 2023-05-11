<template>
    <div v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.8)" element-loading-text="数据加载中...">
        <div class="df-body">
            <h2>
                {{ docInfo.title }}
            </h2>
            <div class="df-update-time">
                更新时间：{{ docInfo.updatedAt }}
            </div>
            <div class="df-btn">
                <el-button type="primary" class="df-upload" @click="dialogVisible = true" :disabled="btnStatus"
                    v-if="role == 2 || role == 4 || role == 5">上传
                </el-button>
                <el-button type="success" class="df-upload" @click="download" :disabled="btnStatus"
                    v-if="docInfo.filename != '' && (role == 2 || role == 4 || role == 5)">下载
                </el-button>
            </div>
        </div>
        <div class="df-topic">
            暂不支持预览
        </div>
        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" :show-close="false" title="上传文档" width="30%">
            <el-form label-width="120px">
                <el-form-item label="文档名称" style="width: 80%;">
                    <el-input v-model="docInfo.title"></el-input>
                </el-form-item>
                <el-form-item label="文件" style="width: 80%;">
                    <input type="file" placeholder="上传文件" ref="file" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false; file.value = null">取消</el-button>
                    <el-button type="primary" @click="upload">提交</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { update } from 'lodash';
import { ref, watch } from 'vue';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex';

const id = ref('')
const textarea = ref('')
const store = useStore()
const projectId = store.getters.getProjectId
const router = useRoute()
const type = ref('')
type.value = router.params.type
const docInfo = ref({
    "id": '',
})
const file = ref(null)
id.value = router.params.id
const dialogVisible = ref(false)
const loading = ref(false)
const emit = defineEmits(["update:change", "update:editing", "update:outline"])
const role = store.getters.getRole

const btnStatus = ref(false)

// 时间格式化
const format = (val) => {
    var date = new Date(val)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return year + "-" + month + "-" + day
}
const init = () => {
    emit("update:outline", [])
    loading.value = true
    axios.get("/api/doc/info?projectId=" + projectId + "&id=" + id.value).then((resp) => {
        docInfo.value = resp.data
        loading.value = false
    }).catch((err) => {
        loading.value = false
        ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
    })
}

init()


const upload = () => {
    let formData = new FormData()
    formData.append("projectId", projectId)
    formData.append("docId", id.value)
    // console.log(file.value.files[0])
    if (file.value.files[0] !== undefined) {
        formData.append("file", file.value.files[0])
        formData.append("query", "file")
    }
    else {
        formData.append("query", "title")
    }
    formData.append("priority", 0)
    formData.append("lock", "true")
    formData.append("title", docInfo.value.title)
    dialogVisible.value = false
    loading.value = true
    axios.post("/api/doc/content", formData).then((resp) => {
        ElMessage.success({ message: "上传成功", duration: 1000, showClose: true })
        file.value.value = null
        emit("update:change", true)
        loading.value = false
        init()
    }).catch((err) => {
        loading.value = false
        ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
    })
}

onBeforeRouteUpdate((to, from) => { // 监听路由变化
    id.value = to.params.id
    init()
})

const download = () => {
    btnStatus.value = true
    window.location.href = "/api/doc/content?docId=" + docInfo.value.id + "&projectId=" + projectId
    setTimeout(() => {
        btnStatus.value = false
        // console.log(123)
    }, 3 * 1000);
}
</script>

<style scoped>
.df-body {
    display: flex;
    padding: 10px;
}

.df-btn {
    margin-left: auto;
    display: flex;
}

.df-upload {
    margin-right: 5px;
    margin-top: 13px;
    /* height: 100px; */
    /* width: 100px; */
}

.df-download {
    margin-top: -5px;
    /* margin-right: 5px; */
    /* margin: 10px;
    height: 50px; */
}

.df-update-time {
    display: flex;
    padding-left: 10px;
    padding-top: 23px;
}

.df-topic {
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    justify-content: center;
    height: calc(80vh);
    flex-direction: column;
    font-size: 40px;
    font-weight: bold;
}
</style>
