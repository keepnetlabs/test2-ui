import { shallowMount } from '@vue/test-utils'
import BookSearch from '@/components/CustomIcons/BookSearch.vue'
import Callback from '@/components/CustomIcons/Callback.vue'
import CreateNewInstance from '@/components/CustomIcons/CreateNewInstance.vue'
import Details from '@/components/CustomIcons/Details.vue'
import Domain from '@/components/CustomIcons/Domain.vue'
import LockOpenTime from '@/components/CustomIcons/LockOpenTime.vue'
import MicrosoftTeamsResend from '@/components/CustomIcons/MicrosoftTeamsResend.vue'
import MicrosoftTeamsResendWhite from '@/components/CustomIcons/MicrosoftTeamsResendWhite.vue'
import PDFFile from '@/components/CustomIcons/PDFFile.vue'
import PlayFile from '@/components/CustomIcons/PlayFile.vue'
import PlayFileGray from '@/components/CustomIcons/PlayFileGray.vue'
import QrCode from '@/components/CustomIcons/QrCode.vue'
import QrCodeSelected from '@/components/CustomIcons/QrCodeSelected.vue'
import RadioChecked from '@/components/CustomIcons/RadioChecked.vue'
import RadioUnchecked from '@/components/CustomIcons/RadioUnchecked.vue'
import RefreshLeft from '@/components/CustomIcons/RefreshLeft.vue'
import Resend from '@/components/CustomIcons/Resend.vue'
import SmishingSimulator from '@/components/CustomIcons/SmishingSimulator.vue'
import ThreatIntelligence from '@/components/CustomIcons/ThreatIntelligence.vue'
import WhiteResend from '@/components/CustomIcons/WhiteResend.vue'

describe('Custom icon components', () => {
  const imageCases = [
    { component: BookSearch, name: 'BookSearch', alt: 'book-search-icon' },
    { component: CreateNewInstance, name: 'CreateNewInstance', alt: 'new-instance-icon' },
    { component: Details, name: 'Details', alt: 'details-icon' },
    { component: Domain, name: 'Domain', alt: 'domain-icon' },
    { component: LockOpenTime, name: 'LockOpenTime', alt: 'radio-checked-icon' },
    { component: MicrosoftTeamsResend, name: 'MicrosoftTeamsResend', alt: 'radio-checked-icon' },
    {
      component: MicrosoftTeamsResendWhite,
      name: 'MicrosoftTeamsResendWhite',
      alt: 'radio-checked-icon'
    },
    { component: PDFFile, name: 'PDFFile', alt: 'pdf' },
    { component: PlayFile, name: 'PlayFile', alt: 'Play File' },
    { component: PlayFileGray, name: 'PlayFileGray', alt: 'Play Icon' },
    { component: QrCode, name: 'QrCode', alt: 'radio-checked-icon' },
    { component: QrCodeSelected, name: 'QrCodeSelected', alt: 'radio-checked-icon' },
    { component: RadioChecked, name: 'RadioChecked', alt: 'radio-checked-icon' },
    { component: RadioUnchecked, name: 'RadioUnchecked', alt: 'radio-unchecked-icon' },
    { component: RefreshLeft, name: 'RefreshLeft', alt: 'refresh-icon' },
    { component: Resend, name: 'Resend', alt: 'resend-icon' },
    { component: WhiteResend, name: 'WhiteResend', alt: 'resend-icon' }
  ]

  imageCases.forEach(({ component, name, alt }) => {
    it(`${name} renders expected image`, () => {
      const wrapper = shallowMount(component)
      expect(wrapper.vm.$options.name).toBe(name)
      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('alt')).toBe(alt)
    })
  })

  const svgCases = [
    { component: Callback, name: 'Callback' },
    { component: SmishingSimulator, name: 'SmishingSimulatorIcon' },
    { component: ThreatIntelligence, name: 'ThreatIntelligenceIcon' }
  ]

  svgCases.forEach(({ component, name }) => {
    it(`${name} renders expected svg`, () => {
      const wrapper = shallowMount(component)
      expect(wrapper.vm.$options.name).toBe(name)
      expect(wrapper.find('svg').exists()).toBe(true)
    })
  })
})
