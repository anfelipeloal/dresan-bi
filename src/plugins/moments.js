import moment from 'moment';
import 'moment/locale/es';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('moment', moment);
});
