<template>
  <div class="show-more">
    <div class="show-more__left" ref="refLeftContainer" v-if="getRenderStatusOfLeftContainer()">
      <template v-for="index in renderedBadgeCount" v-if="renderedBadgeCount > 0 && status === 0">
        <v-chip
          v-for="(value, key) in computedData[index - 1]"
          :class="[unRenderedBadgeCount !== 0 && 'show-more__hidden']"
          :key="value + key"
          v-if="value && key !== 'resourceId'"
          >{{ key && key.substring(0, 1).toUpperCase() + key.substring(1, key.length) }}:
          {{ value }}
        </v-chip>
      </template>
      <template v-if="status === 1" v-for="item in computedData">
        <v-chip v-for="(value, key) in item" :key="value + key"
          >{{ key && key.substring(0, 1).toUpperCase() + key.substring(1, key.length) }}:
          {{ value }}
        </v-chip>
      </template>
    </div>
    <div class="show-more__right" v-if="getRenderStatusOfButton()">
      <v-btn @click="changeStatus" small rounded color="#409eff" class="show-more__button">
        <v-icon class="show-more__icon" color="white">{{ getIconName }}</v-icon>
        <span>
          {{ getButtonText }}
        </span>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowMore',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      unRenderedBadgeCount: 0,
      renderedBadgeCount: 0,
      computedData: [],
      status: 0
    }
  },
  computed: {
    getButtonText() {
      if (this.status) {
        return `Show less`
      } else {
        return `+${this.unRenderedBadgeCount} more`
      }
    },
    getIconName() {
      if (this.status) {
        return 'mdi-menu-up'
      } else {
        return 'mdi-menu-down'
      }
    }
  },
  mounted() {
    this.getChips()
    window.addEventListener('resize', () => {
      this.getChips()
    })
  },
  created() {
    this.produceData()
  },
  methods: {
    getChips() {
      let containerWidth = 0
      if (this.unRenderedBadgeCount === 0) {
        containerWidth =
          Math.floor(
            this.$refs.refLeftContainer && this.$refs.refLeftContainer.getBoundingClientRect().width
          ) - 60 || 0
      } else {
        containerWidth =
          Math.floor(
            this.$refs.refLeftContainer && this.$refs.refLeftContainer.getBoundingClientRect().width
          ) || 0
      }

      let renderedCount = 0
      if (this.computedData.length === 1) {
        this.renderedBadgeCount = 1
        this.unRenderedBadgeCount = 0
      } else if (this.computedData.length > 1) {
        for (let item of this.computedData) {
          let width = 0
          const keys = Object.keys(item)
          for (let key of keys) {
            width += key.length * 8.5 + item[key].length * 8.5 + 15
          }

          if (containerWidth > width) {
            containerWidth -= width
            renderedCount++
          } else {
            break
          }
        }

        this.renderedBadgeCount = renderedCount
        if (this.renderedBadgeCount > this.computedData.length) {
          this.renderedBadgeCount = this.computedData.length
        }
        if (this.renderedBadgeCount < 0) {
          this.renderedBadgeCount = 0
        }
        this.unRenderedBadgeCount = this.computedData.length - this.renderedBadgeCount
      }

      /*
      let averageChipWidth = 0
      if (this.computedData.length > 0) {
        averageChipWidth =
          this.computedData.reduce((acc, item, index) => {
            let width = 0
            const keys = Object.keys(item)
            for (let key of keys) {
              width += key.length * 9 + item[key].length * 9
            }
            if (width > 300) {
              width = 300
            }
            acc += width
            return acc
          }, 0) / this.computedData.length
        this.renderedBadgeCount = Math.floor(containerWidth / averageChipWidth)
        this.unRenderedBadgeCount =
          this.computedData.length - this.renderedBadgeCount < 0
            ? 0
            : this.computedData.length - this.renderedBadgeCount
      }

       */
    },
    produceData() {
      this.computedData = this.data.reduce((acc, item) => {
        const objKeys = Object.keys(item)
        for (let key of objKeys) {
          if (key !== 'resourceId' && item[key]) {
            acc.push({ [key]: item[key] })
          }
        }
        return acc
      }, [])
    },
    changeStatus() {
      this.status = this.status ? 0 : 1
    },
    getRenderStatusOfButton() {
      return !(
        this.renderedBadgeCount === this.computedData.length || this.unRenderedBadgeCount === 0
      )
    },
    getRenderStatusOfLeftContainer() {
      return true
    }
  },
  watch: {
    data(value) {
      if (value.length > 0) {
        this.produceData()
        this.getChips()
      }
    }
  }
}
</script>

<style lang="scss">
.show-more {
  display: flex;
  &__left {
    flex-basis: 100%;
    .v-chip {
      font-size: 14px;
      line-height: 1.71;
      letter-spacing: normal;
      text-align: center;
      color: #000;
      height: auto !important;
      margin-top: 8px;
      margin-right: 4px;
    }
  }

  &__icon {
    font-size: 29px !important;
    margin-right: -3px;
    margin-top: -1px;
  }

  &__right {
  }
  &__button {
    border-radius: 12px !important;
    box-shadow: none !important;
    height: 24px !important;
    padding-left: 7px !important;
    margin-top: 10px;
    .v-btn__content {
      font-size: 12px;
      font-weight: 500;
      line-height: 1.17;
      letter-spacing: 0.3px;
      color: #ffffff;
      text-transform: initial;
      @media not all and (min-resolution: 0.001dpcm) {
        @supports (-webkit-appearance: none) {
          margin-top: -2px;
        }
      }
    }
  }
  &__hidden {
    &.v-chip {
    }
    .v-chip__content {
      white-space: nowrap !important;
      padding-right: 3.5px !important;
    }
  }
}
</style>
