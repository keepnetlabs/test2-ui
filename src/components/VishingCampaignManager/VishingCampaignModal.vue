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
                  hide-details
                  color="#2196f3"
                  label="Exclude from reports (Test campaign)"
                >
                </v-checkbox>
              </FormGroup>
            </v-form>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content vishing-campaign" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              title="Vishing Templates"
              subtitle="Select a template to use in this campaign"
            />
            <VishingTemplateSelectList ref="refVishingTemplateSelectList" />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content vishing-campaign" :step="3">
            <ConfigureCompanyStepHeader
              class="mb-8"
              title="Target Audience"
              subtitle="Select target users for your campaign"
            />
            <KSelect
              v-show="false"
              v-model.trim="formValues.targetGroupResourceIds"
              type="combobox"
              id="input--campaign-target-user-groups"
              class="edit-select new-investigation__combo target-users-select-multi select-specific-users"
              outlined
              multiple
              dense
              auto-select-first
              small-chips
              deletable-chips
              persistent-hint
              hint="*Required"
              placeholder="Select groups"
              :loading="isTargetGroupSearchLoading"
              :items="targetGroupItems"
              :rules="rules.targetGroupSelect"
              :slots="{ progress: true }"
              @input="handleTargetGroupsResourceIdsChange"
              @update:search-input="handleSearchInputChange"
              @focus="handleFocusOfTargetGroupsInput"
              @focusout="handleFocusOutOfTargetGroupsInput"
            >
              <template #progress>
                <KSelectLoading v-show="isTargetGroupSearchLoading && isTargetGroupFocused" />
              </template>
            </KSelect>
            <v-btn
              v-show="false"
              text
              class="campaign-manager__close-advanced-search"
              color="#2196F3"
              @click="toggleShowAdvancedSearch"
            >
              {{ isShowAdvancedSearch ? labels.CloseAdvancedSearch : labels.OpenAdvancedSearch }}
            </v-btn>
            <CampaignManagerTargetGroups
              ref="refTargetAudience"
              class="mt-2"
              :selected-target-groups="formValues.targetGroupResourceIds"
              :response-of-target-groups-items="responseOfTargetGroupsItems"
              :is-valid="isTargetGroupsValid"
              @handle-selection-change="handleTableSelectionChange"
            />
            <FormGroup class="mt-6" title="Limit Recipients" />
            <div class="d-flex" style="align-items: center; gap: 8px;">
              <v-checkbox v-model="formValues.isLimitRecipients" hide-details color="#2196f3">
                <template #label> </template>
              </v-checkbox>
              <span class="form-group-horizontal-content__label">
                Send this campaign to randomly selected
              </span>
              <div style="position: relative;">
                <v-text-field
                  ref="refRecipientValue"
                  :value="formValues.recipientValue"
                  :disabled="!formValues.isLimitRecipients"
                  style="max-width: 64px !important;"
                  outlined
                  placeholder=""
                  hide-details
                  :error="!!getRecipientValueErrorMessage"
                  @input="handleRecipientValueChange"
                />
                <CustomError
                  style="position: absolute; bottom: -16px; left: -8px; width: 500px;"
                  :error-message="getRecipientValueErrorMessage"
                />
              </div>
              <KSelect
                v-model="formValues.recipientType"
                style="max-width: 120px !important;"
                outlined
                dense
                hide-details
                position="top"
                :return-object="false"
                :items="recipientTypes"
                :disabled="!formValues.isLimitRecipients"
              />
              <span class="form-group-horizontal-content__label"> of target users</span>
            </div>
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
import VishingTemplateSelectList from '@/components/VishingCampaignManager/VishingTemplateSelectList'
import CampaignManagerTargetGroups from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroups'
import CustomError from '@/components/CustomError'
import KSelect from '@/components/Common/Inputs/KSelect'
import KSelectLoading from '@/components/KSelectLoading'
import { searchTargetGroups } from '@/api/targetUsers'
import * as validations from '@/utils/validations'
import labels from '@/model/constants/labels'

const initialFormValues = {
  name: '',
  scheduleTypeId: '1',
  scheduledDate: '',
  scheduledTimeZoneId: '',
  markedAsTest: false,
  templateResourceId: '',
  targetGroupResourceIds: [],
  isLimitRecipients: false,
  recipientType: 1,
  recipientValue: 0,
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
    InputTimezone,
    VishingTemplateSelectList,
    CampaignManagerTargetGroups,
    CustomError,
    KSelect,
    KSelectLoading
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
      labels,
      step: 1,
      parsedFormat: getTimeZone(false),
      isDateValid: true,
      datePickerOptions: {
        disabledDate: this.disabledEndDates
      },
      initial: true,
      initialFormValues: JSON.parse(JSON.stringify(initialFormValues)),
      formValues: JSON.parse(JSON.stringify(initialFormValues)),
      selectedTargetGroups: [],
      totalTargetUserCount: 0,
      isTargetGroupsValid: true,
      responseOfTargetGroupsItems: {},
      isTargetGroupSearchLoading: false,
      isTargetGroupLoading: false,
      defaultTargetGroups: [],
      targetGroupItems: [],
      isShowAdvancedSearch: true,
      isTargetGroupFocused: false,
      isShowTargetGroupUsersError: false,
      axiosPayloadOfTargetGroups: {
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
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      },
      rules: {
        targetGroupSelect: [
          (v) => !!v.length || labels.Required,
          (v) => validations.startsWith(v, labels.CannotStartWithSpace, ' ')
        ],
        recipientValue: []
      },
      recipientTypes: [
        {
          text: 'percent',
          value: 1
        },
        {
          text: 'users',
          value: 2
        }
      ]
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
    },
    getTargetGroupErrorMessage() {
      return this.formValues.targetGroupResourceIds.length
        ? this.isShowTargetGroupUsersError
          ? 'Target groups must have at least 1 user'
          : 'Required'
        : 'Required'
    },
    getRecipientValueErrorMessage() {
      if (this.formValues.isLimitRecipients) {
        if (this.formValues.recipientType === 1) {
          if (this.formValues.recipientValue === '' || this.formValues.recipientValue <= 0) {
            return 'Enter a number higher than 0'
          }
          if (this.formValues.recipientValue > 100) {
            return 'This number cannot be higher than 100 percent'
          }
        } else {
          if (this.formValues.recipientValue === '' || this.formValues.recipientValue <= 0) {
            return 'Enter a number higher than 0'
          }
          if (this.formValues.recipientValue > this.totalTargetUserCount) {
            return 'This number cannot be higher than number of total target users'
          }
        }
      }

      return ''
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
    },
    'formValues.targetGroupResourceIds'(val) {
      this.isTargetGroupsValid = !!val.length
    },
    selectedTargetGroups: {
      immediate: true,
      deep: true,
      handler(val) {
        const userCount = val.reduce((acc, item) => {
          acc += item?.userCount || 0
          return acc
        }, 0)
        this.totalTargetUserCount = userCount
      }
    }
  },
  created() {
    this.callForTargetGroups()
  },
  methods: {
    handleSearchInputChange(val) {
      this.debounce(() => {
        if (
          (!this.axiosPayloadOfTargetGroups.filter.FilterGroups[1].FilterItems[0] &&
            val === null) ||
          (this.axiosPayloadOfTargetGroups.filter.FilterGroups[1].FilterItems[0] &&
            this.axiosPayloadOfTargetGroups.filter.FilterGroups[1].FilterItems[0].Value === val)
        )
          return
        this.axiosPayloadOfTargetGroups.filter.FilterGroups[1].FilterItems = [
          { FieldName: 'Name', Operator: 'Contains', Value: val }
        ]
        this.callForTargetGroups()
      }, 500)
    },
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    },
    callForTargetGroups() {
      this.isTargetGroupSearchLoading = true
      this.setTargetGroupLoading(true)
      searchTargetGroups(this.axiosPayloadOfTargetGroups)
        .then((response) => {
          const { data: { data: { results = [] } = {} } = {} } = response
          if (this.initial) {
            this.responseOfTargetGroupsItems = response
          }
          this.initial = false
          this.targetGroupItems = results.map((item) => ({
            text: item.name,
            value: item.resourceId,
            extraDatas: item
          }))
        })
        .finally(() => {
          this.isTargetGroupSearchLoading = false
          this.setTargetGroupLoading()
          this.addDefaultTargetGroupItems(this.defaultTargetGroups)
          this.targetGroupItems.push(...this.defaultTargetGroups)
        })
    },
    setTargetGroupLoading(val = false) {
      this.isTargetGroupLoading = val
    },
    addDefaultTargetGroupItems(targetGroups = []) {
      if (this.formValues.targetGroupResourceIds.length || !targetGroups.length) return
      this.$nextTick(() => {
        this.handleTargetGroupsResourceIdsChange(targetGroups)
      })
    },
    handleTargetGroupsResourceIdsChange(items) {
      const selectedTableItems = items
        .filter((item) => item)
        .map((item) => ({ ...item, resourceId: item.value }))
      if (this.$refs.refTargetAudience.$refs.refGroupTable.$refs.refTable.$refs.elTableRef) {
        this.$refs.refTargetAudience.$refs.refGroupTable.$refs.refTable.getSelectedObjectAndSelectRowsByRowKey(
          selectedTableItems
        )
      }
    },
    handleTableSelectionChange(items) {
      this.selectedTargetGroups = items
      this.formValues.targetGroupResourceIds = items
        .filter((item) => item)
        .map((item) => ({
          text: item.text || item.name,
          value: item.value || item.resourceId,
          extraDatas: item
        }))
    },
    handleScroll(
      e,
      callback = this.callForTargetGroups,
      axiosPayload = this.axiosPayloadOfTargetGroups
    ) {
      const { scrollTop, scrollHeight, offsetHeight } = e.target
      if (
        scrollTop - (scrollHeight - offsetHeight) < 10 &&
        scrollTop - (scrollHeight - offsetHeight) > -10
      ) {
        axiosPayload.pageSize += 10
        this.debounce(() => {
          callback()
        }, 500)
      }
    },
    handleFocusOfTargetGroupsInput() {
      this.isTargetGroupFocused = true
      if (this.inputTimeout) {
        clearTimeout(this.inputTimeout)
      }
      this.inputTimeout = setTimeout(() => {
        this.$nextTick(() => {
          if (document.querySelector('#input--campaign-target-user-groups .k-select__menu')) {
            document
              .querySelector('#input--campaign-target-user-groups .k-select__menu')
              .addEventListener('scroll', this.handleScroll)
          }
        })
      }, 250)
    },
    handleFocusOutOfTargetGroupsInput() {
      this.isTargetGroupFocused = false
      if (this.inputTimeout) {
        clearTimeout(this.inputTimeout)
      }
      this.inputTimeout = setTimeout(() => {
        this.$nextTick(() => {
          if (document.querySelector('#input--campaign-target-user-groups .k-select__menu')) {
            document
              .querySelector('#input--campaign-target-user-groups .k-select__menu')
              .removeEventListener('scroll', this.handleScroll)
          }
        })
      }, 250)
    },
    toggleShowAdvancedSearch() {
      this.isShowAdvancedSearch = !this.isShowAdvancedSearch
    },
    handleRecipientValueChange(val) {
      if (!val || /\d+$/.test(val)) {
        this.formValues.recipientValue = val
      } else {
        this.$refs.refRecipientValue.initialValue = this.formValues.recipientValue
        this.$refs.refRecipientValue.lazyValue = this.formValues.recipientValue
      }
    },
    disabledEndDates(val) {
      return new Date().setHours(0, 0, 0, 0) > val.getTime()
    },
    handleCancel() {
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
