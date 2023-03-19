<template>
    <div class="mem-body" style="margin-left:15%; margin-top: 30px; width: 70%;">
        <el-tabs v-model="activeName" class="member-tabs" type="border-card">
            <div v-if="loginRole == projectLeader || loginRole == projectManager">
                <div class="mem-invite">
                    <div style="float:left;margin-right: 500px;font-size: 24px;margin-left: 8px;">
                        <strong>授权成员</strong>
                    </div>
                    <div style="font-size: 12px;width: 160px;">
                        <span>您可以邀请成员加入项目。</span>
                    </div>
                    <div style="margin: 20px" />
                    <el-form :label-position="labelPosition" label-width="100px" :model="member" style="max-width: 460px">
                        <el-form-item label="成员名称">
                            <el-select v-model="member.userId" :loading="loading" filterable remote :reserve-keyword="false"
                                default-first-option remote-show-suffix :remote-method="memRemoteMethod" placeholder=" "
                                style="width:100%; " value-key="name">
                                <div v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.8)"
                                    element-loading-text="数据加载中...">
                                    <el-option style="height:45px;" v-for="item in persion" :key="item.id" :value="item.id"
                                        :label="item.name">
                                        <div style="height:45px;display:flex;">
                                            <div class="avatar">
                                                <el-image :src="getAvatar(item.id)" style="width:40px;height: 40px;">
                                                    <template #error>
                                                        <el-avatar :src="icon" />
                                                    </template>
                                                </el-image>
                                            </div>
                                            <div style="margin-top:5px;">{{ item.name }}</div>
                                        </div>
                                    </el-option>
                                </div>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="角色权限">
                            <el-select v-model="member.role" style="width:100%;">
                                <el-option label="开发" :value="0" />
                                <el-option label="对接" :value="1" />
                                <el-option label="管理员" :value="3" />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button :disabled="btnStatus" style="float:left;" @click="addMember()">添加到项目
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="mem-list-title" style="display:flex;">
                <span style="float:left;margin-left: 10px;"><strong>项目已有人员</strong></span>
                <el-input v-model="memberInfo.keyword" placeholder="搜索人员" :prefix-icon="Search"
                    style="width:20%;margin-left: auto;margin-right: 20px;" @keydown.enter="getMemberList" />
                <el-button type="primary" style="margin-right:10px;" @click="getMemberList()">
                    <el-icon>
                        <Search />
                    </el-icon>
                    &nbsp;查询
                </el-button>
            </div>
            <div class="mem-project" style="min-height:80px;" v-loading="bodyLoading"
                element-loading-background="rgba(255, 255, 255, 0.8)" element-loading-text="数据加载中...">
                <el-card shadow="hover" v-for="item, index in tableData" :key="index">
                    <div class="mem-title-body" style="display:flex;">
                        <div class="mem-name" style="display: flex;">
                            <div class="avatar">
                                <el-image :src="getAvatar(item.userId)" style="width:40px;height: 40px;">
                                    <template #error>
                                        <el-avatar :src="icon" />
                                    </template>
                                </el-image>
                            </div>
                            <div style="margin-left:5px;margin-top:10px;">{{ item.name }}</div>
                        </div>
                        <div v-if="loginRole == projectLeader || loginRole == projectManager"
                            style="margin-left:auto;display:flex;">
                            <div class=" mem-search" v-if="item.role !== projectLeader" style="margin-right: 10px;">
                                <el-select v-model="item.role" size="small" style="width:100%;"
                                    @change="(val) => changeEvent(val, item.id)">
                                    <el-option label="开发" :value="0" />
                                    <el-option label="对接" :value="1" />
                                    <el-option label="管理员" :value="3" />
                                </el-select>
                            </div>
                            <div v-else-if="item.role === projectDeveloper" link class="mem-permission"
                                style=" padding-right: 10px;">开发</div>
                            <div v-else-if="item.role === projectInterConnector" link class="mem-permission"
                                style=" padding-right: 10px;">对接</div>
                            <div v-else-if="item.role === projectLeader" link class="mem-permission"
                                style=" padding-right: 10px;">创建者</div>
                            <div v-else-if="item.role === projectManager" link class="mem-permission"
                                style=" padding-right: 10px;">管理员</div>
                            <div v-if="item.role !== projectLeader">
                                <el-button type="danger" :icon="Delete" size="small"
                                    @click="deleteMember(item.id, item.name)" />
                            </div>
                        </div>
                        <div v-else style="margin-left:auto;display:flex;">
                            <div v-if="item.role === projectDeveloper" link class="mem-permission"
                                style=" padding-right: 10px;">开发</div>
                            <div v-if="item.role === projectInterConnector" link class="mem-permission"
                                style=" padding-right: 10px;">对接</div>
                            <div v-if="item.role === projectLeader" link class="mem-permission"
                                style=" padding-right: 10px;">创建者</div>
                            <div v-if="item.role === projectManager" link class="mem-permission"
                                style=" padding-right: 10px;">管理员</div>
                        </div>
                    </div>
                </el-card>
            </div>
        </el-tabs>
    </div>
</template>

<script setup>
import icon from "../../../../assets/icon.png";
import {
    Search,
    ArrowLeft,
    ArrowRight,
    Delete,
    Edit,
    Share,
} from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
const store = useStore()
const activeName = ref('first')
const labelPosition = ref('top')

const projectDeveloper = 0 // 开发者
const projectInterConnector = 1 // 对接者
const projectLeader = 2 // 项目负责人 具有项目内所有内容的管理权限
const projectManager = 3 // 项目管理员 具有项目内所有内容的管理权限

// 加载控制
const loading = ref(false)
// 添加成员表单
const member = reactive({
    userId: ref([]),
    role: 0,
    description: '',
    projectId: '',
})
//登录用户角色
const loginRole = store.getters.getRole;
// 查询loading
const bodyLoading = ref(false)
// 项目ID
const projectId = store.getters.getProjectId


const memberInfo = reactive({
    id: store.getters.getProjectId, // 项目ID
    keyword: '' // 关键字
})

// 防误触
const btnStatus = ref(false)

// 成员角色
const changeData = ref({
    id: "",
    projectId: projectId,
    role: ""
})


const persion = ref([])// 成员名称下拉框
let last = "";
let current = "";
const memRemoteMethod = (keyword) => {

    // 1.  参数检查
    if (!keyword) {
        persion.value = []
        return
    }
    current = keyword;
    // 2. 判断是否已经再有程序运行
    if (last !== "") {
        return
    }
    last = keyword;
    loading.value = true
    // 3. 发起请求
    axios.get("/api/user/nameList?projectId=" + projectId + "&keyword=" + keyword).then((resp) => {
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
        if (last === current) {
            return
        }
        let ky = current;
        last = "";
        current = "";
        memRemoteMethod(ky);
    }).finally(() => {
        loading.value = false;
        last = "";
        current = "";
    })
}

// 成员列表
const tableData = ref({})
const getMemberList = () => {
    bodyLoading.value = true
    var url = "/api/project/member/all?"
    if (memberInfo.id !== "") {
        url += "projectId=" + memberInfo.id
    }
    if (memberInfo.keyword !== "") {
        url += "&keyword=" + memberInfo.keyword
    }
    axios.get(url).then((resp) => {
        tableData.value = resp.data
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
    }).finally(() => {
        bodyLoading.value = false
    })
}

const getAvatar = (id) => {
    return "/api/avatar?type=user&id=" + id + "&r=" + Math.random()
}


// 添加成员
const addMember = () => {
    btnStatus.value = true
    if (member.userId == []) {
        ElMessage.error({ message: "请选择项目成员", duration: 2000, showClose: true });
        return
    }
    member.projectId = memberInfo.id
    member.userId = [member.userId]
    axios.post("/api/project/member/add", member).then((resp) => {
        if (resp.status == 200) {
            ElMessage.success({ message: "添加成功", duration: 2000, showClose: true })
            getMemberList()
        }
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
    }).finally(() => {
        btnStatus.value = false
        member.userId = ''
        member.role = 0
    })

}

// 修改成员角色
const changeEvent = (val, id) => {
    changeData.value.id = id
    changeData.value.role = val
    axios.post("/api/project/member/change", changeData.value).then((resp) => {
        if (resp.status == 200) {
            ElMessage.success({ message: "角色修改成功", duration: 2000, showClose: true })
        }
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
    })
}

// 删除项目成员
const deleteMember = (id, name) => {
    ElMessageBox.confirm(
        '确认是否删除' + name + '用户？',
        '确认信息',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            axios.delete("/api/project/member/delete?projectId=" + projectId + "&id=" + id).then((resp) => {
                if (resp.status == 200) {
                    ElMessage.success({ message: "删除成功", duration: 2000, showClose: true })
                    getMemberList()
                }
            }).catch((err) => {
                ElMessage.error({ message: err.response.data, duration: 2000, showClose: true })
            })

        })
        .catch(() => {
        })
}
onMounted(() => {
    getMemberList()
})
const roleTable = ['开发', '对接', '创建者', '管理员']
</script>

<style scoped>
.member-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.member-tabs:deep(.el-tabs__nav-scroll) {
    overflow: hidden;
    display: flex;
    justify-content: center;
}

.mem-list-title {
    width: 100%;
    height: 30px;
    padding: 10px 0;
    background-color: #fafafa;
    border-bottom: 1px solid #e5e5e5;
    margin-top: 20px;
}

img {
    border-radius: 50px;
    width: 40px;
    height: 40px;
    margin-right: 5px;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 25px;
    margin-right: 5px;
    overflow: hidden;
}
</style>
