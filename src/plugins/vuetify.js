import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import ResendIcon from '@/components/CustomIcons/Resend'
import DetailsIcon from '@/components/CustomIcons/Details'
Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    values: {
      'custom-resend': {
        component: ResendIcon
      },
      'custom-details': {
        component: DetailsIcon
      }
    }
  }
})
