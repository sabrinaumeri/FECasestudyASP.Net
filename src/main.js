import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';

import 'primevue/resources/primevue.min.css';   //core css
import 'primevue/resources/themes/md-light-indigo/theme.css'; // theme
import 'primeicons/primeicons.css'; // icons
import './assets/site.css';

const app = createApp(App)
app.use(PrimeVue);
app.component('Button', Button);
app.component('Dropdown', Dropdown);
app.mount('#app');


// createApp(App).mount('#app')
