import { createApp } from 'vue'
import App from './App.vue'
import Emitter from 'tiny-emitter'
import store from './store'

var emitter = new Emitter();

const app = createApp(App)
app.config.globalProperties.$msalInstance = {};
app.config.globalProperties.$emitter = emitter;
app.config.globalProperties.$accessToken = {};

app.use(store);
app.mount('#app')