<template>
  <v-form ref="refForm">
    <CampaignManagerSmtpSettingsDialog
      v-if="isShowCustomSmtpDialog"
      :status="isShowCustomSmtpDialog"
      :smtp-items="defaultSmtpItems"
      @on-close="toggleCustomSmtpDialog"
    />
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
        id="input--notification-template-smtp"
        class="new-integration__select"
        dense
        outlined
        placeholder="Select Option"
        :items="smtpItems"
        :error="isShowSmtpInputError"
        :error-messages="getSmtpInputErrorMessage"
        @change="handleChangeSmtp"
      />
      <v-btn
        class="ml-4"
        text
        color="#2196f3"
        style="font-weight: 600;"
        :style="getTestConnectionButtonStyle"
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
          <v-icon>mdi-check</v-icon> <span class="ml-2"> {{ labels.Connected }}</span>
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
      <v-radio-group
        v-model="formData.distribution"
        class="campaign-manager-advanced-settings__distribution"
      >
        <div class="campaign-manager-advanced-settings__distribution-item">
          <v-radio
            :id="`input--campaign-manager-radio-advanced-settings`"
            label="Send emails with SMTP Delay every"
            color="#2196f3"
            value="1"
          />
          <v-text-field
            v-model="formData.distributionSmtpDelayEvery"
            v-mask="'#####'"
            id="input--campaign-manager-advanced-settings-time"
            placeholder="Enter number"
            outlined
            class="edit-name-textfield edit-select standard-height ml-2"
            hide-details
            style="max-width: 48px;"
            :disabled="!distributionEmailOverTimeDisableStatus"
            :rules="rules.number"
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
          />
        </div>
        <div class="campaign-manager-advanced-settings__distribution-item mt-2">
          <v-radio
            :id="`input--campaign-manager-radio-advanced-settings`"
            value="2"
            label="Distribute emails over"
            color="#2196f3"
          />
          <v-text-field
            v-model="formData.distributionEmailOver"
            v-mask="'#####'"
            id="input--campaign-manager-advanced-settings-distribute-time"
            placeholder="Enter number"
            outlined
            class="edit-name-textfield edit-select standard-height ml-2"
            hide-details
            style="max-width: 48px;"
            :disabled="distributionEmailOverTimeDisableStatus"
            :rules="rules.number"
          ></v-text-field>
          <KSelect
            v-model.trim="formData.distributionEmailOverTimeTypeId"
            id="input--campaign-manager-advanced-settings-distribute-time-type"
            class="ml-2"
            outlined
            dense
            hide-details
            placeholder="Select a item"
            style="max-width: 118px;"
            :disabled="distributionEmailOverTimeDisableStatus"
            :items="formDetails['distributionEmailOverTimeTypes']"
          />
        </div>
      </v-radio-group>
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
      ></v-text-field>
    </FormGroup>
    <div
      v-if="getDistributionTextRenderStatus"
      class="campaign-manager-advanced-settings__distribution-text"
    >
      {{ getDistributionText }}
    </div>
    <FormGroup class="mt-6" :title="labels.OtherSettings" style="max-width: 600px;">
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
            v-mask="'#####'"
            id="input--campaign-manager-advanced-settings-other-settings-number"
            placeholder="Enter number"
            outlined
            class="edit-name-textfield edit-select standard-height ml-2"
            hide-details
            style="max-width: 48px;"
            :disabled="getDisabledStatusOfRandomlySelected"
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
import CampaignManagerSmtpSettingsDialog from '@/components/CampaignManager/AdvancedSettings/CampaignManagerSmtpSettingsDialog'
import * as validations from '@/utils/validations'
import { getAvailableForListFromBackend } from '@/utils/helperFunctions'
import CampaignManagerSmtpErrorDialog from '@/components/CampaignManager/AdvancedSettings/CampaignManagerSmtpErrorDialog'
export default {
  name: 'CampaignManagerAdvancedSettings',
  components: {
    CampaignManagerSmtpErrorDialog,
    CampaignManagerSmtpSettingsDialog,
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
      isShowCustomSmtpDialog: false,
      isShowSmtpErrorDialog: false,
      isTestMailSend: false,
      smtpAxiosPayload: {
        pageNumber: 1,
        pageSize: 5000,
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
      defaultSmtpItems: [],
      responseOfSmtpItems: [],
      isShowSmtpInputError: false,
      testEmailErrorMessage: '',
      formData: {
        smtpSettingResourceId: '',
        excludeFromReports: false,
        sendOnlyActiveUsers: false,
        sendRandomlyUsers: false,
        distribution: '1',
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
          (v) => validations.required(v, labels.Required),
          (v) => validations.startsWith(v, 'Cannot start with 0', 0)
        ]
      }
    }
  },
  computed: {
    getSmtpInputErrorMessage() {
      return this.isShowSmtpInputError ? 'You cannot use this scenario with this SMTP setting.' : ''
    },
    distributionEmailOverTimeDisableStatus() {
      return this.formData.distribution === '1'
    },
    getTestConnectionButtonStyle() {
      return { fontWeight: 600, pointerEvents: this.isTestMailSend ? 'none' : 'cursor' }
    },
    getDistributionText() {
      return this.formData.distribution === '1'
        ? `Sending ${this.formData.sendingLimit} emails every ${this.formData.distributionSmtpDelayEvery} ${this.getSelectedSmtpDelayOverTimeType} 500 target users will take approx ${this.getApproximatedTime} hours`
        : `Sending  ${this.formData.sendingLimit} emails every ${this.getEmailOverMinutes} minutes to 500 targets users will take ${this.getEmailOverEndText}`
    },
    getEmailOverMinutes() {
      const type = this.getSelectedEmailTimeType
      let { distributionEmailOver, sendingLimit } = this.formData
      let ratio = this.calculateRatio(type)
      distributionEmailOver = Number(distributionEmailOver)
      let seconds = (sendingLimit * ratio * distributionEmailOver) / 500
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
    getEmailOverEndText() {
      const type = this.getSelectedEmailTimeType
      const number = this.formData.distributionEmailOver.toString()
      if (type === 'hours') {
        return `${number.length === 1 ? `0${number}` : `${number}`}:00:00 hours`
      } else {
        const { distributionEmailOver } = this.formData
        let hours = 0
        let minutes = distributionEmailOver
        if (distributionEmailOver > 60) {
          hours = Math.floor(minutes / 60)
          minutes = minutes % 60
        }
        hours = hours.toString()
        minutes = minutes.toString()
        return `${hours.length === 1 ? `0${hours}` : `${hours}`}:${
          minutes.length === 1 ? `0${minutes}` : `${minutes}`
        }:00 hours`
      }
    },
    getSelectedSmtpDelayOverTimeType() {
      return this.formDetails['distributionSmtpDelayTimeTypes'].find(
        (item) => item.value === this.formData.distributionSmtpDelayTimeTypeId
      )?.text
    },
    getSelectedEmailTimeType() {
      return this.formDetails['distributionEmailOverTimeTypes'].find(
        (item) => item.value === this.formData.distributionEmailOverTimeTypeId
      )?.text
    },
    getDistributionTextRenderStatus() {
      return this.formData.distribution === '1'
        ? this.formData.sendingLimit && this.formData.distributionSmtpDelayEvery
        : this.formData.sendingLimit && this.formData.distributionEmailOver
    },
    getApproximatedTime() {
      const type = this.getSelectedSmtpDelayOverTimeType
      let { distributionSmtpDelayEvery, sendingLimit } = this.formData
      distributionSmtpDelayEvery = Number(distributionSmtpDelayEvery)
      let ratio = this.calculateRatio(type)
      sendingLimit = Number(sendingLimit)
      let seconds = (500 * ratio * distributionSmtpDelayEvery) / sendingLimit
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

      return `${hours.length === 1 ? `0${hours || 0}` : `${hours}`}:${
        minutes.length === 1 ? `0${minutes || 0}` : `${minutes}`
      }:${seconds.length === 1 ? `0${seconds || 0}` : `${seconds}`}`
    },
    getDisabledStatusOfRandomlySelected() {
      return !this.formData.sendRandomlyUsers
    }
  },
  watch: {
    defaultValues(val) {
      for (const key of Object.keys(val)) {
        this.formData[key] = val[key]
      }
    }
  },
  created() {
    this.callForSmtpSettings()
  },
  methods: {
    calculateRatio(type = '') {
      let ratio = 1
      if (type === 'minutes' || type === 'hours') {
        ratio *= 60
      }
      if (type === 'hours') {
        ratio *= 60
      }
      return ratio
    },
    handleChangeSmtp() {
      this.isTestMailSend = false
      this.isShowSmtpInputError = false
    },
    handleOnConfirmSmtpErrorDialog() {
      this.toggleShowSmtpErrorDialog()
      this.$emit('on-increment-step')
    },
    toggleShowSmtpErrorDialog() {
      this.isShowSmtpErrorDialog = !this.isShowSmtpErrorDialog
    },
    callForSmtpSettings() {
      searchSmtpSettings(this.smtpAxiosPayload).then((response) => {
        const {
          data: { data }
        } = response
        this.responseOfSmtpItems = data.results
        this.smtpItems = this.responseOfSmtpItems.map((smtpItem) => {
          return { text: smtpItem.name, value: smtpItem.resourceId }
        })
        this.defaultSmtpItems = JSON.parse(JSON.stringify(this.smtpItems))
      })
    },

    toggleCustomSmtpDialog() {
      this.isShowCustomSmtpDialog = !this.isShowCustomSmtpDialog
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
          this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
          this.isShowSmtpInputError = false
          this.testEmailErrorMessage = ''
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
      } catch (e) {}
    }
  }
}
</script>

<style lang="scss">
.campaign-manager-smtp-settings {
  max-width: 820px;
  .k-form-group__content {
    display: flex;
  }
  .v-btn {
    padding: 0 8px !important;
  }
  .v-btn__content {
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
  }
}
.campaign-manager-advanced-settings__distribution {
  &.v-input--radio-group.v-input {
    margin-top: 0;
  }
  &-item {
    display: flex;
    align-items: center;
    label {
      font-weight: normal !important;
      font-size: 14px !important;
      color: #383b41 !important;
    }
    .v-radio {
      margin-bottom: 0;
    }
  }
  &-text {
    background-color: #f1f8fe;
    font-weight: 600;
    font-size: 14px;
    line-height: 21px;
    color: #383b41;
    max-width: 554px;
    padding: 8px;
  }
}
.campaign-manager-advanced-settings__other-settings-last {
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 21px;
  color: #383b41;
  .v-input--checkbox {
    padding-top: 2px !important;
  }
}
</style>
