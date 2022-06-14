<template>
  <div>
    <div class="d-flex">
      <v-btn
        v-for="(item, index) in items"
        v-bind="$attrs"
        v-on="$listeners"
        :key="index"
        :class="[
          'fw-600',
          'k-button-radio-group',
          { 'white--text': isSelected(index), 'ml-4': !isFirstIndex(index) }
        ]"
        style="box-shadow: none !important;"
        color="#2196f3"
        :outlined="!isSelected(index)"
        rounded
        @click="handleButtonClick(item, index)"
      >
        <v-icon style="margin-left: 2px !important;" left>
          {{ isSelected(index) ? '$radio-checked' : '$radio-unchecked' }}
        </v-icon>
        {{ item.label }}
      </v-btn>
    </div>
    <span class="k-button-radio-group__info mt-4">
      {{ items[selectedIndex].infoText }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'KButtonRadioGroup',
  props: {
    items: {
      type: Array,
      required: true
    },
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      selectedIndex: this.value
    }
  },
  watch: {
    value(val) {
      if (val && val !== this.selectedIndex) {
        this.selectedIndex = val
      }
    }
  },
  methods: {
    handleButtonClick(item, index) {
      this.selectedIndex = index
      this.$emit('input', index)
      this.$emit('on-item-click', item)
    },
    isSelected(index) {
      return this.selectedIndex === index
    },
    isFirstIndex(index) {
      return index === 0
    }
  }
}
</script>

<style lang="scss">
.k-button-radio-group {
  &__info {
    display: inline-block;
    font-weight: 600;
    font-size: 14px;
    line-height: 21px;
    background: #f1f8fe;
    padding: 12px 16px;
    border: 1px solid #f1f8fe;
    border-radius: 8px;
  }
}
</style>
