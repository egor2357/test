import './assets/main.css';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Tree from 'primevue/tree';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import ContextMenu from 'primevue/contextmenu';
import Message from 'primevue/message';
import KeyFilter from 'primevue/keyfilter';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.component('Header', Header);
app.component('Footer', Footer);
app.component('Button', Button);
app.component('Tree', Tree);
app.component('Card', Card);
app.component('DatePicker', DatePicker);
app.component('Dialog', Dialog);
app.component('InputText', InputText);
app.component('ContextMenu', ContextMenu);
app.component('Message', Message);
app.directive('keyfilter', KeyFilter);

app.use(PrimeVue, {
  locale: {
    monthNames: [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ],
    dayNamesMin: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    firstDayOfWeek: 0,
  },
  theme: {
    preset: Aura,
  },
});
app.mount('#app');
