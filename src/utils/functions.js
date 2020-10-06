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
      return 'Non Malicious'
    case 'veryhigh':
      return 'Very High'
    case 'verylow':
      return 'Very Low'
    case 'completedwitherror':
      return 'Completed with error'
    case 'itemnotfound':
      return 'Item not found'
    case 'n/a':
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

export function setGlobalUserData(userData, isCompanySelect) {
  let currentUserData
  if (isCompanySelect) {
    currentUserData = {
      id: userData.resourceId,
      name: userData.name,
      surname: userData.name,
      email: userData.websiteUrl,
      fullName: userData.name,
      countryCode: null,
      phone: null,
      status: null,
      userCompany: {
        id: userData.resourceId,
        name: userData.name,
        logoPath: userData.logoUrl,
        businessCategoryId: userData.industryResourceId,
        resellerId: userData.null,
        timeZone: null,
        isDemo: false
      },
      role: {
        //name: userData.role.toString()
        name: null
      }
    }
  } else {
    currentUserData = {
      id: userData.user_company_resourceid,
      name: userData.user_company_name,
      surname: userData.family_name,
      email: userData.email,
      fullName: userData.given_name,
      countryCode: null,
      phone: userData.phone_number,
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
  }
  localStorage.setItem('companyId', currentUserData.userCompany.id)
  localStorage.setItem('companyRequestId', currentUserData.userCompany.id)
  localStorage.setItem('companyResourceId', currentUserData.userCompany.id)
  localStorage.setItem('companyName', currentUserData.userCompany.name)
  localStorage.setItem('userId', currentUserData.id)
  localStorage.setItem('businessCatId', currentUserData.userCompany.businessCategoryId)
  localStorage.setItem('userName', currentUserData.fullName)
  return currentUserData
}
