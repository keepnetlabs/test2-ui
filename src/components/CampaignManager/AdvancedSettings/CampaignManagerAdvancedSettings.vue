<template>
  <v-form ref="refForm">
    <CampaignManagerSmtpErrorDialog
      v-if="isShowSmtpErrorDialog"
      :status="isShowSmtpErrorDialog"
      :message="testEmailErrorMessage"
      @on-close="toggleShowSmtpErrorDialog"
      @on-confirm="handleOnConfirmSmtpErrorDialog"
    />
    <FormGroup
      class="mt-8 campaign-manager-smtp-settings"
      :title="labels.Smtp"
      :sub-title="labels.SmtpSub"
      has-hint
    >
      <KSelect
        v-bind="commonRules"
        v-model.trim="formData.smtpSettingResourceId"
        id="input--company-manager-advanced-settings-smtp"
        class="new-integration__select"
        dense
        outlined
        placeholder="Select Option"
        no-data-text="No SMTP setting available"
        :items="smtpItems"
        :error="isShowSmtpInputError"
        :error-messages="getSmtpInputErrorMessage"
        :disabled="isTestingConnection"
        @change="handleChangeSmtp"
        @focus="handleFocusOfSmtpSettingsInput"
        @focusout="handleFocusOutOfSmtpSettingsInput"
      >
        <!--
       <template #item="{ item }">
         <div v-if="item.isHeader" class="campaign-manager-advanced-settings__smtp-select-header">
           {{ item.header }}
         </div>
         <div v-else class="campaign-manager-advanced-settings__smtp-select-item">
           {{ item.text }}
         </div>
       </template>
       -->
      </KSelect>
      <v-btn
        :key="buttonKey"
        class="ml-4"
        text
        color="#2196f3"
        :style="getTestConnectionButtonStyle()"
        :loading="isTestingConnection"
        :disabled="!formData.smtpSettingResourceId"
        @click="handleTestConnectionChange"
        ><span
          v-if="isTestMailSend"
          style="
            color: rgb(67, 160, 71) !important;
            display: flex;
            align-items: center;
            text-transform: capitalize;
          "
        >
          <v-icon>mdi-check</v-icon>
          <span class="ml-2"> {{ labels.Connected }}</span>
        </span>
        <span v-else> {{ labels.TestConnection }}</span>
        <template #loader>
          <img
            src="../../../assets/img/spinner-blue.svg"
            class="add-in-settings__spinner"
            alt="spinner"
          />
          <span class="ml-1" style="font-size: 14px; text-transform: capitalize;">
            {{ labels.TestingConnection }}
          </span>
        </template>
      </v-btn>
    </FormGroup>
    <FormGroup :title="labels.Distribution" :sub-title="labels.DistributionSub">
      <div class="campaign-manager-advanced-settings__distribution-item">
        <label for="input--campaign-manager-advanced-settings-time"
          >Send emails with SMTP Delay every
        </label>
        <v-text-field
          v-model="formData.distributionSmtpDelayEvery"
          v-mask="'###'"
          id="input--campaign-manager-advanced-settings-time"
          outlined
          class="edit-name-textfield edit-select standard-height ml-2"
          hide-details
          style="max-width: 48px;"
          :disabled="!distributionEmailOverTimeDisableStatus"
          :rules="rules.number"
          @input="callForCalculateSendingInfo"
        ></v-text-field>
        <KSelect
          v-model.trim="formData.distributionSmtpDelayTimeTypeId"
          id="input--campaign-manager-advanced-settings-time-type"
          class="ml-2"
          outlined
          dense
          hide-details
          placeholder="Select a item"
          style="max-width: 118px;"
          :items="formDetails['distributionSmtpDelayTimeTypes']"
          :disabled="!distributionEmailOverTimeDisableStatus"
          @change="callForCalculateSendingInfo"
        />
      </div>
      <!-- <v-radio-group
       v-model="formData.distributionTypeId"
       class="campaign-manager-advanced-settings__distribution"
       @change="callForCalculateSendingInfo"
     >
       <div class="campaign-manager-advanced-settings__distribution-item">
         <v-radio
           :id="`input--campaign-manager-radio-advanced-settings`"
           class="mb-0"
           label="Send emails with SMTP Delay every"
           color="#2196f3"
           value="1"
         />
         <v-text-field
           v-model="formData.distributionSmtpDelayEvery"
           v-mask="'###'"
           id="input--campaign-manager-advanced-settings-time"
           placeholder="Enter number"
           outlined
           class="edit-name-textfield edit-select standard-height ml-2"
           hide-details
           style="max-width: 48px"
           :disabled="!distributionEmailOverTimeDisableStatus"
           :rules="rules.number"
           @input="callForCalculateSendingInfo"
         ></v-text-field>
         <KSelect
           v-model.trim="formData.distributionSmtpDelayTimeTypeId"
           id="input--campaign-manager-advanced-settings-time-type"
           class="ml-2"
           outlined
           dense
           hide-details
           placeholder="Select a item"
           style="max-width: 118px"
           :items="formDetails['distributionSmtpDelayTimeTypes']"
           :disabled="!distributionEmailOverTimeDisableStatus"
           @change="callForCalculateSendingInfo"
         />
       </div>
       <div class="campaign-manager-advanced-settings__distribution-item mt-2">
         <v-radio
           :id="`input--campaign-manager-radio-advanced-settings`"
           value="2"
           class="mb-0"
           label="Distribute emails over"
           color="#2196f3"
         />
         <v-text-field
           v-model="formData.distributionEmailOver"
           v-mask="'###'"
           id="input--campaign-manager-advanced-settings-distribute-time"
           placeholder="Enter number"
           outlined
           class="edit-name-textfield edit-select standard-height ml-2"
           hide-details
           style="max-width: 48px"
           :disabled="distributionEmailOverTimeDisableStatus"
           :rules="rules.number"
           @change="callForCalculateSendingInfo"
         ></v-text-field>
         <KSelect
           v-model.trim="formData.distributionEmailOverTimeTypeId"
           id="input--campaign-manager-advanced-settings-distribute-time-type"
           class="ml-2"
           outlined
           dense
           hide-details
           placeholder="Select a item"
           style="max-width: 118px"
           :disabled="distributionEmailOverTimeDisableStatus"
           :items="formDetails['distributionEmailOverTimeTypes']"
           @change="callForCalculateSendingInfo"
         />
       </div>
     </v-radio-group> -->
    </FormGroup>
    <FormGroup :title="labels.SendingLimit" :sub-title="labels.SendingLimitSub">
      <v-text-field
        v-model="formData.sendingLimit"
        v-mask="'###########'"
        id="input--campaign-manager-advanced-settings-sending-limit"
        outlined
        persistent-hint
        placeholder="Enter number"
        hint="*Required"
        :rules="rules.number"
        @input="callForCalculateSendingInfo"
      ></v-text-field>
    </FormGroup>
    <div
      v-if="getDistributionTextRenderStatus"
      class="campaign-manager-advanced-settings__distribution-text"
    >
      {{ getDistributionText }}
    </div>
    <FormGroup class="mt-6" :title="labels.OtherSettings" style="max-width: 640px;">
      <div>
        <v-checkbox
          v-model="formData.excludeFromReports"
          id="input--campaign-manager-advanced-settings-exclude-from-reports"
          color="#2196f3"
        >
          <template #label> Exclude from reports</template>
        </v-checkbox>
        <v-checkbox
          v-model="formData.sendOnlyActiveUsers"
          id="input--campaign-manager-advanced-settings-only-active-users"
          color="#2196f3"
          :disabled="!isUsersOnline"
        >
          <template #label> Send only to active users on phishing reporter add-in</template>
        </v-checkbox>
        <div class="campaign-manager-advanced-settings__other-settings-last">
          <v-checkbox
            v-model="formData.sendRandomlyUsers"
            id="input--campaign-manager-advanced-settings-randomly-selected"
            color="#2196f3"
            hide-details
          >
          </v-checkbox>
          <span>Send this campaign to randomly selected</span>
          <v-text-field
            v-model="formData.sendRandomlyUsersCount"
            v-mask="'#######'"
            id="input--campaign-manager-advanced-settings-other-settings-number"
            placeholder="Enter number"
            outlined
            class="edit-name-textfield edit-select standard-height ml-2 absolute-text-input-error"
            style="max-width: 64px;"
            :disabled="getDisabledStatusOfRandomlySelected"
            :rules="[...rules.number, userCountValidation]"
          ></v-text-field>
          <KSelect
            v-model.trim="formData.sendRandomlyUsersCalculateTypeId"
            id="input--campaign-manager-advanced-settings-other-settings-percent"
            class="ml-2"
            outlined
            dense
            hide-details
            placeholder="Select a item"
            style="max-width: 118px;"
            :items="formDetails['sendRandomlyUsersCalculateTypes']"
            :disabled="getDisabledStatusOfRandomlySelected"
            @change="validateForm"
          />
          <span class="ml-2">of target users</span>
        </div>
      </div>
    </FormGroup>
  </v-form>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import KSelect from '@/components/Common/Inputs/KSelect'
import { getSmtpSettings, searchSmtpSettings, testConnection } from '@/api/smtpSettings'
import * as validations from '@/utils/validations'
import CampaignManagerSmtpErrorDialog from '@/components/CampaignManager/AdvancedSettings/CampaignManagerSmtpErrorDialog'
import { calculateSendingInfo } from '@/api/phishingsimulator'
export default {
  name: 'CampaignManagerAdvancedSettings',
  components: {
    CampaignManagerSmtpErrorDialog,
    KSelect,
    FormGroup
  },
  props: {
    formDetails: {
      type: Object
    },
    defaultValues: {
      type: Object
    },
    selectedPhishingScenario: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      isTestingConnection: false,
      isShowSmtpErrorDialog: false,
      isUsersOnline: false,
      totalSendSecond: 77720,
      batchEverySendSecond: 0,
      targetGroupResourceIds: [],
      isTestMailSend: false,
      totalTargetUserCount: 0,
      smtpAxiosPayload: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      smtpItems: [],
      buttonKey: Math.random().toString(),
      defaultSmtpItems: [],
      responseOfSmtpItems: [],
      isShowSmtpInputError: false,
      testEmailErrorMessage: '',
      formData: {
        smtpSettingResourceId: '',
        excludeFromReports: false,
        sendOnlyActiveUsers: false,
        sendRandomlyUsers: false,
        distributionTypeId: '1',
        distributionSmtpDelayEvery: 20,
        distributionEmailOverTimeTypeId: '1',
        distributionEmailOver: 8,
        distributionSmtpDelayTimeTypeId: '1',
        sendingLimit: 50,
        sendRandomlyUsersCount: 20,
        sendRandomlyUsersCalculateTypeId: '1'
      },
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.TemplateName))
        ]
      },
      rules: {
        number: [
          (v) => validations.required(v, 'Enter a number higher than 0'),
          (v) => validations.startsWith(v, 'Cannot start with 0', 0),
          (v) => v < 1000000 || `${v} cannot exceed ${1000000}`
        ]
      }
    }
  },
  computed: {
    getSmtpInputErrorMessage() {
      return this.isShowSmtpInputError ? 'You cannot use this scenario with this SMTP setting.' : ''
    },
    distributionEmailOverTimeDisableStatus() {
      return this.formData.distributionTypeId === '1'
    },
    getDistributionText() {
      return this.formData.distributionTypeId === '1'
        ? `Sending ${this.formData.sendingLimit} emails every ${this.formData.distributionSmtpDelayEvery} ${this.getSelectedSmtpDelayOverTimeType} to ${this.totalTargetUserCount} target users will take approximately ${this.getApproximatedTime}.`
        : `Sending  ${this.formData.sendingLimit} emails every ${this.getEmailOverMinutes} minutes to ${this.totalTargetUserCount} targets users will take ${this.getApproximatedTime}.`
    },
    getEmailOverMinutes() {
      let seconds = this.batchEverySendSecond
      seconds = seconds.toFixed()
      if (seconds < 1) seconds = 1
      let minutes = 0
      if (seconds > 60) {
        minutes = seconds % 60
        seconds = seconds / 60
      }
      minutes = minutes.toString()
      seconds = seconds.toString()
      return `${minutes.length === 1 ? `0${minutes}` : `${minutes}`}:${
        seconds.length === 1 ? `0${seconds}` : `${seconds}`
      }`
    },
    getSelectedSmtpDelayOverTimeType() {
      return this.formDetails['distributionSmtpDelayTimeTypes']
        ? this.formDetails['distributionSmtpDelayTimeTypes']?.find(
            (item) => item.value === this.formData.distributionSmtpDelayTimeTypeId
          )?.text
        : ''
    },
    getDistributionTextRenderStatus() {
      return this.formData.distributionTypeId === '1'
        ? this.formData.sendingLimit && this.formData.distributionSmtpDelayEvery
        : this.formData.sendingLimit && this.formData.distributionEmailOver
    },
    getApproximatedTime() {
      let seconds = this.totalSendSecond
      let minutes = 0
      let hours = 0
      if (seconds > 60) {
        minutes = Math.floor(seconds / 60)
        seconds = seconds % 60
      }
      if (minutes > 60) {
        hours = Math.floor(minutes / 60)
        minutes = minutes % 60
      }
      seconds = Math.floor(seconds)
      if (minutes === 0 && hours === 0 && seconds === 0) {
        seconds = 1
      }
      hours = hours.toString()
      minutes = minutes.toString()
      seconds = seconds.toString()

      const hoursText = hours > 1 ? 'hours' : 'hour'
      const minutesText = minutes > 1 ? 'minutes' : 'minute'
      const secondsText = seconds > 1 ? 'seconds' : 'second'

      return `${hours !== '0' ? `${hours} ${hoursText} ` : ''}${
        minutes !== '0' ? `${minutes} ${minutesText} ` : ''
      }${
        seconds !== '0'
          ? hours !== '0' || minutes !== '0'
            ? `and ${seconds} ${secondsText}`
            : `${seconds} ${secondsText}`
          : ''
      }`
    },
    getDisabledStatusOfRandomlySelected() {
      return !this.formData.sendRandomlyUsers
    }
  },
  watch: {
    defaultValues(val) {
      for (const key of Object.keys(val)) {
        if (key === 'smtpSetting') {
          this.selectedSmtpSetting = val[key]
          this.formData.smtpSettingResourceId = this.selectedSmtpSetting.value
        } else if (key === 'distributionTypeId') {
          this.formData.distributionTypeId = '1'
        } else {
          this.formData[key] = val[key]
        }
      }
    }
  },
  created() {
    this.callForSmtpSettings()
  },
  methods: {
    getTestConnectionButtonStyle() {
      return {
        fontWeight: 600,
        pointerEvents: this.isTestMailSend ? 'none' : 'cursor'
      }
    },
    validateForm() {
      this.$refs.refForm.validate()
    },
    userCountValidation(v) {
      const { sendRandomlyUsersCalculateTypeId } = this.formData
      //that means percent
      const val = parseInt(v)
      if (sendRandomlyUsersCalculateTypeId === '1') {
        return (val <= 100 && val >= 0) || 'This number cannot be higher than 100 percent'
      } else {
        return (
          !(this.totalTargetUserCount < val) ||
          'This number cannot be higher than number of total target users.'
        )
      }
    },
    handleChangeSmtp() {
      this.buttonKey = Math.random().toString()
      this.isTestMailSend = false
      this.isShowSmtpInputError = false
      this.testEmailErrorMessage = ''
    },
    handleOnConfirmSmtpErrorDialog() {
      this.toggleShowSmtpErrorDialog()
      this.$emit('on-increment-step')
    },
    toggleShowSmtpErrorDialog() {
      this.isShowSmtpErrorDialog = !this.isShowSmtpErrorDialog
    },
    callForSmtpSettings() {
      searchSmtpSettings(this.smtpAxiosPayload)
        .then((response) => {
          const {
            data: { data }
          } = response
          this.responseOfSmtpItems = data.results
          // this.responseOfSmtpItems = data.results.map((item, index) => ({
          //   ...item,
          //   isDefault: index % 3 === 0 ? true : false,
          // }));
          const defaultSmtpItems = this.responseOfSmtpItems.filter((item) => item.isDefault)
          this.smtpItems = this.responseOfSmtpItems
            .map((smtpItem) => {
              if (smtpItem.isDefault) return null
              return { text: smtpItem.name, value: smtpItem.resourceId }
            })
            .filter(Boolean)
          if (defaultSmtpItems.length > 0) {
            this.smtpItems.unshift(
              ...defaultSmtpItems.map((smtpItem) => ({
                text: smtpItem.name,
                value: smtpItem.resourceId
              })),
              { divider: true },
              {
                header: 'Others',
                class: 'campaign-manager-advanced-settings__smtp-select-header'
              }
            )
          }
          this.defaultSmtpItems = JSON.parse(JSON.stringify(this.smtpItems))
        })
        .finally(() => {
          if (
            this.selectedSmtpSetting &&
            !this.smtpItems.find((item) => item.value === this.selectedSmtpSetting.value)
          ) {
            this.smtpItems.push(this.selectedSmtpSetting)
          }
        })
    },
    callForCalculateSendingInfo() {
      if (!this.targetGroupResourceIds.length) return
      if (!this.formData.distributionSmtpDelayEvery) return
      this.debounce(() => {
        const payload = {
          targetGroupResourceIds: this.targetGroupResourceIds,
          distributionTypeId: this.formData.distributionTypeId,
          distributionSmtpDelayEvery: this.formData.distributionSmtpDelayEvery,
          distributionSmtpDelayTimeTypeId: this.formData.distributionSmtpDelayTimeTypeId,
          distributionEmailOver: this.formData.distributionEmailOver,
          distributionEmailOverTimeTypeId: this.formData.distributionEmailOverTimeTypeId,
          sendingLimit: this.formData.sendingLimit,
          sendOnlyActiveUsers: this.formData.sendOnlyActiveUsers,
          sendRandomlyUsers: this.formData.sendRandomlyUsers,
          sendRandomlyUsersCount: this.formData.sendRandomlyUsersCount,
          sendRandomlyUsersCalculateTypeId: this.formData.sendRandomlyUsersCalculateTypeId
        }
        if (payload.distributionSmtpDelayEvery) {
          calculateSendingInfo(payload).then((response) => {
            const {
              data: { data }
            } = response
            const { totalSendSecond, batchEverySendSecond } = data
            this.totalSendSecond = totalSendSecond
            this.batchEverySendSecond = batchEverySendSecond
          })
        }
      }, 500)
    },
    handleTestConnectionChange() {
      try {
        this.callForTestConnection()
      } catch (e) {}
    },
    callForGetSmtpSetting() {
      return getSmtpSettings(this.formData.smtpSettingResourceId).then((response) => {
        const {
          data: {
            data: { password, serverAddress, serverPort, useAuthentication, useSSL, userName } = {}
          } = {}
        } = response
        return {
          serverAddress,
          port: serverPort,
          userName,
          password,
          resourceId: this.formData.smtpSettingResourceId,
          useAuthentication,
          useSSL
        }
      })
    },
    async callForTestConnection() {
      this.$emit('set-action-button-disability', true)
      try {
        this.isTestingConnection = true
        const smtpData = await this.callForGetSmtpSetting()
        const { fromAddress, fromName, template } = this.selectedPhishingScenario
        const payload = {
          ...smtpData,
          to: this.$store.state.auth.user.email,
          from: fromAddress,
          fromName,
          message: template
        }
        try {
          await testConnection(payload)
          this.isTestMailSend = true
          this.isShowSmtpInputError = false
          this.$nextTick(() => {
            this.testEmailErrorMessage = ''
          })
          return true
        } catch (error) {
          if (!error) return
          const { response } = error
          const { data: { message = '', Message = '' } = {} } = response
          const errorMessage = message || Message
          this.testEmailErrorMessage =
            errorMessage ||
            'You cannot use this scenario with this SMTP setting.If you are going to keep it like that, there will be some errors in the campaign.'
          this.isShowSmtpInputError = true
        } finally {
          this.isTestingConnection = false
        }
      } catch (e) {
      } finally {
        this.$emit('set-action-button-disability', false)
      }
    },
    handleFocusOfSmtpSettingsInput() {
      if (this.inputTimeout) {
        clearTimeout(this.inputTimeout)
      }
      this.inputTimeout = setTimeout(() => {
        this.$nextTick(() => {
          const element = document.querySelector(
            '#input--company-manager-advanced-settings-smtp .k-select__menu'
          )
          if (element) {
            element.addEventListener('scroll', this.handleScroll)
          }
        })
      }, 250)
    },
    handleFocusOutOfSmtpSettingsInput() {
      if (this.inputTimeout) {
        clearTimeout(this.inputTimeout)
      }
      this.inputTimeout = setTimeout(() => {
        this.$nextTick(() => {
          const element = document.querySelector(
            '#input--company-manager-advanced-settings-smtp .k-select__menu'
          )
          if (element) {
            element.removeEventListener('scroll', this.handleScroll)
          }
        })
      }, 250)
    },
    handleScroll(e) {
      const { scrollTop, scrollHeight, offsetHeight } = e.target
      if (
        scrollTop - (scrollHeight - offsetHeight) < 10 &&
        scrollTop - (scrollHeight - offsetHeight) > -10
      ) {
        this.smtpAxiosPayload.pageSize += 10
        this.debounce(() => {
          this.callForSmtpSettings()
        }, 500)
      }
    },
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    }
  }
}
</script>
