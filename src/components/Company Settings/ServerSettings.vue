<template>
  <div class="server-settings">
    <company-settings-header
      title="Server Settings"
      sub-title="Define settings for your on-premise or private cloud server"
    />
    <form-group>
      <v-checkbox
        v-model="formValues.isOnPremise"
        color="#2196f3"
        class="mt-n2 pt-0"
        label="Enable on-premise installation"
      />
    </form-group>
    <v-list-item :class="['k-form-group', 'mt-2']">
      <v-list-item-content>
        <label
          class="k-form-group__title"
          :class="[!formValues.isOnPremise && 'server-settings__label']"
        >
          API URL
        </label>

        <div :class="['k-form-group__content']">
          <v-text-field
            placeholder="Enter API URL"
            class="server-settings__text-field"
            :class="[!formValues.isOnPremise && 'server-settings__text-field--disabled']"
            outlined
            dense
            v-model.trim="formValues.apiURL"
          ></v-text-field>
        </div>
      </v-list-item-content>
    </v-list-item>
    <div>
      <v-btn
        @click="submit"
        class="white--text btn-util btn-save-changes mb-6 mt-2"
        color="#2196f3"
        rounded
      >
        SAVE CHANGES
      </v-btn>
    </div>
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'

export default {
  name: 'ServerSettings',
  components: {
    FormGroup,
    CompanySettingsHeader
  },
  data() {
    return {
      formValues: {
        isOnPremise: false,
        apiURL: ''
      }
    }
  },
  methods: {
    submit() {}
  }
}
</script>

<style lang="scss">
.server-settings {
  &__text-field {
    &--disabled {
      pointer-events: none;
      opacity: 0.5;
    }
    max-width: 400px !important;
  }
  &__label {
    opacity: 0.5;
  }
}
</style>
