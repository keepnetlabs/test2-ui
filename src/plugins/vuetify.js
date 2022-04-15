import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import ResendIcon from '@/components/CustomIcons/Resend'
import DetailsIcon from '@/components/CustomIcons/Details'
import CreateNewInstanceIcon from '@/components/CustomIcons/CreateNewInstance'
Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    icons: {
      iconfont: 'mdiSvg'
    },
    values: {
      'custom-resend': {
        component: ResendIcon
      },
      'custom-details': {
        component: DetailsIcon
      },
      'custom-new-instance': {
        component: CreateNewInstanceIcon
      }
    }
  }
})
