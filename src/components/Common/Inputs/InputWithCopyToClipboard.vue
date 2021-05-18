<template>
  <form-group :title="title" class-name="input-copy-to-clipboard">
    <div class="copy-to-clipboard__container">
      <slot name="input">
        <v-text-field
          outlined
          dense
          hint="*Required"
          persistent-hint
          class="auth-key__textfield"
          :disabled="true"
        ></v-text-field>
      </slot>
      <v-btn text color="#2196f3" class="ml-8" @click="handleCopyToClipboard">{{
        labels.CopyToClipboard
      }}</v-btn>
    </div>
  </form-group>
</template>

<script>
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
export default {
  name: 'InputWithCopyToClipboard',
  components: { FormGroup },
  props: {
    title: {
      type: String
    },
    subtitle: {
      type: String
    },
    copyKey: {
      type: String
    }
  },
  emits: ['on-copy'],
  data() {
    return {
      labels
    }
  },
  methods: {
    handleCopyToClipboard() {
      this.$emit('on-copy', this.copyKey)
    }
  }
}
</script>

<style lang="scss">
.input-copy-to-clipboard {
  max-width: 745px;
}
</style>
