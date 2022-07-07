<template>
  <v-form ref="refForm">
    <FormGroup has-hint :title="labels.ContentLanguage">
      <KSelect
        v-model.trim="formData.contentLanguage"
        persistent-hint
        dense
        outlined
        autocomplete="off"
        hint="*Required"
        placeholder="All Languages"
        :rules="[(v) => Validations.required(v, labels.Required)]"
        :items="contentLanguageItems"
      ></KSelect>
    </FormGroup>
    <FormGroup has-hint style="max-width: 600px;" :title="labels.Schedule">
      <v-radio-group
        v-model="formData.scheduleTypeId"
        class="mt-0 campaign-manager-target-groups-radio"
        hide-details
      >
        <v-radio
          v-for="item in radioItems"
          :key="item.text"
          :id="`input--campaign-manager-radio-${item.text}`"
          style="margin-bottom: 16px;"
          color="#2196f3"
          :value="item.value"
          :label="item.text"
        ></v-radio>
        <div class="campaign-manager-advanced-settings__distribution-item mt-n2">
          <v-radio
            :id="`input--campaign-manager-radio-schedule-to`"
            style="margin-bottom: 0;"
            label="Schedule to"
            color="#2196f3"
            value="3"
          />
          <div :class="[!isDateValid && 'date-picker-error mb-n3']">
            <InputDate
              v-model="formData.scheduledDate"
              class="date-picker-height-40 ml-2"
              type="datetime"
              ref="refPicker"
              placeholder="Select Date Select Time"
              style="width: 100%; max-width: 222px;"
              :disabled="isScheduledTimeDisabled"
            />
            <div class="v-text-field__details checkbox-error" v-if="!isDateValid">
              <transition appear name="bounce">
                <div class="v-messages theme--light error--text" role="alert">
                  <div class="v-messages__wrapper">
                    <div class="v-messages__message" style="padding-left: 10px;">
                      Date is required
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <InputTimezone :disabled="isScheduledTimeDisabled" />
        </div>
      </v-radio-group>
    </FormGroup>
    <FormGroup :title="labels.Distribution" :sub-title="labels.TrainingDistributionSub">
    </FormGroup>
    <FormGroupHorizontalContent :label="labels.SendingLimit" class="mt-2" style="max-width: 323px;">
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
    </FormGroupHorizontalContent>
    <v-radio-group
      v-model="formData.distributionTypeId"
      class="mt-0 campaign-manager-target-groups-radio"
      hide-details
    >
      <div class="campaign-manager-advanced-settings__distribution-item">
        <v-radio
          :id="`input--send-training-radio-smtp-delay-send`"
          style="margin-bottom: 0;"
          label="Send emails with SMTP Delay every"
          color="#2196f3"
          value="1"
        >
        </v-radio>
        <v-text-field
          v-model="formData.distributionSmtpDelayEvery"
          v-mask="'###'"
          id="input--send-trainings-time"
          placeholder="Enter number"
          outlined
          class="ml-2"
          hide-details
          style="max-width: 48px;"
          :rules="rules.number"
          :disabled="isDistributionSmtpDelayDisabled"
        ></v-text-field>
        <KSelect
          v-model.trim="formData.distributionSmtpDelayTimeTypeId"
          id="input--send-trainings-time-type"
          class="ml-2"
          outlined
          dense
          hide-details
          placeholder="Select a item"
          style="max-width: 118px;"
          :items="distributionSmtpDelayTimeTypes"
          :disabled="isDistributionSmtpDelayDisabled"
        />
      </div>
      <div class="campaign-manager-advanced-settings__distribution-item mt-2">
        <v-radio
          :id="`input--send-trainings-distribute-trainings-over`"
          style="margin-bottom: 0;"
          label="Distribute trainings over"
          color="#2196f3"
          value="2"
        />
        <v-text-field
          v-model="formData.trainingDistributionOver"
          v-mask="'###'"
          id="input--send-trainings-distribution-over"
          placeholder="Enter number"
          outlined
          class="ml-2"
          hide-details
          style="max-width: 48px;"
          :rules="rules.number"
          :disabled="!isDistributionSmtpDelayDisabled"
        ></v-text-field>
        <KSelect
          v-model.trim="formData.trainingDistributionOverType"
          id="input--send-trainings-distribution-over-type"
          class="ml-2"
          outlined
          dense
          hide-details
          placeholder="Select a item"
          style="max-width: 118px;"
          :items="trainingTimeItems"
          :disabled="!isDistributionSmtpDelayDisabled"
        />
      </div>
    </v-radio-group>
    <FormGroup class="mt-6" :title="labels.Reminder">
      <div class="campaign-manager-advanced-settings__other-settings-last">
        <v-checkbox
          v-model="formData.sendReminderEvery"
          id="input--campaign-manager-advanced-settings-randomly-selected"
          color="#2196f3"
          hide-details
        >
        </v-checkbox>
        <span>Set reminder every</span>
        <v-text-field
          v-model="formData.reminder"
          v-mask="'#######'"
          id="input--campaign-manager-advanced-settings-other-settings-number"
          placeholder="Enter number"
          outlined
          class="edit-name-textfield edit-select standard-height ml-2 absolute-text-input-error"
          style="max-width: 64px;"
          :disabled="!formData.sendReminderEvery"
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
          :disabled="!formData.sendReminderEvery"
        />
        <span class="ml-2">ends</span>
        <KSelect
          v-model.trim="formData.sendRandomlyUsersCalculateTypeId"
          id="input--campaign-manager-advanced-settings-other-settings-percent"
          class="ml-2"
          outlined
          dense
          hide-details
          placeholder="Select a item"
          style="max-width: 118px;"
          :disabled="!formData.sendReminderEvery"
        />
      </div>
    </FormGroup>
    <FormGroup class="mt-6" :title="labels.Certificate">
      <v-checkbox
        v-model="formData.certificate"
        id="input--campaign-manager-advanced-settings-randomly-selected"
        hide-details
        color="#2196f3"
        label="Award certificate when a user completes the training"
      >
      </v-checkbox>
    </FormGroup>
    <FormGroup class="mt-6" :title="labels.Test">
      <v-checkbox
        v-model="formData.test"
        id="input--campaign-manager-advanced-settings-randomly-selected"
        hide-details
        color="#2196f3"
        label="Exclude from reports (Mark as test)"
      >
      </v-checkbox>
    </FormGroup>
    <FormGroup class="mt-6" :title="labels.AutoEnroll">
      <div class="campaign-manager-advanced-settings__other-settings-last">
        <v-checkbox
          v-model="formData.isAutoEnroll"
          id="input--campaign-manager-advanced-settings-randomly-selected"
          color="#2196f3"
          hide-details
        >
        </v-checkbox>
        <span>Automatically enroll new users in target groups</span>
        <KSelect
          v-model.trim="formData.sendRandomlyUsersCalculateTypeId"
          id="input--campaign-manager-advanced-settings-other-settings-percent"
          class="ml-2"
          outlined
          dense
          hide-details
          placeholder="Select a item"
          style="max-width: 118px;"
          :disabled="!formData.isAutoEnroll"
        />
      </div>
    </FormGroup>
  </v-form>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import InputDate from '@/components/Common/Inputs/InputDate'
import InputTimezone from '@/components/Common/Inputs/InputTimezone'
import * as validations from '@/utils/validations'
import FormGroupHorizontalContent from '@/components/SmallComponents/FormGroupHorizontalContent'
export default {
  name: 'SendTrainingSettings',
  components: { FormGroupHorizontalContent, InputTimezone, InputDate, KSelect, FormGroup },
  inject: {
    getDistributionEmailOverTimeTypes: {
      type: Array,
      default: () => []
    },
    getDistributionSmtpDelayTimeTypes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      labels,
      Validations,
      contentLanguage: '',
      contentLanguageItems: [],
      isDateValid: true,
      formData: {
        reminder: 2,
        test: false,
        isAutoEnroll: false,
        sendReminderEvery: false,
        certificate: false,
        distributionSmtpDelayTimeTypeId: '1',
        scheduleTypeId: '1',
        distributionTypeId: '1',
        scheduledDateTimeZoneId: '',
        distributionSmtpDelayEvery: 20,
        sendingLimit: 50,
        trainingDistributionOver: 8,
        trainingDistributionOverType: '1'
      },
      radioItems: [{ text: 'Send now', value: '1' }],
      rules: {
        number: [
          (v) => Validations.required(v, 'Enter a number higher than 0'),
          (v) => Validations.startsWith(v, 'Cannot start with 0', 0),
          (v) => v < 1000000 || `${v} cannot exceed ${1000000}`
        ]
      }
    }
  },
  computed: {
    isScheduledTimeDisabled() {
      return this.formData.scheduleTypeId !== '3'
    },
    distributionSmtpDelayTimeTypes() {
      return this.getDistributionSmtpDelayTimeTypes()
    },
    trainingTimeItems() {
      return this.getDistributionEmailOverTimeTypes()
    },
    isDistributionSmtpDelayDisabled() {
      return this.formData.distributionTypeId !== '1'
    }
  },
  methods: {}
}
</script>
