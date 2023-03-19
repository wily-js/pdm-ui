<template>
    <div class="body" style="width: 90%;margin-left: 5%;" v-loading="loading" element-loading-text="数据加载中...">
        <div class="mpj-search" style="margin: 30px 20px;display: flex;">
            <el-button type="primary" style="" @click="create()">
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
            <div style="display: flex;justify-content: space-between;"
                @click="enterProject(item.name, item.id, item.manager.id)">
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
        <el-pagination style="margin-top: 15px;" :currentPage="pagination.currentPage" :page-size="pagination.pageSize"
            :page-sizes="[20, 30, 40, 50]" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRouter, } from 'vue-router'
import { useStore } from "vuex";
import { Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
const searchItem = ref('')
const router = useRouter()
const store = useStore()
const tableData = ref([])
const pagination = ref({
    currentPage: 1,//当前页码
    pageSize: 20,//每页显示的记录数
    total: 0, //总记录数
    userName: "",
    name: "",
    description: ""
})
const handleCurrentChange = (currentPage) => {
    //修改页码值为选中页码值
    pagination.value.currentPage = currentPage;
    //执行查询
    getProject();
}
const handleSizeChange = (val) => {
    pagination.value.pageSize = val
    pagination.value.currentPage = 1
    getProject();
}
const loading = ref(false)

const format = (val) => {
    var date = new Date(val)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return year + "-" + month + "-" + day
}
const getProject = () => {
    loading.value = true
    var url = "/api/project/search?"
    if (searchItem.value) {
        url += "keyword=" + searchItem.value
    }
    if (pagination.value.currentPage) {
        url += "&page=" + pagination.value.currentPage
    }
    if (pagination.value.pageSize) {
        url += "&limit=" + pagination.value.pageSize
    }
    axios.get(url).then((resp) => {
        pagination.value.currentPage = resp.data.current
        pagination.value.pageSize = resp.data.size
        pagination.value.total = resp.data.total
        tableData.value = resp.data.records
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true })
    }).finally(() => {
        loading.value = false
    })

}


const create = () => {
    router.push({
        name: "UserCreateProject"
    });
}

const enterProject = (name, projectId, managerId) => {
    loading.value = true
    let id = {
        projectId: projectId
    }
    axios.post("/api/auth/enterProject", id).then((resp) => {
        store.commit("saveProjectName", name)
        store.commit("saveProjectId", projectId)
        store.commit("saveManagerId", managerId)
        store.commit("saveRole", resp.data.role)
        router.push({
            name: "DockingDocuments"
        });
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true })
    }).finally(() => {
        loading.value = false
    })
}

onMounted(() => {
    getProject()
})

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
