<script>
import { VueTelInputVuetify } from 'vue-tel-input-vuetify/lib/plugin.js'

class isValid {
  constructor(status) {
    this._status = status
  }

  get status() {
    return this._status
  }

  set status(newStatus) {
    this._status = newStatus
  }
}
const validatorObj = new isValid(false)

export default {
  name: 'InputPhone',
  extends: VueTelInputVuetify,
  props: {
    outlined: {
      default: true
    },
    dense: {
      default: true
    },
    label: {
      default: ''
    },
    placeholder: {
      default: 'Enter a phone number'
    },
    mode: {
      default: 'international'
    },

    defaultCountry: {
      default: 'GB'
    },
    inputOptions: {
      default: () => {
        return { showDialCode: true }
      }
    },
    hint: {
      default: '*Required'
    },
    persistentHint: {
      default: true
    },
    autocomplete: {
      default: 'off'
    },
    maxLen: {
      default: 17
    },
    rules: {
      default: (e) => [
        () => {
          return validatorObj.status || 'Invalid phone number'
        }
      ]
    }
  },
  data() {
    return {
      isMounted: false
    }
  },
  methods: {
    validPhone(newVal, oldVal) {
      if (
        (newVal.length > 10 && this.phoneObject.possibility === 'too-long') ||
        (newVal.length && /[a-zA-Z]+$/gi.test(newVal))
      ) {
        this.$emit('input', oldVal)
        this.$refs.input.lazyValue = oldVal
      }
      validatorObj.status = this.phoneObject.isValid
      this.$forceUpdate()
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.validPhone(newVal, oldVal)
    }
  }
}
</script>
<style lang="scss">
.vue-tel-input-vuetify {
  & > div:first-child {
    margin-right: 4px;
  }
  /* & > div:last-child {
    .v-input__slot {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      fieldset {
        border-left: none !important;
      }
    }
  }*/
}
</style>
