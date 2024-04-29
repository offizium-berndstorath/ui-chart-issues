import Vue from 'nativescript-vue'
import Home from './components/Home.vue'

declare let __DEV__: boolean;

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = !__DEV__

Vue.registerElement('BarChart', () => require('@nativescript-community/ui-chart/charts/BarChart').BarChart)
Vue.registerElement('HTMLLabel', () => require('@nativescript-community/ui-label').Label);

new Vue({
  render: (h) => h('frame', [h(Home)]),
}).$start()
