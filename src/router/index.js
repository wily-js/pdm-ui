import { createRouter, createWebHashHistory } from 'vue-router'
// 还有 createWebHashHistory 和 createMemoryHistory

const routes = [
    {
        path: '/',
        name: 'userLogin',
        component: () => import('../views/login/UserLogin.vue') // 建议进行路由懒加载，优化访问性能
    },
    {
        path: '/adminLogin',
        name: 'adminLogin',
        component: () => import('../views/login/AdminLogin.vue')
    },
    {
        path: '/binding',
        name: 'binding',
        component: () => import('../views/login/Binding.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
