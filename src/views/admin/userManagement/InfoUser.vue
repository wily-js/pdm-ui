<template>
  <el-dialog :close-on-click-modal="false" :show-close="false" title="用户详情" v-bind:modelValue="modelValue"
    @update:modelValue="determine">
    <el-descriptions direction="horizontal" :column="1" border>
      <el-descriptions-item label="工号">
        {{ userInfo.openid }}
      </el-descriptions-item>
      <el-descriptions-item label="用户名">
        {{ userInfo.username }}
      </el-descriptions-item>
      <el-descriptions-item label="姓名">
        {{ userInfo.name }}
      </el-descriptions-item>
      <el-descriptions-item label="手机号">{{ userInfo.phone }}
      </el-descriptions-item>
      <el-descriptions-item label="邮箱">{{ userInfo.email }}
      </el-descriptions-item>
      <el-descriptions-item label="身份证号">{{ userInfo.sn }}
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="determine()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from "@vue/runtime-core"
import axios from "axios"
import { ElMessage } from "element-plus"


const props = defineProps({
  userId: Number,
  modelValue: Boolean,
})

const emit = defineEmits(["update:modelValue"])
const userInfo = reactive({
  openid: "",
  username: "",
  name: "",
  phone: "",
  email: "",
  sn: "",
})


const determine = () => {
  emit("update:modelValue", false);
}

onMounted(() => {
  axios.get("/api/user/info?id=" + props.userId).then(({ data }) => {
    userInfo.openid = data.openid
    userInfo.name = data.name
    userInfo.phone = data.phone
    userInfo.username = data.username
    userInfo.email = data.email
    userInfo.sn = data.sn
  }).catch((err) => {
    ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
  })
})

</script>
