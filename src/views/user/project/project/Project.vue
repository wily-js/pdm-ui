<template>
    <div class="pj-top">
        <el-menu class="pj-menu" mode="horizontal" router :default-active="activeIndex">
            <el-button link class="pj-title" style="font-size:24px;" @click="back">
                <img src="../../../../../public/pdm.svg"
                    style="width: 25px; height : 25px ;padding-right:10px;margin-left: 10px;">
                <div style="padding-right: 10px;">{{ name }}</div>
            </el-button>
            <!-- <el-menu-item index="/project/dockingDocuments">对接文档</el-menu-item> -->
            <el-menu-item index="/project/document">对接文档</el-menu-item>
            <el-menu-item index="/project/apiManagement">接口管理</el-menu-item>
            <el-menu-item index="/project/member">授权成员</el-menu-item>
            <!-- <el-menu-item index="/project/technicalProposal">技术方案管理</el-menu-item> -->
            <!-- <el-menu-item index="/project/baseDocumentArea">基础文档管理</el-menu-item> -->
            <div class="pj-btn">
                <el-button type="primary" @click="back" class="pj-item">项目列表</el-button>
                <div class="pj-avatar" @click="skipUser">
                    <div style="width:40px;height: 40px; border-radius: 25px; overflow: hidden;">
                        <el-image :src="userInfo.imgSrc" style="width:40px;height: 40px;">
                            <template #error>
                                <el-avatar :src="icon" />
                            </template>
                        </el-image>
                    </div>
                    <el-button link class="pj-name">{{ userInfo.name }}</el-button>
                </div>
                <el-link type="info" style=" margin-right: 10px;" @click="logout">退出登录</el-link>
            </div>

        </el-menu>
    </div>

    <router-view />
</template>

<script setup>
import icon from "../../../../assets/icon.png";
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { ElMessage } from 'element-plus';
const store = useStore()
const router = useRouter()
// 用户头像等信息
const userInfo = store.getters.getUserInfo

const role = store.getters.getRole

const logout = () => {
    axios.delete("/api/logout").then(() => {
        router.push({
            path: "/"
        })
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
    })
}

const back = () => {
    store.commit("saveProjectName", '')
    axios.delete("/api/auth/exitProject")
    router.push({
        name: "ProjectList"
    })

}

const skipUser = () => {
    router.push({
        name: 'UserInfoCopy'
    })
}

const name = ref('')
name.value = store.getters.getProjectName
const r = useRoute()
const activeIndex = ref()

const actIndex = () => {
    activeIndex.value = r.fullPath
}

onMounted(() => {
    actIndex()
})



</script>

<style scoped>
.pj-top {
    display: flex;
    height: 58px;
}


.pj-menu {
    width: 100%;
}

.pj-btn {
    margin: 10px 10px 0 auto;
    display: flex;
}

.pj-name {
    padding: 12px 0 15px 5px;
    font-size: 18px;
}

.pj-avatar {
    margin: 2px 15px 0 auto;
    /* margin: 0 10px; */
    display: flex;
}

.pj-item {
    margin-top: 10px;
    margin-right: 5px;
}
</style>
