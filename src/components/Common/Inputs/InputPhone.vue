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
const onur = new isValid(false)

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
    rules: {
      default: (e) => [
        () => {
          return onur.status || 'Invalid phone number'
        }
      ]
    }
  },
  data() {
    return {
      isMounted: false
    }
  },
  mounted() {},
  methods: {
    validPhone() {
      onur.status = this.phoneObject.isValid
    }
  },
  watch: {
    value(val) {
      this.validPhone()
    }
  }
}
</script>
<style lang="scss">
/*
.vue-tel-input-vuetify {
  & > div:first-child {
    .v-input__slot {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      fieldset {
        border-right: none !important;
      }
    }
  }
  & > div:last-child {
    .v-input__slot {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      fieldset {
        border-left: none !important;
      }
    }
  }
}*/
</style>
