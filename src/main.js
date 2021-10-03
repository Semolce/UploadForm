import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import {AIMarker} from './components/ui-picture-bd-marker'

const app = createApp(App)
app.use(store).use(ElementPlus).use(router).use(AIMarker).mount('#app')