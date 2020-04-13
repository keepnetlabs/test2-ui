import CookieKeys from '../model/constants/cookieKeys'
import AuthenticationStatus from '../model/constants/authenticationStatus'

const AuthenticationService = {
  getAuthenticationStatus() {
    let tokenModel = this.getTokenModel()
    if (tokenModel == null) {
      return AuthenticationStatus.UNAUTHENTICATED
    } else if (new Date(tokenModel.expired) <= Date.now()) {
      return AuthenticationStatus.EXPIRED
    } else if (tokenModel.status === 3) {
      return AuthenticationStatus.REQUIRETWOSTEP
    } else {
      return AuthenticationStatus.AUTHENTICATED
    }
  },
  getTokenModel() {
    let tokenString = localStorage.getItem(CookieKeys.AUTH_KEY)
    if (tokenString != null && tokenString !== '') {
      let tokenModel = JSON.parse(tokenString)
      return tokenModel
    } else {
      return null
    }
  },
  isAuthenticated() {
    return this.getAuthenticationStatus() === AuthenticationStatus.AUTHENTICATED
  },
  isExpired() {
    return this.getAuthenticationStatus() === AuthenticationStatus.EXPIRED
  },
  isTwoFactor() {
    return this.getAuthenticationStatus() === AuthenticationStatus.REQUIRETWOSTEP
  },
  getToken() {
    let tokenString = localStorage.getItem(CookieKeys.AUTH_KEY)
    if (tokenString != null && tokenString !== '') {
      let tokenModel = JSON.parse(tokenString)
      return tokenModel.token
    } else {
      return null
    }
  },
  setToken(token, expired, status) {
    localStorage.setItem(
      CookieKeys.AUTH_KEY,
      JSON.stringify({
        token: token,
        expired: expired,
        status: status
      })
    )
  },
  removeToken() {
    localStorage.removeItem(CookieKeys.AUTH_KEY)
  }
}

export default AuthenticationService
