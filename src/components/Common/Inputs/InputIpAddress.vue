<script>
import { VTextField } from 'vuetify/lib'
import * as Validations from '@/utils/validations'

export default {
  name: 'InputIpAddress',
  extends: VTextField,
  props: {
    outlined: {
      default: true
    },
    dense: {
      default: true
    },
    placeholder: {
      default: 'Enter an ip adress'
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
      default: () => [(v) => Validations.ip(v), (v) => Validations.startsWithSpace(v)]
    }
  }
}
</script>
