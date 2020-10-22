import { createApp } from 'vue'
import App from './App.vue'
import Emitter from 'tiny-emitter'

var emitter = new Emitter();

const app = createApp(App)
app.config.globalProperties.$msalInstance = {};
app.config.globalProperties.$emitter = emitter;
app.mount('#app')



