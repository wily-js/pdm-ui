<template>
    <div v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.8)" element-loading-text="数据加载中...">
        <div class="md-body">
            <h2 v-if="editState == false">{{ docInfo.title }}</h2>
            <el-input v-model="docInfo.title" class="md-input" @change="changeTitle" v-else></el-input>
            <div class="md-update-time">
                更新时间：{{ docInfo.updatedAt }}
            </div>
            <el-button type="success" style="margin-top: 16px;margin-left: 5px;" @click="exportDoc" :disabled="exportStatus"
                v-if="role !== 1">导出</el-button>
            <el-button type="warning" style="margin-top: 16px;margin-left: 5px;" @click="generate"
                :disabled="generateStatus" v-if="role !== 1">生成技术方案</el-button>
            <div class="md-btn-group" v-if="editState == false">
                <div class="md-btn">
                    <el-button type="primary" style="margin-top:5px;" @click="changeToEdit" v-if="role !== 1">编辑</el-button>
                </div>
            </div>
            <div class="md-btn-group" v-else>
                <el-button-group class="md-group">
                    <el-button type="primary" @click="Edit">编辑模式</el-button>
                    <el-button type="primary" @click="Preview">预览模式</el-button>
                    <el-button type="primary" @click="Mixed">混合模式</el-button>
                    <el-button type="primary" @click="Code">代码模式</el-button>
                </el-button-group>
                <div class="md-btn">
                    <el-button :disabled="btnStatus" @click="cancel">取消</el-button>
                    <el-button @click="save" type="warning" :disabled="btnStatus">保存</el-button>
                    <!-- <el-button @click="dialogRemoveVisible = true" type="danger" :disabled="btnStatus">删除</el-button> -->
                </div>
            </div>
        </div>
        <Markdown :content="content" :pattern="pattern" :codeType="codeType" :id="id" @update:content="update"
            @update:ctState="changeState" @update:ctrlSave="timeSave" @update:outline="getOutline"
            :class="[pattern === 2 && editState === true ? 'md-pattern' : '']"></Markdown>
    </div>
</template>

<script setup>

import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onUnmounted, ref, watch } from 'vue';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex';
import Markdown from "../../../../components/markdown/markdown.vue";
const id = ref(0)
const textarea = ref('')
const docInfo = ref({})
const store = useStore()
const projectId = store.getters.getProjectId
const content = ref('')
const router = useRoute()
const loading = ref(false)
const role = store.getters.getRole
const exportStatus = ref(false)
const generateStatus = ref(false)
// 编辑模式
const editState = ref(false)
// markdown状态  1 - 编辑模式 2 - 预览模式 3 - 混合模式 4 - 代码模式
const pattern = ref(0)
// 文档类型
const codeType = ref("doc")
// 文档是否发生修改
const ctState = ref(false)
// 保存、删除按钮是否可用
const btnStatus = ref(false)
id.value = Number(router.params.id)
const emit = defineEmits(["update:change", "update:editing", "update:outline"])

const outline = ref()
const getOutline = (val) => {
    outline.value = val
    emit("update:outline", val)
}

const init = () => {
    loading.value = true
    axios.get("/api/doc/info?projectId=" + projectId + "&id=" + id.value).then((resp) => {
        docInfo.value = resp.data
        axios.get("/api/doc/content?docId=" + docInfo.value.id + "&projectId=" + projectId).then((resp) => {
            content.value = resp.data
            loading.value = false
        }).catch((err) => {
            loading.value = false
            ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
        })
    }).catch((err) => {
        loading.value = false
        ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
    })
}
init()

// 获取编辑状态
const changeToEdit = () => {
    // 锁表单
    var lockDto = {}
    lockDto.userId = Number(store.getters.getUserInfo.id)
    lockDto.projectId = Number(projectId)
    lockDto.id = id.value
    lockDto.docType = "doc"
    // 获取锁信息
    axios.post("/api/doc/lock", lockDto).then((resp) => {
        editState.value = true
        pattern.value = 1
        emit("update:editing", true)
    }).catch((err) => {
        ElMessageBox.alert(err.response.data, '提示', {
            confirmButtonText: '确定',
            type: 'error',
        })
    })
}

// 编辑模式
const Edit = () => {
    pattern.value = 1
}

// 预览模式
const Preview = () => {
    pattern.value = 2
}

// 混合模式
const Mixed = () => {
    pattern.value = 3
}

// 代码模式
const Code = () => {
    pattern.value = 4
}

// 获取子组件内容
const update = (val) => {
    content.value = val
}

// 获取子组件是否发生编辑
const changeState = (val) => {
    ctState.value = val
}

const changeTitle = () => {
    ctState.value = true
}

// 监听路由变化
onBeforeRouteUpdate((to, from) => {
    if (ctState.value == true) {
        let formData = new FormData()
        formData.append("projectId", projectId)
        formData.append("docId", from.params.id)
        formData.append("content", content.value)
        formData.append("priority", 0)
        formData.append("autoSave", "true")
        formData.append("title", docInfo.value.title)
        axios.post("/api/doc/content", formData).then((resp) => {
            ElMessage.info({ message: "修改成功", duration: 1000, showClose: true })
            id.value = Number(to.params.id)
            pattern.value = 2
            editState.value = false
            init()
        }).catch((err) => {
            ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
        })
        // btnStatus.value = false
        ctState.value = false
    }
    else {
        id.value = Number(to.params.id)
        pattern.value = 2
        editState.value = false
        init()
    }
    emit("update:editing", false)
})

// 导出文档
const exportDoc = () => {
    exportStatus.value = true
    window.location.href = "/api/doc/export?docId=" + docInfo.value.id
    setTimeout(() => {
        exportStatus.value = false
    }, 3 * 1000);
}

// 生成技术方案
const generate = () => {
    generateStatus.value = true
    axios.get(`/api/doc/generate?docId=${docInfo.value.id}`).then(() => {
        ElMessage.success({ message: "技术方案生成成功", duration: 2000, showClose: true })
        generateStatus.value = false
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
    })
}

// 保存项目阶段
const save = () => {
    let formData = new FormData()
    formData.append("projectId", projectId)
    formData.append("docId", id.value)
    formData.append("content", content.value)
    formData.append("priority", 0)
    formData.append("autoSave", "false")
    formData.append("title", docInfo.value.title)
    btnStatus.value = true
    axios.post("/api/doc/content", formData).then((resp) => {
        ElMessage.success({ message: "修改成功", duration: 2000, showClose: true })
        unlock()
        btnStatus.value = false
        pattern.value = 2
        ctState.value = false
        emit("update:change", true)
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
    })
    emit("update:editing", false)
}

// 解锁
const unlock = () => {
    editState.value = false
}

// 定时任务 -- 5分钟一次自动保存
const timer = setInterval(() => {
    if (ctState.value == true) {
        timeSave()
    }
}, 5 * 60 * 1000);

// 自动保存
const timeSave = () => {
    // 内容发生修改，自动修改
    if (ctState.value == true) {
        setTimeout(() => {
            btnStatus.value = true
            let formData = new FormData()
            formData.append("projectId", projectId)
            formData.append("docId", id.value)
            formData.append("content", content.value)
            formData.append("priority", 0)
            formData.append("autoSave", "true")
            formData.append("title", docInfo.value.title)
            axios.post("/api/doc/content", formData).then((resp) => {
                ElMessage.info({ message: "修改成功", duration: 1000, showClose: true })
                btnStatus.value = false
            }).catch((err) => {
                ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
                btnStatus.value = false
            })
            ctState.value = false
        }, 300)
    }
}

// 取消编辑
const cancel = () => {
    // 锁表单
    var lockDto = {}
    lockDto.userId = Number(store.getters.getUserInfo.id)
    lockDto.projectId = Number(projectId)
    lockDto.id = id.value
    lockDto.docType = "doc"

    loading.value = true
    pattern.value = 2
    editState.value = false
    ctState.value = false
    // 获取锁信息
    axios.post("/api/doc/cancel", lockDto).then((resp) => {
        content.value = resp.data
        axios.get("/api/doc/info?projectId=" + projectId + "&id=" + id.value).then((resp) => {
            docInfo.value = resp.data
            loading.value = false
        }).catch((err) => {
            loading.value = false
            ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
        })
    }).catch((err) => {
        loading.value = false
        ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
    })
    emit("update:editing", false)
}


// 离开页面，自动保存
onUnmounted(() => {
    timeSave()
    if (timer) { //如果定时器还在运行 或者直接关闭，不用判断
        clearInterval(timer); //关闭
    }
    emit("update:editing", false)
})


</script>

<style scoped>
.md-body {
    display: flex;
    padding: 10px;
    /* max-height: 85px; */
}


.md-group {
    margin-right: 50px;
}

.md-box {
    width: 700px;
    height: 700px;
    border: 1px solid var(--el-border-color);
    margin: 20px;
}

.md-btn-group {
    margin: 10px 0 10px auto;
    display: flex;
}

.md-btn {
    margin-left: auto;
    /* margin-right: 50px; */
}

.md-input {
    /* margin-top: 10px; */
    height: 50px;
    width: calc(50vh);
}

.md-update-time {
    display: flex;
    padding-left: 10px;
    padding-top: 23px;
}

.md-pattern :deep(.milkdown .editor) {
    margin-top: 10px;
}
</style>
