<template>
    <div class="common-layout">
        <el-container>
            <el-aside>
                <api-list-sider @showDefault="showApiContent"></api-list-sider>
            </el-aside>
            <el-main>
                <div class="df-topic" v-if="show">请新增或者编辑已经存在的接口</div>
                <api-list-content v-if="!show"></api-list-content>
                <!-- <api-list-content></api-list-content> -->
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import ApiListSider from './components/ApiListSider.vue';
import ApiListContent from './components/ApiListContent.vue';
import { onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore()

const show = ref(true);

const showApiContent = (defaultShow) => {
    show.value = defaultShow;
};

onUnmounted(() => {
    store.commit("saveCaseId", 0)
})
</script>

<style  scoped>
.df-topic {
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    justify-content: center;
    height: calc(80vh);
    flex-direction: column;
    font-size: 40px;
    font-weight: bold;
}
</style>