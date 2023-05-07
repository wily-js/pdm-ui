<template>
    <div class="layout">
        <div style="padding: 10px; margin-left:auto">布局</div>
        <el-radio-group v-model="layout" class="layout-radio" size="large" @change="changeLayout">
            <el-radio label="icon" size="large">图标</el-radio>
            <el-radio label="list" size="large">列表</el-radio>
        </el-radio-group>
    </div>

    <BaseAreaList v-if="layout == 'list'" :userType="userType"></BaseAreaList>
    <BaseAreaIcon v-else-if="layout == 'icon'" :userType="userType"></BaseAreaIcon>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseAreaIcon from '../../../components/baseArea/BaseAreaIcon.vue'
import BaseAreaList from '../../../components/baseArea/BaseAreaList.vue'
import axios from 'axios';
import { useStore } from 'vuex';
const layout = ref('')
const router = useRouter()
const store = useStore()
const userType = store.getters.getUserInfo.type

const changeLayout = (val) => {
    store.commit("saveLayout", val)
}
onMounted(() => {
    layout.value = store.getters.getLayout
})
</script>

<style scoped>
.layout {
    display: flex;
    padding-top: 20px;
}

.layout-radio {
    padding-right: 20px;
}
</style>
