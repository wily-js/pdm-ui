<template>
    <el-dialog :close-on-click-modal="false" :show-close="false" title="创建用户" v-bind:modelValue="modelValue"
        @update:modelValue="cancel">
        <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="工号" prop="openid" style="width: 80%;">
                <el-input v-model="form.openid"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name" style="width: 80%;">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username" style="width: 80%;">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone" style="width: 80%;">
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" style="width: 80%;">
                <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="sn" style="width: 80%;">
                <el-input v-model="form.sn"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="userCreate">提交</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity"
import axios from "axios"
import { ElMessage } from "element-plus"


const props = defineProps({
    modelValue: Boolean,
})


const emit = defineEmits(["update:modelValue", "saveUser"])

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
    name: [
        {
            required: true,
            message: '请填写姓名',
            trigger: 'change'
        },
    ],
})

// 创建用户表单
const form = reactive({
    openid: "", // 工号
    name: "",
    username: "",
    phone: "",
    email: "",
    sn: "",
})

// 取消
const cancel = () => {
    form.openid = ""
    form.name = ""
    form.username = ""
    form.phone = ""
    form.email = ""
    form.sn = ""
    ruleForm.value.resetFields()
    emit("update:modelValue", false);
}


// 创建用户
const userCreate = () => {
    ruleForm.value.validate((valid) => {
        //表单校验成功
        if (valid) {
            if (!form) return
            axios.post("/api/user/create", form).then(() => {
                emit("update:modelValue", false);
                emit("saveUser")
                ElMessage.success({ message: "创建成功", duration: 2000, showClose: true })
                form.openid = ""
                form.name = ""
                form.username = ""
                form.phone = ""
                form.email = ""
                form.sn = ""
                ruleForm.value.resetFields()
            }).catch((err) => {
                ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
            })
        }
    })

}

</script>
