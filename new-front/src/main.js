import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import router from './utils/router.js'
import store from './utils/store.js'
import './utils/config.js'
// import 'amfe-flexible'



const app = createApp(App)

app.use(store)
app.use(router)
app.mount('#app')
