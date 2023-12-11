<template>
  <v-form ref="refForm">
    <InputCallerPhoneNumber
      title="Sender Phone Number"
      subTitle="Select the SMS sender phone number"
      is-smishing
      required
      :defaultPhoneNumbers="phoneNumbers"
      :value="formData.phoneNumber"
      @input="handlePhoneNumberChange"
    />
    <FormGroup
      class="mb-4"
      style="max-width: 585px;"
      title="SMS Text"
      sub-title="SMS text to be sent to target users. Use the mandatory merge tag {TRAININGURL} for the link to be added to the SMS"
    >
      <InputMergeTag
        v-model.trim="formData.smsTextTemplate"
        initialPlaceholder="Enter your text message"
        rows="5"
        height="160"
        hint="SMS supports the GSM-7 character set and can contain up to 160 characters"
        required
        :mergeTags="mergeTags"
        :initialRules="smsTextRules"
      />
    </FormGroup>
  </v-form>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import useDebounce from '@/hooks/useDebounce'
import InputCallerPhoneNumber from '@/components/Common/Inputs/InputCallerPhoneNumber'
import InputMergeTag from '@/components/Common/Inputs/InputMergeTag'
export default {
  name: 'SendTrainingSMSSettings',
  components: {
    FormGroup,
    InputCallerPhoneNumber,
    InputMergeTag
  },
  mixins: [useDebounce],
  props: {
    distributionDelayTimeTypes: {
      type: Array
    },
    totalPhoneNumberUserCount: {
      type: Number
    },
    defaultValues: {
      type: Object
    },
    isEdit: {
      type: Boolean
    },
    targetGroupResourceIds: {
      type: Array,
      default: () => []
    },
    userTargetAudienceData: {
      type: Object,
      default: () => ({
        sendOnlyActiveUsers: false,
        sendRandomlyUsers: false,
        sendRandomlyUsersCount: 20,
        sendRandomlyUsersCalculateTypeId: '1'
      })
    },
    totalTargetUserCount: {
      type: Number,
      default: 0
    },
    phoneNumberItems: {
      type: Array,
      default: () => []
    },
    phoneNumbers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      labels,
      formData: {
        smsTextTemplate: `Dear {FULLNAME} {TRAININGNAME} assigned to you. Please enroll it on {TRAININGURL}`,
        phoneNumber: '',
        smsProviderNumberResourceId: ''
      },
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [(v) => Validations.required(v, labels.Required)]
      },
      rules: {
        number: [
          (v) => Validations.required(v, 'Enter a number higher than 0'),
          (v) => Validations.startsWith(v, 'Cannot start with 0', 0),
          (v) => v < 1000000 || `${v} cannot exceed ${1000000}`
        ]
      },
      smsTextRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => {
          if (!v) return true
          const matches = v.match(/{(.*?)}/gi)
          const mergeTagsCharacterLength =
            matches?.reduce((acc, match) => acc + match.length, 0) || 0
          if (v.length - mergeTagsCharacterLength > 160)
            return `SMS supports the GSM-7 character set and can contain up to 160 characters excluding the merge tags.`
          return true
        }
      ],
      mergeTags: [
        {
          text: 'Training URL',
          value: '{TRAININGURL}'
        },
        {
          text: 'Training Name',
          value: '{TRAININGNAME}'
        },
        {
          text: 'Full Name',
          value: '{FULLNAME}'
        },
        {
          text: 'First Name',
          value: '{FIRSTNAME}'
        },
        {
          text: 'Last Name',
          value: '{LASTNAME}'
        },
        {
          text: 'Company Name',
          value: `{COMPANYNAME}`
        },
        {
          text: 'Training Description',
          value: '{TRAININGDESCRIPTION}'
        },
        {
          text: 'Date SMS Sent',
          value: '{DATESMSSENT}'
        }
      ]
    }
  },
  watch: {
    defaultValues: {
      deep: true,
      handler(val) {
        this.formData = { ...this.formData, ...val }
      }
    }
  },
  methods: {
    handlePhoneNumberChange(phoneNumber) {
      const phoneNumberIndex = this.phoneNumberItems.findIndex(
        (item) => item.phoneNumber === phoneNumber
      )
      if (phoneNumberIndex !== -1) {
        this.formData.smsProviderNumberResourceId = this.phoneNumberItems[
          phoneNumberIndex
        ].resourceId
        this.formData.phoneNumber = phoneNumber
      }
    },
    validateForm() {
      return this.$refs.refForm.validate()
    }
  }
}
</script>
