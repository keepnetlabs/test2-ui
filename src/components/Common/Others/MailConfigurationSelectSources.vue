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
    autocomplete="off"
    hint="*Required"
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
      return !!(
        this.value.some(
          (source) => source.mailConfigurationResourceId === item.mailConfigurationResourceId
        ) ||
        (this.isAllSelected && item.statusName === 'Running')
      )
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
        this.options = data.map((item) => {
          if (item.type.toLowerCase() === 'outlook') {
            item['mailConfigurationName'] = 'Outlook'
          }
          return {
            ...item,
            statusName: item.statusName || 'Running'
          }
        })
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
      return !!this.isAllSelected
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
