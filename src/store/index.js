import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
    state: {
        userInfo: { // 登录的用户信息
            id: "",
            openid: "",
            name: "",
            type: "",
            imgSrc: ""
        },
        projectId: "", // 项目ID
        projectName: "", // 项目名称
        managerId: "", //承接人ID
        role: "", // 用户在项目中的角色
    },
    mutations: {
        saveUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        saveImgSrc(state, imgSrc) {
            state.userInfo.imgSrc = imgSrc
        },
        saveProjectId(state, id) {
            state.projectId = id;
        },
        saveProjectName(state, name) {
            state.projectName = name;
        },
        saveManagerId(state, id) {
            state.managerId = id;
        },
        saveRole(state, role) {
            state.role = role
        },
    },
    getters: {
        getUserInfo(state) {
            return state.userInfo
        },
        getProjectId(state) {
            return state.projectId
        },
        getProjectName(state) {
            return state.projectName
        },
        getManagerId(state) {
            return state.managerId
        },
        getRole(state) {
            return state.role
        },
    },
    plugins: [
        createPersistedState({
            // 存储方式：localStorage、sessionStorage、cookies
            storage: window.localStorage,
            // 存储的 key 的key值
            key: "store",
            render(state) {
                // 要存储的数据：本项目采用es6扩展运算符的方式存储了state中所有的数据
                return { ...state };
            }
        })
    ]
})
