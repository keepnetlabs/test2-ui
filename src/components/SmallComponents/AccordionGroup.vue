<template>
  <section class="accordion-group">
    <div
      v-for="(item, index) in items"
      :key="item.title"
      class="accordion-group__item-wrapper"
    >
      <article class="accordion-group__item">
        <div class="accordion-group__header-row">
          <button
            type="button"
            class="accordion-group__header"
            @click="toggle(index)"
            :aria-expanded="isOpen(index)"
          >
            <v-icon class="accordion-group__leading-icon"
              >mdi-chevron-right</v-icon
            >
            <div class="accordion-group__text">
              <div class="accordion-group__title">{{ item.title }}</div>
              <div v-if="item.subtitle" class="accordion-group__subtitle">
                {{ item.subtitle }}
              </div>
            </div>
          </button>

          <div
            v-if="item.showSwitch && item.switchModel && item.switchField"
            class="accordion-group__switch-wrapper"
          >
            <v-switch
              v-model="item.switchModel[item.switchField]"
              class="accordion-group__switch"
              :disabled="item.switchDisabled"
              dense
              hide-details
              inset
              color="#2196f3"
              @click.stop
              @change="item.switchOnChange && item.switchOnChange($event)"
            />
          </div>
        </div>

        <div v-show="isOpen(index)" class="accordion-group__content"></div>
      </article>
      <div
        v-if="isOpen(index) && item.children && item.children.length"
        class="accordion-group__children"
      >
        <div
          v-for="child in item.children"
          :key="child.title"
          class="safeguard-detail-card"
        >
          <div
            v-if="
              child.showCheckbox && child.checkboxModel && child.checkboxField
            "
            class="safeguard-detail-checkbox"
          >
            <v-checkbox
              v-model="child.checkboxModel[child.checkboxField]"
              :disabled="child.checkboxDisabled"
              dense
              hide-details
              ripple
              color="#2196f3"
              @change="child.checkboxOnChange && child.checkboxOnChange($event)"
            />
          </div>

          <div class="safeguard-detail-title">
            {{ child.title }}
          </div>

          <div v-if="child.tooltip" class="safeguard-detail-icon-wrapper">
            <v-tooltip bottom content-class="accordion-group__tooltip">
              <template v-slot:activator="{ on }">
                <v-icon
                  class="accordion-group__detail-icon"
                  v-on="on"
                  size="18"
                  color="#6b7280"
                  >mdi-information-outline</v-icon
                >
              </template>
              <div class="tooltip-span">{{ child.tooltip }}</div>
            </v-tooltip>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "AccordionGroup",
  props: {
    items: {
      type: Array,
      required: true,
      validator(value) {
        return value.every((item) => "title" in item);
      }
    },
    allowMultiple: {
      type: Boolean,
      default: false
    },
    defaultOpenIndexes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      openIndexes: [...this.defaultOpenIndexes]
    };
  },
  methods: {
    isOpen(index) {
      return this.openIndexes.includes(index);
    },
    toggle(index) {
      const isAlreadyOpen = this.isOpen(index);
      if (this.allowMultiple) {
        this.openIndexes = isAlreadyOpen
          ? this.openIndexes.filter((idx) => idx !== index)
          : [...this.openIndexes, index];
      } else {
        this.openIndexes = isAlreadyOpen ? [] : [index];
      }
      this.$emit("open-change", this.openIndexes);
    }
  },
  watch: {
    defaultOpenIndexes(newIndexes) {
      this.openIndexes = [...newIndexes];
    }
  }
};
</script>
