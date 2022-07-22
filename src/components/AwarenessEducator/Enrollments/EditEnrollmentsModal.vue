<template>
  <AppModal
    :status="status"
    icon-name="mdi-send"
    title="Edit Enrollment"
    title-id="text--edit-enrollments-modal-title"
    @closeOverlay="handleClose"
  >
    <template #overlay-body>
      <AppModalBodyHeader
        title="Enrollment Settings"
        sub-title="Select target groups and schedule options for this phishing campaign instance"
      />
      <v-form ref="refForm">
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
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputDate from '@/components/Common/Inputs/InputDate'
import labels from '@/model/constants/labels'
import InputTimezone from '@/components/Common/Inputs/InputTimezone'
import KSelect from '@/components/Common/Inputs/KSelect'
import { EMITS } from '@/components/AwarenessEducator/utils'
export default {
  name: 'EditEnrollmentsModal',
  components: { KSelect, InputTimezone, InputDate, FormGroup, AppModalBodyHeader, AppModal },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      labels,
      radioItems: [{ text: 'Send now', value: '1' }],
      isDateValid: true,
      formData: {
        reminder: 2,
        isAutoEnroll: false,
        sendReminderEvery: false,
        scheduleTypeId: '1',
        sendRandomlyUsersCalculateTypeId: '1'
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
    }
  },
  methods: {
    handleClose() {
      this.$emit(EMITS.ON_CLOSE)
    }
  }
}
</script>
