<template>
    <div>
        <el-menu style="width:100%;" mode="horizontal" router :default-active="activeIndex">
            <div class="title">
                <img src="../../../public/pdm.svg" style="width: 25px; height : 25px ;padding-right:10px;margin-top: 3px;">
                <div style="padding-right: 10px;padding-bottom: 1px;">项目对接管理系统</div>
                <el-tag type="info" style="font-size:18px;margin-top: 3px;">V{{ version.systemVersion }}</el-tag>
            </div>
            <el-menu-item index="/index/projectList">项目列表</el-menu-item>
            <el-menu-item index="/index/technicalProposal">技术方案</el-menu-item>
            <el-menu-item index="/index/baseDocumentArea">基础文档区</el-menu-item>
            <div class="i-avatar" @click="skipUser">
                <div style="width:40px;height: 40px; border-radius: 25px; overflow: hidden;">
                    <el-image :src="userInfo.imgSrc" style="width:40px;height: 40px;">
                        <template #error>
                            <el-avatar :src="icon" />
                        </template>
                    </el-image>
                </div>
                <el-button v-if="userInfo.name" link class="i-name">{{ userInfo.name }}</el-button>
                <el-button v-else link class="i-name">{{ userInfo.openid }}</el-button>
            </div>
            <el-link type="info" style=" margin-top: 8px;margin-right: 10px;" @click="logout">退出登录</el-link>
        </el-menu>
    </div>
    <router-view />
</template>

<script setup>
import icon from "../../assets/icon.png"
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from "vuex";
import axios from 'axios';
import { ElMessage } from 'element-plus';
const router = useRouter()
const store = useStore()
const r = useRoute()

// 用户信息
const userInfo = ref({})

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

const skipUser = () => {
    router.push({
        name: 'UserInfo'
    })
}


// 取消页面本身拖拽事件
document.addEventListener('drop', function (e) {
    e.preventDefault()
}, false)
document.addEventListener('dragover', function (e) {
    e.preventDefault()
}, false)

// 系统版本号
const version = ref('')
const getVersion = () => {
    axios.get("/api/system/version").then((resp) => {
        version.value = resp.data
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
    })
}
const checkToken = () => {
    axios.get("/api/check").then((resp) => {
        resp.data.imgSrc = "/api/avatar?type=user&id=" + resp.data.id
        store.commit("saveUserInfo", resp.data)
        userInfo.value = resp.data
    }).catch(() => {

    })
}
const activeIndex = ref("")
onMounted(() => {
    activeIndex.value = r.fullPath
    getVersion()
    checkToken()
})



</script>

<style scoped>
.title {
    display: flex;
    font-size: 20px;
    min-width: 180px;
    padding: 16px 20px 0 50px;
    height: 40px;
}

.pj-top {
    display: flex;
}

.pj-menu {
    width: 100%;
}

.i-avatar {
    margin: 10px 15px 0 auto;
    display: flex;

}

.i-name {
    padding: 12px 0 15px 5px;
    font-size: 18px;
}

.badge:deep(.el-badge__content.is-fixed) {
    top: 14px;
}
</style>
