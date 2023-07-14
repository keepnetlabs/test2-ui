<script>
import { VTextField } from 'vuetify/lib'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
export default {
  name: 'InputDepartment',
  extends: VTextField,
  props: {
    outlined: {
      default: true
    },
    dense: {
      default: true
    },
    placeholder: {
      default: 'Enter a name for the department'
    },
    persistentHint: {
      default: true
    },
    autocomplete: {
      default: 'off'
    },
    rules: {
      default: () => [
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) => Validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.Department, 256))
      ]
    }
  }
}
</script>
