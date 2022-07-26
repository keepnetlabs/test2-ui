const query = new URLSearchParams(window.location.search)
const enrollmentContentResourceId = query.get('EnrollmentContentId') || ''
const targetUserResourceId = query.get('TargetUserResourceId') || ''
const domainUrl = query.get('DomainUrl') || 'https://test-api.devkeepnet.com'
const isPreview = query.get('isPreview') || false

var API = new apiclass()
API.version = '1.2'
var API_1484_11 = new apiclass()
API_1484_11.version = '1.3'
function apiclass() {
  this.version = '1.3' // new value for SCORM2004
  // Define exception/error codes
  this._NotInitialized = 301
  // define properties
  this.serviceAvailable = false // WebService initialization state
  this.initialized = false // SCO LMSInitialize state
  this.LastError = this._NotInitialized
  this.LastErrorString = ''
  this.LastErrorDiagnostic = ''
  this.enrollmentContentResourceId = enrollmentContentResourceId
  this.targetUserResourceId = targetUserResourceId
  this.enrollmentSessionId = ''
  this.scormSessionId = ''
  let _api_prototype_called
  if (typeof _api_prototype_called == 'undefined') {
    _api_prototype_called = true
    apiclass.prototype.LMSInitialize = _LMSInitialize
    apiclass.prototype.LMSFinish = _LMSFinish
    apiclass.prototype.LMSGetValue = _LMSGetValue
    apiclass.prototype.LMSSetValue = _LMSSetValue
    apiclass.prototype.LMSCommit = _LMSCommit
    apiclass.prototype.LMSGetLastError = _LMSGetLastError
    apiclass.prototype.LMSGetErrorString = _LMSGetErrorString
    apiclass.prototype.LMSGetDiagnostic = _LMSGetDiagnostic
    // for SCORM 2004
    apiclass.prototype.Initialize = _LMSInitialize
    apiclass.prototype.Terminate = _LMSFinish
    apiclass.prototype.GetValue = _LMSGetValue
    apiclass.prototype.SetValue = _LMSSetValue
    apiclass.prototype.Commit = _LMSCommit
    apiclass.prototype.GetLastError = _LMSGetLastError
    apiclass.prototype.GetErrorString = _LMSGetErrorString
    apiclass.prototype.GetDiagnostic = _LMSGetDiagnostic
  }
  function _LMSInitialize(val) {
    if (isPreview) return 'true'
    if (val != '') {
      this.LastErrorString = 'Value passed to LMSInitialize, should be blank'
      this.LastError = '201'
      this.LastErrorDiagnostic = 'Error from API'
      return 'false'
    }
    ///scorm/LMSInitialize
    const request = new XMLHttpRequest()
    request.open('POST', `${domainUrl}/scorm/LMSInitialize`, false)
    request.setRequestHeader('Content-type', 'application/json')
    request.send(
      JSON.stringify({
        enrollmentContentResourceId,
        targetUserResourceId
      })
    )
    const response = JSON.parse(request.response)
    console.log('lmsInitializeData', response.data)
    this.enrollmentSessionId = response?.data?.enrollmentSessionId
    this.scormSessionId = response?.data?.scormSessionId
    return response.status === 'SUCCESS' ? 'true' : 'false'
  }
  function _LMSFinish(val) {
    if (isPreview) return 'true'
    if (val !== '') {
      this.LastErrorString = 'Value passed to LMSFinish, should be blank'
      this.LastError = '201'
      this.LastErrorDiagnostic = 'Error from API'
      return 'false'
    }
    const request = new XMLHttpRequest()
    request.open('POST', `${domainUrl}/scorm/LMSFinish`, false)
    request.setRequestHeader('Content-type', 'application/json')
    request.send(
      JSON.stringify({
        enrollmentSessionId: this.enrollmentSessionId,
        scormSessionId: this.scormSessionId,
        targetUserResourceId: this.targetUserResourceId
      })
    )
    const response = JSON.parse(request.response)
    console.log('lmsFinishResponseStatus', response.status)
    console.log('lmsFinish', response.data)
    return response.status === 'SUCCESS' ? response.data : 'false'
  }
  function _LMSGetValue(name) {
    if (isPreview) return 'true'
    const request = new XMLHttpRequest()
    request.open('POST', `${domainUrl}/scorm/LMSGetValue`, false)
    request.setRequestHeader('Content-type', 'application/json')
    request.send(
      JSON.stringify({
        enrollmentSessionId: this.enrollmentSessionId,
        scormSessionId: this.scormSessionId,
        name
      })
    )

    const response = JSON.parse(request.response)
    console.log('lmsGetValueResponseStatus', response.status)
    console.log('lmsGetValue', response.data)
    return response.status === 'SUCCESS' ? response.data : 'false'
  }
  function _LMSSetValue(name, value) {
    if (isPreview) return 'true'
    const request = new XMLHttpRequest()
    request.open('POST', `${domainUrl}/scorm/LMSSetValue`, false)
    request.setRequestHeader('Content-type', 'application/json')
    request.send(
      JSON.stringify({
        enrollmentSessionId: this.enrollmentSessionId,
        scormSessionId: this.scormSessionId,
        name,
        value
      })
    )
    const response = JSON.parse(request.response)
    console.log('lmsSetValue', response.status)
    console.log('lmsSetValue', response.data)
    return response.status === 'SUCCESS' ? response.data : 'false'
  }
  function _LMSCommit(val) {
    if (isPreview) return 'true'
    // LMSCommit is a no-op since we commit every time.
    if (val != '') {
      this.LastErrorString = 'Value passed to LMSCommit, should be blank'
      this.LastError = '201'
      this.LastErrorDiagnostic = 'Error from API'
      return 'false'
    }
    if (!this.initialized) {
      this.LastErrorString = 'LMS is not initialized, call to LMSCommit ignored.'
      this.LastError = '301'
      this.LastErrorDiagnostic = 'Error from API'
      return 'false'
    }
    return 'true'
  }
  function _LMSGetLastError() {
    return this.LastError
  }
  function _LMSGetErrorString() {
    return this.LastErrorString
  }
  function _LMSGetDiagnostic() {
    return this.LastErrorDiagnostic
  }
}

window.API = API
