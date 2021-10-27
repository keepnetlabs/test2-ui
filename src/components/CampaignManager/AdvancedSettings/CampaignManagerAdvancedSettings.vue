<template>
  <v-form ref="refForm">
    <CampaignManagerSmtpSettingsDialog
      v-if="isShowCustomSmtpDialog"
      :status="isShowCustomSmtpDialog"
      :smtp-items="defaultSmtpItems"
      @on-close="toggleCustomSmtpDialog"
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
        @input="handleSmtpItemChange"
      />
      <v-btn
        class="ml-4"
        text
        color="#2196f3"
        style="font-weight: 600;"
        :loading="isTestingConnection"
        @click="handleTestConnectionChange"
        >{{ labels.TestConnection }}
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
            v-model="formData.time"
            v-mask="'#####'"
            id="input--campaign-manager-advanced-settings-time"
            placeholder="Enter number"
            outlined
            class="edit-name-textfield edit-select standard-height ml-2"
            hide-details
            style="max-width: 48px;"
            :disabled="!distributionEmailOverTimeDisableStatus"
          ></v-text-field>
          <KSelect
            v-model.trim="formData.distributionEmailOverTime"
            id="input--campaign-manager-advanced-settings-time-type"
            class="ml-2"
            outlined
            dense
            hide-details
            placeholder="Select a item"
            style="max-width: 118px;"
            :items="formDetails['distributionEmailOverTimeTypes']"
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
            v-model="formData.distributeTime"
            v-mask="'#####'"
            id="input--campaign-manager-advanced-settings-distribute-time"
            placeholder="Enter number"
            outlined
            class="edit-name-textfield edit-select standard-height ml-2"
            hide-details
            style="max-width: 48px;"
            :disabled="distributionEmailOverTimeDisableStatus"
          ></v-text-field>
          <KSelect
            v-model.trim="formData.distributionSmtpDelayTime"
            id="input--campaign-manager-advanced-settings-distribute-time-type"
            class="ml-2"
            outlined
            dense
            hide-details
            placeholder="Select a item"
            style="max-width: 118px;"
            :disabled="distributionEmailOverTimeDisableStatus"
            :items="formDetails['distributionSmtpDelayTimeTypes']"
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
        :rules="rules.days"
      ></v-text-field>
    </FormGroup>
    <div class="campaign-manager-advanced-settings__distribution-text">
      {{ getDistributionText }}
    </div>
    <FormGroup class="mt-6" :title="labels.OtherSettings" style="max-width: 600px;">
      <div>
        <v-checkbox
          v-model="formData.isExcludeFromReports"
          id="input--campaign-manager-advanced-settings-exclude-from-reports"
          color="#2196f3"
        >
          <template #label> Exclude from reports (Test campaign)</template>
        </v-checkbox>
        <v-checkbox
          v-model="formData.isOnlyActiveUsers"
          id="input--campaign-manager-advanced-settings-only-active-users"
          color="#2196f3"
        >
          <template #label>
            Send only to active users on phishing reporter add-in (14 currently)</template
          >
        </v-checkbox>
        <div class="campaign-manager-advanced-settings__other-settings-last">
          <v-checkbox
            v-model="formData.isRandomSelected"
            id="input--campaign-manager-advanced-settings-randomly-selected"
            color="#2196f3"
            hide-details
          >
          </v-checkbox>
          <span>Send this campaign to randomly selected</span>
          <v-text-field
            v-model="formData.randomlySelectNumber"
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
            v-model.trim="formData.randomlySelectPercent"
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
import { searchSmtpSettings } from '@/api/smtpSettings'
import CampaignManagerSmtpSettingsDialog from '@/components/CampaignManager/AdvancedSettings/CampaignManagerSmtpSettingsDialog'
import * as validations from '@/utils/validations'
export default {
  name: 'CampaignManagerAdvancedSettings',
  components: { CampaignManagerSmtpSettingsDialog, KSelect, FormGroup },
  props: {
    formDetails: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      isTestingConnection: false,
      isShowCustomSmtpDialog: false,
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
      formData: {
        smtpSettingResourceId: '',
        isExcludeFromReports: false,
        isOnlyActiveUsers: false,
        isRandomSelected: false,
        distribution: '1',
        time: 20,
        distributionEmailOverTime: '1',
        distributeTime: 8,
        distributionSmtpDelayTime: '1',
        sendingLimit: 50,
        randomlySelectNumber: 20,
        randomlySelectPercent: '1'
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
        days: [
          (v) => validations.required(v, labels.Required),
          (v) => validations.startsWith(v, 'Cannot start with 0', 0)
        ]
      }
    }
  },
  computed: {
    distributionEmailOverTimeDisableStatus() {
      return this.formData.distribution === '1'
    },
    getDistributionText() {
      return `Sending ${this.formData.sendingLimit} every ${this.formData.time} ${this.formData.timeType} 500 targetUsers will take approx 00:03:20 hours`
    },
    getDisabledStatusOfRandomlySelected() {
      return !this.formData.isRandomSelected
    }
  },
  created() {
    this.callForSmtpSettings()
  },
  methods: {
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
        this.smtpItems.push({ text: 'Customize for each company...', value: 'Custom' })
      })
    },
    handleSmtpItemChange(item) {
      if (item === 'Custom') this.toggleCustomSmtpDialog()
    },
    toggleCustomSmtpDialog() {
      this.isShowCustomSmtpDialog = !this.isShowCustomSmtpDialog
    },
    handleTestConnectionChange() {
      this.isTestingConnection = true
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
