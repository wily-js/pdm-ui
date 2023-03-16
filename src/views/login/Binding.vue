<template>
    <div class="wrapper">
        <div class="container" v-loading="loadding" element-loading-background="rgba(255, 255, 255, 0.8)"
            element-loading-text="数据加载中...">
            <div style="margin: 50px 15px">
                <h1 style="font-size: 40px; text-align: center;">设备绑定</h1>
            </div>
            <g-input :err="pErr.username" @blur="handleUsernameBlur" v-model="username" placeholder="用户名" />
            <div class="hit" style="color: #d93025;" v-show="pErr.username">
                <el-icon>
                    <Warning />
                </el-icon>用户名不能为空
            </div>

            <div class="key-select">
                <el-select v-model="usbKey" class="list-select" placeholder="设备" size="large" clearable style="width: 75%;">
                    <el-option v-for="keyItem in keyList" :key="keyItem.name" :label="keyItem.name" :value="keyItem.name" />
                </el-select>
                <el-button v-if="driver == false" type="info" size="large" style="margin-left : 25px ; "
                    @click="openDriver">
                    刷新
                </el-button>
                <el-button v-else type="info" size="large" style="margin-left : 25px ; " @click="getEnumList">
                    刷新
                </el-button>
            </div>

            <g-input :err="pErr.pin" @blur="handlePinBlur" style="margin-top: 15px;" v-model="pin" type="password"
                placeholder="PIN" @enter="handleBinding" />
            <div class="hit" style="color: #d93025;" v-show="pErr.pin">
                <el-icon>
                    <Warning />
                </el-icon>PIN不能为空
            </div>
            <div class="ensure-container">
                <el-button @click="handleBinding" size="large" style="font-size: 16px; width: 100%;" type="primary">
                    绑定
                </el-button>
            </div>
            <a href="/ui/skfdriver.msi"><el-button link class="link-button">
                    下载驱动程序
                </el-button></a>
        </div>

    </div>
</template>
<script setup>
import axios from "axios";
import { ref, reactive, onUnmounted, onMounted } from "vue";
import { ElButton, ElMessage } from 'element-plus';
import { Warning } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import GInput from "../../components/GInput.vue";
import customProtocolCheck from "custom-protocol-check";
import { useStore } from "vuex";

const loadding = ref(false)
const username = ref('');
const usbKey = ref('');
const pin = ref('');
const router = useRouter();

const pErr = reactive({
    username: false,
    pin: false,
});

const keyList = ref([])


const handleBinding = () => {
    if (username.value == '') {
        ElMessage.error("账户信息为空");
        return
    }
    if (usbKey.value == '') {
        ElMessage.error("未选择设备");
        return
    }
    if (pin.value == '') {
        ElMessage.error("pin为空");
        return
    }
    router.push({
        name: "adminLogin"
    })
}
const driver = ref(false)

const openDriver = () => {
    console.log("open");
}
const handleUsernameBlur = (v) => {
    if (v != "") {
        pErr.username = false;
    } else {
        pErr.username = true;
    }
}

const handlePasswordBlur = (v) => {
    if (v != '') {
        pErr.password = false;
    } else {
        pErr.password = true;
    }
}

const handlePinBlur = (v) => {
    if (v != '') {
        pErr.pin = false;
    } else {
        pErr.pin = true;
    }
}

onMounted(() => {
})
</script>


<style scoped>
.wrapper {
    min-width: 1040px;
    min-height: 99.9vh;
    position: relative;
}

.container {
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    padding: 0;
    margin: 0;
    position: absolute;
    min-width: 400px;
    min-height: 500px;
    border-radius: 4px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, .12);
    padding: 30px 45px;
    border: 1px solid #CDD0D6;
}

.ensure-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 50px;
    align-items: center;
    width: 100%;
}

.hit {
    margin-left: 15px;
    margin-top: 5px;
}

.key-select {
    width: 100%;
    height: 56px;
    font-size: 16px;
    padding-top: 20px;
}

.list-select:deep(.el-input--large) {
    font-size: 16px;
    height: 56px;
}

.link-button {
    margin-top: 30px;
}
</style>
