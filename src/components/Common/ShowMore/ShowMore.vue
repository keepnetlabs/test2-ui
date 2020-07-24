<template>
  <div class="show-more">
    <div class="show-more__left" ref="refLeftContainer" v-if="getRenderStatusOfLeftContainer()">
      <template v-for="index in renderedBadgeCount" v-if="renderedBadgeCount > 0 && status === 0">
        <v-chip
          v-for="(value, key) in computedData[index - 1]"
          class="show-more__hidden"
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
        <v-icon small color="white">{{ getIconName }}</v-icon>
        <span class="ml-1">
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
        return 'mdi-arrow-up-drop-circle-outline'
      } else {
        return 'mdi-arrow-down-drop-circle-outline'
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
      const containerWidth =
        Math.floor(
          this.$refs.refLeftContainer && this.$refs.refLeftContainer.getBoundingClientRect().width
        ) || 0
      const averageChipWidth = 250
      console.log('averageChipWidth', averageChipWidth)
      this.renderedBadgeCount = Math.floor(containerWidth / averageChipWidth)
      this.unRenderedBadgeCount =
        this.computedData.length - this.renderedBadgeCount < 0
          ? 0
          : this.computedData.length - this.renderedBadgeCount
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

  &__right {
  }
  &__button {
    border-radius: 12px !important;
    box-shadow: none !important;
    height: 24px !important;
    margin-top: 10px;
    .v-btn__content {
      font-size: 12px;
      font-weight: 500;
      line-height: 1.17;
      letter-spacing: 0.3px;
      color: #ffffff;
      text-transform: initial;
    }
  }
  &__hidden {
    &.v-chip {
      max-width: 300px !important;
    }

    .v-chip__content {
      white-space: nowrap !important;
    }
  }
}
</style>
