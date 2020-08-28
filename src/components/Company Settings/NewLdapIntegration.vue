<template>
  <div>
    <app-modal
      :status="status"
      @closeOverlay="$emit('closeOverlay')"
      icon-name="mdi-domain"
      title="New LDAP Integration"
      class-name="add-in-configuration"
    >
      <template v-slot:overlay-body>
        <v-stepper v-model="step" class="k-stepper">
          <v-stepper-header class="k-stepper__header">
            <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
              >LDAP Info</v-stepper-step
            >
            <v-divider class="k-stepper__divider" />
            <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2"
              >Field Mapping</v-stepper-step
            >
          </v-stepper-header>
          <v-stepper-items class="k-stepper__items">
            <v-stepper-content class="k-stepper__content" :step="1">
              <v-list-item class="pl-0 add-in-configuration__list-item">
                <v-list-item-content>
                  <v-list-item-title class="add-in-configuration__title">
                    LDAP Information
                  </v-list-item-title>
                  <v-list-item-subtitle class="add-in-configuration__subtitle mb-6">
                    Enter Active Directory information
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <ldap-info-form ref="refLdapInfoForm" />
            </v-stepper-content>
            <v-stepper-content class="k-stepper__content" :step="2">
              <v-list-item class="pl-0 add-in-configuration__list-item">
                <v-list-item-content>
                  <v-list-item-title class="add-in-configuration__title">
                    Field Mapping
                  </v-list-item-title>
                  <v-list-item-subtitle class="add-in-configuration__subtitle">
                    Match field names from your Active Directory to the system fields to import
                    users information correctly
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </template>
      <template v-slot:overlay-footer>
        <v-btn @click="closeOverlay" class="add-in-configuration__footer-btn-cancel" rounded>
          CANCEL
        </v-btn>
        <div class="add-in-configuration__footer__right-col">
          <v-btn
            @click="changeStep(-1)"
            class="add-in-configuration__footer-btn-back mr-4"
            rounded
            v-if="step > 1"
          >
            BACK
          </v-btn>
          <v-btn
            @click="changeStep(+1)"
            class="add-in-configuration__footer-btn-next"
            color="#2196f3"
            rounded
            v-if="step < 2"
          >
            NEXT
          </v-btn>
          <v-btn
            @click="submit"
            class="add-in-configuration__footer-btn-next"
            color="#2196f3"
            rounded
            v-if="step === 2"
          >
            SAVE
          </v-btn>
        </div>
      </template>
    </app-modal>
  </div>
</template>

<script>
import AppModal from '@/components/AppModal'
import LdapInfoForm from '@/components/Company Settings/LdapInfoForm'

export default {
  name: 'NewLdapIntegration',
  components: {
    LdapInfoForm,
    AppModal
  },
  props: {
    status: {
      type: Boolean
    }
  },
  data() {
    return {
      step: 1
    }
  },
  methods: {
    changeStep(step) {
      this.step += step
    },
    submit() {},
    closeOverlay() {
      this.$emit('closeOverlay')
    }
  }
}
</script>

<style lang="scss"></style>
