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
              <app-modal-body-header
                inStepper
                title="LDAP Information"
                sub-title=" Enter Active Directory information"
              />
              <ldap-info-form ref="refLdapInfoForm" />
            </v-stepper-content>
            <v-stepper-content class="k-stepper__content" :step="2">
              <app-modal-body-header
                inStepper
                title="Field Mapping"
                sub-title="Match field names from your Active Directory to the system fields to import
                    users information correctly"
              />
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
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
export default {
  name: 'NewLdapIntegration',
  components: {
    LdapInfoForm,
    AppModal,
    AppModalBodyHeader
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
      let isValid = false
      switch (this.step) {
        case 1:
          if (this.$refs.refLdapInfoForm.$refs.refForm.validate()) {
            isValid = true
          }
          break
        default:
          isValid = true
          break
      }
      if (isValid) {
        this.step += step
      }
    },
    submit() {},
    closeOverlay() {
      this.$emit('closeOverlay')
    }
  }
}
</script>

<style lang="scss"></style>
