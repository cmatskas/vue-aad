import { createApp } from 'vue';
import App from './App.vue';
import Emitter from 'tiny-emitter';
import store from './store';

const app = createApp(App);

// TODO: consider a module to handle this (aka service or composable)
// TODO: perhaps ... useMSAL
app.config.globalProperties.$msalInstance = {};
// TODO: make the emitter a service
app.config.globalProperties.$emitter = new Emitter();
app.config.globalProperties.$accessToken = {};

app.use(store).mount('#app');
