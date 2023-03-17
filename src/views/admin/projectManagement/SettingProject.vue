<template>
    <div class="spj-body" v-loading="bodyLoading" element-loading-background="rgba(255, 255, 255, 0.8)"
        element-loading-text="数据加载中...">
        <el-form :model="form" label-width="120px">
            <el-form-item label="项目名称：">
                <el-input v-model="form.name" v-if="nameEditor" class="spj-name" />
                <div v-else class="spj-name">{{ form.name }}</div>
                <el-button :icon="EditPen" link @click="nameEditor = !nameEditor"></el-button>
            </el-form-item>
            <el-form-item label="项目描述：">
                <el-input v-model="form.description" class="spj-describe" type="textarea" :rows="10" />
            </el-form-item>
            <el-form-item label="创建时间：">
                <div class="spj-font">{{ format(form.createdAt) }}</div>
            </el-form-item>
            <el-form-item label="项目负责人：">
                <el-select v-if="principalEditor" :loading="loading" v-model="form.manager" filterable remote
                    :reserve-keyword="false" default-first-option remote-show-suffix :remote-method="remoteMethod"
                    placeholder=" " style="width:20%;" value-key="name">
                    <div v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.8)"
                        element-loading-text="数据加载中...">
                        <el-option style="height:45px;" v-for="item in persion" :key="item.id" :value="item"
                            :label="item.name">
                            <div style="height:45px;display:flex;">
                                <img v-if="item.avatar" :src="item.avatar" style="width:40px;">
                                <el-avatar v-else :src="icon" style="width:40px;" />
                                <div style="margin-top:5px;">{{ item.name }}</div>
                            </div>
                            {{ item.name }}
                        </el-option>
                    </div>

                </el-select>
                <div v-else class="spj-font">{{ form.manager.name }}</div>

                <el-button :icon="EditPen" link @click="principalEditor = !principalEditor"></el-button>
            </el-form-item>
            <el-form-item class="spj-btn">
                <el-button @click="$router.back()">取消</el-button>
                <el-button type="primary" @click="edit">保存</el-button>
            </el-form-item>
        </el-form>

        <el-collapse>
            <el-collapse-item>
                <template #title>
                    <div class="spj-title">高级</div>
                </template>
                <div class="spj-coll">
                    <div class="spj-hint">
                        如果对项目进行删除会造成不可逆的后果，请再三确认后在进行该操作
                    </div>
                    <el-button type="danger" @click="dialogVisible = true">删除项目</el-button>
                </div>
            </el-collapse-item>
        </el-collapse>
        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" :show-close="false" title="删除" width="30%">
            <div class="spj-warning">你要删除{{ form.name }}。删除的项目无法恢复！你绝对确定吗？</div>
            <div class="spj-prompt">
                <span>此操作可能会导致数据丢失。为防止意外行为，我们要求您确认您的意图。</span>
                <div>
                    <span>请键入</span>
                    <span class="spj-highlighted">{{ form.name }}</span>
                    <span>以继续或关闭此模式以取消</span>
                </div>
            </div>
            <el-input v-model="checkForm.name"></el-input>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="deleteProject">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import icon from "../../../assets/icon.png";
import { reactive, ref } from 'vue'
import { EditPen } from '@element-plus/icons-vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router';

const loading = ref(false)
const nameEditor = ref(false)
const principalEditor = ref(false)
const store = useStore()
const dialogVisible = ref(false)
const router = useRouter()
const form = ref({
    manager: ref({})
})
const editForm = ref({})

const checkForm = reactive({
    name: '',
})

const persion = ref([])
const bodyLoading = ref(false)
form.value.id = store.getters.getProjectId

// 时间格式化
const format = (val) => {
    var date = new Date(val)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return year + "-" + month + "-" + day
}
const init = () => {
    bodyLoading.value = true
    axios.get("/api/project/info?id=" + form.value.id).then((resp) => {
        form.value = resp.data
        bodyLoading.value = false
    }).catch((err) => {
        bodyLoading.value = false
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
    })
}

let lastQueryKeyword = "";
let currentKeyword = "";
const remoteMethod = (keyword) => {

    // 1.  参数检查
    if (!keyword) {
        persion.value = []
        return
    }
    currentKeyword = keyword;
    // 2. 判断是否已经再有程序运行
    if (lastQueryKeyword !== "") {
        return
    }
    lastQueryKeyword = keyword;
    loading.value = true
    // 3. 发起请求
    axios.get("/api/user/nameList?keyword=" + keyword).then((resp) => {
        // 4. 绑定数据
        if (resp.data) {
            resp.data.forEach(e => {
                if (e.avatar) {
                    // 转blob
                    let bstr = window.atob(e.avatar)
                    e.avatar = bstr
                }
            });
        }
        persion.value = resp.data
    }).then(() => {
        // 5. 请求结束后判断最初的查询参数与现在的查询参数是否一致。
        if (lastQueryKeyword === currentKeyword) {
            return
        }
        let ky = currentKeyword;
        lastQueryKeyword = "";
        currentKeyword = "";
        remoteMethod(ky);
    }).finally(() => {
        loading.value = false;
        lastQueryKeyword = "";
        currentKeyword = "";
    })
}


const edit = () => {
    editForm.value.id = form.value.id
    editForm.value.name = form.value.name
    editForm.value.description = form.value.description
    editForm.value.manager = form.value.manager.id
    axios.post("/api/project/edit", editForm.value).then((resp) => {
        ElMessage.success({ message: "修改项目成功", duration: 2000, showClose: true });
        router.back()
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
    })

}

const deleteProject = () => {
    if (checkForm.name == form.value.name) {
        axios.delete("/api/project/delete?id=" + form.value.id).then((resp) => {
            ElMessage.success({ message: "项目删除成功", duration: 2000, showClose: true });
            router.back()
        })
    }
    else {
        ElMessage.error({ message: "项目名称填写错误", duration: 2000, showClose: true });
    }
}

init()

</script>

<style scoped>
.spj-body {
    width: 70%;
    margin: 30px 0 0 15%;
    padding: 10px;
    border: 1px solid var(--el-border-color);
    border-radius: 3px;
}

.spj-name {
    width: 20%;
    font-size: large;
    font-weight: bolder;
}

.spj-describe {
    width: 50%;
}

.spj-font {
    width: 20%;
    font-size: 15px;
}

.spj-btn {
    margin-top: 50px;
}

.spj-title {
    padding: 10px 0 10px 20px;
    font-size: x-large;
    font-weight: bolder;
}

.spj-coll {
    text-align: start;
    padding: 10px 0 10px 20px;
}

.spj-hint {
    padding-bottom: 20px;
}

.spj-warning {
    text-align: left;
    color: #F56C6C;
    margin-bottom: 20px;
}

.spj-prompt {
    text-align: left;
    margin-bottom: 20px;
}

.spj-highlighted {
    background-color: #f5c6c6;
    color: #803939;
    margin: 0 10px;
    padding: 2px 5px;
    border-radius: 3px;
}

img {
    border-radius: 50px;
    width: 40px;
    height: 40px;
    margin-right: 5px;
}
</style>
