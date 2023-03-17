<template>
    <el-dialog :close-on-click-modal="false" :show-close="false" title="编辑用户" v-bind:modelValue="modelValue"
        @update:modelValue="cancel">
        <el-form ref="ruleForm" :model="userInfo" :rules="rules" label-width="120px">
            <el-form-item label="工号" prop="openid" style="width: 80%;">
                <el-input v-model="userInfo.openid"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username" style="width: 80%;">
                <el-input v-model="userInfo.username"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name" style="width: 80%;">
                <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone" style="width: 80%;">
                <el-input v-model="userInfo.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" style="width: 80%;">
                <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="sn" style="width: 80%;">
                <el-input v-model="userInfo.sn"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel()">取消</el-button>
                <el-button type="primary" @click="edit()">提交</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import axios from "axios";
import { ElMessage } from "element-plus";

const props = defineProps({
    userId: Number,
    modelValue: Boolean,
})
const emit = defineEmits(["update:modelValue", "changed"])

// 获取用户详情
const userInfo = reactive({
    id: 0,
    openid: "",
    username: "",
    name: "",
    phone: "",
    email: "",
    sn: "",
})

const ruleForm = ref()
// 表单校验规则
const rules = ref({
    openid: [
        {
            required: true,
            message: '请填写工号',
            trigger: 'change'
        },
    ],
    password: [
        {
            required: true,
            message: '请填写口令',
            trigger: 'change'
        },
        {
            min: 8,
            message: '口令长度至少8位',
            trigger: 'blur'
        },
    ],
    passwordAgain: [
        {
            required: true,
            message: '请确认填写口令',
            trigger: 'change'
        },
    ]
})


const cancel = () => {
    emit("update:modelValue", false);
}

onMounted(() => {
    axios.get("/api/user/info?id=" + props.userId).then(({ data }) => {
        userInfo.id = data.id
        userInfo.openid = data.openid
        userInfo.name = data.name
        userInfo.username = data.username
        userInfo.phone = data.phone
        userInfo.email = data.email
        userInfo.sn = data.sn
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
    })
})

// 编辑用户信息
const edit = () => {
    ruleForm.value.validate((valid) => {
        if (valid) {
            axios.post("/api/user/adminEdit", userInfo).then(() => {
                ElMessage.success({ message: "编辑成功", duration: 2000, showClose: true })
                emit("update:modelValue", false);
                emit("changed")
                ruleForm.value.resetFields()
            }).catch((err) => {
                ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
            })

        }
    })
}

</script>
