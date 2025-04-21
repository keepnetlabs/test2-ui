<template>
  <FormGroup
    has-hint
    :title="labels.TrackingDuration"
    :sub-title="labels.TrackingDurationSub">
    <VTextField
      v-mask="'###'"
      :value="value"
      ref="refDurationTextField"
      id="input--campaign-manager-days"
      class="input-duration"
      outlined
      persistent-hint
      hint="*Required"
      :rules="rules"
      @input="handleDurationChange"/>
    <span class="input-duration-days-text">Days</span>
  </FormGroup>
</template>
<script>
  import FormGroup from '@/components/SmallComponents/FormGroup'
  import labels from '@/model/constants/labels'
  import * as validations from '@/utils/validations'
  export default {
    name: 'InputDuration',
    components: { FormGroup },
    props: {
      value: {
        type: [Number, String],
        default: 30
      },
      isCallback: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      isCallback: {
        immediate: true,
        handler(val) {
          if (val) {
            this.rules.push((v) =>
              validations.numberRangeRule(v, 1, 30, 'Duration can be minimum 1, maximum 30 days')
            )
          }
        }
      }
    },
    data() {
      return {
        labels,
        rules: [
          (v) => validations.required(v, labels.Required),
          (v) => validations.startsWith(v, 'Cannot start with 0', '0')
        ]
      }
    },
    methods: {
      handleDurationChange(val) {
        if (!val || /^\d{1,3}$/.test(val)) {
          this.$emit('input', val)
        } else {
          this.$refs.refDurationTextField.initialValue = val
          this.$refs.refDurationTextField.lazyValue = val
        }
      }
    }
  }
</script>
