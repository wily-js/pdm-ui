<template>
    <div class="doc-body" v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.8)"
        element-loading-text="数据加载中...">
        <div v-if="isEmpty" style="margin-top:10px;margin-left:10px;">
            <el-button :icon="Plus" round type="primary" @click="dialogVisible = true">
                新建文档
            </el-button>
        </div>
        <el-empty v-if="isEmpty" description="暂无对接文档" />
        <split-pane v-else :min="190" class="doc-aside">
            <template v-slot:left>
                <el-scrollbar height="calc(93.5vh)">

                    <el-menu class="doc-menu" router :default-active="activeIndex">
                        <el-input placeholder="搜索" v-model="search" :prefix-icon="Search" @input=searchForDoc clearable>
                        </el-input>
                        <el-button type="primary" class="doc-btn" @click="dialogVisible = true" :disabled="newBtnStatus">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            &nbsp;新建
                        </el-button>

                        <div>
                            <el-menu mode="horizontal" :ellipsis="false">
                                <el-menu-item @click="menuFlag = 0" index="目录">文件目录</el-menu-item>
                                <el-menu-item @click="menuFlag = 1" index="大纲"
                                    :disabled="disabledOutline">&nbsp;&nbsp;大纲&nbsp;&nbsp;
                                </el-menu-item>
                            </el-menu>
                        </div>

                        <div v-for="item, index in docList" :key="index" v-if="menuFlag == 0">
                            <el-menu-item v-if="item.docType === 'markdown'"
                                :index="'/project/document/' + item.id + '.md'">
                                {{ item.title }}
                            </el-menu-item>
                            <el-menu-item v-else :index="'/project/document/' + item.id + '-' + item.docType">
                                {{ item.title }}
                            </el-menu-item>
                        </div>
                        <el-menu>
                            <div v-for="item, index in outlineMenu" :key="index" v-if="menuFlag == 1">
                                <el-menu-item :index="item.text" @click="item.node.scrollIntoView()">
                                    {{ getOutlineTitle(item) }}
                                </el-menu-item>
                            </div>
                        </el-menu>
                    </el-menu>
                </el-scrollbar>
            </template>
            <template v-slot:right>
                <RouterView @update:change="init" @update:editing="toedit" @update:outline="getOutline" />
            </template>
        </split-pane>
    </div>
    <el-dialog v-model="dialogVisible" :close-on-click-modal="false" :show-close="false" title="文档" width="30%">
        <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="名称" prop="name" style="width: 80%;">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type" style="width: 80%;">
                <el-select v-model="form.type" class="m-2" placeholder="Select" size="large">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="文件" style="width: 80%;" v-if="form.type !== 'markdown'">
                <input type="file" placeholder="上传文件" ref="file" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false; form.name = null; form.type = 'markdown'; ruleForm.resetFields()">
                    取消
                </el-button>
                <el-button type="primary" @click="create">提交</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { ref, reactive, watch, onMounted } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import splitPane from "../../../../components/markdown/SplitPane.vue"
const loading = ref(false)
const items = ref()
const docList = ref()
const store = useStore()
const role = ref('')
role.value = store.getters.getRole
const projectId = store.getters.getProjectId
const search = ref("")
const file = ref(null)
const menuFlag = ref(0)
const options = reactive([
    {
        value: 'markdown',
        label: 'markdown',
    },
    {
        value: 'word',
        label: 'word',
    },
    {
        value: 'txt',
        label: 'txt',
    },
    {
        value: 'excel',
        label: 'excel',
    },
    {
        value: 'file',
        label: '其他',
    },
])
const ruleForm = ref()
const form = ref({
    name: "",
    type: "markdown",
})

// 表单校验规则
const rules = ref({
    name: [
        {
            required: true,
            message: '请填写文档名称',
            trigger: 'change'
        },
        {
            max: 50,
            message: '最大长度不可超过50字',
            trigger: 'change'
        },
    ],

})
const dialogVisible = ref(false)

const disabledOutline = ref(true)

const newBtnStatus = ref(false)

// 前端搜索
const searchForDoc = (value) => {
    if (null === value || undefined === value) {
        docList.value = items.value
    } else {
        docList.value = []; // 结果列表置空
        let regStr = '';
        // 初始化正则表达式
        for (let i = 0; i < value.length; i++) {
            regStr = regStr + '(' + value[i] + ')([\\s]*)'; //跨字匹配
        }
        let reg = new RegExp(regStr);
        for (let i = 0; i < items.value.length; i++) {
            let name = items.value[i].title; //按照名字匹配
            let regMatch = name.match(reg);
            if (null !== regMatch) {// 将匹配的数据放入结果列表中
                docList.value.push(items.value[i]);
            }
        }
    }

}

const outlineMenu = ref([])

// 获取大纲
const getOutline = (val) => {
    outlineMenu.value = val
    disabledOutline.value = false
}

const isEmpty = ref(true)
// 初始化
const init = () => {
    loading.value = true;
    axios.get("/api/doc/projectDocList?projectId=" + projectId).then((resp) => {
        dialogVisible.value = false
        items.value = resp.data
        docList.value = items.value
        form.value.name = null;
        if (resp.data.length === 0) {
            isEmpty.value = true;
        } else {
            isEmpty.value = false;
        }
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
    }).finally(() => {
        loading.value = false;
    })
}

// 进入编辑状态
const toedit = (val) => {
    newBtnStatus.value = val
}

// 创建文档
const create = () => {
    ruleForm.value.validate((valid) => {
        if (valid) {
            let formData = new FormData()
            formData.append("projectId", projectId)
            formData.append("title", form.value.name)
            formData.append("docType", form.value.type)
            formData.append("priority", 0)
            loading.value = true
            if (form.value.type != "markdown") {
                formData.append("file", file.value.files[0])
            }
            axios.post("/api/doc/create", formData).then((resp) => {
                init()
                ruleForm.value.resetFields()
                loading.value = false
                dialogVisible.value = false
                ElMessage.success({ message: "新建成功", duration: 1000, showClose: true })
            }).catch((err) => {
                loading.value = false
                ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
            })
        }
    })
}

const r = useRoute()
const activeIndex = ref()
activeIndex.value = r.fullPath

onBeforeRouteUpdate((to, from) => { // 监听路由变化
    activeIndex.value = to.fullPath
    init()
})


const docFlag = ref()
docFlag.value = store.getters.getDocChange

watch(docFlag, (newVal, oldVal) => {
    // console.log(newVal)
})

// 大纲缩进
const getOutlineTitle = (item) => {
    var text = ""
    for (var i = 1; i < item.level; i++) {
        text += "\xa0\xa0\xa0\xa0"
    }
    return text + item.text
}
onMounted(() => {
    init()
})
</script>

<style scoped>
.doc-body {
    /* display: flex; */
    min-width: 1040px;
    min-height: 99.9vh;
}

.doc-aside {
    width: 100%;
    height: 100%;
}

.doc-menu {
    min-height: calc(93.5vh);
    height: 100%;
}

.doc-btn {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
}

.el-main {
    --el-main-padding: 0px;
}

/* .doc-outline-btn{
    width: 100%;
    height: 56px;
    justify-content: left;
} */
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
