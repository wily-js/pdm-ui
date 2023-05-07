import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import store from './store/index';
import useInterceptor from './components/useInterceptor'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import contextmenu from 'v-contextmenu';
import "v-contextmenu/dist/themes/default.css";

const app = createApp(App)

app.use(router).use(store)

app.use(ElementPlus, {
    locale: zhCn,
})
app.use(contextmenu)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
useInterceptor(router)