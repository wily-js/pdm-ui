<template>
    <div class="cpj-body">
        <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="项目名称：" prop="name">
                <el-input v-model="form.name" placeholder="请输入项目名称" class="cpj-name" />
            </el-form-item>
            <el-form-item label="项目描述：" prop="description">
                <el-input v-model="form.description" class="cpj-describe" type="textarea" :rows="10" />
            </el-form-item>
            <el-form-item label="项目负责人：" prop="manager">
                <el-input v-model="realName" :disabled=true class="cpj-name"></el-input>
            </el-form-item>
            <el-form-item label="项目版本号:" prop="version">
                <el-input v-model="form.version" placeholder="请输入项目版本号" class="cpj-name" />
            </el-form-item>
            <el-form-item class="cpj-btn">
                <el-button @click="$router.back()">取消</el-button>
                <el-button type="primary" @click="save()">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import icon from "../../../../assets/icon.png";
import axios from 'axios';
import { ref } from 'vue';
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

// 下拉框loading
const loading = ref(false)
const store = useStore()
const router = useRouter()
const persion = ref([])
const realName = store.getters.getUserInfo.name
const ruleForm = ref()
const form = ref({
    name: '',
    description: '',
    manager: '',
    version: '',
})

// 表单校验规则
const rules = ref({
    name: [
        {
            required: true,
            message: '请填写项目名称',
            trigger: 'change'
        },
    ],
    manager: [
        {
            required: true,
            message: '请选择项目负责人',
            trigger: 'change'
        },
    ],

})

const save = () => {
    ruleForm.value.validate((valid) => {
        if (valid) {
            axios.post("/api/project/create", form.value).then(() => {
                ElMessage.success({ message: "创建项目成功", duration: 2000, showClose: true });
                router.back()
            }).catch((err) => {
                ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
            })
        }
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


</script>

<style scoped>
.cpj-body {
    width: 70%;
    margin: 30px 0 0 15%;
    padding: 10px;
    border: 1px solid var(--el-border-color);
    border-radius: 3px;
}

.cpj-name {
    width: 20%;
    font-size: large;
    font-weight: bolder;
}

.cpj-describe {
    width: 50%;
}

.cpj-font {
    width: 20%;
    font-size: 15px;
}

.cpj-btn {
    margin-top: 50px;
}

img {
    border-radius: 50px;
    width: 40px;
    height: 40px;
    margin-right: 5px;
}
</style>
