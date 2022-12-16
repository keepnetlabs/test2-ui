import ResendIcon from '@/components/CustomIcons/Resend.vue'
import WhiteResendIcon from '@/components/CustomIcons/WhiteResend.vue'
import DetailsIcon from '@/components/CustomIcons/Details.vue'
import CreateNewInstanceIcon from '@/components/CustomIcons/CreateNewInstance.vue'
import RadioChecked from '@/components/CustomIcons/RadioChecked.vue'
import RadioUnchecked from '@/components/CustomIcons/RadioUnchecked.vue'
import RefreshLeft from '@/components/CustomIcons/RefreshLeft.vue'
import Domain from '@/components/CustomIcons/Domain.vue'
import ThreatIntelligenceIcon from '@/components/CustomIcons/ThreatIntelligence.vue'
import Vuetify from 'vuetify'
export const wait = async (delay = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

export const customVuetify = new Vuetify({
  icons: {
    icons: {
      iconfont: 'mdiSvg'
    },
    values: {
      'custom-resend': {
        component: ResendIcon
      },
      'white-resend': {
        component: WhiteResendIcon
      },
      'custom-details': {
        component: DetailsIcon
      },
      'custom-new-instance': {
        component: CreateNewInstanceIcon
      },
      'radio-checked': {
        component: RadioChecked
      },
      'radio-unchecked': {
        component: RadioUnchecked
      },
      'refresh-left': {
        component: RefreshLeft
      },
      domain: {
        component: Domain
      },
      'threat-intelligence': {
        component: ThreatIntelligenceIcon
      }
    }
  }
})
