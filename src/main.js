import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import Quasar
import { Quasar, Dialog, Notify, Loading, Dark, setCssVar } from 'quasar'
import quasarLang from 'quasar/lang/en-US'
import quasarIconSet from 'quasar/icon-set/material-icons'
import '@quasar/extras/material-icons/material-icons.css'
// src/main.js
import 'quasar/dist/quasar.css'  // ✅ pure CSS build of Quasar
import 'animate.css'



const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Quasar, {
  plugins: { Dialog, Notify, Loading, Dark }, // you can add more plugins
  lang: quasarLang,
  iconSet: quasarIconSet
})

// Bootstrap auth token on app start
import { useAuthStore } from './store/auth'
const auth = useAuthStore(pinia)
auth.loadToken()

// Set brand colors (align with fintech theme)
setCssVar('primary', '#2563eb')
setCssVar('secondary', '#06b6d4')
setCssVar('accent', '#f59e0b')
setCssVar('dark', '#0b1220')

app.mount('#app')
