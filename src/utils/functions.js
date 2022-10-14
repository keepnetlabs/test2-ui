export function getBtnStatusColor(type) {
  let _type = type
  if (typeof _type === 'boolean' && _type) {
    _type = 'yes'
  } else if (typeof _type === 'boolean' && !_type) {
    _type = 'no'
  }
  if (typeof _type !== 'number') {
    _type = _type.toLowerCase()
  }
  switch (_type && _type) {
    case 'pending':
      return '#00bcd4'
    case 'clean':
      return '#00bcd4'
    case 'active':
      return '#1173C1'
    case 'deferred':
      return '#B6791D'
    case 'dropped':
      return '#F56C6C'
    case 'blocked':
      return '#F56C6C'
    case 'inactive':
      return '#b83a3a'
    case 'sending':
      return '#1173C1'
    case 'scheduled':
      return '#1173C1'
    case 'finished':
      return '#217124'
    case 'warning':
      return '#b6791d'
    case 'processing':
      return '#1173C1'
    case 'processed':
      return '#217124'
    case 'delivered':
      return '#217124'
    case 'clicked':
      return '#217124'
    case 'opened':
      return '#217124'
    case 'bounced':
      return '#F56C6C'
    case 'blocks':
      return '#F56C6C'
    case 'spam_report':
      return '#F56C6C'
    case 'malicious':
      return '#b83a3a'
    case 'unsubscribes':
      return '#B6791D'
    case 'group_unsubscribe':
      return '#B6791D'
    case 'group_resubscribe':
      return '#B6791D'
    case 'nonmalicious':
      return '#00bcd4'
    case 'offline':
      return '#B83A3A'
    case 'expired':
      return '#B6791D'
    case 'paused':
      return '#B6791D'
    case 'passive':
      return '#b83a3a'
    case 'cancelled':
      return '#B6791D'
    case 'canceled':
      return '#B6791D'
    case 'quequed':
      return '#0198AC'
    case 'phishing':
      return '#b83a3a'
    case 'idle':
      return '#0198AC'
    case 'excluded':
      return '#757575'
    case 'disabled':
      return '#b83a3a'
    case 'network error':
      return '#b83a3a'
    case 'quedued':
      return '#00bcd4'
    case 'inqueue':
    case 'in queue':
      return '#1173C1'
    case 'none':
      return '#00bcd4'
    case 'running':
      return '#1173C1'
    case 'Running':
      return '#1173C1'
    case 'Not Running':
      return '#1173C1'
    case 'not delivered':
      return '#757575'
    case 'completed':
      return '#217124'
    case 'complete':
      return '#217124'
    case 'finished':
      return '#217124'
    case 'successful':
      return '#217124'
    case 'success':
      return '#217124'
    case 'online':
      return '#217124'
    case 'deactivated':
      return '#757575'
    case 'notinstalled':
      return '#757575'
    case 'user unavailable':
      return '#757575'
    case 'completedwitherror':
      return '#6d6d6d'
    case 'itemnotfound':
      return '#fafafa'
    case 'failed':
      return '#b83a3a'
    case 'n/a':
      return '#00bcd4'
    case 'stopped':
      return '#b83a3a'
    case 'error':
      return '#B83A3A'
    case 'exist':
      return '#1173C1'
    case 'new':
      return '#217124'
    case 'undetected':
      return '#1173C1'
    case 'listed':
      return '#b83a3a'
    case 'low':
      return '#0198AC'
    case 'verylow':
      return '#757575'
    case 'custom':
      return '#f56c6c'
    case 'system':
      return '#1173C1'
    case 'yes':
      return '#1173c1'
    case 'no':
      return '#757575'
    case 'not running':
      return '#B83A3A'
    case 'easy':
      return 'rgba(33, 113, 36, 1)'
    case 'medium':
      return 'rgba(17, 115, 193, 1)'
    case 'hard':
      return 'rgba(184, 58, 58, 1)'
    case 'no match':
      return '#757575'
    default:
      return '#00bcd4'
  }
}

export function getBtnPriorityColor(type) {
  switch (type.toLowerCase()) {
    case 'active':
      return '#00bcd4'
    case 'inactive':
      return '#b83a3a'
    case 'low':
      return '#0198AC'
    case 'very low':
      return '#757575'
    case 'verylow':
      return '#757575'
    case 'medium':
      return '#1173C1'
    case 'high':
      return '#b6791d'
    case 'very high':
      return '#b83a3a'
    case 'veryhigh':
      return '#b83a3a'
    case 'n/a':
      return '#00bcd4'
    case 'error':
      return '#b83a3a'
    case 'exist':
      return '#1173C1'
    case 'new':
      return '#217124'
    case 'excluded':
      return '#757575'
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
    case 'notinstalled':
      return 'Not Installed'
    case 'waitingresponse':
      return 'Waiting Response'
    case 'unknown':
      return 'N/A'
    case 'Easy':
      return 'Easy'
    case 'Medium':
      return 'Medium'
    case 'Hard':
      return 'Hard'
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
      timeZone: userData && userData.user_dateformat,
      isDemo: false,
      timeFormat: userData && userData.user_timeformat
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
  localStorage.setItem('hostId', userData['user_id'])
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

export function scrollToComponent(
  el,
  options = { behavior: 'smooth', block: 'center', inline: 'center' }
) {
  if (!el) return

  if (window.safari || navigator.vendor.match(/apple/i)) {
    el.scrollIntoView()
  } else {
    el.scrollIntoView(options)
  }
}

export function setSafariClusterFix(obj = {}, param = '') {
  if (obj.column.property === param) {
    return 'safari-cluster-icon-fix'
  }
}
export function handleIsSafari() {
  return window.safari || navigator.vendor.match(/apple/i)
}

export function incidenPostReviewElementBind(url, id, rootId, isReview) {
  let els
  if (url.url === 'Hidden by Owner' || url.isHidden) {
    els = document
      .getElementById(rootId || 'last-preview-body-shadow-root')
      ?.shadowRoot?.querySelectorAll('[data-post-item-hidden]')
    if (!els.length) {
      els = document
        .getElementById(rootId || 'last-preview-body-shadow-root')
        ?.shadowRoot?.querySelectorAll('[href="' + url.url + '"]')
    }
  } else {
    els = document
      .getElementById(rootId || 'last-preview-body-shadow-root')
      ?.shadowRoot?.querySelectorAll('[href="' + url.url + '"]')
  }

  if (els && els.length) {
    for (let i = 0, l = els.length; i < l; i++) {
      let el = els[i]
      el.setAttribute('target', '_blank')
      if (url.isHidden) {
        url.isFlagged = false
        el.style.backgroundColor = '#757575'
        el.style.color = '#ffffff'
        el.style.position = 'relative'
        el.innerHTML = 'Hidden by Owner'
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
        hiddenEl.innerHTML = 'Hidden by Owner'
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

export function datePrettier(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const newDate = new Date(date)
  return newDate.toLocaleDateString('en-US', options)
}
export function eventFire(el, etype) {
  if (el.fireEvent) {
    el.fireEvent('on' + etype)
  } else {
    let evObj = document
      .getElementsByClassName('gjs-frame')[0]
      .contentWindow.document.createEvent('Events')
    evObj.initEvent(etype, true, false)
    el.dispatchEvent(evObj)
  }
}

export function getTimeZone(isDate, fallback) {
  let timeZone = localStorage.getItem('selectedDateFormat') || fallback?.dateFormat || ''
  let timeFormat = localStorage.getItem('selectedTimeFormat') || fallback?.timeFormat || ''
  let is12H = timeFormat === '12h'

  if (is12H) {
    timeFormat = 'hh'
  } else {
    timeFormat = 'HH'
  }

  if (isDate) {
    switch (timeZone) {
      case 'DD/MM/YYYY':
        timeZone = `dd/MM/yyyy`
        //timeZone = `yyyy-MM-dd HH:mm:ss`
        break
      case 'MM/DD/YYYY':
        timeZone = `MM/dd/yyyy`

        //timeZone = `yyyy-MM-dd HH:mm:ss`
        break
      case 'YYYY/MM/DD':
        timeZone = `yyyy/MM/dd`
        //timeZone = `yyyy-MM-dd HH:mm:ss`
        break
    }
  } else {
    switch (timeZone) {
      case 'DD/MM/YYYY':
        timeZone = `dd/MM/yyyy ${is12H ? `${timeFormat}:mm A` : `${timeFormat}:mm`}`
        //timeZone = `yyyy-MM-dd HH:mm:ss`
        break
      case 'MM/DD/YYYY':
        timeZone = `MM/dd/yyyy ${is12H ? `${timeFormat}:mm A` : `${timeFormat}:mm`}`

        //timeZone = `yyyy-MM-dd HH:mm:ss`
        break
      case 'YYYY/MM/DD':
        timeZone = `yyyy/MM/dd ${is12H ? `${timeFormat}:mm A` : `${timeFormat}:mm`}`
        //timeZone = `yyyy-MM-dd HH:mm:ss`
        break
    }
  }

  return timeZone
}

export function getTimeValueFormatZone(isDate) {
  let timeZone = localStorage.getItem('selectedDateFormat')
  let timeFormat = localStorage.getItem('selectedTimeFormat')
  let is12H = timeFormat === '12h'

  if (is12H) {
    timeFormat = 'hh'
  } else {
    timeFormat = 'HH'
  }

  switch (timeZone) {
    case 'DD/MM/YYYY':
      timeZone = `dd/MM/yyyy ${is12H ? `${timeFormat}:mm A` : `${timeFormat}:mm`}`
      //timeZone = `yyyy-MM-dd HH:mm:ss`
      break
    case 'MM/DD/YYYY':
      timeZone = `MM/dd/yyyy ${is12H ? `${timeFormat}:mm A` : `${timeFormat}:mm`}`

      //timeZone = `yyyy-MM-dd HH:mm:ss`
      break
    case 'YYYY/MM/DD':
      timeZone = `yyyy/MM/dd ${is12H ? `${timeFormat}:mm A` : `${timeFormat}:mm`}`
      //timeZone = `yyyy-MM-dd HH:mm:ss`
      break
  }

  return timeZone
}

export function convertTo12Hr(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1) // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM' // Set AM/PM
    time[0] = +time[0] % 12 || 12 // Adjust hours

    if (time[0] < 10) {
      time[0] = `0${time[0]}`
    }
  }
  return time.join('') // return adjusted time or original string
}

export function getTimeZoneForMoment(fallback) {
  let timeZone = localStorage.getItem('selectedDateFormat') || fallback?.dateFormat || ''
  let timeFormat = localStorage.getItem('selectedTimeFormat') || fallback?.timeFormat || ''

  let is12H = timeFormat === '12h'

  if (is12H) {
    timeFormat = 'hh'
  } else {
    timeFormat = 'HH'
  }

  switch (timeZone) {
    case 'DD/MM/YYYY':
      timeZone = `DD/MM/YYYY ${is12H ? `${timeFormat}:mm A` : `${timeFormat}:mm`}`
      //timeZone = `yyyy-MM-dd HH:mm:ss`
      break
    case 'MM/DD/YYYY':
      timeZone = `MM/DD/YYYY ${is12H ? `${timeFormat}:mm A` : `${timeFormat}:mm`}`
      //timeZone = `yyyy-MM-dd HH:mm:ss`
      break
    case 'YYYY/MM/DD':
      timeZone = `YYYY/MM/DD ${is12H ? `${timeFormat}:mm A` : `${timeFormat}:mm`}`
      //timeZone = `yyyy-MM-dd HH:mm:ss`
      break
  }

  return timeZone
}

export function deepCopyArray(data) {
  return JSON.parse(JSON.stringify(data))
}

export function getDefaultFilter() {
  return deepCopyArray({
    filter: {
      Condition: 'AND',
      FilterGroups: [
        {
          Condition: 'AND',
          FilterItems: [],
          FilterGroups: []
        },
        {
          Condition: 'OR',
          FilterItems: [],
          FilterGroups: []
        }
      ]
    }
  })
}

export function getDefaultAxiosPayload(props, defaultOrderBy = null) {
  return deepCopyArray({
    pageNumber: 1,
    pageSize: 10,
    orderBy: defaultOrderBy !== null ? defaultOrderBy : 'CreateTime',
    ascending: false,
    filter: getDefaultFilter().filter,
    ...props
  })
}

export function getSelectSearchPayload(payload = {}, search, key = 'name', extraFilterItems = []) {
  const copyOfPayload = JSON.parse(JSON.stringify(payload))
  copyOfPayload.pageSize = 100
  copyOfPayload.pageNumber = 1
  copyOfPayload.filter.FilterGroups[1].FilterItems.push(
    {
      Value: search,
      FieldName: key,
      Operator: 'Contains'
    },
    ...extraFilterItems
  )
  return copyOfPayload
}

export function isDifferent(a, b) {
  return (
    !a ||
    !b ||
    Object.keys(a).some((key) => {
      if (Array.isArray(a[key]) && Array.isArray(b[key])) {
        return a[key].length !== b[key].length
      }
      if (
        typeof a[key] === 'object' &&
        a[key] !== null &&
        typeof b[key] === 'object' &&
        b[key] !== null
      ) {
        return isDifferent(a[key], b[key])
      }
      return a[key] !== b[key]
    })
  )
}

export function getInvestigationStatusTooltipText(type) {
  switch (type) {
    case 'Queued':
      return 'This investigation will start when others before it are finished'
    case 'Running':
      return 'Investigation will finish on expiry date'
    case 'No match':
      return 'This email does not match properties required by the rule: No attachment'
    case 'Finished':
      return 'Investigation of all target users are completed and expired'
    case 'Canceled':
      return 'Investigation was cancelled manually'
    case 'Expired':
      return 'Investigation expired before completing investigation for all target users'
  }
}

export function copyToClipboard(textToCopy) {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    return navigator.clipboard.writeText(textToCopy)
  } else {
    // text area method
    let textArea = document.createElement('textarea')
    textArea.value = textToCopy
    // make the textarea out of viewport
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    return new Promise((res, rej) => {
      // here the magic happens
      document.execCommand('copy') ? res() : rej()
      textArea.remove()
    })
  }
}

export function colorNameToHex(color, defaultColor) {
  const colors = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    'indianred ': '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgrey: '#d3d3d3',
    lightgreen: '#90ee90',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370d8',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#d87093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32'
  }

  if (color && typeof colors[color.toLowerCase()] != 'undefined') return colors[color.toLowerCase()]

  return defaultColor
}

export function rgba2hex(orig) {
  var a,
    isPercent,
    rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
    alpha = ((rgb && rgb[4]) || '').trim(),
    hex = rgb
      ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
        (rgb[2] | (1 << 8)).toString(16).slice(1) +
        (rgb[3] | (1 << 8)).toString(16).slice(1)
      : orig

  if (alpha !== '') {
    a = alpha
  } else {
    a = 1
  }
  // multiply before convert to HEX
  a = ((a * 255) | (1 << 8)).toString(16).slice(1)
  hex = hex + a

  return `#${hex}`
}

export function addOutlookPolyfills(template) {
  const doc = new DOMParser().parseFromString(template, 'text/html')
  const anchorTags = doc.getElementsByTagName('a')

  for (let i = 0; i < anchorTags.length; i++) {
    anchorTags[i].innerHTML = anchorTags[i].innerText
    const tdWrapper = document.createElement('td')
    tdWrapper.style.padding = anchorTags[i].style.padding
    anchorTags[i].style.padding = ''
    const tableWrapper = document.createElement('table')
    if (!!anchorTags[i].style.backgroundColor) {
      if (anchorTags[i].style.backgroundColor.includes('rgb')) {
        const hexColor = rgba2hex(anchorTags[i].style.backgroundColor)
        tableWrapper.setAttribute('bgcolor', hexColor)
        tableWrapper.style.backgroundColor = hexColor
      } else if (anchorTags[i].style.backgroundColor.includes('#')) {
        tableWrapper.setAttribute('bgcolor', anchorTags[i].style.backgroundColor)
        tableWrapper.style.backgroundColor = anchorTags[i].style.backgroundColor
      } else {
        const hexColor = colorNameToHex(anchorTags[i].style.backgroundColor, 'unset')
        if (hexColor !== 'unset') {
          tableWrapper.setAttribute('bgcolor', hexColor)
        }
        tableWrapper.style.backgroundColor = hexColor
      }
    }
    tableWrapper.style.borderRadius = anchorTags[i].style.borderRadius
    const strongChild = document.createElement('strong')
    strongChild.style.fontWeight = 'normal'
    const fontChild = document.createElement('font')
    fontChild.innerText = anchorTags[i].innerText
    if (!!anchorTags[i].style.color) {
      if (anchorTags[i].style.color.includes('rgb')) {
        const hexColor = rgba2hex(anchorTags[i].style.color)
        anchorTags[i].style.color = hexColor
        fontChild.setAttribute('color', hexColor)
      } else if (anchorTags[i].style.color.includes('#')) {
        fontChild.setAttribute('color', anchorTags[i].style.color)
      } else {
        const hexColor = colorNameToHex(anchorTags[i].style.color, 'unset')
        if (hexColor !== 'unset') {
          fontChild.setAttribute('color', hexColor)
        }
        anchorTags[i].style.color = hexColor
      }
    }
    strongChild.appendChild(fontChild)
    anchorTags[i].innerHTML = new XMLSerializer().serializeToString(strongChild)
    anchorTags[i].parentNode.insertBefore(tdWrapper, anchorTags[i])
    tdWrapper.appendChild(anchorTags[i])
    tdWrapper.parentNode.insertBefore(tableWrapper, tdWrapper)
    tableWrapper.appendChild(tdWrapper)
  }

  return new XMLSerializer().serializeToString(doc)
}

export const getErrorMessage = (error) => {
  return (
    (error?.response?.data &&
      error?.response?.data?.validationMessages &&
      error?.response?.data?.validationMessages?.length &&
      error?.response?.data?.validationMessages[0]) ||
    error?.response?.data?.message ||
    error?.response?.data?.Message ||
    error.message ||
    'Something Went Wrong'
  )
}
