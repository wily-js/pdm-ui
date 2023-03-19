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
                path: 'interfaceDirectory',
                name: 'InterfaceDirectory',
                component: () => import('../views/user/project/interfaceDirectory/InterfaceDirectory.vue'),
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
                path: 'member',
                name: 'Member',
                component: () => import('../views/user/project/member/Member.vue'),
            },
            {
                path: 'userInfo',
                name: 'UserInfoCopy',
                component: () => import('../views/user/userInfo/UserInfo.vue')
            },
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
                name: 'settingProject',
                component: () => import('../views/admin/projectManagement/SettingProject.vue')
            },
            {
                path: 'project/create',
                name: 'createProject',
                component: () => import('../views/admin/projectManagement/CreateProject.vue')
            }
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
