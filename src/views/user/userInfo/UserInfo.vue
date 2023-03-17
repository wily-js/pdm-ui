<template>
    <div class="user-body" v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.8)"
        element-loading-text="数据加载中...">
        <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px" class="user-form">
            <el-form-item label="姓名" prop="name">
                <div class="user-name">{{ form.name }}</div>
            </el-form-item>
            <el-form-item label="头像">
                <el-upload class="avatar-uploader" :auto-upload="false" :on-change="changeUpload" :show-file-list=false>
                    <el-image :src="imageUrl" class="avatar" style="width:80px;height: 80px;">
                        <template #error>
                            <el-icon class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </template>
                    </el-image>
                </el-upload>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="form.phone" v-if="phoneEditor" style="width:30%;"></el-input>
                <div v-else style="width:30%;">{{ form.phone }}</div>
                <el-button v-if="phoneEditor" :icon="EditPen" t link @click="phoneEditor = !phoneEditor; edit()">
                    提交</el-button>
                <el-button v-else :icon="EditPen" link @click="phoneEditor = !phoneEditor"></el-button>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" v-if="emailEditor" style="width:30%;"></el-input>
                <div v-else style="width:30%;">{{ form.email }}</div>
                <el-button v-if="emailEditor" :icon="EditPen" link @click="emailEditor = !emailEditor; edit()">提交
                </el-button>
                <el-button v-else :icon="EditPen" link @click="emailEditor = !emailEditor"></el-button>
            </el-form-item>

            <el-form-item label=" 旧口令" prop="oldPassword">
                <el-input v-model="form.oldPassword" class="user-password" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item label="新口令" prop="newPassword">
                <el-input v-model="form.newPassword" class="user-password" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认口令" prop="passwordAgain">
                <el-input v-model="form.passwordAgain" class="user-password" type="password" show-password>
                </el-input>
            </el-form-item>
            <el-form-item class="user-btn">
                <el-button @click="router.back()">取消</el-button>
                <el-button type="primary" @click="modifyPwd()">确认修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from "vuex";
import axios from 'axios';
import { ElMessage, ElMessageBox, ElSteps } from 'element-plus';
import { Cherry, Flag, EditPen } from '@element-plus/icons-vue';

const store = useStore()
const router = useRouter()

// 表单校验
const ruleForm = ref()
// 表单信息
const form = reactive({
    id: store.getters.getUserInfo.id,
    name: store.getters.getUserInfo.name,
    oldPassword: '',
    newPassword: '',
    passwordAgain: '',
    phone: '',
    email: ''
})
// 修改手机号
const phoneEditor = ref(false)
// 修改邮箱
const emailEditor = ref(false)

const loading = ref(false)
// 表单校验规则
const rules = ref({
    oldPassword: [
        {
            required: true,
            message: '请输入旧口令',
            trigger: 'change'
        },
    ],
    newPassword: [
        {
            required: true,
            message: '请输入新口令',
            trigger: 'change'
        },
    ],
    passwordAgain: [
        {
            required: true,
            message: '请再次输入新口令',
            trigger: 'change'
        },
    ]

})

const init = () => {
    let userId = store.getters.getUserInfo.id
    axios.get("/api/user/info?id=" + userId).then((resp) => {
        form.phone = resp.data.phone
        form.email = resp.data.email
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
    })
}
const edit = () => {
    let editInfo = {}
    editInfo.id = store.getters.getUserInfo.id
    editInfo.phone = form.phone
    editInfo.email = form.email
    axios.post("/api/user/edit", editInfo).then(() => {
        ElMessage.success({ message: "编辑成功", duration: 2000, showClose: true })
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
    }).finally(() => {
        init()
    })

}
const check = () => {
    if (form.newPassword !== form.passwordAgain) {
        ElMessage.error({ message: "两次输入的新口令不一致，请重新输入", duration: 2000, showClose: true });
        return
    }
}

const modifyPwd = () => {
    ruleForm.value.validate((valid) => {
        if (valid) {
            check()
            let info = {}
            info.id = form.id
            info.oldPwd = form.oldPassword
            info.newPwd = form.newPassword
            loading.value = true
            axios.post('/api/user/modifyPwd', info).then(() => {
                ElMessage.success({ message: "修改成功", duration: 2000, showClose: true })
                logout()
            }).catch((err) => {
                ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
            }).finally(() => {
                loading.value = false
            })
        }
    })
}

// 退出登录
const logout = () => {
    axios.delete("/api/logout").then(() => {
        router.push({
            path: "/"
        })
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
    })
}

// 更新头像
const updateAvatarInfo = ref({
    id: store.getters.getUserInfo.id,
    avatar: ""
})
// 头像图片
const imageUrl = ref("/api/avatar?type=user&id=" + form.id + "&r=" + Math.random())

const changeUpload = (rawFile, allFileList) => {
    if (rawFile.raw.type !== 'image/jpeg' && rawFile.raw.type !== 'image/png') {
        ElMessage.error('头像需要为jpeg或png格式')
        return false
    } else if (rawFile.raw.size / 1024 > 64) {
        ElMessage.error('头像大小不能超过64KB')
        return false
    }
    let formData = new FormData()
    formData.append("avatar", rawFile.raw)
    formData.append("id", form.id)
    loading.value = true
    axios.post("/api/user/updateAvatar", formData).then(() => {
        imageUrl.value = "/api/avatar?type=user&id=" + form.id + "&r=" + Math.random()
        store.commit("saveImgSrc", imageUrl.value)
        ElMessage.success({ message: "头像修改成功", duration: 2000, showClose: true });
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
    }).finally(() => {
        loading.value = false
    })

    return true
}

const upload = () => {
    loading.value = true
    axios.post("/api/user/updateAvatar", updateAvatarInfo.value).then((resp) => {
        ElMessage.success({ message: "头像修改成功", duration: 2000, showClose: true });
        store.commit("saveAvatar", imageUrl.value)
        loading.value = false
    }).catch((err) => {
        loading.value = false
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
    })
}
watch(updateAvatarInfo.value, () => {
    upload();
})

onMounted(() => {
    init()

})
</script>

<style scoped>
.user-body {
    width: 70%;
    margin: 30px 0 0 15%;
}

.user-form {
    padding: 30px;
    border: 1px solid var(--el-border-color);
    border-radius: 3px;
}

.user-name {
    font-size: 30px;
    padding: 0 0 50px 0;
}

.user-text {
    font-size: 15px;
    margin-top: -10px;
}

:deep(.el-upload-dragger) {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px dashed var(--el-border-color);
}

.user-btn {
    margin-top: 50px;
}

.user-password {
    width: 30%;
}


.avatar-uploader {
    width: 80px;
    height: 80px;
    border: 1px dashed #8c939d;
    border-radius: 42px;
    overflow: hidden;
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    text-align: center;
}
</style>
