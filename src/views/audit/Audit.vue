<template>
    <div class="pj-top">
        <el-menu class="pj-menu" mode="horizontal" router :default-active="activeIndex">
            <div class="title">
                <img src="../../../public/pdm.svg" style="width: 25px; height : 25px ;padding-right:10px">
                <div style="padding-right: 10px;">项目对接管理系统</div>
                <el-tag type="info" style="font-size:18px;">{{ version.systemVersion }}</el-tag>
            </div>
            <el-menu-item index="/audit/operationLog">操作日志</el-menu-item>
            <el-menu-item index="/audit/programLog">程序日志</el-menu-item>
            <el-link type="info" class="pj-btn" @click="logout">退出登录</el-link>
        </el-menu>
    </div>

    <router-view />
</template>


<script setup>

import { ref } from 'vue'
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from "vuex";

const store = useStore()
const router = useRouter()
const r = useRoute()
const activeIndex = ref()
activeIndex.value = r.fullPath

const version = ref('')
const init = () => {
    axios.get("/api/system/version").then((resp) => {
        version.value = resp.data
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
    })
}
init()

const logout = () => {
    axios.delete("/api/logout").then(() => {
        router.push({
            path: "/"
        })
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
    })

}

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

.pj-title {
    display: flex;
    padding-left: 40px;
}

.pj-menu {
    width: 100%;
}

.pj-btn {
    margin: 10px 10px 0 auto;
}
</style>