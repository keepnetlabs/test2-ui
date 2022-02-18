<template>
  <v-tooltip bottom v-if="isWithTooltip">
    <template v-slot:activator="{ on }">
      <div
        v-on="on"
        :class="[
          'mail-configuration-select-sources__item-container',
          {
            'mail-configuration-select-sources__item-container--disabled': isDisabled,
            'mail-configuration-select-sources__item-container--first': isFirst
          }
        ]"
      >
        <v-checkbox
          hide-details
          color="#2196f3"
          class="mt-n1"
          :disabled="isDisabled"
          :input-value="isSelected"
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
                :color="badgeColor"
                :id="`badge--mail-configuration-select-sources-${index}`"
                :outline="false"
                :text="badgeText"
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
        'mail-configuration-select-sources__item-container--disabled': isDisabled,
        'mail-configuration-select-sources__item-container--first': isFirst
      }
    ]"
  >
    <v-checkbox
      hide-details
      color="#2196f3"
      class="mt-n1"
      :disabled="isDisabled"
      :input-value="isSelected"
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
            :color="badgeColor"
            :id="`badge--mail-configuration-select-sources-${index}`"
            :outline="false"
            :text="badgeText"
          />
        </div>
      </div>
      <div v-else class="mail-configuration-select-sources__item-right-platform">
        All Configurations
      </div>
    </div>
  </div>
</template>

<script>
import Badge from '@/components/Badge'
import { VTooltip } from 'vuetify/lib'

export default {
  name: 'MailConfigurationSelectItem',
  components: {
    Badge,
    VTooltip
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number
    },
    isWithTooltip: {
      type: Boolean,
      default: false,
      required: true
    },
    isDisabled: {
      type: Boolean,
      default: false,
      required: true
    },
    isFirst: {
      type: Boolean,
      default: false,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false,
      required: true
    },
    badgeColor: {
      type: String,
      default: '#217124',
      required: true
    },
    badgeText: {
      type: String,
      default: 'Running',
      required: true
    }
  }
}
</script>
