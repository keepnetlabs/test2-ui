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
import {
  getTimeZoneForMoment,
  scrollToComponent,
  isDifferent,
  createRandomCryptStringNumber
} from '@/utils/functions'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader.vue'
import NewInvestigationSettings from '@/components/Investigation/NewInvestigationSettings.vue'
import StepperFooter from '@/components/Stepper/StepperFooter.vue'
export default {
  components: {
    StepperFooter,
    NewInvestigationSettings,
    ConfigureCompanyStepHeader,
    AppModal
  },
  props: [
    'isEdit',
    'ísDuplicate',
    'investigationDetailsData',
    'status',
    'selectedMail',
    'isTs',
    'isIr'
  ],
  data() {
    return {
      step: 1,
      initialFormValues: null,
      isActionButtonDisabled: false,
      labels,
      errorMessages: [],
      placeholders: {
        ip: 'Enter an ip address ',
        from: 'Enter an email address',
        to: 'Enter an email address',
        cc: 'Enter an email address',
        bcc: 'Enter an email address',
        subject: 'Enter a subject',
        senderName: 'Enter a from name',
        url: 'Enter a domain name',
        keyword: 'Enter a keyword',
        size: 'Enter file size(byte)',
        name: 'Enter a file name(case sensitive)',
        sha512: 'Enter a sha512 key',
        md5: 'Enter a md5 key',
        extension: 'Enter an file extension',
        regex: 'Enter a regular expression'
      },
      filterList: [
        {
          renderKey: `column-key-${createRandomCryptStringNumber()}`,
          text: ''
        }
      ],
      filterListOption: [
        {
          label: 'Header',
          id: 'header',
          isDefaultExpanded: true,
          children: [
            { label: 'Subject', id: 'subject' },
            { label: 'From', id: 'from' },
            { label: 'To', id: 'to' },
            { label: 'CC', id: 'cc' },
            { label: 'BCC', id: 'bcc' },
            { label: 'Sender Name', id: 'senderName' },
            { label: 'IP Address', id: 'ip' }
          ]
        },
        {
          label: 'Body',
          id: 'body',
          isDefaultExpanded: true,
          children: [
            { label: 'Keyword', id: 'keyword' },
            { label: 'URL', id: 'url' },
            { label: 'Regex', id: 'regex' }
          ]
        },
        {
          label: 'Attachment',
          id: 'attachment',
          isDefaultExpanded: true,
          children: [
            { label: 'File Name', id: 'name' },
            { label: 'File Size', id: 'size' },
            { label: 'File Extension', id: 'extension' },
            { label: 'SHA512', id: 'sha512' },
            { label: 'MD5', id: 'md5' }
          ]
        }
      ]
    }
  },
  watch: {
    filterList() {
      this.checkAllSingularity()
    }
  },
  created() {
    this.checkIsEdit()
    if (this.selectedMail) {
      this.filterList = []
      const isTs = this.isTs
      const isIR = this.isIr
      if (isIR) {
        this.selectedMail.urls = this.selectedMail.notifiedEmailInvestigation.urls
        this.selectedMail.attachments = this.selectedMail.notifiedEmailInvestigation.attachments
      }
      this.selectedMail.attachments &&
        this.selectedMail.attachments.map((item) => {
          const attachmentCase = isTs ? !item.isHidden && item.isFlagged : true
          if (attachmentCase)
            this.filterList.push({
              option: 'md5',
              text: item.md5,
              isFlagged: item.isFlagged,
              label: 'Malicious'
            })
          if (attachmentCase)
            this.filterList.push({
              option: 'sha512',
              text: item.sha512,
              isFlagged: item.isFlagged,
              label: 'Malicious'
            })
        })
      const bccCase = isTs ? !this.selectedMail.isBccHidden && this.selectedMail.isBccFlagged : true
      this.selectedMail.bcc &&
        bccCase &&
        this.selectedMail.bcc.map((item) => {
          this.filterList.push({
            option: 'bcc',
            text: item,
            isFlagged: this.selectedMail.isBccFlagged,
            label: 'Harmful sender'
          })
        })
      const ccCase = isTs ? !this.selectedMail.isCcHidden && this.selectedMail.isCcFlagged : true
      this.selectedMail.cc &&
        ccCase &&
        this.selectedMail.cc.map((item) => {
          this.filterList.push({
            option: 'cc',
            text: item,
            isFlagged: this.selectedMail.isCcFlagged,
            label: 'Harmful sender'
          })
        })
      const fromCase = isTs
        ? !this.selectedMail.isFromHidden && this.selectedMail.isFromFlagged
        : true
      this.selectedMail.from &&
        fromCase &&
        this.filterList.push({
          option: 'from',
          text: this.selectedMail.from,
          isFlagged: this.selectedMail.isFromFlagged,
          label: 'Harmful sender'
        })
      const subjectCase = isTs
        ? !this.selectedMail.isSubjectHidden && this.selectedMail.isSubjectFlagged
        : true
      this.selectedMail.subject &&
        subjectCase &&
        this.filterList.push({
          option: 'subject',
          text: this.selectedMail.subject,
          isFlagged: this.selectedMail.isSubjectFlagged,
          label: 'Harmful sender'
        })
      const toCase = isTs ? !this.selectedMail.isToHidden && this.selectedMail.isToFlagged : true
      this.selectedMail.to &&
        toCase &&
        !isIR &&
        this.selectedMail.to.map((item) => {
          this.filterList.push({
            option: 'to',
            text: item,
            isFlagged: this.selectedMail.isToFlagged,
            label: 'Harmful sender'
          })
        })
      this.selectedMail.urls &&
        this.selectedMail.urls.map((item) => {
          const urlCase = isTs ? !item.isHidden && item.isFlagged : true
          if (urlCase)
            this.filterList.push({
              option: 'url',
              text: item.url,
              isFlagged: item.isFlagged,
              label: 'Phishing'
            })
        })
      if (!this.filterList.length) {
        this.filterList.push({})
      }
      this.investigationName = `Manual Investigation - ${this.$moment(Date.now()).format(
        getTimeZoneForMoment()
      )}`
    }
    this.setInitialFormData()
  },
  methods: {
    setInitialFormData() {
      this.initialFormValues = {
        investigationName: this.investigationName,
        targetUsers: this.targetUsers,
        filterList: this.filterList,
        date: this.date,
        scanTypes: this.scanTypes,
        duration: this.duration,
        selectedAction: this.selectedAction
      }
    },
    changeStep(flag = 1) {
      this.step += flag
    },
    checkAllSingularity() {
      this.filterList.forEach((item, index) => this.checkSingularity(item, index))
    },
    handleInputSingularityChange(list, index) {
      this.checkSingularity({ ...list }, index)
      this.checkAllSingularity()
    },
    handleDeleteListItem(index) {
      this.filterList.splice(index, 1)
      this.errorMessages.splice(index, 1)
    },
    checkSingularity(list = {}, index = 0) {
      if (!list.option && !list.text) return
      let message = ''
      if (
        this.filterList.find(
          (item, itemIndex) =>
            item.text &&
            item.text === list.text &&
            item.option === list.option &&
            index !== itemIndex &&
            itemIndex < index
        )
      )
        message = `There is already ${list.option} with same value`
      this.$set(this.errorMessages, index, message)
    },
    getSearchCriteriaItemRules(option = '') {
      const rules = []
      if (!option) {
        return rules
      }
      if (['from', 'to', 'cc', 'bcc'].includes(option)) {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.email(v),
          (v) =>
            Validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.EmailAddress, 320)),
          (v) => {
            if (Validations.email(v)) {
              return Validations.controlEmailLength(v) || labels.InvalidEmailAddress
            }
            return false
          }
        )
        return rules
      } else if (option === 'ip') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.ip(v),
          (v) => Validations.maxLength(v, 15, labels.getMaxLengthMessage(labels.IpAddress, 15))
        )
        return rules
      } else if (option === 'subject') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Subject))
        )
        return rules
      } else if (option === 'senderName') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.SenderName))
        )
        return rules
      } else if (option === 'url') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.maxLength(v, 2000, labels.getMaxLengthMessage(labels.URL, 2000)),
          (v) => Validations.urlOrIpAddress(v)
        )
        return rules
      } else if (option === 'keyword') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Keyword))
        )
        return rules
      } else if (option === 'size') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.isNumber(v),
          (v) => Validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.Size, 320))
        )
        return rules
      } else if (option === 'name') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Name))
        )
        return rules
      } else if (option === 'sha512') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.minLength(v, 128, labels.getMinLengthMessage(labels.SHA512, 128)),
          (v) => Validations.maxLength(v, 128, labels.getMaxLengthMessage(labels.SHA512, 128))
        )
        return rules
      } else if (option === 'md5') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v),
          (v) => Validations.maxLength(v, 32, labels.getMaxLengthMessage(labels.MD5, 32)),
          (v) => Validations.minLength(v, 32, labels.getMinLengthMessage(labels.MD5, 32))
        )
        return rules
      } else if (option === 'extension') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.minLength(v, 3, labels.getMinLengthMessage(labels.Extension, 3)),
          (v) => Validations.maxLength(v, 10, labels.getMaxLengthMessage(labels.Extension, 10)),
          (v) => Validations.extension(v, labels.InvalidExtension),
          (v) => Validations.isFileExtensionSpecialCharacter(v, labels.InvalidExtension)
        )
        return rules
      } else if (option === 'regex') {
        rules.push(
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.maxLength(v, 2000, labels.getMaxLengthMessage(labels.Regex, 10))
        )
      }
      return rules
    },
    addNewFilterListOption() {
      this.filterList.push({
        renderKey: `column-key-${createRandomCryptStringNumber()}`,
        text: ''
      })
    },
    handleClose() {
      const currentFormValues = {
        investigationName: this.investigationName,
        targetUsers: this.targetUsers,
        filterList: this.filterList,
        date: this.date,
        scanTypes: this.scanTypes,
        duration: this.duration,
        selectedAction: this.selectedAction
      }
      const isChanged = isDifferent(currentFormValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit('closeAdd')
      }
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

      if (this.date.length < 1) {
        this.isDateValid = false
      }
      if (this.$refs.form.validate()) {
        if (!this.isDateValid || this.errorMessages.some((item) => item)) {
          this.$nextTick(() => {
            const el = this.$refs.form.$el.querySelector('.date-row')
            scrollToComponent(el)
          })

          return false
        }

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
      } else {
        return this.$nextTick(() => {
          this.isActionButtonDisabled = false
          const el = this.$refs.form.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
    },
    checkIsEdit() {
      if (!this.isEdit) return
      this.investigationName = this?.investigationDetailsData?.name || ''
      this.scanTypes = this.investigationDetailsData.scanConfigurationDetails.map(
        ({ mailConfigurationResourceId, type }) => ({
          mailConfigurationResourceId,
          type
        })
      )
      this.duration = 3
      this.targetUserType = this.investigationDetailsData.targetUserType
      if (this.investigationDetailsData.targetUserType === 'Groups') {
        this.targetUsersValue = this.investigationDetailsData.targetUsers.map((item) => {
          return {
            name: item.targetUser,
            resourceId: item.targetGroupResourceId
          }
        })
      } else if (this.investigationDetailsData.targetUserType === 'SpecificUsers') {
        this.targetUsersValue = this.investigationDetailsData.targetUsers.map(
          (item) => item.targetUser
        )
        const newItems = this.targetUsersValue.map((email) => ({ email }))
        this.specificUserItems = [...this.specificUserItems, ...newItems]
      }
      this.selectedAction = 'NoAction'
      this.filterList = this.getEditedFilters()
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
