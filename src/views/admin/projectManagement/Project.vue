<template>
    <div class="body" style="width: 90%;margin-left: 5%;" v-loading="loading" element-loading-text="数据加载中...">
        <div class="mpj-search" style="margin: 30px 20px;display: flex;">
            <el-button type="primary" style="" @click="skip('')">
                <el-icon>
                    <Plus />
                </el-icon>
                &nbsp;新建项目
            </el-button>

            <el-input v-model="searchItem" class="search-input" placeholder="搜索项目" :prefix-icon="Search"
                style="margin-left:auto;float: right;width:15%;" clearable @keydown.enter="getProject" />
            <el-button type="primary" style="margin-left:20px;" @click="getProject">
                <el-icon>
                    <Search />
                </el-icon>
                &nbsp;查询
            </el-button>

        </div>
        <div style="margin-top:10px;"></div>
        <el-empty v-if="tableData && tableData.length == 0" description="暂无项目" />
        <el-card shadow="hover" v-for="item, index in tableData" :key="index" class="list-item">
            <div style="display: flex;justify-content: space-between;" @click="skip(item.id)">
                <div style="min-width: 200px;display: flex; justify-items: center;">
                    <div style="display: block;">
                        <div style="font-weight: bold;font-size: 18px;">{{ item.name }}</div>
                        <div style="font-size: 15px;"> {{ format(item.createdAt) }}</div>
                    </div>
                </div>
                <div style="min-width: 150px;">
                    <div class="pj-item-version">版本号：{{ item.version ? item.version : '-' }}</div>
                    <div class="pj-item-persion" style="margin-top: 10px;font-size: 15px;">
                        负责人：{{ item.manager.name }}</div>
                </div>
            </div>
        </el-card>
        <el-pagination style="margin-top: 15px;" :currentPage="currentPage" :page-size="pageSize"
            :page-sizes="[20, 30, 40, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useStore } from "vuex";
import axios from 'axios';
import { ElMessage } from 'element-plus';

const router = useRouter()
const store = useStore()
const tableData = ref([]);
const searchItem = ref('')
const typeValue = ref('')

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const path = ref('')


const handleSizeChange = (val) => {
    pageSize.value = val
    currentPage.value = 1
    getProject()
}

const handleCurrentChange = (val) => {
    currentPage.value = val
    getProject()
}

// 时间格式化
const format = (val) => {
    var date = new Date(val)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return year + "-" + month + "-" + day
}

const getProject = () => {
    loading.value = true
    path.value = "/api/project/search?page=" + currentPage.value + "&limit=" + pageSize.value
    if (searchItem.value != "") {
        path.value = path.value + "&keyword=" + searchItem.value
    }
    if (typeValue.value != "") {
        path.value = path.value + "&stage=" + typeValue.value
    }
    axios.get(path.value).then((resp) => {
        tableData.value = resp.data.records
        if (!tableData.value) {
            tableData.value = [];
        }
        total.value = resp.data.total
        loading.value = false
    }).catch((err) => {
        loading.value = false
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true })
    })

}

onMounted(() => { getProject() })

const skip = (projectId) => {
    loading.value = true
    if (projectId === '') {
        router.push({
            path: "project/create"
        });
    }
    else {
        router.push({
            path: "project/setting"
        });
        store.commit("saveProjectId", projectId);
    }
}
</script>

<style scoped>
.list-item {
    text-align: left;
    width: 100%;
    margin-top: 10px;
}

.pagination {
    margin-top: 50px;
    display: flex;
    justify-content: center;
}
</style>
