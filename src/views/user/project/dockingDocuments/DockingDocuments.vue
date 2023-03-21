<template>
    <div class="vs-body" v-loading="loading" element-loading-text="数据加载中...">
        <div>
            <el-button :icon="Plus" round type="primary" @click="dialogVisible = true">
                新建文档
            </el-button>
        </div>
        <div class="content_bound">
            <el-empty v-if="items && items.length == 0" description="暂无对接文档" />
            <div v-for="item, index in items" class="vs-item" :key="item">
                <div style="display: block;width: 150px;">
                    <div style="color: #909399;font-size: 12px;">{{ format(item.createdAt) }}</div>
                    <div style="display: flex; align-items: center; ">
                        <div class="avatar">
                            <el-image :src="getAvatar(item.publisher.id)" style="width:40px;height: 40px;">
                                <template #error>
                                    <el-avatar :src="icon" />
                                </template>
                            </el-image>
                        </div>
                        <div>{{ item.publisher.name }}</div>
                    </div>
                </div>
                <div class="vs-content">
                    <div class="vs-name">
                        <div>{{ item.name }}</div>
                        <div>
                            <el-button :icon="EditPen" type="primary" @click="skip(item.id)" text
                                v-if="userId == item.publisher.id"></el-button>
                            <el-button :icon="Delete" type="danger" text @click="remove(item.id, item.name)"></el-button>
                        </div>
                    </div>
                    <el-collapse v-model="activeNams[index]" class="vs-coll">
                        <el-collapse-item title="对接方案" name="1">
                            <div class="vs-markdown">
                                <div v-html="contentHtml(item.content)"></div>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                    <div class="vs-download">
                        <div class="vs-retitle">资源区</div>
                        <div v-for="uri, name  in item.asserts" class="vs-resource" :key="uri">
                            <el-link type="primary" :href="uri"> {{ name }} </el-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-pagination style="margin-top: 15px;" class="vs-pagiantion" :current-page="pagination.currentPage"
            :page-size="pagination.pageSize" :page-sizes="[20, 30, 40, 50]" layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total" @current-change="handleCurrentChange" @size-change="handleSizeChange">
        </el-pagination>

        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" :show-close="false" title="新建对接文档" width="30%">
            <el-form ref="ruleForm" :model="form" label-width="120px" :rules="rules">
                <el-form-item label="文档名称" style="width: 80%" prop="name">
                    <el-input v-model="form.name">
                    </el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false; form.version = null; ruleForm.resetFields()">
                        取消
                    </el-button>
                    <el-button type="primary" @click="newDockingDoc">提交</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import icon from "../../../../assets/icon.png";
import axios from 'axios';
import { EditPen, Delete, Plus } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { marked } from "marked";
import hljs from "highlight.js";
import 'highlight.js/styles/monokai-sublime.css';
import DOMPurify from 'isomorphic-dompurify';

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


const router = useRouter()
const loading = ref(false)
const activeNams = ref(['1'])
const ruleForm = ref()

const pagination = ref({
    currentPage: 1,//当前页码
    pageSize: 20,//每页显示的记录数
    total: 0, //总记录数
    userName: "",
    name: "",
    description: ""
})
const dialogVisible = ref(false);
const items = ref([])
const store = useStore()
const projectId = store.getters.getProjectId
const role = store.getters.getRole
const userId = store.getters.getUserInfo.id

const handleCurrentChange = (currentPage) => {
    //修改页码值为选中页码值
    pagination.value.currentPage = currentPage;
    //执行查询
    init();
}

const handleSizeChange = (val) => {
    pagination.value.pageSize = val
    pagination.value.currentPage = 1
    init();
}
const init = () => {
    loading.value = true
    var url = "/api/docking/all?projectId=" + projectId
    if (pagination.value.currentPage) {
        url += "&page=" + pagination.value.currentPage
    }
    if (pagination.value.pageSize) {
        url += "&limit=" + pagination.value.pageSize
    }
    axios.get(url).then((resp) => {
        pagination.value.currentPage = resp.data.current
        pagination.value.pageSize = resp.data.size
        pagination.value.total = resp.data.total
        items.value = resp.data.records
    }).catch((err) => (
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true })
    )).finally(() => {
        loading.value = false
    })
}
const getAvatar = (id) => {
    return "/api/avatar?type=user&id=" + id + "&r=" + Math.random()
}

const remove = (id, name) => {
    ElMessageBox.confirm(
        '确认是否删除' + name + '文档？',
        '确认信息',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            loading.value = true
            axios.delete("/api/docking/delete?id=" + id + "&projectId=" + projectId).then(() => {
                ElMessage.success({ message: "删除成功", duration: 2000, showClose: true })
                init()
            }).catch((err) => (
                ElMessage.error({ message: err.response.data, duration: 2000, showClose: true })
            )).finally(() => {
                loading.value = false
            })

        })
        .catch(() => {
        })
}

const format = (val) => {
    var date = new Date(val)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return year + "-" + month + "-" + day
}

const contentHtml = (val) => {
    return DOMPurify.sanitize(marked.parse(val.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "")), { USE_PROFILES: { html: true } })
}

const form = ref({})

// 表单校验规则
const rules = ref({
    name: [
        {
            required: true,
            message: '请填写文档名',
            trigger: 'blur'
        },
    ],

})

const newDockingDoc = () => {
    ruleForm.value.validate((valid) => {
        if (valid) {
            dialogVisible.value = false
            loading.value = true
            form.value.projectId = projectId
            axios.post("/api/docking/create", form.value).then((resp) => {
                ElMessage.success({ message: "新建成功", duration: 2000, showClose: true })
                init()
                router.push("dockingContent/" + resp.data)
            }).catch((err) => {
                ElMessage.error({ message: err.response.data, duration: 2000, showClose: true })
            }).finally(() => {
                loading.value = false
                form.value.version = null
            })
        }
    })
}

const skip = (val) => {
    router.push("dockingContent/" + val)
}
onMounted(() => {
    init()
})
</script>

<style scoped>
.vs-body {
    margin: 20px;
}

.vs-item {
    display: flex;
    margin: 15px 30px;
}

.vs-content {
    flex: 1;
    border: 1px solid var(--el-border-color);
    border-radius: 5px;
    min-height: 100px;
}

.vs-name {
    padding: 20px;
    font-size: 30px;
    display: flex;
    justify-content: space-between;
}

.vs-download {
    padding: 20px;
    text-align: left;

}

.vs-coll {
    padding-left: 20px;
}

.vs-resource {
    padding: 10px;
    border: 2px solid var(--el-border-color);
    /* border-radius: 6px; */
    margin-top: -2px;
    /* border-top-right-radius: 6px; */
}

.vs-markdown {
    text-align: left;
    overflow: hidden;
    overflow-x: auto;
}


.vs-markdown:deep(img) {
    max-width: 100%;
}

.vs-markdown:deep(.milkdown .editor) {
    height: 100%;
    max-height: calc(73vh);
}

.vs-coll:deep(.el-collapse-item__content) {
    padding-bottom: 0px;
}

.vs-retitle {
    padding-bottom: 15px;
}

.vs-pagiantion {
    display: flex;
    justify-content: center;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 25px;
    margin-right: 5px;
    overflow: hidden;
}

.content_bound {
    padding-right: 0;
    padding-left: 0;
}


@media screen and (min-width: 992px) {
    .content_bound {
        padding-right: 30px !important;
        padding-left: 30px !important;
    }
}

@media screen and (min-width: 1200px) {
    .content_bound {
        padding-right: 180px !important;
        padding-left: 180px !important;
    }
}
</style>
