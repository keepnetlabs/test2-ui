<template>
  <v-form ref="refForm">
    <FormGroup :title="labels.CampaignName" has-hint>
      <InputEntityName
        v-model.trim="formData.name"
        id="input--campaign-info-name"
        entity-name="campaign name"
        initial-placeholder="Enter a name"
        :initial-rules="rules.name"
      />
    </FormGroup>
    <InputSchedule v-model="inputScheduleFormData"
    :isEditOrDuplicate="isEdit || isDuplicate"
     ref="inputSchedule" class="mb-6" />
    <FormGroup
      v-if="showDuration"
      has-hint
      :title="labels.TrackingDuration"
      :sub-title="labels.TrackingDurationSub"
    >
      <v-text-field
        v-mask="'###'"
        :value="formData.duration"
        ref="refDurationTextField"
        id="input--campaign-manager-days"
        class="input-duration"
        outlined
        persistent-hint
        hint="*Required"
        :rules="rules.days"
        @input="handleDurationChange"
      ></v-text-field>
      <span style="position: absolute; top: 87px; left: 56px; font-size: 13px; color: #000;"
        >Days</span
      >
    </FormGroup>
    <FormGroup v-if="showMarkAsTest" :title="labels.MarkAsTest">
      <div>
        <v-checkbox
          v-model="formData.excludeFromReports"
          id="input--campaign-manager-campaign-settings-exclude-from-reports"
          color="#2196f3"
        >
          <template #label>Exclude this campaign’s statistics from all generic reports</template>
        </v-checkbox>
      </div>
    </FormGroup>
  </v-form>
</template>

<script>
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import * as validations from '@/utils/validations'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import { scrollToComponent } from '@/utils/functions'
import InputSchedule from '@/components/Common/Inputs/InputSchedule.vue'
import { SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
export default {
  name: 'CampaignManagerPrintoutCampaignInfo',
  components: {
    InputSchedule,
    FormGroup,
    InputEntityName
  },
  props: {
    defaultValues: {
      type: Object
    },
    isEdit: {
      type: Boolean
    },
    isDuplicate: {
      type: Boolean
    },
    showDuration: {
      type: Boolean,
      default: true
    },
    showMarkAsTest: {
      type: Boolean,
      default: true
    },
    isCallback: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedTargetGroups: [],
      labels,
      inputScheduleFormData: {
        scheduleTypeId: SCHEDULE_TYPES.SCHEDULE_TO,
        scheduledDate: '',
        scheduledDateTimeZoneId: ''
      },
      formData: {
        name: '',
        duration: 365,
        excludeFromReports: false
      },
      rules: {
        name: [
          (v) => validations.required(v, labels.Required),
          (v) => validations.startsWith(v, labels.CannotStartWithSpace, ' '),
          (v) => validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.CampaignName))
        ],
        select: [
          (v) => !!v.length || labels.Required,
          (v) => validations.startsWith(v, labels.CannotStartWithSpace, ' ')
        ],
        days: [
          (v) => validations.required(v, labels.Required),
          (v) => validations.startsWith(v, 'Cannot start with 0', '0')
        ]
      }
    }
  },
  computed: {
    getTargetGroupErrorMessage() {
      return this.formData.targetGroupResourceIds.length
        ? this.getTargetGroupErrorText
        : labels.TargetGroupSelectionRequiredError
    },
    getTargetGroupErrorText() {
      return this.isShowTargetGroupUsersError ? labels.TargetGroupUserRequiredError : 'Required'
    }
  },
  watch: {
    isCallback: {
      immediate: true,
      handler(val) {
        if (val) {
          this.rules.days.push((v) =>
            validations.numberRangeRule(v, 1, 30, 'Duration can be minimum 1, maximum 30 days')
          )
        }
      }
    },
    defaultValues: {
      deep: true,
      immediate: true,
      handler(val) {
        for (const key of Object.keys(val)) {
          this.formData[key] = val[key]
        }
      }
    }
  },
  created() {
    const initialFormValues = JSON.parse(JSON.stringify(this.formData))
    this.$emit('initialFormValues', initialFormValues)
  },
  methods: {
    setInitialName(value) {
      this.formData.name = value
      const initialFormValues = JSON.parse(JSON.stringify(this.formData))
      this.$emit('initialFormValues', initialFormValues)
    },
    handleDurationChange(val) {
      if (!val || /^\d{1,3}$/.test(val)) {
        this.formData.duration = val
      } else {
        this.$refs.refDurationTextField.initialValue = this.formData.duration
        this.$refs.refDurationTextField.lazyValue = this.formData.duration
      }
    },
    validateForm() {
      let isValid = this.$refs.refForm.validate()
      if (!isValid) {
        this.$nextTick(() => {
          const el = this.$refs.refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
      return isValid
    }
  }
}
</script>
