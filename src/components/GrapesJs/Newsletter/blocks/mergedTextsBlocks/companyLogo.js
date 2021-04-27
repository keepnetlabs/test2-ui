import store from '../../../../../store'
const logoUrl = store.state.whitelabel.mainLogoUrl
const companyLogo = [
  {
    type: 'img',
    content: `<img class="logo-url" src="${logoUrl}"/>`
  }
]
export default companyLogo
