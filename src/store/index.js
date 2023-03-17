import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
    state: {
        userInfo: { // 登录的用户信息
            id: "",
            name: "",
            type: "",
            imgSrc: ""
        },
        projectId: "", // 项目ID
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
    },
    getters: {
        getUserInfo(state) {
            return state.userInfo
        },
        getProjectId(state) {
            return state.projectId
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
