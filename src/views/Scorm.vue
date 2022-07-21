<template>
  <iframe v-if="src" frameborder="0" :src="src" style="width: 100vw; height: 100vh;"></iframe>
</template>
<script>
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'Scorm',
  data() {
    return {
      src: '',
      scormSessionId: '',
      enrollmentSessionId: ''
    }
  },
  created() {
    this.callForData()
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
        })
          .then((response) => {
            this.enrollmentSessionId = response?.data?.data?.enrollmentSessionId
            this.scormSessionId = response?.data?.data?.scormSessionId
            this.initialized = true
          })
          .finally(() => this.setupIframe(this.scormSessionId, this.enrollmentSessionId))
      }
    },
    setupIframe(scormSessionId, enrollmentSessionId) {
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
        this.enrollmentSessionId = enrollmentSessionId
        this.scormSessionId = scormSessionId
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
          
          if (val != '') {
            this.LastErrorString = 'Value passed to LMSInitialize, should be blank'
            this.LastError = '201'
            this.LastErrorDiagnostic = 'Error from API'
            return 'false'
          }
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
          return enrollmentSessionId && scormSessionId ? ' true' : 'false'
        }
        function _LMSFinish(val) {
          if (val !== '') {
            this.LastErrorString = 'Value passed to LMSFinish, should be blank'
            this.LastError = '201'
            this.LastErrorDiagnostic = 'Error from API'
            return 'false'
          }
          const request = new XMLHttpRequest();
              request.open('POST', `${APP_CONFIG.VUE_APP_APP_API_TEST}/scorm/LMSFinish`, false); 
              request.setRequestHeader("Content-type", "application/json");
              request.send(JSON.stringify({
              enrollmentSessionId:this.enrollmentSessionId,
              scormSessionId:this.scormSessionId,
              targetUserResourceId:this.targetUserResourceId
            }))
            const response=JSON.parse(request.response)
             console.log("lmsFinish",response.data)
           return response.data
        }

        function _LMSGetValue(name) {
              const request = new XMLHttpRequest();
              request.open('POST', `${APP_CONFIG.VUE_APP_APP_API_TEST}/scorm/LMSGetValue`, false); 
              request.setRequestHeader("Content-type", "application/json");
              request.send(JSON.stringify({
              enrollmentSessionId:this.enrollmentSessionId,
              scormSessionId:this.scormSessionId,
              name
            }))
            const response=JSON.parse(request.response)
            console.log("lmsGetValue",response.data)
           return response.data
        }
        function _LMSSetValue(name, value) {
            const request = new XMLHttpRequest();
              request.open('POST', `${APP_CONFIG.VUE_APP_APP_API_TEST}/scorm/LMSSetValue`, false); 
              request.setRequestHeader("Content-type", "application/json");
              request.send(JSON.stringify({
              enrollmentSessionId:this.enrollmentSessionId,
              scormSessionId:this.scormSessionId,
              name,
              value
            }))
            const response=JSON.parse(request.response)
             console.log("lmsSetValue",response.data)
           return response.data
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
      window.API = API
      this.src = '/scorm-test/index_lms.html'
    },
    routeToLogin() {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
