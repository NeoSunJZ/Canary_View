import {
   createApp
} from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import ViewUIPlus from 'view-ui-plus'
import router from './router'
import 'ant-design-vue/dist/antd.css';
import 'view-ui-plus/dist/styles/viewuiplus.css'
import './style.less'; // 用于覆盖上面定义的变量
const app = createApp(App);
app.use(Antd)
   .use(router)
   .use(ViewUIPlus)
   .mount('#app');