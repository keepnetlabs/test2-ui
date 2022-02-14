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
    :slots="{ item: true }"
    :items="options"
    :item-disabled="checkIsItemDisabled"
    :rules="[(v) => !!v.length || labels.Required]"
    :position="position"
    @input="handleInputChange"
  >
    <template #item="{ item, index }">
      <v-tooltip bottom v-if="shouldRenderTooltip(item)">
        <template v-slot:activator="{ on }">
          <div
            v-on="on"
            :class="[
              'mail-configuration-select-sources__item-container',
              {
                'mail-configuration-select-sources__item-container--disabled': checkIsItemDisabled(
                  item
                ),
                'mail-configuration-select-sources__item-container--first':
                  item.mailConfigurationName === 'All'
              }
            ]"
          >
            <v-checkbox
              hide-details
              color="#2196f3"
              class="mt-n1"
              :disabled="checkIsItemDisabled(item)"
              :input-value="
                !!value.some(
                  (source) =>
                    source.mailConfigurationResourceId === item.mailConfigurationResourceId
                )
              "
            />
            <div class="mail-configuration-select-sources__item">
              <div class="mail-configuration-select-sources__item-left">
                {{ item.mailConfigurationName }}
              </div>
              <div
                class="mail-configuration-select-sources__item-right"
                v-if="item.mailConfigurationName !== 'All'"
              >
                <div class="mail-configuration-select-sources__item-right-platform">
                  {{ item.type }}
                </div>
                <div>
                  <v-btn style="display: none;" />
                  <Badge
                    size="small"
                    className="mail-configuration-select-sources__badge"
                    :color="getBtnStatusColor(item.statusName)"
                    :id="`badge--mail-configuration-select-sources-${index}`"
                    :outline="false"
                    :text="item.statusName"
                  />
                </div>
              </div>
              <div v-else class="mail-configuration-select-sources__item-right-platform">
                All Configurations
              </div>
            </div>
          </div>
        </template>
        <span>You can only choose running configurations</span>
      </v-tooltip>
      <div
        v-else
        :class="[
          'mail-configuration-select-sources__item-container',
          {
            'mail-configuration-select-sources__item-container--disabled': checkIsItemDisabled(
              item
            ),
            'mail-configuration-select-sources__item-container--first':
              item.mailConfigurationName === 'All'
          }
        ]"
      >
        <v-checkbox
          hide-details
          color="#2196f3"
          class="mt-n1"
          :disabled="checkIsItemDisabled(item)"
          :input-value="
            !!value.some(
              (source) => source.mailConfigurationResourceId === item.mailConfigurationResourceId
            )
          "
        />
        <div class="mail-configuration-select-sources__item">
          <div class="mail-configuration-select-sources__item-left">
            {{ item.mailConfigurationName }}
          </div>
          <div
            class="mail-configuration-select-sources__item-right"
            v-if="item.mailConfigurationName !== 'All'"
          >
            <div class="mail-configuration-select-sources__item-right-platform">
              {{ item.type }}
            </div>
            <div>
              <v-btn style="display: none;" />
              <Badge
                size="small"
                className="mail-configuration-select-sources__badge"
                :color="getBtnStatusColor(item.statusName)"
                :id="`badge--mail-configuration-select-sources-${index}`"
                :outline="false"
                :text="item.statusName"
              />
            </div>
          </div>
          <div v-else class="mail-configuration-select-sources__item-right-platform">
            All Configurations
          </div>
        </div>
      </div>
    </template>
  </k-select>
</template>

<script>
import Badge from '@/components/Badge'
import KSelect from '@/components/Common/Inputs/KSelect'
import { VTooltip } from 'vuetify/lib'
import { getBtnStatusColor, getDataTableFieldLabel } from '@/utils/functions'
import labels from '@/model/constants/labels'
import { getInvestigationScanTypes } from '@/api/investigations'
export default {
  name: 'MailConfigurationSelectSources',
  components: {
    Badge,
    KSelect,
    VTooltip
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
  computed: {
    isAllSelected() {
      return this.selectedSources.some((item) => item.mailConfigurationResourceId === 'all')
    }
  },
  created() {
    this.callForOptions()
  },
  methods: {
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
            statusName: index % 2 === 0 ? 'Failed' : 'Running'
          }
        })
        this.options.unshift(
          { mailConfigurationName: 'All', mailConfigurationResourceId: 'all' },
          { divider: true }
        )
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
}
</style>
