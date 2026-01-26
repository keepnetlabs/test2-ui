<template>
  <v-row class="target-users-summary-cards mb-6" dense>
    <v-col v-for="item in items" :key="item.key" cols="12" sm="6" md="6" lg="3">
      <v-card
        class="target-users-summary-card"
        :class="cardClasses(item)"
        :style="cardStyles(item)"
        outlined
        :ripple="false"
        @click="handleSelect(item)"
      >
        <div class="d-flex justify-space-between">
          <div class="d-flex flex-column">
            <div class="d-flex align-center">
              <span class="summary-title">{{ item.title }}</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    @click.stop
                    class="summary-info-icon"
                    small
                  >
                    mdi-information-outline
                  </v-icon>
                </template>
                <span class="summary-tooltip">{{ item.tooltip }}</span>
              </v-tooltip>
            </div>
            <div v-if="item.subtitle" class="summary-subtitle">
              <span>{{ item.subtitle }}</span>
              <v-menu
                v-if="item.menuOptions && item.menuOptions.length > 1"
                v-model="menuStates[item.key]"
                close-on-content-click
                offset-y
                bottom
                left
                nudge-right="40"
                nudge-bottom="4"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    @click.stop
                    small
                    class="summary-subtitle-icon summary-subtitle-action"
                  >
                    mdi-chevron-down
                  </v-icon>
                </template>
                <v-list dense>
                  <v-list-item
                    v-for="(option, optionIndex) in item.menuOptions"
                    :key="`${item.key}-period-${optionIndex}`"
                    @click.stop="handleMenuSelect(item, optionIndex)"
                  >
                    <v-list-item-title>{{ option.period }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="summary-value">
              <v-skeleton-loader v-if="loading" type="text" width="64" />
              <span v-else>{{ item.value }}</span>
            </div>
          </div>
          <div class="d-flex flex-column align-baseline">
            <v-icon
              class="summary-filter-icon"
              :class="{ 'summary-filter-icon--disabled': item.disabled }"
              :color="getFilterIconColor(item)"
              @click.stop="handleSelect(item)"
            >
              {{ getFilterIconName(item) }}
            </v-icon>
            <img
              v-if="item.iconType === 'image'"
              class="summary-icon-image"
              :src="item.icon"
              width="64"
              height="64"
              alt=""
            />
            <v-icon v-else class="summary-icon" color="white" small>{{ item.icon }}</v-icon>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "TargetUsersSummaryCards",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    activeKey: {
      type: [String, Number, Array],
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleMenuSelect(item, optionIndex) {
      this.$set(this.menuStates, item.key, false)
      this.$emit("period-select", {
        key: item.key,
        index: optionIndex
      })
    },
    handleSelect(item) {
      if (item.disabled) return;
      this.$emit("select", item.key);
    },
    isActive(item) {
      if (Array.isArray(this.activeKey)) {
        return this.activeKey.includes(item.key);
      }
      return this.activeKey === item.key;
    },
    getThemeColor(colorKey) {
      return (
        this.$vuetify?.theme?.currentTheme?.[colorKey] || colorKey || "#e0e0e0"
      );
    },
    cardClasses(item) {
      return {
        "summary-card--active": this.isActive(item),
        "summary-card--disabled": item.disabled,
        "summary-card--clickable": !item.disabled
      };
    },
    cardStyles(item) {
      if (item.disabled) {
        return { borderColor: "#757575" };
      }
      if (item.key === "active") {
        return { borderColor: "#2196F3" };
      }
      if (item.key === "monthly") {
        return { borderColor: "#00BCD4" };
      }
      return { borderColor: this.getThemeColor(item.color) };
    },
    getFilterIconColor(item) {
      if (this.isActive(item)) return "primary";
      return "grey";
    },
    getFilterIconName(item) {
      return this.isActive(item)
        ? "mdi-filter-variant-remove"
        : "mdi-filter-variant";
    }
  },
  data() {
    return {
      menuStates: {}
    }
  }
};
</script>
