<template>
  <iframe frameborder="0" :src="src" style="width: 100vw; height: 100vh;"></iframe>
</template>
<script>
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'Scorm',
  data() {
    return {
      src: 'https://d8rg7jrq84z6k.cloudfront.net/deneme(2)/index_lms.html'
    }
  },
  created() {
    const query = this?.$route?.query
    const enrollmentContentResourceId = query?.EnrollmentContentId
    const targetUserResourceId = query?.TargetUserResourceId
    var blnDebug = false
    var aryDebug = new Array()
    var strDebug = ''
    var winDebug
    var API = new apiclass()
    API.version = '1.2'
    var API_1484_11 = new apiclass()
    API_1484_11.version = '1.3'
    var sessionid
    var userid
    var coreid
    var scorm_course_id
    var sco_identifier
    var exit_status
    var cmi
    function apiclass() {
      this.version = '1.3' // new value for SCORM2004
      // Define exception/error codes
      this._NoError = 0
      this._GeneralException = 101
      this._ServerBusy = 102
      this._InvalidArgumentError = 201
      this._ElementCannotHaveChildren = 202
      this._ElementIsNotAnArray = 203
      this._NotInitialized = 301
      this._NotImplementedError = 401
      this._InvalidSetValue = 402
      this._ElementIsReadOnly = 403
      this._ElementIsWriteOnly = 404
      this._IncorrectDataType = 405
      // define properties
      this.serviceAvailable = false // WebService initialization state
      this.initialized = false // SCO LMSInitialize state
      this.LastError = this._NotInitialized
      this.LastErrorString = ''
      this.LastErrorDiagnostic = ''
      this.cmi = cmi

      this._sessionid = ''
      this._userid = ''
      this._coreid = ''
      this._scorm_course_id = ''
      this._sco_identifier = ''
      this._exit_status = '' // this will stay as is in browse or review mode, will change if they are actually taking the sco for credit to completed. Will only request the next page if this is "completed"

      this.enrollmentContentResourceId = enrollmentContentResourceId // for testing purposes
      this.targetUserResourceId = targetUserResourceId // for testing purposes
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
        console.log('_LMSInitialize')
        console.log('URL: ' + window.document.location.href)

        if (val != '') {
          this.LastErrorString = 'Value passed to LMSInitialize, should be blank'
          this.LastError = '201'
          this.LastErrorDiagnostic = 'Error from API'
          return 'false'
        }

        if (this.initialized) {
          this.LastErrorString = 'LMS is already initialized, call to LMSInitialize ignored.'
          this.LastError = '101'
          this.LastErrorDiagnostic = 'Error from API'
          return 'false'
        }
        // the calling application leaves a session id and other variables

        this._sessionid = ''
        this._userid = targetUserResourceId
        this._coreid = ''
        this._scorm_course_id = ''
        this._sco_identifier = ''
        // LMSInfo object carries arguments to the server and back
        var lmsInfo = JSON.stringify(
          createLMSInfo(
            this._sessionid,
            this._userid,
            this._coreid,
            this._scorm_course_id,
            this._sco_identifier
          )
        )
        var lmsInfoInitialize = JSON.stringify(
          createLMSInfoInitialize(this.enrollmentContentResourceId, this.targetUserResourceId)
        )
        fetch(`${APP_CONFIG.VUE_APP_APP_API_TEST}/scorm/LMSInitialize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify(lmsInfoInitialize)
        })
          .then((response) => {
            return response.json()
          })
          .then((response) => {
            this.enrollmentSessionId = response.data.enrollmentSessionId
            this.scormSessionId = response.data.scormSessionId
            if (response.status === 'SUCCESS') this.initialized = true
            else this.initialized = false
          })
          .catch((error) => {
            this.LastError = '101' //general exception
            this.LastErrorString = error.Message
            this.LastErrorDiagnostic = 'AJAX error'
            return 'false'
          })
        return this.initialized ? 'true' : 'false'
      }
      function _LMSFinish(val) {
        if (val != '') {
          this.LastErrorString = 'Value passed to LMSFinish, should be blank'
          this.LastError = '201'
          this.LastErrorDiagnostic = 'Error from API'
          return 'false'
        }
        if (!this.initialized) {
          this.LastErrorString = 'LMS is not initialized, call to LMSFinish ignored.'
          this.LastError = '301'
          this.LastErrorDiagnostic = 'Error from API'
          return 'false'
        }
        // LMSInfo object carries arguments to the server and back
        var lmsInfo = JSON.stringify(
          createLMSInfo(
            this._sessionid,
            this._userid,
            this._coreid,
            this._scorm_course_id,
            this._sco_identifier
          )
        )
        var lmsFinishInfo = JSON.stringify(
          createLMSInfoFinish(this.enrollmentSessionId, this.scormSessionId)
        )
        fetch(`${APP_CONFIG.VUE_APP_APP_API_TEST}/scorm/LMSFinish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify(lmsFinishInfo)
        })
          .then((response) => {
            return response.json()
          })
          .then((response) => {
            if (response.status === 'SUCCESS') this.initialized = false
            else this.initialized = true
          })
          .catch((error) => {
            // Ajax call failed
            this.LastError = '101' //general exception
            this.LastErrorString = error
            this.LastErrorDiagnostic = 'AJAX error'
            return 'false'
          })
        var that = this // get reference to current instance

        // AJAX callback for the LMSFinish call
        function LMSFinish_callback(response) {
          lmsInfo = response.d == null ? response : response.d // asp.net 3.5 adds the 'd' attribute to the response object
          that.LastError = lmsInfo.errorCode
          that.LastErrorString = lmsInfo.errorString
          that.LastError = '101'
          that.LastErrorString = ''
          that.initialized = false
        }
        return this.initialized ? 'true' : 'false'
      }
      function _LMSGetValue(name) {
        if (!this.initialized) {
          this.LastErrorString = 'LMS is not initialized, call to LMSGetValue ignored.'
          this.LastError = '301'
          this.LastErrorDiagnostic = 'Error from API'
          return ''
        }

        var lmsInfo = JSON.stringify(
          createLMSInfo(
            this._sessionid,
            this._userid,
            this._coreid,
            this._scorm_course_id,
            this._sco_identifier,
            name
          )
        )
        var lmsGetValueInfo = JSON.stringify(
          createLMSInfoGetValue(this.enrollmentSessionId, this.scormSessionId, name)
        )
        var that = this // get reference to current API instance

        fetch(`${APP_CONFIG.VUE_APP_APP_API_TEST}/scorm/LMSGetValue`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify(lmsGetValueInfo)
        })
          .then((response) => {
            return response.json()
          })
          .catch((error) => {
            this.LastError = '101' //general exception
            this.LastErrorString = error
            this.LastErrorDiagnostic = 'AJAX error'
            return 'false'
          })
        return returnValue || ''
      }
      function _LMSSetValue(name, value) {
        if (name == 'cmi.core.lesson_status' || name == 'cmi.core.exit') {
          this._exit_status = value // set this so LMSFinish knows what to do
        }
        if (!this.initialized) {
          this.LastErrorString = 'LMS is not initialized, call to LMSSetValue ignored.'
          this.LastError = '301'
          this.LastErrorDiagnostic = 'Error from API'
          return 'false'
        }
        var lmsInfo = JSON.stringify(
          createLMSInfo(
            this._sessionid,
            this._userid,
            this._coreid,
            this._scorm_course_id,
            this._sco_identifier,
            name,
            value
          )
        )

        var lmsInfoSetValue = JSON.stringify(
          createLMSInfoSetValue(this.enrollmentSessionId, this.scormSessionId, name, value)
        )
        var returnValue = ''
        var that = this // get reference to current API instance
        fetch(`${APP_CONFIG.VUE_APP_APP_API_TEST}/scorm/LMSSetValue`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify(lmsInfoSetValue)
        })
          .then((response) => {
            return response.json()
          })
          .then((response) => {
            if (response.status === 'SUCCESS') returnValue = 'true'
            else returnValue = 'false'
          })
          .catch((error) => {
            that.LastError = '101' //general exception
            that.LastErrorString = error
            that.LastErrorDiagnostic = 'AJAX error'
            return 'false'
          })
        return returnValue
      }
      function _LMSCommit(val) {
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
    function createLMSInfo(
      Sessionid,
      user_id,
      core_id,
      SCORM_course_id,
      SCO_identifier,
      DataItem,
      DataValue,
      ErrorCode,
      ErrorString,
      ErrorDiagnostic,
      ReturnValue
    ) {
      var o = new Object()
      o.sessionId = Sessionid
      o.userId = user_id
      o.coreId = core_id
      o.scoIdentifier = SCO_identifier
      o.scormCourseId = SCORM_course_id
      o.dataItem = DataItem
      o.dataValue = DataValue
      o.errorCode = ErrorCode
      o.errorString = ErrorString
      o.errorDiagnostic = ErrorDiagnostic
      o.returnValue = ReturnValue
      for (prop in o) {
        if (o[prop] == null) {
          o[prop] = 'null'
        }
      }
      return o
    }

    function createLMSInfoSetValue(
      enrollment_session_id,
      scorm_session_id,
      DataItem,
      DataValue,
      ErrorCode,
      ErrorString,
      ErrorDiagnostic,
      ReturnValue
    ) {
      var o = new Object()
      o.enrollmentSessionId = enrollment_session_id
      o.scormSessionId = scorm_session_id
      o.name = DataItem
      o.value = DataValue
      o.errorCode = ErrorCode
      o.errorString = ErrorString
      o.errorDiagnostic = ErrorDiagnostic
      o.returnValue = ReturnValue
      for (prop in o) {
        if (o[prop] == null) {
          o[prop] = 'null'
        }
      }
      return o
    }

    function createLMSInfoInitialize(enrollmentContentResourceId, targetUserResourceId) {
      var o = new Object()
      o.enrollmentContentResourceId = enrollmentContentResourceId
      o.targetUserResourceId = targetUserResourceId
      return o
    }

    function createLMSInfoFinish(enrollment_session_id, scorm_session_id) {
      var o = new Object()
      o.enrollmentSessionId = enrollment_session_id
      o.scormSessionId = scorm_session_id
      o.TargetUserEmail = 'atacan.kerpic@keepnetlabs.com'
      o.CompanyId = 1
      o.SMTPSettingId = 1
      return o
    }

    function createLMSInfoGetValue(enrollment_session_id, scorm_session_id, DataItem) {
      var o = new Object()
      o.enrollmentSessionId = enrollment_session_id
      o.scormSessionId = scorm_session_id
      o.name = DataItem
      return o
    }
    console.log('API', API)
  },
  methods: {
    callForData() {
      const query = this?.$route?.query
      const enrollmentContentResourceId = query?.EnrollmentContentId
      const targetUserResourceId = query?.TargetUserResourceId
      if (enrollmentContentResourceId && targetUserResourceId) {
        AwarenessEducatorService.lmsInitialize({
          enrollmentContentResourceId,
          targetUserResourceId
        }).catch(() => {
          this.routeToLogin()
        })
      } else this.routeToLogin()
    },
    routeToLogin() {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
