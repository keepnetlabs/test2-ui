<template>
  <AppModal
    :status="status"
    title-id="text--add-or-edit-ldap-modal-title"
    icon-name="mdi-mail"
    :title="labels.LDAPModalTitle"
    @closeOverlay="handleClose"
  >
    <template #overlay-body>
      <v-stepper v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step
            id="step--target-user-add-or-edit-modal-campaign-info"
            class="k-stepper__step"
            :complete="step > 1"
            :step="1"
            >{{ labels.SelectGroups }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--target-user-ldap-add-or-edit-modal-advanced-settings"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.SelectUsers }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.Groups"
              :subtitle="labels.LDAPImportModalStep1Subtitle"
            />
            <TargetUserLDAPImportModalStep1 />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.SelectUsers"
              :subtitle="labels.LDAPImportModalStep2Subtitle"
            />
            <TargetUserLDAPImportModalStep2 />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <TargetUserLDAPModalStepperFooter :step.sync="step" max-step="2" @on-cancel="handleClose" />
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import TargetUserLDAPModalStepperFooter from '@/components/TargetUsers/LDAP/TargetUserLDAPModalStepperFooter'
import TargetUserLDAPImportModalStep1 from '@/components/TargetUsers/LDAP/TargetUserLDAPImportModalStep1'
import TargetUserLDAPImportModalStep2 from '@/components/TargetUsers/LDAP/TargetUserLDAPImportModalStep2'
export default {
  name: 'TargetUserLDAPImportModal',
  components: {
    TargetUserLDAPImportModalStep2,
    TargetUserLDAPImportModalStep1,
    TargetUserLDAPModalStepperFooter,
    ConfigureCompanyStepHeader,
    AppModal
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  emits: ['on-close'],
  data() {
    return {
      labels,
      step: 1
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>

<style lang="scss"></style>
