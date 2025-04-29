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
    <InputSchedule
      v-model="inputScheduleFormData"
      :isEditOrDuplicate="isEdit || isDuplicate"
      isInidividualPrintOut
      ref="inputSchedule"
      class="mb-6"
    />
    <InputDuration v-if="showDuration" v-model="formData.duration" :is-callback="isCallback" />
    <FormGroup v-if="showMarkAsTest" :title="labels.MarkAsTest">
      <div>
        <VCheckbox
          v-model="formData.excludeFromReports"
          id="input--campaign-manager-campaign-settings-exclude-from-reports"
          color="#2196f3"
        >
          <template #label>Exclude this campaign’s statistics from all generic reports</template>
        </VCheckbox>
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
import InputDuration from '@/components/Common/Inputs/InputDuration'
export default {
  name: 'CampaignManagerPrintoutCampaignInfo',
  components: {
    InputSchedule,
    FormGroup,
    InputEntityName,
    InputDuration
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
        duration: 30,
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
    defaultValues: {
      deep: true,
      immediate: true,
      handler(val) {
        const inputScheduleFormData = {
          scheduledDate: val?.scheduledDate,
          scheduledDateTimeZoneId: val?.scheduledDateTimeZoneId
        }
        this.inputScheduleFormData = {
          ...this.inputScheduleFormData,

          ...inputScheduleFormData
        }
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
