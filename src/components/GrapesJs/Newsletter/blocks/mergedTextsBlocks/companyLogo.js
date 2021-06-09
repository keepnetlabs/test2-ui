import store from '@/store/index'
const logoUrl = store && store.state.whitelabel.mainLogoUrl
const companyLogo = [
  {
    src: logoUrl,
    id: 'logo-url'
  }
]
export default companyLogo
