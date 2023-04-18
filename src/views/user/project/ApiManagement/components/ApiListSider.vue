<template>
    <div class="body">
        <div style="display: flex;margin-top: 5px;margin-bottom: 10px;">
            <el-button type="primary" :icon="Plus" link style="margin-left: 5px;margin-right: 5px;"
                @click="createDialogVisible = true">
            </el-button>
            <el-input style="margin-right: 5px;" placeholder="输入名称或路径查询"></el-input>
        </div>
        <el-tree ref="tree" :default-expanded-keys="expandList" node-key="id" :expand-on-click-node="false" :data="treeData"
            :props="defaultProps" :load="loadNode" lazy @node-click="getToPath" @node-expand="handleNodeExpand"
            @node-collapse="handleNodeCollapse" highlight-current>
            <template #default="{ data }">
                <div class="node-css">
                    <!-- <img :src="folderIcon" style="height:20px;" /> -->
                    <div style="display: flex;">
                        <div v-if="data.method === GET" class="api-method" style="color: #0bbb52;">GET</div>
                        <div v-if="data.method === POST" class="api-method" style="color: #fcb100;">POST</div>
                        <div v-if="data.method === PUT" class="api-method" style="color: #0978e7;">PUT</div>
                        <div v-if="data.method === DELETE" class="api-method" style="color: #e71f12;">DELETE</div>
                        <div>{{ data.name }}</div>
                    </div>
                    <el-dropdown trigger="click">
                        <el-button link>
                            <img :src="ellipsis" style="width:20px;">
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-if="data.type === 'categorize'"
                                    @click="renameCategorize(data)">重命名</el-dropdown-item>
                                <el-dropdown-item v-if="data.type === 'case'"
                                    @click="renameCase(data)">重命名</el-dropdown-item>
                                <el-dropdown-item v-if="data.type === 'categorize'"
                                    @click="createCategorize(data)">添加分类</el-dropdown-item>
                                <el-dropdown-item v-if="data.type === 'categorize'"
                                    @click="createCase(data)">添加用例</el-dropdown-item>
                                <el-dropdown-item v-if="data.type === 'categorize'" divided disabled style="color:red;"
                                    @click="removeCategorize(data)">删除</el-dropdown-item>
                                <el-dropdown-item v-if="data.type === 'case'" divided style="color:red;"
                                    @click="removeCase(data)">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </template>
        </el-tree>
    </div>
    <el-dialog :close-on-click-modal="false" :show-close="false" v-model="createDialogVisible" :title="form.title"
        width="40%">
        <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="名称" prop="name" style="width: 50%;">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="create(form.type)">提交</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :show-close="false" v-model="editDialogVisible" :title="form.title"
        width="40%">
        <el-form ref="ruleForm" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="名称" prop="name" style="width: 50%;">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="rename(form.type)">提交</el-button>
            </span>
        </template>
    </el-dialog>
</template>
  
<script setup>
import ellipsis from "../../../../../assets/ellipsis.png"
import { Plus } from '@element-plus/icons-vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { forEach } from 'lodash';
import { onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex'
// 请求方法定义
const GET = 0
const POST = 1
const PUT = 2
const DELETE = 3
const store = useStore()

// 创建dialog
const createDialogVisible = ref(false)
// 编辑dialog
const editDialogVisible = ref(false)

const emits = defineEmits(["showDefault"]);

const ruleForm = ref()
// 表单校验规则
const rules = ref({
    name: [
        {
            required: true,
            message: '请填写名称',
            trigger: 'change'
        },
    ]
})

// 创建表单
const form = reactive({
    type: "categorize",
    name: "",
    id: 0,
    title: "新建接口集合"
})
// 取消
const cancel = () => {
    form.name = ""
    form.type = "categorize"
    form.id = 0
    form.title = "新建接口集合"
    ruleForm.value.resetFields()
    createDialogVisible.value = false
    editDialogVisible.value = false
}

// 树形结构数据
const treeData = ref([])
const tree = ref(null)
const defaultProps = {
    children: 'children',
    label: 'name',
    isLeaf: "leaf"
}

// 懒加载
const loadNode = (node, resolve) => {
    if (node.data?.constructor != Object) {
        return resolve(treeData.value)
    }
    if (node.data.type === "categorize") {
        let parentId = node.data.id
        axios.get(`/api/categorize/list?parentId=${parentId}`).then((resp) => {
            resp.data.forEach(e => {
                if (e.type === "case") {
                    e.leaf = true
                } else {
                    e.leaf = false
                }
            })
            resolve(resp.data)
        }).catch((err) => {
            ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
        })
    } else {
        resolve([])
    }

}

const getToPath = (data, me, children) => {
    if (data.leaf) {
        store.commit("saveCaseId", data.id)
        emits("showDefault", false);
    } else {
        emits("showDefault", true);
    }
    // findExpandedNode(treeData.value)
    console.log(data);
    console.log(me);
    console.log(children);

}

// 获取树形根数据
const getTree = () => {
    axios.get("/api/categorize/list").then((resp) => {
        resp.data.forEach(e => {
            if (e.type === "case") {
                e.leaf = true
            } else {
                e.leaf = false
            }
        })
        treeData.value = resp.data
    }).catch((err) => {
        ElMessage.error({ message: err.response.data, duration: 1000, showClose: true })
    })
}

// 默认展开的节点
const expandList = ref([])

const handleNodeExpand = (data) => {
    // 保存当前展开的节点
    let flag = false
    expandList.value.some(item => {
        if (item === data.id) { // 判断当前节点是否存在， 存在不做处理
            flag = true
            return true
        }
    })
    if (!flag) { // 不存在则存到数组里
        expandList.value.push(data.id)
    }
}

const handleNodeCollapse = (data) => {
    // 删除当前关闭的节点
    expandList.value.some((item, i) => {
        if (item === data.id) {
            expandList.value.splice(i, 1)
        }
    })
    removeChildrenIds(data) // 这里主要针对多级树状结构，当关闭父节点时，递归删除父节点下的所有子节点
}

const removeChildrenIds = (data) => {
    if (data.children) {
        data.children.forEach(e => {
            const index = expandList.value.indexOf(e.id)
            if (index > 0) {
                expandList.value.splice(index, 1)
            }
            removeChildrenIds(e)
        })
    }
}




// 寻找所有展开的节点id
const findExpandedNode = (data) => {
    expandList.value = []
    data.forEach(e => {
        if (tree.value.getNode(e).expanded === true) {
            console.log("eee = ", e);
            expandList.value.push(e)
            // if (e.children && e.children.length > 0) {
            //     let newList = findExpandedNode(e)
            //     expandList.value = list.concat(newList)
            // }
        }
    })
}


const append = (data, node) => {
    if (!node.children) {
        node.children = []
    }
    node.children.push(data)
    treeData.value = [...treeData.value]
}

const create = (type) => {
    ruleForm.value.validate((valid) => {
        //表单校验成功
        if (valid) {
            if (!form) return
            if (type === "categorize") {
                let data = {
                    name: form.name,
                    parentId: form.id
                }
                axios.post("/api/categorize/create", data).then((resp) => {
                    ElMessage.success({ message: "创建成功", duration: 2000, showClose: true })
                    if (form.id === 0) {
                        treeData.value.push(resp.data)
                    } else {
                        append(resp.data, currentNode.value)
                    }
                }).catch((err) => {
                    ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
                }).finally(() => {
                    cancel()
                })
            } else {
                let data = {
                    name: form.name,
                    categorizeId: form.id
                }
                axios.post("/api/case/create", data).then((resp) => {
                    ElMessage.success({ message: "创建成功", duration: 2000, showClose: true })
                    if (form.id === 0) {
                        treeData.value.push(resp.data)
                    } else {
                        append(resp.data, currentNode.value)
                    }
                    cancel()
                }).catch((err) => {
                    console.log(err);
                    ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
                }).finally(() => {
                    cancel()
                })
            }
        }
    })
}
// 当前节点
const currentNode = ref()
const createCategorize = (node) => {
    currentNode.value = node
    form.id = node.id
    form.type = "categorize"
    form.title = "新建接口分类"
    createDialogVisible.value = true
}

const createCase = (node) => {
    currentNode.value = node
    form.id = node.id
    form.type = "case"
    form.title = "新建接口用例"
    createDialogVisible.value = true
}


const rename = (type) => {
    ruleForm.value.validate((valid) => {
        //表单校验成功
        if (valid) {
            if (!form) return
            let data = {
                id: form.id,
                name: form.name
            }
            if (type === "categorize") {
                axios.post("/api/categorize/edit", data).then((resp) => {
                    ElMessage.success({ message: "重命名成功", duration: 2000, showClose: true })
                    cancel()
                    getTree()
                }).catch((err) => {
                    ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
                })
            } else {
                axios.post("/api/case/edit", data).then((resp) => {
                    ElMessage.success({ message: "重命名成功", duration: 2000, showClose: true })
                    cancel()
                    getTree()
                }).catch((err) => {
                    ElMessage.error({ message: err.response.data, duration: 2000, showClose: true });
                })
            }
        }
    })
}

const renameCategorize = (node) => {
    editDialogVisible.value = true
    form.id = node.id
    form.type = "categorize"
    form.title = "重命名"

}

const renameCase = (node) => {
    editDialogVisible.value = true
    form.id = node.id
    form.type = "case"
    form.title = "重命名"

}

const removeCategorize = (node) => {

}

const removeCase = (node) => {
    ElMessageBox.confirm(
        '确认是否删除 ' + node.name + ' 接口用例？',
        '确认信息',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            axios.delete("/api/case/delete?ids=" + node.id).then(() => {
                ElMessage.success({ message: "删除成功", duration: 2000, showClose: true })
                getTree()
            })
        })
        .catch(() => {
        })
}

onMounted(() => {
    getTree()
})
</script>

<style scoped>
.body {
    margin-left: 5px;
    margin-right: 5px;
}

.api-method {
    margin-top: 3px;
    margin-right: 2px;
    font-size: 12px;
}

.node-css {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
</style>