<template>
    <div v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.8)" element-loading-text="数据加载中...">
        <el-form :model="form" label-width="120px" class="rv-form">
            <el-form-item class="rv-name">
                <div>
                    <div class="rv-title">{{ form.version }}</div>
                    <div style="display: flex;">
                        <div class="rv-title-author">
                            {{ form.publisher.name }}
                        </div>
                        <div>
                            创建于&nbsp;{{ format(form.createdAt) }}
                        </div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="对接方案">
                <el-tabs class="rv-tabs" v-model="activeName" type="border-card">
                    <el-tab-pane label="编写" name="write">
                        <CodeMirror v-model="form.content" :id="id" :cmtype="cmtype" />
                    </el-tab-pane>
                    <el-tab-pane label="视图" name="view">
                        <div class="rv-html" v-html="contentHtml(form.content)"></div>
                    </el-tab-pane>
                </el-tabs>

            </el-form-item>
            <el-form-item label="上传文件">
                <el-upload class="rv-upload" drag action="/api/docking/upload" :auto-upload="false" :on-change="upload"
                    :show-file-list=false>
                    <div class="el-upload__text">
                        拖拽文件或点击此处上传文件
                    </div>
                </el-upload>
            </el-form-item>
            <el-form-item label="附件列表">
                <div class="rv-upload-item">
                    <div v-for="uri, name  in form.asserts" style="display: flex;" :key="uri">
                        <div class="rv-link">
                            <el-link type="primary" :href="uri"> {{ name }} </el-link>
                        </div>
                        <el-button @click="remove(name)" type="danger">删除</el-button>
                    </div>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="onSubmit">保存</el-button>
                <el-button @click="returnH">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script  setup>
import axios from 'axios';
import DOMPurify from 'dompurify';
import { ElMessage, ElMessageBox } from 'element-plus';
import hljs from 'highlight.js';
import { marked } from 'marked';
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import CodeMirror from '../../../../components/richText/CodeMirror.vue';

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code) {
        return hljs.highlightAuto(code).value;
    },
    breaks: false,
    gfm: true,
    headerIds: true,
    headerPrefix: '',
    mangle: true,
    pedantic: false,
    sanitize: false,
    silent: false,
    smartLists: false,
    smartypants: false,
    xhtml: false
})

const cmtype = "docking"
const router = useRouter()
const route = useRoute()
const id = ref(0)
const loading = ref(false)
const activeName = ref('write')

id.value = route.params.id
// do not use same name with ref
const form = ref({
    name: '',
    publisher: {
        id: '',
        name: '',
    },
    content: '',
    createdAt: '',
})
const editForm = ref({
    content: '',
    id: 0,
})

// markdown => html
const contentHtml = (val) => {
    return DOMPurify.sanitize(marked.parse(val.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "")), { USE_PROFILES: { html: true } })
}

// 初始化
const init = () => {
    loading.value = true
    axios.get("/api/docking?id=" + id.value).then((resp) => {
        form.value = resp.data
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
    }).finally(() => {
        loading.value = false
    })
}

// 时间格式化
const format = (val) => {
    var date = new Date(val)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return year + "-" + month + "-" + day
}

// 提交修改
const onSubmit = () => {
    editForm.value.content = form.value.content
    editForm.value.id = parseInt(id.value)
    axios.post("/api/docking/edit", editForm.value).then(() => {
        ElMessage.success({ message: "修改成功", duration: 1000, showClose: true })
        router.back();
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
    })
}

const returnH = () => {
    router.back();
}
// 删除文件
const remove = (name) => {
    ElMessageBox.confirm(
        '确认是否删除' + name + '资源？',
        '确认信息',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            loading.value = true
            axios.delete("/api/docking/remove?id=" + id.value + "&filename=" + name).then((resp) => {
                ElMessage.success({ message: "删除成功", duration: 1000, showClose: true })
                form.value.asserts = resp.data
            }).catch((err) => {
                ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
            }).finally(() => {
                loading.value = false
            })
        })
        .catch(() => {
        })
}

// 上传文件
const upload = (rawFile) => {
    let formData = new FormData()
    formData.append("id", id.value)
    formData.append("file", rawFile.raw)
    loading.value = true
    axios.post("/api/docking/upload", formData).then((resp) => {
        ElMessage.success({ message: "上传成功", duration: 1000, showClose: true })
        form.value.asserts = resp.data
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
    }).finally(() => {
        loading.value = false
    })
    return true
}

onMounted(() => {
    init()
})
</script>

<style scoped>
.rv-form {
    margin-top: 20px;
}

.rv-title {
    padding: 10px 0;
    min-height: 0px;
    font-weight: bold;
    font-size: 35px;
    text-align: left;
}

.rv-name {
    font-size: 13px;
    color: rgb(99, 97, 97);
    display: flex;
}

.rv-md {
    width: 80%;
}

.rv-html {
    text-align: start;
    padding-left: 10px;
    overflow: hidden;
    overflow-x: auto;
}

.rv-upload {
    width: 80%;
}

.rv-link {
    justify-content: left;
    min-width: 20%;
    margin-right: 10px;
}

.rv-title-author {
    font-weight: bolder;
    padding-right: 5px;
}


.rv-item {
    color: rgb(221, 81, 81);
}

.rv-tabs {
    width: 80%;
    min-height: calc(38vh);
    border: 1px solid var(--el-border-color);
    border-radius: 0;
}

.rv-upload-item {
    width: 100%;
    text-align: left;
}

.rv-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.rv-tabs:deep(.el-tabs__nav-scroll) {
    padding-left: 16px;
}

.rv-tabs:deep(.el-tabs__header) {
    margin: 0px;
}
</style>
