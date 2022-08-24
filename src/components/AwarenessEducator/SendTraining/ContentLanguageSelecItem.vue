<template>
  <div>
    <div
      :class="[
        'mail-configuration-select-sources__item-container',
        {
          'mail-configuration-select-sources__item-container--first': isFirst,
          'mail-configuration-select-sources__item-container--disabled': isDisabled
        }
      ]"
    >
      <v-checkbox
        hide-details
        color="#2196f3"
        class="mt-n1"
        :disabled="isDisabled"
        :input-value="isSelected"
      />
      <div class="mail-configuration-select-sources__item">
        <div class="mail-configuration-select-sources__item-left">
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentLanguageSelectItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number
    },
    isDisabled: {
      type: Boolean,
      default: false,
      required: true
    },
    isFirst: {
      type: Boolean,
      default: false,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false,
      required: true
    }
  }
}
</script>
