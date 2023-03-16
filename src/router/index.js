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
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
