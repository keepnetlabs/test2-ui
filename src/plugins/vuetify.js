import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import ResendIcon from '@/components/CustomIcons/Resend'
import WhiteResendIcon from '@/components/CustomIcons/WhiteResend'
import DetailsIcon from '@/components/CustomIcons/Details'
import CreateNewInstanceIcon from '@/components/CustomIcons/CreateNewInstance'
import RadioChecked from '@/components/CustomIcons/RadioChecked'
import RadioUnchecked from '@/components/CustomIcons/RadioUnchecked'
import RefreshLeft from '@/components/CustomIcons/RefreshLeft'
import Domain from '@/components/CustomIcons/Domain'
import ThreatIntelligenceIcon from '@/components/CustomIcons/ThreatIntelligence'
import BookSearch from '@/components/CustomIcons/BookSearch'
import SmishingSimulator from '@/components/CustomIcons/SmishingSimulator'
import LockOpenTime from '@/components/CustomIcons/LockOpenTime'
import PlayFile from '@/components/CustomIcons/PlayFile'
Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    icons: {
      iconfont: 'mdiSvg'
    },
    values: {
      playfile: {
        component: PlayFile
      },
      'smishing-simulator': {
        component: SmishingSimulator
      },
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
      },
      'book-search': {
        component: BookSearch
      },
      'lock-open-time': {
        component: LockOpenTime
      }
    }
  }
})
