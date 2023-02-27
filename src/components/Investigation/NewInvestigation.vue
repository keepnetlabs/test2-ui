<template>
  <app-modal
    :status="status"
    title-id="text--incident-responder-new-investigation-modal-title"
    icon-name="$book-search"
    :title="labels.StartNewManualInvestigation"
    @closeOverlay="handleClose"
  >
    <template #overlay-body>
      <v-stepper v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step
            id="step--investigation-add-or-edit-modal-settings"
            class="k-stepper__step"
            :complete="step > 1"
            :step="1"
            >{{ labels.Settings }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--investigation-add-or-edit-modal-filters"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.Filters }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.Settings"
              :subtitle="labels.NewInvestigationSub"
            />
            <NewInvestigationSettings ref="refNewInvestigationSettings" />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.Filters"
              :subtitle="labels.NewInvestigationFiltersSub"
            />
            <NewInvestigationFilters ref="refNewInvestigationFilters" />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="2"
        :ids="{
          cancelButton: 'btn-cancel--add-or-edit-investigation-modal',
          backButton: 'btn-back--add-or-edit-investigation-modal',
          nextButton: 'btn-next--add-or-edit-investigation-modal',
          saveButton: 'btn-save--add-or-edit-investigation-modal'
        }"
        :step="step"
        :disabled-statuses="{
          nextButton: isActionButtonDisabled,
          submitButton: isActionButtonDisabled
        }"
        @on-cancel="handleClose"
        @on-back="changeStep(-1)"
        @on-next="changeStep()"
        @on-submit="handleSubmit"
      />
    </template>
  </app-modal>
</template>

<script>
import AppModal from '../AppModal'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader.vue'
import NewInvestigationSettings from '@/components/Investigation/NewInvestigationSettings.vue'
import StepperFooter from '@/components/Stepper/StepperFooter.vue'
import { ACTION_TYPES, TARGET_USER_TYPES, DURATION_TYPES } from '@/components/Investigation/utils'
import NewInvestigationFilters from '@/components/Investigation/NewInvestigationFilters.vue'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
export default {
  components: {
    NewInvestigationFilters,
    StepperFooter,
    NewInvestigationSettings,
    ConfigureCompanyStepHeader,
    AppModal
  },
  props: {
    isDuplicate: {
      type: Boolean,
      default: false
    },
    investigationDetailsData: {
      type: Object,
      default: null
    },
    status: {
      type: Boolean,
      default: false
    },
    selectedMail: {
      type: Object,
      default: null
    },
    isTs: {
      type: Boolean,
      default: false
    },
    isIr: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      step: 1,
      initialFormData: null,
      isActionButtonDisabled: false,
      labels,
      errorMessages: []
    }
  },
  mounted() {
    this.checkIsDuplicate()
    this.checkIsSelectedMail()
    this.setInitialFormData()
  },
  methods: {
    setInitialFormData() {
      this.initialFormData = this.getCurrentFormData()
    },
    getStepOneFormData() {
      const { refNewInvestigationSettings } = this.$refs
      const { formData = {} } = refNewInvestigationSettings || {}
      return {
        investigationName: formData.investigationName,
        targetUsers: formData.targetUsers,
        emailDateRange: formData.date,
        scanTypes: formData.scanTypes,
        duration: formData.duration,
        action: formData.action,
        filterList: this.filterList
      }
    },
    getCurrentFormData() {
      return {
        ...this.getStepOneFormData(),
        filterList: this.filterList
      }
    },
    changeStep(flag = 1) {
      if (this.step === 1 && flag === 1) {
        const { refNewInvestigationSettings } = this.$refs
        if (refNewInvestigationSettings.validateForm()) return (this.step += flag)
        return this.scrollToErrorMessage(refNewInvestigationSettings.$refs.refForm.$el)
      } else this.step += flag
    },
    scrollToErrorMessage(el = {}) {
      this.$nextTick(() => {
        scrollToComponent(el.querySelector('.error--text') || el.querySelector('.date-row'))
      })
    },
    handleClose() {
      if (!isDifferent(this.getCurrentFormData(), this.initialFormData))
        return this.$emit('closeAdd')
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit('closeAdd')
        }
      })
    },
    filterData(data = []) {
      return data.reduce((acc, item) => {
        if (
          Object.keys(item).some((key) => {
            return item[key]
          })
        )
          acc.push(item)
        return acc
      }, [])
    },
    handleSubmit() {
      // creating new form data if validation is success
      // data structure is a little bit difficult. The filter values has to be check all time when It's selected.
      const { refNewInvestigationFilters } = this.$refs
      const { formValid, queryValid, filtersValid } = refNewInvestigationFilters.validateForm()
      if (formValid && queryValid && filtersValid.ipValid && filtersValid.fromValid) {
      } else if (!formValid) {
        return this.scrollToErrorMessage(this.$refs.refNewInvestigationFilters.$refs.refForm.$el)
      } else if (!filtersValid.ipValid || !filtersValid.fromValid) {
        if (!filtersValid.fromValid) {
          this.$store.dispatch('common/createSnackBar', {
            message: labels.ErrorDuplicateFilterFrom,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
        }
        if (!filtersValid.ipValid) {
          this.$store.dispatch('common/createSnackBar', {
            message: labels.ErrorDuplicateFilterIp,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
        }
        return
      } else {
        const message = refNewInvestigationFilters.getErrorMessage()
        this.$store.dispatch('common/createSnackBar', {
          message,
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-alert-circle'
        })
      }
      if (this.$refs.form.validate()) {
        if (!this.filterList.every((filter) => filter.text && filter.option)) {
          this.$nextTick(() => {
            const el = this.$refs.form.$el.querySelector('.error--text')
            scrollToComponent(el)
          })

          return false
        }
        let headersData = [
          {
            ip: null,
            from: null,
            to: null,
            cc: null,
            bcc: null,
            subject: null,
            senderName: null
          }
        ]

        let bodyData = [
          {
            url: null,
            keyword: null,
            regex: null
          }
        ]
        let attachmentsData = [
          {
            size: null,
            name: null,
            md5: null,
            sha512: null,
            extension: null
          }
        ]
        // checking filter status. If there are only 1 filter, it goes to the first element of array
        // If It's already exist, then new element pushs to the array.
        // for more info look at the ip case ( 4 line below)
        for (let index = 0; index < this.filterList.length; index++) {
          if (this.filterList[index].option === 'ip') {
            if (
              !headersData[headersData.length - 1].ip &&
              headersData[headersData.length - 1].ip != this.filterList[index].text
            ) {
              // in the first array, there is no value at ip value name pair
              // that's why, we can set the our ip value to the first array element
              headersData.filter((s) => s.ip == null)[0].ip = this.filterList[index].text
            } else {
              // ip value name pair is already exist. Thus, we push new array tp the headersData with all values null except ip.
              headersData.push({
                ip: this.filterList[index].text,
                from: null,
                to: null,
                cc: null,
                bcc: null,
                subject: null,
                senderName: null
              })
            }
          }
          if (this.filterList[index].option === 'from') {
            if (
              !headersData[headersData.length - 1].from &&
              headersData[headersData.length - 1].from != this.filterList[index].text
            ) {
              headersData.filter((s) => s.from == null)[0].from = this.filterList[index].text
            } else {
              headersData.push({
                ip: null,
                from: this.filterList[index].text,
                to: null,
                cc: null,
                bcc: null,
                subject: null,
                senderName: null
              })
            }
          }
          if (this.filterList[index].option === 'to') {
            if (
              !headersData[headersData.length - 1].to &&
              headersData[headersData.length - 1].to != this.filterList[index].text
            ) {
              headersData.filter((s) => s.to == null)[0].to = this.filterList[index].text
            } else {
              headersData.push({
                ip: null,
                from: null,
                to: this.filterList[index].text,
                cc: null,
                bcc: null,
                subject: null,
                senderName: null
              })
            }
          }

          if (this.filterList[index].option === 'cc') {
            if (
              !headersData[headersData.length - 1].cc &&
              headersData[headersData.length - 1].cc != this.filterList[index].text
            ) {
              headersData.filter((s) => s.cc == null)[0].cc = this.filterList[index].text
            } else {
              headersData.push({
                ip: null,
                from: null,
                to: null,
                cc: this.filterList[index].text,
                bcc: null,
                subject: null,
                senderName: null
              })
            }
          }
          if (this.filterList[index].option === 'bcc') {
            if (
              !headersData[headersData.length - 1].bcc &&
              headersData[headersData.length - 1].bcc != this.filterList[index].text
            ) {
              headersData.filter((s) => s.bcc == null)[0].bcc = this.filterList[index].text
            } else {
              headersData.push({
                ip: null,
                from: null,
                to: null,
                cc: null,
                bcc: this.filterList[index].text,
                subject: null,
                senderName: null
              })
            }
          }
          if (this.filterList[index].option === 'subject') {
            if (
              !headersData[headersData.length - 1].subject &&
              headersData[headersData.length - 1].subject != this.filterList[index].text
            ) {
              headersData.filter((s) => s.subject == null)[0].subject = this.filterList[index].text
            } else {
              headersData.push({
                ip: null,
                from: null,
                to: null,
                cc: null,
                bcc: null,
                subject: this.filterList[index].text,
                senderName: null
              })
            }
          }
          if (this.filterList[index].option === 'senderName') {
            if (
              !headersData[headersData.length - 1].senderName &&
              headersData[headersData.length - 1].senderName != this.filterList[index].text
            ) {
              headersData.filter((s) => s.senderName == null)[0].senderName = this.filterList[
                index
              ].text
            } else {
              headersData.push({
                ip: null,
                from: null,
                to: null,
                cc: null,
                bcc: null,
                subject: null,
                senderName: this.filterList[index].text
              })
            }
          }

          if (this.filterList[index].option === 'url') {
            if (
              !bodyData[bodyData.length - 1].url &&
              bodyData[bodyData.length - 1].url != this.filterList[index].text
            ) {
              bodyData.filter((s) => s.url == null)[0].url = this.filterList[index].text
            } else {
              bodyData.push({
                url: this.filterList[index].text,
                keyword: null,
                isRegex: false
              })
            }
          }
          if (this.filterList[index].option === 'keyword') {
            if (
              !bodyData[bodyData.length - 1].keyword &&
              bodyData[bodyData.length - 1].keyword != this.filterList[index].text
            ) {
              bodyData.filter((s) => s.keyword == null)[0].keyword = this.filterList[index].text
            } else {
              bodyData.push({
                url: null,
                keyword: this.filterList[index].text,
                isRegex: false
              })
            }
          }
          if (this.filterList[index].option === 'size') {
            if (
              !attachmentsData[attachmentsData.length - 1].size &&
              attachmentsData[attachmentsData.length - 1].size != this.filterList[index].text
            ) {
              attachmentsData.filter((s) => s.size == null)[0].size = this.filterList[index].text
            } else {
              attachmentsData.push({
                size: this.filterList[index].text,
                name: null,
                md5: null,
                sha512: null,
                extension: null
              })
            }
          }
          if (this.filterList[index].option === 'name') {
            if (
              !attachmentsData[attachmentsData.length - 1].name &&
              attachmentsData[attachmentsData.length - 1].name != this.filterList[index].text
            ) {
              attachmentsData.filter((s) => s.name == null)[0].name = this.filterList[index].text
            } else {
              attachmentsData.push({
                size: null,
                name: this.filterList[index].text,
                md5: null,
                sha512: null,
                extension: null
              })
            }
          }
          if (this.filterList[index].option === 'sha512') {
            if (
              !attachmentsData[attachmentsData.length - 1].sha512 &&
              attachmentsData[attachmentsData.length - 1].sha512 != this.filterList[index].text
            ) {
              attachmentsData.filter((s) => s.sha512 == null)[0].sha512 = this.filterList[
                index
              ].text
            } else {
              attachmentsData.push({
                size: null,
                name: null,
                md5: null,
                sha512: this.filterList[index].text,
                extension: null
              })
            }
          }
          if (this.filterList[index].option === 'md5') {
            if (
              !attachmentsData[attachmentsData.length - 1].md5 &&
              attachmentsData[attachmentsData.length - 1].md5 != this.filterList[index].text
            ) {
              attachmentsData.filter((s) => s.md5 == null)[0].md5 = this.filterList[index].text
            } else {
              attachmentsData.push({
                size: null,
                name: null,
                md5: this.filterList[index].text,
                sha512: null,
                extension: null
              })
            }
          }
          if (this.filterList[index].option === 'extension') {
            if (
              !attachmentsData[attachmentsData.length - 1].extension &&
              attachmentsData[attachmentsData.length - 1].extension != this.filterList[index].text
            ) {
              attachmentsData.filter((s) => s.extension == null)[0].extension = this.filterList[
                index
              ].text
            } else {
              attachmentsData.push({
                size: null,
                name: null,
                md5: null,
                sha512: null,
                extension: this.filterList[index].text
              })
            }
          }

          if (this.filterList[index].option === 'regex') {
            if (
              !bodyData[bodyData.length - 1].regex &&
              bodyData[bodyData.length - 1].regex !== this.filterList[index].text
            ) {
              bodyData.filter((s) => s.regex == null)[0].regex = this.filterList[index].text
            } else {
              bodyData.push({
                url: null,
                keyword: null,
                regex: this.filterList[index].text
              })
            }
          }
        }

        const [startDate, endDate] = this.date

        const newInvestigationObj = {
          headers: this.filterData(headersData),
          bodies: this.filterData(bodyData),
          attachments: this.filterData(attachmentsData),
          isScanEnterpriseVault: false,
          name: this.investigationName,
          startDate,
          endDate,
          duration: this.duration,
          targetUserType: this.targetUserType,
          targetUsers:
            this.targetUserType === 'Groups'
              ? this.targetUsersValue.map((item) => item.resourceId)
              : this.targetUsersValue,
          scanTypes: this.scanTypes,
          autoAction: {
            type: this.selectedAction,
            isPermanentDelete: this.selectedAction === 'Delete',
            warningMessage: this.warningMessage
          }
        }
        this.isActionButtonDisabled = true
        // post request with body data
        this.$store
          .dispatch('investigations/createInvestigation', newInvestigationObj)
          .catch(() => {
            this.isActionButtonDisabled = false
          })
          .then((resp) => {
            this.isActionButtonDisabled = false
            this.$emit('closeWithRoute', resp)
            this.$emit('closeAdd', true)
          })
      }
    },
    checkIsDuplicate() {
      if (!this.isDuplicate) return
      const duplicatedNewInvestigationSettings = {
        investigationName: this?.investigationDetailsData?.name || '',
        scanTypes: this.investigationDetailsData.scanConfigurationDetails.map(
          ({ mailConfigurationResourceId, type }) => ({
            mailConfigurationResourceId,
            type
          })
        ),
        duration: this.investigationDetailsData.duration || DURATION_TYPES.OneDay,
        targetUserType: this.investigationDetailsData.targetUserType,
        selectedAction: ACTION_TYPES.NoAction,
        targetUsersValue: ''
      }

      if (this.investigationDetailsData.targetUserType === TARGET_USER_TYPES.Groups) {
        duplicatedNewInvestigationSettings.targetUsersValue = this.investigationDetailsData.targetUsers.map(
          (item) => {
            return {
              name: item.targetUser,
              resourceId: item.targetGroupResourceId
            }
          }
        )
      } else if (this.investigationDetailsData.targetUserType === TARGET_USER_TYPES.Users) {
        duplicatedNewInvestigationSettings.targetUsersValue = this.investigationDetailsData.targetUsers.map(
          (item) => item.targetUser
        )
      }
      this.$refs.refNewInvestigationSettings.setFormData(duplicatedNewInvestigationSettings)
      this.filterList = this.getEditedFilters()
    },
    checkIsSelectedMail() {
      if (!this.selectedMail) return
      const filterList = []
      if (this.isIr) {
        this.selectedMail.urls = this.selectedMail.notifiedEmailInvestigation.urls
        this.selectedMail.attachments = this.selectedMail.notifiedEmailInvestigation.attachments
      }
      filterList.push(this.getSelectedMailFromFilter())
      filterList.push(this.getSelectedMailSubjectFilter())
      filterList.push(...this.getSelectedMailAttachmentFilter())
      filterList.push(...this.getSelectedMailBccFilter())
      filterList.push(...this.getSelectedMailCcFilter())
      filterList.push(...this.getSelectedMailToFilter())
      filterList.push(...this.getSelectedMailUrlFilter())
      if (!this.filterList.length) this.filterList.push({})
    },
    getSelectedMailAttachmentFilter() {
      if (!this.selectedMail.attachments) return []
      const filterList = []
      this.selectedMail.attachments.forEach((item) => {
        const attachmentCase = this.isTs ? !item.isHidden && item.isFlagged : true
        if (!attachmentCase) return
        filterList.push({
          option: 'md5',
          text: item.md5,
          isFlagged: item.isFlagged,
          label: 'Malicious'
        })
        filterList.push({
          option: 'sha512',
          text: item.sha512,
          isFlagged: item.isFlagged,
          label: 'Malicious'
        })
      })
      return filterList
    },
    getSelectedMailBccFilter() {
      const bccCase = this.isTs
        ? !this.selectedMail.isBccHidden && this.selectedMail.isBccFlagged
        : true
      if (!bccCase || !this.selectedMail.bcc) return []
      return this.selectedMail.bcc.map((item) => {
        return {
          option: 'bcc',
          text: item,
          isFlagged: this.selectedMail.isBccFlagged,
          label: 'Harmful sender'
        }
      })
    },
    getSelectedMailCcFilter() {
      const ccCase = this.isTs
        ? !this.selectedMail.isCcHidden && this.selectedMail.isCcFlagged
        : true
      if (!ccCase || !this.selectedMail.cc) return []
      return this.selectedMail.cc.map((item) => {
        return {
          option: 'cc',
          text: item,
          isFlagged: this.selectedMail.isCcFlagged,
          label: 'Harmful sender'
        }
      })
    },
    getSelectedMailFromFilter() {
      const fromCase = this.isTs
        ? !this.selectedMail.isFromHidden && this.selectedMail.isFromFlagged
        : true
      if (!fromCase || !this.selectedMail.from) return []
      return {
        option: 'from',
        text: this.selectedMail.from,
        isFlagged: this.selectedMail.isFromFlagged,
        label: 'Harmful sender'
      }
    },
    getSelectedMailSubjectFilter() {
      const subjectCase = this.isTs
        ? !this.selectedMail.isSubjectHidden && this.selectedMail.isSubjectFlagged
        : true
      if (!subjectCase || !this.selectedMail.subject) return []
      return {
        option: 'subject',
        text: this.selectedMail.subject,
        isFlagged: this.selectedMail.isSubjectFlagged,
        label: 'Harmful sender'
      }
    },
    getSelectedMailToFilter() {
      const toCase = this.isTs
        ? !this.selectedMail.isToHidden && this.selectedMail.isToFlagged
        : true
      if (!toCase || !this.selectedMail.to || this.isIr) return []
      return this.selectedMail.to.map((item) => {
        return {
          option: 'to',
          text: item,
          isFlagged: this.selectedMail.isToFlagged,
          label: 'Harmful sender'
        }
      })
    },
    getSelectedMailUrlFilter() {
      if (!this.selectedMail.urls) return []
      const filterList = []
      this.selectedMail.urls.forEach((item) => {
        const urlCase = this.isTs ? !item.isHidden && item.isFlagged : true
        if (!urlCase) return
        filterList.push({
          option: 'url',
          text: item.url,
          isFlagged: item.isFlagged,
          label: 'Phishing'
        })
      })
      return filterList
    },
    getEditedFilters() {
      const headers = this?.investigationDetailsData?.headers?.reduce((acc, item) => {
        for (let [key, value] of Object.entries(item)) {
          if (value && key !== 'resourceId') {
            acc.push({ option: key, text: value })
          }
        }
        return acc
      }, [])
      const body = this?.investigationDetailsData?.bodies?.reduce((acc, item) => {
        for (let [key, value] of Object.entries(item)) {
          if (value && key !== 'resourceId') {
            acc.push({ option: key, text: value })
          }
        }
        return acc
      }, [])
      const attachments = this?.investigationDetailsData?.attachments?.reduce((acc, item) => {
        for (let [key, value] of Object.entries(item)) {
          if (value && key !== 'resourceId') {
            acc.push({ option: key, text: value })
          }
        }
        return acc
      }, [])
      return [...headers, ...body, ...attachments]
    }
  }
}
</script>
