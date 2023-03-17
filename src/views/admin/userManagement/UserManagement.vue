<template>
    <div>
        <CreateUser v-if="dialogVisible" v-model="dialogVisible" @saveUser="userList()"></CreateUser>
        <InfoUser v-if="dialogInfo" v-model="dialogInfo" :userId="userId"></InfoUser>
        <EditUser v-if="dialogEdit" v-model="dialogEdit" :userId="userId" @changed="userList();"></EditUser>
        <RestPwd v-if="dialogRestPwd" v-model="dialogRestPwd" :userId="userId"></RestPwd>
    </div>

    <div class="um-body" v-loading="loading" element-loading-text="数据加载中...">
        <div class="um-operation">
            <el-button class="um-btn" :icon="Plus" type="primary" @click="dialogVisible = true">创建用户</el-button>
            <el-input placeholder="姓名/工号/手机号/用户名等" :prefix-icon="Search" @keydown.enter="userList"
                class="um-operation-input" v-model="pagination.keyword" clearable />
            <el-button :icon="Search" type="primary" @click="userList">查询</el-button>
        </div>

        <el-table :data="tableData" empty-text="暂无用户" style="width: 100%" border>
            <el-table-column label="工号" prop="openid" width="240"></el-table-column>
            <el-table-column label="用户名" prop="username" width="240"></el-table-column>
            <el-table-column label="姓名" prop="name" width="240"></el-table-column>
            <el-table-column label="操作栏">
                <template #default="scope">
                    <el-button size="small" class="um-btn" @click="userId = scope.row.id; dialogInfo = true;">详情
                    </el-button>
                    <el-button type="primary" size="small" class="um-btn"
                        @click="userId = scope.row.id; dialogEdit = true;">编辑</el-button>
                    <el-button type="primary" size="small" class="um-btn"
                        @click="dialogRestPwd = true; userId = scope.row.id;">重置口令
                    </el-button>
                    <el-button size="small" type="danger" class="um-btn" :icon="Delete"
                        @click="userDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="margin-top: 15px;margin-bottom: 15px;" class="pagiantion"
            :current-page="pagination.currentPage" :page-size="pagination.pageSize" :page-sizes="[20, 30, 40, 50]"
            layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" @current-change="handleCurrentChange"
            @size-change="handleSizeChange">
        </el-pagination>

    </div>
</template>
  
<script setup>
import axios from 'axios'
import { ref, onMounted, reactive } from 'vue'
import { Plus, Search, Delete } from '@element-plus/icons-vue';
import CreateUser from './CreateUser.vue';
import InfoUser from './InfoUser.vue';
import EditUser from './EditUser.vue';
import RestPwd from './RestPwd.vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const dialogVisible = ref(false)//创建用户dialog
const dialogRestPwd = ref(false) // 重置密码
const dialogInfo = ref(false) // 详情页面
const dialogEdit = ref(false)

const tableData = ref([])
const loading = ref(false)

const pagination = reactive({
    currentPage: 1,//当前页码
    pageSize: 20,//每页显示的记录数
    total: 0, //总记录数
    keyword: "",// 关键字
    state: 255, // 用户状态
})
const handleCurrentChange = (currentPage) => {
    //修改页码值为选中页码值
    pagination.currentPage = currentPage;
    //执行查询
    userList();
}

const handleSizeChange = (val) => {
    pagination.pageSize = val
    pagination.currentPage = 1
    userList();
}

// 查询用户列表
const userList = () => {
    loading.value = true
    var url = "/api/user/search?state=" + pagination.state
    if (pagination.keyword !== "") {
        var keyword = pagination.keyword.trim()
        url += "&keyword=" + keyword
    }
    if (pagination.currentPage) {
        url += "&page=" + pagination.currentPage
    }
    if (pagination.pageSize) {
        url += "&limit=" + pagination.pageSize
    }
    axios.get(url).then((resp) => {
        pagination.currentPage = resp.data.current
        pagination.pageSize = resp.data.size
        pagination.total = resp.data.total

        tableData.value = resp.data.records
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
    }).finally(() => {
        loading.value = false
    })
}

const userId = ref()

// 删除用户
const userDelete = (item) => {

    ElMessageBox.confirm(
        '确认是否删除工号为 ' + item.openid + " 的 " + item.name + ' 用户？',
        '确认信息',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            axios.delete("/api/user/delete?ids=" + item.id).then(() => {
                ElMessage.success({ message: "删除成功", duration: 2000, showClose: true })
                userList()
            })
        })
        .catch(() => {
            // ElMessage({
            //     type: 'info',
            //     message: '取消',
            // })
        })
}

onMounted(() => {
    userList();
})

</script>
  
<style scoped>
.um-operation {
    margin: 30px 20px;
    display: flex;
    /* float: right; */
}

.um-btn {
    margin: 0 15px 0 0;
}

.um-operation-input {
    margin-left: auto;
    width: 250px;
    margin-right: 15px;
}

.um-body {
    width: 90%;
    margin-left: 5%;
}

.pagiantion {
    display: flex;
    justify-content: center;
}
</style>
  