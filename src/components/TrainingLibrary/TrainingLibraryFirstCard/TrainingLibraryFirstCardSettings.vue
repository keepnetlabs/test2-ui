<template>
  <div>
    <VCard class="card">
      <div
        v-click-outside="handleSettingsPopupClickOutside"
        v-show="isSettingsOpened"
        class="training-library-settings-popup"
      >
        <div class="training-library-settings-header">
          <span class="training-library-settings-span">Table Settings</span>
          <v-icon @click="toggleIsSettingsOpened" class="close-icon">mdi-close</v-icon>
        </div>
        <div class="training-library-settings-sub-header">Show / Hide Columns</div>
        <div
          v-if="ind !== 0 && col && !col.hideOnSettingsPopup"
          v-for="(col, ind) of tableColumns"
          :key="ind"
          class="training-library-popup-row"
        >
          {{ col.label }}
          <VSwitch v-model="col.show" color="#2196f3" @change="setChangeVisibilityOfColumn" />
        </div>
        <div class="training-library-settings-sub-header" style="margin-top: 10px;">
          Freeze Columns
        </div>
        <div class="training-library-popup-row">
          First Column
          <VSwitch
            :value="firstColFixed"
            :input-value="firstColFixed"
            color="#2196f3"
            @change="
              setColFixedChange({
                value: $event,
                key: 'firstColFixed'
              })
            "
          />
        </div>
        <div class="training-library-popup-row">
          Last Column
          <VSwitch
            :value="lastColFixed"
            :input-value="lastColFixed"
            color="#2196f3"
            @change="
              setColFixedChange({
                value: $event,
                key: 'lastColFixed'
              })
            "
          />
        </div>
      </div>
    </VCard>
    <VTooltip bottom opacity="1">
      <template #activator="{ on }">
        <VBtn
          v-on="on"
          id="btn-settings--training-library"
          class="btn-hover mr-1"
          icon
          @click="toggleIsSettingsOpened"
        >
          <v-icon>mdi-cog</v-icon>
        </VBtn>
      </template>
      <span class="tooltip-span">Table Settings</span>
    </VTooltip>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TrainingLibraryFirstCardSettings',
  data() {
    return {
      isSettingsOpened: false,
      isFirstOpenSettings: false,
      firstOpenSettingsTimeout: null
    }
  },
  computed: {
    ...mapGetters({
      tableColumns: 'trainingLibrary/getTableColumns',
      firstColFixed: 'trainingLibrary/getFirstColFixed',
      lastColFixed: 'trainingLibrary/getLastColFixed'
    })
  },
  beforeDestroy() {
    if (this.firstOpenSettingsTimeout) clearTimeout(this.firstOpenSettingsTimeout)
  },
  methods: {
    ...mapActions({
      setChangeVisibilityOfColumn: 'trainingLibrary/setChangeVisibilityOfColumn',
      setColFixedChange: 'trainingLibrary/setColFixedChange'
    }),
    toggleIsSettingsOpened() {
      this.isSettingsOpened = !this.isSettingsOpened
      this.isFirstOpenSettings = true
      if (this.firstOpenSettingsTimeout) clearTimeout(this.firstOpenSettingsTimeout)
      this.firstOpenSettingsTimeout = setTimeout(() => {
        this.isFirstOpenSettings = false
      }, 200)
    },
    handleSettingsPopupClickOutside() {
      if (!this.isSettingsOpened || this.isFirstOpenSettings) return
      this.isSettingsOpened = false
    }
  }
}
</script>
