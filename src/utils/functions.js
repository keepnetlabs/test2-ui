import store from '../store'

export function getBtnStatusColor(type) {
  switch (type && type.toLowerCase()) {
    case 'pending':
      return '#00bcd4'
    case 'clean':
      return '#00bcd4'
    case 'active':
      return '#00bcd4'
    case 'inactive':
      return '#f56c6c'
    case 'warning':
      return '#e6a23c'
    case 'malicious':
      return '#e6a23c'
    case 'nonmalicious':
      return '#00bcd4'
    case 'offline':
      return '#e6a23c'
    case 'expired':
      return '#e6a23c'
    case 'passive':
      return '#f56c6c'
    case 'cancelled':
      return '#f56c6c'
    case 'phishing':
      return '#f56c6c'
    case 'idle':
      return '#757575'
    case 'disabled':
      return '#f56c6c'
    case 'network error':
      return '#f56c6c'
    case 'quedued':
      return '#00bcd4'
    case 'none':
      return '#00bcd4'
    case 'running':
      return '#2196f3'
    case 'Running':
      return '#2196f3'
    case 'Not Running':
      return '#2196f3'
    case 'completed':
      return '#43a047'
    case 'finished':
      return '#43a047'
    case 'online':
      return '#43a047'
    case 'deactivated':
      return '#757575'
    case 'not installed':
      return '#757575'
    case 'user unavailable':
      return '#757575'
    case 'completedwitherror':
      return '#6d6d6d'
    case 'itemnotfound':
      return '#fafafa'
    case 'failed':
      return '#f56c6c'
    case 'n/a':
      return '#00bcd4'
    case 'stopped':
      return '#f56c6c'
    default:
      return '#00bcd4'
  }
}

export function getBtnPriorityColor(type) {
  switch (type.toLowerCase()) {
    case 'active':
      return '#00bcd4'
    case 'inactive':
      return '#f56c6c'
    case 'low':
      return '#00bcd4'
    case 'very low':
      return '#757575'
    case 'verylow':
      return '#757575'
    case 'medium':
      return '#2196f3'
    case 'high':
      return '#e6a23c'
    case 'very high':
      return '#f56c6c'
    case 'veryhigh':
      return '#f56c6c'
    case 'n/a':
      return '#00bcd4'
    default:
      break
  }
}

export function getTextColor(type) {
  switch (type.toLowerCase()) {
    case 'open':
      return '#f56c6c'
    case 'in progress':
      return '#2196f3'
    case 'false positive':
      return '#e6a23c'
    case 'closed':
      return '#43a047'
    case 'very high':
      return '#43a047'
    case 'medium':
      return '#00bcd4'
    case 'low':
      return '#e6a23c'
    case 'very low':
      return '#f56c6c'
    default:
      break
  }
}

export function getDataTableFieldLabel(field = '') {
  field = String(field)
  const defField = field
  field = field.trim().toLowerCase()
  let upperCaseCount = 0
  for (let i = 0; i < field.length; i++) {
    if (upperCaseCount === 2) {
      return `${field.slice(0, i)} ${field.slice(i, field.length)}`
    }
    if (field.charAt(i) === field.charAt(i).toUpperCase()) {
      upperCaseCount++
    }
  }
  switch (field) {
    case 'beinganalyzed':
      return 'Being Analyzed'
    case 'inprogress':
      return 'In Progress'
    case 'falsepositive':
      return 'False Positive'
    case 'nonmalicious':
      return 'Clean'
    case 'veryhigh':
      return 'Very High'
    case 'verylow':
      return 'Very Low'
    case 'completedwitherror':
      return 'Completed with error'
    case 'itemnotfound':
      return 'Item not found'
    case 'Running':
      return 'Running'
    case 'Not Running':
      return 'Not Running'
    case 'n/a':
      return 'N/A'
    case 'unknown':
      return 'N/A'
    default:
      return defField
  }
}

export function isOwnerOrMember(membershipStatusId) {
  switch (membershipStatusId) {
    case 1:
      return true
    case 2:
      return true
    default:
      return false
  }
}

export function isOwner(membershipStatusId) {
  return membershipStatusId == 1
}

export function isPostedByMe(isPostedByMe) {
  return isPostedByMe
}

export function copyToClipboard(e) {}

export function setGlobalUserData(userData) {
  let currentUserData = {}
  currentUserData = {
    id: userData.user_company_resourceid,
    name: userData.user_company_name,
    surname: userData.family_name,
    email: userData.email,
    fullName: userData.name,
    countryCode: null,
    phone: userData.phone_number,
    firstName: userData.given_name,
    status: null,
    userCompany: {
      id: userData.user_company_resourceid,
      name: userData.user_company_name,
      logoPath: userData.user_company_logopath,
      businessCategoryId: userData.user_company_industry_resourceid,
      resellerId: userData.user_company_parentcompany_resourceid,
      timeZone: null,
      isDemo: false
    },
    role: {
      name: userData.role.toString()
    }
  }
  localStorage.setItem('companyId', currentUserData.userCompany.id)
  localStorage.setItem('companyRequestId', currentUserData.userCompany.id)
  localStorage.setItem('companyResourceId', currentUserData.userCompany.id)
  localStorage.setItem('companyName', currentUserData.userCompany.name)
  localStorage.setItem('userId', currentUserData.id)
  localStorage.setItem('businessCatId', currentUserData.userCompany.businessCategoryId)
  localStorage.setItem('userName', userData.name || currentUserData.name)
  return currentUserData
}

export function passwordComplexity(pwd) {
  String.prototype.strReverse = function () {
    var newstring = ''
    for (var s = 0; s < this.length; s++) {
      newstring = this.charAt(s) + newstring
    }
    return newstring
    //strOrig = ' texttotrim ';
    //strReversed = strOrig.revstring();
  }
  function initPwdChk(restart) {
    /* Reset all form values to their default */
    var arrZeros = [
      'nLength',
      'nAlphaUC',
      'nAlphaLC',
      'nNumber',
      'nSymbol',
      'nMidChar',
      'nRequirements',
      'nAlphasOnly',
      'nNumbersOnly',
      'nRepChar',
      'nConsecAlphaUC',
      'nConsecAlphaLC',
      'nConsecNumber',
      'nSeqAlpha',
      'nSeqNumber',
      'nSeqSymbol',
      'nLengthBonus',
      'nAlphaUCBonus',
      'nAlphaLCBonus',
      'nNumberBonus',
      'nSymbolBonus',
      'nMidCharBonus',
      'nRequirementsBonus',
      'nAlphasOnlyBonus',
      'nNumbersOnlyBonus',
      'nRepCharBonus',
      'nConsecAlphaUCBonus',
      'nConsecAlphaLCBonus',
      'nConsecNumberBonus',
      'nSeqAlphaBonus',
      'nSeqNumberBonus',
      'nSeqSymbolBonus'
    ]
    var arrPassPars = [
      'nAlphasOnlyBonus',
      'nNumbersOnlyBonus',
      'nRepCharBonus',
      'nConsecAlphaUCBonus',
      'nConsecAlphaLCBonus',
      'nConsecNumberBonus',
      'nSeqAlphaBonus',
      'nSeqNumberBonus',
      'nSeqSymbolBonus'
    ]
    var arrPassDivs = [
      'div_nAlphasOnly',
      'div_nNumbersOnly',
      'div_nRepChar',
      'div_nConsecAlphaUC',
      'div_nConsecAlphaLC',
      'div_nConsecNumber',
      'div_nSeqAlpha',
      'div_nSeqNumber',
      'div_nSeqSymbol'
    ]
    var arrFailPars = [
      'nLengthBonus',
      'nAlphaUCBonus',
      'nAlphaLCBonus',
      'nNumberBonus',
      'nSymbolBonus',
      'nMidCharBonus',
      'nRequirementsBonus'
    ]
    var arrFailDivs = [
      'div_nLength',
      'div_nAlphaUC',
      'div_nAlphaLC',
      'div_nNumber',
      'div_nSymbol',
      'div_nMidChar',
      'div_nRequirements'
    ]
  }
  // Simultaneous variable declaration and value assignment aren't supported in IE apparently
  // so I'm forced to assign the same value individually per var to support a crappy browser *sigh*
  var nScore = 0,
    nLength = 0,
    nAlphaUC = 0,
    nAlphaLC = 0,
    nNumber = 0,
    nSymbol = 0,
    nMidChar = 0,
    nRequirements = 0,
    nAlphasOnly = 0,
    nNumbersOnly = 0,
    nUnqChar = 0,
    nRepChar = 0,
    nRepInc = 0,
    nConsecAlphaUC = 0,
    nConsecAlphaLC = 0,
    nConsecNumber = 0,
    nConsecSymbol = 0,
    nConsecCharType = 0,
    nSeqAlpha = 0,
    nSeqNumber = 0,
    nSeqSymbol = 0,
    nSeqChar = 0,
    nReqChar = 0,
    nMultConsecCharType = 0
  var nMultRepChar = 1,
    nMultConsecSymbol = 1
  var nMultMidChar = 2,
    nMultRequirements = 2,
    nMultConsecAlphaUC = 2,
    nMultConsecAlphaLC = 2,
    nMultConsecNumber = 2
  var nReqCharType = 3,
    nMultAlphaUC = 3,
    nMultAlphaLC = 3,
    nMultSeqAlpha = 3,
    nMultSeqNumber = 3,
    nMultSeqSymbol = 3
  var nMultLength = 4,
    nMultNumber = 4
  var nMultSymbol = 6
  var nTmpAlphaUC = '',
    nTmpAlphaLC = '',
    nTmpNumber = '',
    nTmpSymbol = ''
  var sAlphaUC = '0',
    sAlphaLC = '0',
    sNumber = '0',
    sSymbol = '0',
    sMidChar = '0',
    sRequirements = '0',
    sAlphasOnly = '0',
    sNumbersOnly = '0',
    sRepChar = '0',
    sConsecAlphaUC = '0',
    sConsecAlphaLC = '0',
    sConsecNumber = '0',
    sSeqAlpha = '0',
    sSeqNumber = '0',
    sSeqSymbol = '0'
  var sAlphas = 'abcdefghijklmnopqrstuvwxyz'
  var sNumerics = '01234567890'
  var sSymbols = ')!@#$%^&*()'
  var sComplexity = 'Too Short'
  var sStandards = 'Below'
  var nMinPwdLen = 8
  if (document.all) {
    var nd = 0
  } else {
    var nd = 1
  }
  if (pwd) {
    nScore = parseInt(pwd.length * nMultLength)
    nLength = pwd.length
    var arrPwd = pwd.replace(/\s+/g, '').split(/\s*/)
    var arrPwdLen = arrPwd.length

    /* Loop through password to check for Symbol, Numeric, Lowercase and Uppercase pattern matches */
    for (var a = 0; a < arrPwdLen; a++) {
      if (arrPwd[a].match(/[A-Z]/g)) {
        if (nTmpAlphaUC !== '') {
          if (nTmpAlphaUC + 1 == a) {
            nConsecAlphaUC++
            nConsecCharType++
          }
        }
        nTmpAlphaUC = a
        nAlphaUC++
      } else if (arrPwd[a].match(/[a-z]/g)) {
        if (nTmpAlphaLC !== '') {
          if (nTmpAlphaLC + 1 == a) {
            nConsecAlphaLC++
            nConsecCharType++
          }
        }
        nTmpAlphaLC = a
        nAlphaLC++
      } else if (arrPwd[a].match(/[0-9]/g)) {
        if (a > 0 && a < arrPwdLen - 1) {
          nMidChar++
        }
        if (nTmpNumber !== '') {
          if (nTmpNumber + 1 == a) {
            nConsecNumber++
            nConsecCharType++
          }
        }
        nTmpNumber = a
        nNumber++
      } else if (arrPwd[a].match(/[^a-zA-Z0-9_]/g)) {
        if (a > 0 && a < arrPwdLen - 1) {
          nMidChar++
        }
        if (nTmpSymbol !== '') {
          if (nTmpSymbol + 1 == a) {
            nConsecSymbol++
            nConsecCharType++
          }
        }
        nTmpSymbol = a
        nSymbol++
      }
      /* Internal loop through password to check for repeat characters */
      var bCharExists = false
      for (var b = 0; b < arrPwdLen; b++) {
        if (arrPwd[a] == arrPwd[b] && a != b) {
          /* repeat character exists */
          bCharExists = true
          /*
      Calculate icrement deduction based on proximity to identical characters
      Deduction is incremented each time a new match is discovered
      Deduction amount is based on total password length divided by the
      difference of distance between currently selected match
      */
          nRepInc += Math.abs(arrPwdLen / (b - a))
        }
      }
      if (bCharExists) {
        nRepChar++
        nUnqChar = arrPwdLen - nRepChar
        nRepInc = nUnqChar ? Math.ceil(nRepInc / nUnqChar) : Math.ceil(nRepInc)
      }
    }

    /* Check for sequential alpha string patterns (forward and reverse) */
    for (var s = 0; s < 23; s++) {
      var sFwd = sAlphas.substring(s, parseInt(s + 3))
      var sRev = sFwd.strReverse()
      if (pwd.toLowerCase().indexOf(sFwd) != -1 || pwd.toLowerCase().indexOf(sRev) != -1) {
        nSeqAlpha++
        nSeqChar++
      }
    }

    /* Check for sequential numeric string patterns (forward and reverse) */
    for (var s = 0; s < 8; s++) {
      var sFwd = sNumerics.substring(s, parseInt(s + 3))
      var sRev = sFwd.strReverse()
      if (pwd.toLowerCase().indexOf(sFwd) != -1 || pwd.toLowerCase().indexOf(sRev) != -1) {
        nSeqNumber++
        nSeqChar++
      }
    }

    /* Check for sequential symbol string patterns (forward and reverse) */
    for (var s = 0; s < 8; s++) {
      var sFwd = sSymbols.substring(s, parseInt(s + 3))
      var sRev = sFwd.strReverse()
      if (pwd.toLowerCase().indexOf(sFwd) != -1 || pwd.toLowerCase().indexOf(sRev) != -1) {
        nSeqSymbol++
        nSeqChar++
      }
    }

    /* Modify overall score value based on usage vs requirements */

    /* General point assignment */
    if (nAlphaUC > 0 && nAlphaUC < nLength) {
      nScore = parseInt(nScore + (nLength - nAlphaUC) * 2)
      sAlphaUC = '+ ' + parseInt((nLength - nAlphaUC) * 2)
    }
    if (nAlphaLC > 0 && nAlphaLC < nLength) {
      nScore = parseInt(nScore + (nLength - nAlphaLC) * 2)
      sAlphaLC = '+ ' + parseInt((nLength - nAlphaLC) * 2)
    }
    if (nNumber > 0 && nNumber < nLength) {
      nScore = parseInt(nScore + nNumber * nMultNumber)
      sNumber = '+ ' + parseInt(nNumber * nMultNumber)
    }
    if (nSymbol > 0) {
      nScore = parseInt(nScore + nSymbol * nMultSymbol)
      sSymbol = '+ ' + parseInt(nSymbol * nMultSymbol)
    }
    if (nMidChar > 0) {
      nScore = parseInt(nScore + nMidChar * nMultMidChar)
      sMidChar = '+ ' + parseInt(nMidChar * nMultMidChar)
    }

    /* Point deductions for poor practices */
    if ((nAlphaLC > 0 || nAlphaUC > 0) && nSymbol === 0 && nNumber === 0) {
      // Only Letters
      nScore = parseInt(nScore - nLength)
      nAlphasOnly = nLength
      sAlphasOnly = '- ' + nLength
    }
    if (nAlphaLC === 0 && nAlphaUC === 0 && nSymbol === 0 && nNumber > 0) {
      // Only Numbers
      nScore = parseInt(nScore - nLength)
      nNumbersOnly = nLength
      sNumbersOnly = '- ' + nLength
    }
    if (nRepChar > 0) {
      // Same character exists more than once
      nScore = parseInt(nScore - nRepInc)
      sRepChar = '- ' + nRepInc
    }
    if (nConsecAlphaUC > 0) {
      // Consecutive Uppercase Letters exist
      nScore = parseInt(nScore - nConsecAlphaUC * nMultConsecAlphaUC)
      sConsecAlphaUC = '- ' + parseInt(nConsecAlphaUC * nMultConsecAlphaUC)
    }
    if (nConsecAlphaLC > 0) {
      // Consecutive Lowercase Letters exist
      nScore = parseInt(nScore - nConsecAlphaLC * nMultConsecAlphaLC)
      sConsecAlphaLC = '- ' + parseInt(nConsecAlphaLC * nMultConsecAlphaLC)
    }
    if (nConsecNumber > 0) {
      // Consecutive Numbers exist
      nScore = parseInt(nScore - nConsecNumber * nMultConsecNumber)
      sConsecNumber = '- ' + parseInt(nConsecNumber * nMultConsecNumber)
    }
    if (nSeqAlpha > 0) {
      // Sequential alpha strings exist (3 characters or more)
      nScore = parseInt(nScore - nSeqAlpha * nMultSeqAlpha)
      sSeqAlpha = '- ' + parseInt(nSeqAlpha * nMultSeqAlpha)
    }
    if (nSeqNumber > 0) {
      // Sequential numeric strings exist (3 characters or more)
      nScore = parseInt(nScore - nSeqNumber * nMultSeqNumber)
      sSeqNumber = '- ' + parseInt(nSeqNumber * nMultSeqNumber)
    }
    if (nSeqSymbol > 0) {
      // Sequential symbol strings exist (3 characters or more)
      nScore = parseInt(nScore - nSeqSymbol * nMultSeqSymbol)
      sSeqSymbol = '- ' + parseInt(nSeqSymbol * nMultSeqSymbol)
    }

    /* Determine if mandatory requirements have been met and set image indicators accordingly */
    var arrChars = [nLength, nAlphaUC, nAlphaLC, nNumber, nSymbol]
    var arrCharsIds = ['nLength', 'nAlphaUC', 'nAlphaLC', 'nNumber', 'nSymbol']
    var arrCharsLen = arrChars.length
    for (var c = 0; c < arrCharsLen; c++) {
      if (arrCharsIds[c] == 'nLength') {
        var minVal = parseInt(nMinPwdLen - 1)
      } else {
        var minVal = 0
      }
      if (arrChars[c] == parseInt(minVal + 1)) {
        nReqChar++
      } else if (arrChars[c] > parseInt(minVal + 1)) {
        nReqChar++
      } else {
      }
    }
    nRequirements = nReqChar
    if (pwd.length >= nMinPwdLen) {
      var nMinReqChars = 3
    } else {
      var nMinReqChars = 4
    }
    if (nRequirements > nMinReqChars) {
      // One or more required characters exist
      nScore = parseInt(nScore + nRequirements * 2)
      sRequirements = '+ ' + parseInt(nRequirements * 2)
    }

    /* Determine if additional bonuses need to be applied and set image indicators accordingly */
    var arrChars = [nMidChar, nRequirements]
    var arrCharsIds = ['nMidChar', 'nRequirements']
    var arrCharsLen = arrChars.length
    for (var c = 0; c < arrCharsLen; c++) {
      if (arrCharsIds[c] == 'nRequirements') {
        var minVal = nMinReqChars
      } else {
        var minVal = 0
      }
      if (arrChars[c] == parseInt(minVal + 1)) {
      } else if (arrChars[c] > parseInt(minVal + 1)) {
      } else {
      }
    }

    /* Determine if suggested requirements have been met and set image indicators accordingly */
    var arrChars = [
      nAlphasOnly,
      nNumbersOnly,
      nRepChar,
      nConsecAlphaUC,
      nConsecAlphaLC,
      nConsecNumber,
      nSeqAlpha,
      nSeqNumber,
      nSeqSymbol
    ]
    var arrCharsIds = [
      'nAlphasOnly',
      'nNumbersOnly',
      'nRepChar',
      'nConsecAlphaUC',
      'nConsecAlphaLC',
      'nConsecNumber',
      'nSeqAlpha',
      'nSeqNumber',
      'nSeqSymbol'
    ]
    var arrCharsLen = arrChars.length
    for (var c = 0; c < arrCharsLen; c++) {
      if (arrChars[c] > 0) {
      } else {
      }
    }

    var level = 'progress-bar-danger'

    /* Determine complexity based on overall score */
    if (nScore > 100) {
      nScore = 100
    } else if (nScore < 0) {
      nScore = 0
    }
    if (nScore >= 0 && nScore < 20) {
      sComplexity = 'Very Weak'
    } else if (nScore >= 20 && nScore < 40) {
      sComplexity = 'Weak'
    } else if (nScore >= 40 && nScore < 60) {
      sComplexity = 'Good'
      level = 'progress-bar-warning'
    } else if (nScore >= 60 && nScore < 80) {
      sComplexity = 'Strong'
      level = 'progress-bar-success'
    } else if (nScore >= 80 && nScore <= 100) {
      sComplexity = 'Very Strong'
      level = 'progress-bar-info'
    }

    return nScore

    /* Display updated score criteria to client */
  } else {
    /* Display default score criteria to client */
    initPwdChk()
  }
}

export function scrollToComponent(el) {
  if (window.safari || navigator.vendor.match(/apple/i)) {
    el.scrollIntoView()
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }
}

export function reviewElementBind(els, url) {
  if (els && els.length) {
    for (let i = 0, l = els.length; i < l; i++) {
      let el = els[i]
      el.setAttribute('target', '_blank')
      if (url.isHidden) {
        url.isFlagged = false
        el.innerHTML = url.urlHtml || url.name || url.url
        el.innerHTML = 'hidden by owner'
        el.style.backgroundColor = '#757575'
        el.style.color = '#ffffff'
        el.style.position = 'relative'
      } else if (!!url && !!url.name) {
        el.innerHTML = url.name
        el.setAttribute('href', url.url)
        el.style.backgroundColor = 'inherit'
        el.style.color = 'inherit'
      } else if (!!url && !!url.urlHtml) {
        el.innerHTML = url.urlHtml
        el.setAttribute('href', url.url)
        el.style.backgroundColor = 'inherit'
        el.style.color = 'inherit'
      }
      if (url.isFlagged) {
        const el = els[i]
        el.setAttribute('target', '_blank')
        el.setAttribute('data-title', 'This link has been reported as a phishing')
        el.style.backgroundColor = '#f3e1e5'
        el.style.color = '#bb2a45'
        el.innerHTML = el.innerHTML + `<span class="malicious-link mdi mdi-alert"></span>`

        //el.appendChild(iEl)
      } else if (!url.isFlagged && !url.isHidden) {
        el.innerHTML = url.urlHtml || url.name || url.url
        el.style.backgroundColor = 'inherit'
        el.style.color = 'inherit'
      }
      if (url.isHidden) {
        el.setAttribute('target', '_self')
      }
    }
  }
  let hiddenEls = document.getElementsByClassName(url.url)
  if (hiddenEls && hiddenEls.length) {
    for (let i = 0, l = hiddenEls.length; i < l; i++) {
      let hiddenEl = hiddenEls[i]
      hiddenEl.setAttribute('target', '_blank')
      if (url.isHidden) {
        hiddenEl.innerHTML = 'hidden by owner'
        hiddenEl.setAttribute('href', '#')
      }
      if (url.isFlagged) {
        hiddenEl.classList.add('malicious-link')
        let iEl = document.createElement('span')
        iEl.className +=
          'red-malicious-alert v-icon notranslate ml-2 malicious-icon mdi mdi-alert theme--light'
        hiddenEl.appendChild(iEl)
      }
    }
  }
}

export function incidenPostReviewElementBind(url, id, rootId, isReview) {
  let els = document
    .getElementById(rootId || 'last-preview-body-shadow-root')
    .shadowRoot.querySelectorAll('[href="' + url.url + '"]')
  if (els && els.length) {
    for (let i = 0, l = els.length; i < l; i++) {
      let el = els[i]
      el.setAttribute('target', '_blank')
      if (url.isHidden) {
        url.isFlagged = false
        el.innerHTML = url.urlHtml || url.name || url.url
        el.innerHTML = 'hidden by owner'
        el.style.backgroundColor = '#757575'
        el.style.color = '#ffffff'
        el.style.position = 'relative'
        el.style.pointerEvents = 'none'
      } else if (!!url && !!url.name) {
        el.innerHTML = url.name
        el.setAttribute('href', url.url)
        el.style.backgroundColor = 'inherit'
        el.style.color = 'inherit'
      } else if (!!url && !!url.urlHtml) {
        el.innerHTML = url.urlHtml
        el.setAttribute('href', url.url)
        el.style.backgroundColor = 'inherit'
        el.style.color = 'inherit'
      }
      if (url.isFlagged) {
        el.setAttribute('target', '_blank')
        el.setAttribute('data-title', 'This link has been reported as a phishing')
        el.style.backgroundColor = '#f3e1e5'
        el.style.color = '#bb2a45'
        el.innerHTML = el.innerHTML + `<span class="malicious-link mdi mdi-alert"></span>`
        el.style.cursor = 'default'
        el.setAttribute('onclick', 'return false;')
        //el.appendChild(iEl)
      } else if (!url.isFlagged && !url.isHidden) {
        !isReview && (el.innerHTML = url.urlHtml || url.name || url.url)
        el.style.backgroundColor = 'inherit'
        el.style.color = 'inherit'
      }
      if (url.isHidden) {
        el.setAttribute('target', '_self')
      }
    }
  }
  let hiddenEls = document.getElementsByClassName(url.url)
  if (hiddenEls && hiddenEls.length) {
    for (let i = 0, l = hiddenEls.length; i < l; i++) {
      let hiddenEl = hiddenEls[i]
      hiddenEl.setAttribute('target', '_blank')
      if (url.isHidden) {
        hiddenEl.innerHTML = 'hidden by owner'
        hiddenEl.setAttribute('href', '#')
      }
      if (url.isFlagged) {
        hiddenEl.classList.add('malicious-link')
        let iEl = document.createElement('span')
        iEl.className +=
          'red-malicious-alert v-icon notranslate ml-2 malicious-icon mdi mdi-alert theme--light'
        hiddenEl.appendChild(iEl)
      }
    }
  }
}

export function checkPermission(permission, type, store = { store }) {
  console.log(store.dispatch('threadSharing/getCommunities'))
}
