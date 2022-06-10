<template>
  <div class="d-flex justify-space-between w-100">
    <CancelButton :id="ids.cancelButton" @click="$emit('on-cancel')" />
    <SaveButton :id="ids.saveButton" :disabled="actionButtonDisabled" @click="$emit('on-save')" />
  </div>
</template>

<script>
import CancelButton from '@/components/Common/Buttons/CancelButton'
import SaveButton from '@/components/Common/Buttons/SaveButton'
export default {
  name: 'AppModalFooter',
  components: { SaveButton, CancelButton },
  props: {
    ids: {
      type: Object,
      default: () => ({
        cancelButton: '',
        saveButton: ''
      })
    },
    actionButtonDisabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
