<template>
    <el-dialog :close-on-click-modal="false" :show-close="false" title="重置口令" v-bind:modelValue="modelValue"
        @update:modelValue="cancel">
        <el-form ref="ruleForm" :model="pwdForm" :rules="rules" label-width="120px">
            <el-form-item label="口令" prop="password" style="width: 80%;">
                <el-input v-model="pwdForm.password" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认口令" prop="passwordAgain" style="width: 80%;">
                <el-input v-model="pwdForm.passwordAgain" type="password" show-password></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel()">取消</el-button>
                <el-button type="primary" @click="resetPwd()">提交</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity"
import { onMounted } from "@vue/runtime-core"
import axios from "axios"
import { ElMessage } from "element-plus"


const props = defineProps({
    userId: Number,
    modelValue: Boolean,
})
const emit = defineEmits(["update:modelValue"])

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

// 重置密码表单
const pwdForm = reactive({
    password: "",
    passwordAgain: ""
})

const cancel = () => {
    pwdForm.password = ""
    pwdForm.passwordAgain = ""
    emit("update:modelValue", false)
}

const pwdInfo = reactive({
    id: 0,
    newPwd: ""
})

const resetPwd = () => {
    ruleForm.value.validate((valid) => {
        if (valid) {
            check()
            pwdInfo.newPwd = pwdForm.passwordAgain
            axios.post('/api/user/resetPwd', pwdInfo).then(() => {
                ruleForm.value.resetFields()
                ElMessage.success({ message: "修改成功", duration: 2000, showClose: true })
                emit("update:modelValue", false)
            }).catch((err) => {
                ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
            })
        }
    })
}

// 检查两次密码是否一致
const check = () => {
    if (pwdForm.password !== pwdForm.passwordAgain) {
        ElMessage.error({ message: "两次输入的新口令不一致，请重新输入", duration: 2000, showClose: true });
        return
    }
}

onMounted(() => {
    pwdInfo.id = props.userId
})

</script>