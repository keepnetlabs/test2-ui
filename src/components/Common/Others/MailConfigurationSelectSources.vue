<template>
  <k-select
    v-model="selectedSources"
    type="combobox"
    id="input--mail-configuration-sources"
    class="mail-configuration-select-sources"
    placeholder="Select sources"
    outlined
    multiple
    dense
    persistent-hint
    small-chips
    deletable-chips
    autocomplete="disabled"
    item-value="mailConfigurationResourceId"
    item-text="mailConfigurationName"
    :slots="{ item: true, selection: true }"
    :items="options"
    :item-disabled="checkIsItemDisabled"
    :rules="[(v) => !!v.length || labels.Required]"
    :position="position"
    @input="handleInputChange"
  >
    <template #item="{ item, index }">
      <MailConfigurationSelectItem
        :item="item"
        :index="index"
        :isWithTooltip="shouldRenderTooltip(item)"
        :isDisabled="checkIsItemDisabled(item)"
        :isFirst="item.mailConfigurationName === 'All'"
        :isSelected="getCheckboxCheckedValue(item)"
        :badgeColor="getBtnStatusColor(item.statusName)"
        :badgeText="item.statusName"
      />
    </template>
    <template #selection="data">
      <v-chip
        v-if="data.item.mailConfigurationResourceId !== 'all'"
        v-show="!isAllSelected"
        v-bind="data.attrs"
        close
        small
        :key="JSON.stringify(data.item)"
        :input-value="data.selected"
        :disabled="data.disabled"
        @click:close="data.parent.selectItem(data.item)"
      >
        {{ data.item.mailConfigurationName }}
      </v-chip>
      <div v-else>
        {{ data.item.mailConfigurationName }}
      </div>
    </template>
  </k-select>
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect'
import { getBtnStatusColor, getDataTableFieldLabel } from '@/utils/functions'
import labels from '@/model/constants/labels'
import { getInvestigationScanTypes } from '@/api/investigations'
import MailConfigurationSelectItem from './MailConfigurationSelectItem.vue'
export default {
  name: 'MailConfigurationSelectSources',
  components: {
    KSelect,
    MailConfigurationSelectItem
  },
  props: {
    value: {
      type: Array
    },
    position: {
      type: String,
      default: 'bottom'
    }
  },
  data() {
    return {
      options: [],
      selectedSources: [],
      labels
    }
  },
  watch: {
    isAllSelected(newVal) {
      if (newVal === true) {
        const validOptions = this.options.filter(
          (item) =>
            !item.divider &&
            (item.mailConfigurationResourceId === 'all' || item.statusName === 'Running')
        )
        this.selectedSources = [...validOptions]
        this.$emit('input', [...validOptions])
      } else {
        this.selectedSources = []
        this.$emit('input', [])
      }
    }
  },
  computed: {
    isAllSelected() {
      return this.selectedSources.some((item) => item.mailConfigurationResourceId === 'all')
    }
  },
  created() {
    this.callForOptions()
  },
  methods: {
    getCheckboxCheckedValue(item) {
      if (
        !!this.value.some(
          (source) => source.mailConfigurationResourceId === item.mailConfigurationResourceId
        ) ||
        (this.isAllSelected && item.statusName === 'Running')
      )
        return true
      return false
    },
    shouldRenderTooltip(item) {
      if (item.mailConfigurationResourceId === 'all') return false
      if (item.statusName !== 'Running') return true
    },
    callForOptions() {
      getInvestigationScanTypes().then((response) => {
        const {
          data: { data }
        } = response
        this.options = data.map((item, index) => {
          if (item.type.toLowerCase() === 'outlook') {
            item['mailConfigurationName'] = 'Outlook'
          }
          return {
            ...item,
            statusName: !!item.statusName ? item.statusName : 'Running'
          }
        })
        // this.options.unshift(
        //   { mailConfigurationName: 'All', mailConfigurationResourceId: 'all' },
        //   { divider: true }
        // )
        if (this.value.length) {
          this.selectedSources = this.options.filter((item) =>
            this.value.find(
              (val) => val.mailConfigurationResourceId === item.mailConfigurationResourceId
            )
          )
        }
      })
    },
    checkIsItemDisabled(item) {
      if (item.mailConfigurationResourceId === 'all') return false
      if (item.statusName !== 'Running') return true
      if (this.isAllSelected) return true
      return false
    },
    getBtnStatusColor(type) {
      if (type === 'Running') return '#217124'
      return getBtnStatusColor(type)
    },
    getDataTableFieldLabel(field) {
      return getDataTableFieldLabel(field)
    },
    handleInputChange(val = []) {
      this.$emit(
        'input',
        val.map(({ mailConfigurationResourceId, type }) => ({
          mailConfigurationResourceId: mailConfigurationResourceId,
          type
        }))
      )
    }
  }
}
</script>

<style lang="scss">
.mail-configuration-select-sources {
  .v-chip {
    margin: 4px !important;
  }
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    &-container {
      display: flex;
      align-items: center;
      width: 100%;
      min-height: 48px;
      &--disabled {
        opacity: 0.72;
      }
      &--first {
        &::after {
          width: 100%;
          height: 1px;
          background-color: rgb(224, 224, 224);
          position: absolute;
          bottom: 0;
          left: 0;
          content: '';
        }
      }
    }
    &-left {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      color: #383b41 !important;
    }
    &-right {
      display: flex;
      align-items: center;
      &-platform {
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        color: #757575;
        margin-left: 8px;
        margin-right: 8px;
      }
    }
  }
  &__badge {
    &.v-btn.v-btn--contained.v-btn--rounded.theme--light {
      height: 24px !important;
      border-radius: 4px !important;
      box-shadow: none !important;
    }
  }
}
.v-list-item--disabled {
  pointer-events: auto;

  .v-ripple__container {
    display: none;
  }
}
</style>
