<template>
  <div class="company-license-type-cell">
    <div class="company-license-type-cell__title" :title="licenseTypeName">
      {{ licenseTypeName || emptyText }}
    </div>
    <div
      v-if="visibleModulesText"
      ref="summaryContainer"
      class="company-license-type-cell__summary"
    >
      <span class="company-license-type-cell__summary-text">
        {{ visibleModulesText }}
      </span>
      <VTooltip v-if="hasOverflowModules" bottom max-width="280" opacity="1">
        <template #activator="{ on }">
          <span class="company-license-type-cell__more" v-on="on">
            +{{ remainingModuleCount }}
          </span>
        </template>
        <div class="company-license-type-cell__tooltip">
          <div
            v-for="(moduleName, index) in overflowModuleNames"
            :key="`${moduleName}-${index}`"
            class="company-license-type-cell__tooltip-item"
          >
            {{ moduleName }}
          </div>
        </div>
      </VTooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompanyLicenseTypeCell",
  props: {
    licenseTypeName: {
      type: String,
      default: ""
    },
    modules: {
      type: Array,
      default: () => []
    },
    defaultVisibleModules: {
      type: Number,
      default: 2
    },
    emptyText: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      resizeObserver: null,
      observedSummaryContainer: null,
      renderedModuleCount: 0,
      textMeasureCanvas: null
    }
  },
  computed: {
    moduleNames() {
      return (this.modules || [])
        .map((module) => {
          if (!module) return ""
          if (typeof module === "string") return module
          return module.name || ""
        })
        .filter(Boolean)
    },
    visibleModuleNames() {
      return this.moduleNames.slice(0, this.visibleModuleCount)
    },
    overflowModuleNames() {
      return this.moduleNames.slice(this.visibleModuleCount)
    },
    remainingModuleCount() {
      return Math.max(0, this.moduleNames.length - this.visibleModuleNames.length)
    },
    visibleModuleCount() {
      if (!this.moduleNames.length) return 0
      return Math.min(
        Math.max(this.renderedModuleCount, this.defaultVisibleModules),
        this.moduleNames.length
      )
    },
    visibleModulesText() {
      if (!this.visibleModuleNames.length) return ""
      return this.visibleModuleNames.join(", ")
    },
    hasOverflowModules() {
      return this.remainingModuleCount > 0
    }
  },
  watch: {
    modules: {
      deep: true,
      handler() {
        this.scheduleVisibleModuleCountUpdate()
      }
    }
  },
  mounted() {
    this.scheduleVisibleModuleCountUpdate()
    this.initResizeObserver()
  },
  beforeDestroy() {
    this.destroyResizeObserver()
  },
  methods: {
    scheduleVisibleModuleCountUpdate() {
      this.$nextTick(() => {
        this.observeSummaryContainer()
        this.updateVisibleModuleCount()
      })
    },
    initResizeObserver() {
      if (typeof ResizeObserver === "undefined") {
        window.addEventListener("resize", this.updateVisibleModuleCount)
        return
      }

      this.resizeObserver = new ResizeObserver(() => {
        this.updateVisibleModuleCount()
      })
      this.observeSummaryContainer()
    },
    destroyResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect()
        this.resizeObserver = null
      }
      this.observedSummaryContainer = null
      window.removeEventListener("resize", this.updateVisibleModuleCount)
    },
    observeSummaryContainer() {
      if (!this.resizeObserver) return

      const nextContainer = this.$refs.summaryContainer || null
      if (this.observedSummaryContainer === nextContainer) return

      if (
        this.observedSummaryContainer &&
        typeof this.resizeObserver.unobserve === "function"
      ) {
        this.resizeObserver.unobserve(this.observedSummaryContainer)
      }

      this.observedSummaryContainer = nextContainer

      if (nextContainer) {
        this.resizeObserver.observe(nextContainer)
      }
    },
    updateVisibleModuleCount() {
      const moduleCount = this.moduleNames.length
      if (!moduleCount) {
        this.renderedModuleCount = 0
        return
      }

      const baseVisibleCount = Math.min(this.defaultVisibleModules, moduleCount)
      const containerWidth = Math.floor(
        this.$refs.summaryContainer?.getBoundingClientRect?.().width || 0
      )

      if (!containerWidth) {
        this.renderedModuleCount = baseVisibleCount
        return
      }

      let nextVisibleCount = baseVisibleCount

      while (nextVisibleCount < moduleCount) {
        const candidateVisibleCount = nextVisibleCount + 1
        const candidateOverflowCount = moduleCount - candidateVisibleCount

        if (
          this.getRequiredWidth(candidateVisibleCount, candidateOverflowCount) <=
          containerWidth
        ) {
          nextVisibleCount = candidateVisibleCount
        } else {
          break
        }
      }

      this.renderedModuleCount = nextVisibleCount
    },
    getRequiredWidth(visibleCount, overflowCount) {
      const visibleText = this.moduleNames.slice(0, visibleCount).join(", ")
      const overflowText = overflowCount > 0 ? `+${overflowCount}` : ""
      const overflowSpacing = overflowText ? 6 : 0

      return (
        this.measureTextWidth(visibleText) +
        this.measureTextWidth(overflowText) +
        overflowSpacing
      )
    },
    measureTextWidth(text) {
      if (!text) return 0

      if (!this.textMeasureCanvas) {
        this.textMeasureCanvas = document.createElement("canvas")
      }

      const context = this.textMeasureCanvas.getContext("2d")
      if (!context) {
        return text.length * 6
      }

      context.font = '400 9px "Open Sans"'
      return Math.ceil(context.measureText(text).width)
    }
  }
}
</script>

<style lang="scss" scoped>
.company-license-type-cell {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  min-height: 48px;
  width: 100%;
  line-height: normal;
  white-space: normal;

  &::before {
    display: none !important;
    content: none !important;
  }

  &__title,
  &__summary-text {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__title {
    color: var(--Black-Black, #383B41);
    font-feature-settings: "liga" off, "clig" off;
    font-family: "Open Sans";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
  }

  &__summary {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    min-width: 0;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    color: var(--Black-Black, #383B41);
    font-feature-settings: "liga" off, "clig" off;
    font-family: "Open Sans";
    font-size: 9px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  &__summary-text {
    min-width: 0;
    flex: 0 1 auto;
  }

  &__more {
    flex: 0 0 auto;
    display: inline-block;
    max-width: fit-content;
    margin-left: 4px;
    white-space: nowrap;
    cursor: pointer;
    color: var(--Black-Black, #383B41);
    font-feature-settings: "liga" off, "clig" off;
    font-family: "Open Sans";
    font-size: 9px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  &__tooltip-item + &__tooltip-item {
    margin-top: 4px;
  }
}
</style>
