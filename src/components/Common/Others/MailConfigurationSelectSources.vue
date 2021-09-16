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
    item-value="resourceId"
    item-text="name"
    :slots="{ item: true }"
    :items="options"
    :item-disabled="checkIsItemDisabled"
    :rules="[(v) => v.length || labels.Required]"
    @input="handleInputChange"
  >
    <template #item="{item,index}">
      <div
        :class="[
          'mail-configuration-select-sources__item-container',
          {
            'mail-configuration-select-sources__item-container--disabled':
              item.statusName === 'Not Running',
            'mail-configuration-select-sources__item-container--first': item.name === 'All'
          }
        ]"
      >
        <v-checkbox
          hide-details
          color="#2196f3"
          class="mt-n1"
          :input-value="
            !!value.some((source) => source.mailConfigurationResourceId === item.resourceId)
          "
        />
        <div class="mail-configuration-select-sources__item">
          <div class="mail-configuration-select-sources__item-left">
            {{ item.name }}
          </div>
          <div class="mail-configuration-select-sources__item-right" v-if="item.name !== 'All'">
            <div class="mail-configuration-select-sources__item-right-platform">
              {{ item.platform }}
            </div>
            <div>
              <v-btn style="display: none;" />
              <Badge
                size="small"
                className="mail-configuration-select-sources__badge"
                :id="`badge--mail-configuration-select-sources-${index}`"
                :outline="false"
                :text="getDataTableFieldLabel(item.statusName)"
                :color="getBtnStatusColor(item.statusName)"
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
import { getMailConfigurationList } from '@/api/mailConfiguration'
import { getBtnStatusColor, getDataTableFieldLabel } from '@/utils/functions'
import labels from '@/model/constants/labels'
export default {
  name: 'MailConfigurationSelectSources',
  components: {
    Badge,
    KSelect
  },
  props: {
    value: {
      type: Array
    }
  },
  data() {
    return {
      options: [],
      selectedSources: [],
      labels
    }
  },
  created() {
    this.callForOptions()
  },
  methods: {
    callForOptions() {
      getMailConfigurationList({
        pageNumber: 1,
        pageSize: 75000,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        }
      }).then((response) => {
        const {
          data: { data }
        } = response
        this.options = data.results
        if (this.value.length) {
          this.selectedSources = this.options.filter((item) =>
            this.value.find((val) => val.mailConfigurationResourceId === item.resourceId)
          )
        }
      })
    },
    checkIsItemDisabled(item) {
      return item.statusName === 'Not Running'
    },
    getBtnStatusColor(type) {
      return getBtnStatusColor(type)
    },
    getDataTableFieldLabel(field) {
      return getDataTableFieldLabel(field)
    },
    handleInputChange(val = {}) {
      this.$emit(
        'input',
        val.map(({ resourceId, platform }) => ({
          mailConfigurationResourceId: resourceId,
          type: platform
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
    }
  }
}
</style>
