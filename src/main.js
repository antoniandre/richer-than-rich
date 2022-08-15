import { createApp } from 'vue'
import App from './App.vue'
import PreSsh from 'simple-syntax-highlighter'
import 'simple-syntax-highlighter/dist/sshpre.css'

const app = createApp(App)

app.component('PreSsh', PreSsh)
app.mount('#app')
