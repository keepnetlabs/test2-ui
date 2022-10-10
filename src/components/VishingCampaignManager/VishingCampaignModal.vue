<template>
  <AppModal :status="status" icon-name="mdi-phone-in-talk" :title="getTitle">
    <template #overlay-body>
      <v-stepper light v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
            >Campaign Settings</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2"
            >Vishing Templates</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 3" :step="3"
            >Target Audience</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 4" :step="4"
            >Call Settings</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 5" :step="5"
            >Campaign Summary</v-stepper-step
          >
        </v-stepper-header>

        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content vishing-campaign" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              title="Campaign Info"
              subtitle="Enter basic information about this campaign"
            />
            <v-form ref="refFormStep1" lazy-validation>
              <FormGroup title="Campaign Name" has-hint>
                <InputEntityName
                  v-model.trim="formValues.name"
                  id="input--new-vishing-campaign-campaign-name"
                  entityName="campaign name"
                  initialPlaceholder="Enter a name"
                />
              </FormGroup>
              <FormGroup
                style="max-width: 600px;"
                title="Schedule"
                subtitle="Start time of this campaign"
              >
                <v-radio-group
                  v-model="formValues.scheduleTypeId"
                  class="mt-0 campaign-manager-target-groups-radio"
                  hide-details
                >
                  <v-radio
                    :id="`input--campaign-manager-radio-send-now`"
                    style="margin-bottom: 16px;"
                    color="#2196f3"
                    value="1"
                    label="Send now"
                  ></v-radio>
                  <v-radio
                    :id="`input--campaign-manager-radio-save-for-later`"
                    style="margin-bottom: 16px;"
                    color="#2196f3"
                    value="2"
                    label="Save for later"
                  ></v-radio>
                  <div class="campaign-manager-advanced-settings__distribution-item mt-n2">
                    <v-radio
                      :id="`input--campaign-manager-radio-schedule-to`"
                      style="margin-bottom: 0;"
                      color="#2196f3"
                      label="Schedule to"
                      value="3"
                    />
                    <div :class="[!isDateValid && 'date-picker-error mb-n3']">
                      <InputDate
                        v-model="formValues.scheduledDate"
                        class="date-picker-height-40 ml-2 black-placeholder"
                        type="datetime"
                        ref="refPicker"
                        placeholder="Select Date and Time"
                        style="width: 100%; max-width: 220px;"
                        :format="parsedFormat"
                        :valueFormat="parsedFormat"
                        :picker-options="datePickerOptions"
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
                    <span class="v-label theme--light mx-2" style="font-size: 14px;">in</span>
                    <InputTimezone
                      v-model="formValues.scheduledTimeZoneId"
                      class="black-placeholder"
                      :disabled="isScheduledTimeDisabled"
                    />
                  </div>
                </v-radio-group>
              </FormGroup>
              <FormGroup class="mt-6" title="Mark as Test">
                <v-checkbox
                  v-model="formValues.markedAsTest"
                  id="input--campaign-manager-advanced-settings-randomly-selected"
                  hide-details
                  color="#2196f3"
                  label="Exclude from reports (Test campaign)"
                >
                </v-checkbox>
              </FormGroup>
            </v-form>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="5"
        :step.sync="step"
        @on-cancel="handleCancel"
        @on-back="backStep"
        @on-next="nextStep"
        @on-submit="submit"
      />
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import StepperFooter from '@/components/Stepper/StepperFooter'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputDate from '@/components/Common/Inputs/InputDate'
import InputTimezone from '@/components/Common/Inputs/InputTimezone'
import { mapGetters } from 'vuex'
import { getTimeZone } from '@/utils/functions'

const initialFormValues = {
  name: '',
  scheduleTypeId: '1',
  scheduledDate: '',
  scheduledTimeZoneId: '',
  markedAsTest: false,
  description: '',
  tags: [],
  difficultyResourceId: 'mT0CeYGgKsVb',
  languageResourceId: 'WNZt0sCVCWB3',
  availableForRequests: [],
  dialogNoticeType: 'textToSpeech',
  dialogNoticeTextToSpeech: '',
  dialogNoticeFile: null,
  dialogNoticeFileUrl: '',
  steps: []
}

export default {
  name: 'VishingCampaignModal',
  components: {
    AppModal,
    StepperFooter,
    ConfigureCompanyStepHeader,
    InputEntityName,
    FormGroup,
    InputDate,
    InputTimezone
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object
    }
  },
  data() {
    return {
      step: 1,
      parsedFormat: getTimeZone(false),
      isDateValid: true,
      datePickerOptions: {
        disabledDate: this.disabledEndDates
      },
      initialFormValues: JSON.parse(JSON.stringify(initialFormValues)),
      formValues: JSON.parse(JSON.stringify(initialFormValues))
    }
  },
  computed: {
    ...mapGetters({
      selectedTimeZone: 'common/getSelectedTimeZone',
      timezoneFormat: 'auth/getTimezoneFormat'
    }),
    getTitle() {
      return !this.isEdit
        ? 'New Vishing Campaign'
        : this.isDuplicate
        ? 'Duplicate Vishing Campaign'
        : 'Edit Vishing Campaign'
    },
    isScheduledTimeDisabled() {
      return this.formValues.scheduleTypeId !== '3'
    }
  },
  watch: {
    timezoneFormat: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.parsedFormat = getTimeZone(false, val)
        }
      }
    }
  },
  methods: {
    disabledEndDates(val) {
      return new Date().setHours(0, 0, 0, 0) > val.getTime()
    },
    handleCancel() {
      console.log('handleCancel executed')
      this.$emit('cancel')
    },
    backStep() {
      this.step--
    },
    nextStep() {
      this.step++
    },
    submit() {}
  }
}
</script>
