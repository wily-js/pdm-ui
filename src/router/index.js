import { createRouter, createWebHashHistory } from 'vue-router'
// 还有 createWebHashHistory 和 createMemoryHistory

const routes = [
    {
        path: '/',
        name: 'UserLogin',
        component: () => import('../views/login/UserLogin.vue') // 建议进行路由懒加载，优化访问性能
    },
    {
        path: '/adminLogin',
        name: 'AdminLogin',
        component: () => import('../views/login/AdminLogin.vue')
    },
    {
        path: '/binding',
        name: 'Binding',
        component: () => import('../views/login/Binding.vue')
    },
    {
        path: '/index',
        name: 'Index',
        component: () => import('../views/user/Index.vue'),
        children: [
            {
                path: 'projectList',
                name: 'ProjectList',
                component: () => import('../views/user/project/ProjectList.vue')
            },
            {
                path: 'userCreateProject',
                name: 'UserCreateProject',
                component: () => import('../views/user/project/project/CreateProject.vue')
            },
            {
                path: 'technicalProposal/:chapters*',
                name: 'TechnicalProposal',
                component: () => import('../views/user/technicalProposal/TechnicalProposal.vue'),
            },
            {
                path: 'baseDocumentArea/:chapters*',
                name: 'BaseDocumentArea',
                component: () => import('../views/user/baseDocumentArea/BaseDocumentArea.vue'),
            },
            {
                path: 'userInfo',
                name: 'UserInfo',
                component: () => import('../views/user/userInfo/UserInfo.vue')
            }
        ]
    },
    {
        path: '/project',
        name: 'Project',
        component: () => import('../views/user/project/project/Project.vue'),
        children: [
            {
                path: 'apiManagement',
                name: 'ApiManagement',
                component: () => import('../views/user/project/ApiManagement/ApiListView.vue'),
                children: [

                ]
            },
            {
                path: 'dockingDocuments',
                name: 'DockingDocuments',
                props: true,
                component: () => import('../views/user/project/dockingDocuments/DockingDocuments.vue'),
            },
            {
                path: 'dockingContent/:id',
                name: 'DockingContent',
                props: true,
                component: () => import('../views/user/project/dockingDocuments/DockingContent.vue'),
            },
            {
                path: 'member',
                name: 'Member',
                component: () => import('../views/user/project/member/Member.vue'),
            },
            {
                path: 'userInfo',
                name: 'UserInfoCopy',
                component: () => import('../views/user/userInfo/UserInfo.vue')
            },
            {
                path: 'document',
                name: 'Document',
                component: () => import('../views/user/project/document/Document.vue'),
                children: [
                    {
                        path: ':id?.md',
                        name: 'markdown',
                        props: true,
                        component: () => import('../views/user/project/document/MarkdownFile.vue')
                    },
                    {
                        path: ':id?-:type?',
                        name: 'downloadFile',
                        props: true,
                        component: () => import('../views/user/project/document/DownloadFile.vue')
                    }
                ]
            }
        ]
    },
    {
        path: "/admin",
        name: 'Admin',
        component: () => import('../views/admin/Admin.vue'),
        children: [
            {
                path: 'project',
                name: 'AdminProject',
                component: () => import('../views/admin/projectManagement/Project.vue')
            },
            {
                path: 'userManagement',
                name: 'UserManagement',
                component: () => import('../views/admin/userManagement/UserManagement.vue'),
            },
            {
                path: 'project/setting',
                name: 'SettingProject',
                component: () => import('../views/admin/projectManagement/SettingProject.vue')
            },
            {
                path: 'project/create',
                name: 'CreateProject',
                component: () => import('../views/admin/projectManagement/CreateProject.vue')
            },
            {
                path: 'rootCerts',
                name: 'rootCerts',
                component: () => import('../views/admin/rootCerts/certsManagement.vue'),
            }
        ]
    },
    {
        path: "/audit",
        name: "Audit",
        component: () => import('../views/audit/Audit.vue'),
        children: [{
            path: "operationLog",
            name: "OperationLog",
            component: () => import('../views/audit/operationLog/OperationLog.vue')
        },
        {
            path: "programLog",
            name: "ProgramLog",
            component: () => import('../views/audit/programLog/ProgramLog.vue')
        }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
