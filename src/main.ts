import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'vue-sonner/style.css'
import { initAuth } from './app/providers/init-auth'

const app = createApp(App)

app.use(createPinia())

await initAuth()

app.use(router)
app.mount('#app')
