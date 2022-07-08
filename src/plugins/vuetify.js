import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

import es from 'vuetify/src/locale/es.ts'

Vue.component('my-component', {
  methods: {
    changeLocale () {
      this.$vuetify.lang.current = 'es'
    },
  },
})

export default new Vuetify({
    lang: {
        locales: { es },
        current: 'es',
      },
});
