<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    :title="'New SMS Configuration'"
    icon-name="mdi-domain"
    class-name="new-smtp-setting"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header title="SMS Configuration" sub-title="Set new SMS Provider" />
      <v-form ref="refForm" lazy-validation>
        <form-group title="Provider">
          <k-select
            placeholder="Select option"
            outlined
            dense
            :items="providerItems"
            v-model.trim="formValues.provider"
          />
        </form-group>
        <form-group title="Account SID">
          <v-text-field
            placeholder="Enter Account SID"
            outlined
            dense
            v-model.trim="formValues.accountSid"
          ></v-text-field>
        </form-group>
        <form-group title="Authorization Token">
          <v-text-field
            placeholder="Enter authorization token"
            outlined
            dense
            v-model.trim="formValues.authorizationToken"
          ></v-text-field>
        </form-group>
        <form-group title="Phone Number">
          <phone-number v-model="formValues.phoneNumber" />
        </form-group>
        <v-list-item class="white-labeling__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">Status</label>
            <v-switch
              class="playbook-rule-form__switch mt-2"
              v-model="formValues.isActive"
              :label="formValues.isActive ? 'Active' : 'Inactive'"
              color="#2196f3"
            />
          </v-list-item-content>
        </v-list-item>
      </v-form>
    </template>
    <template v-slot:overlay-footer>
      <v-btn class="new-integration__footer-btn-cancel" @click="closeOverlay" rounded>
        CANCEL
      </v-btn>
      <div class="new-integration__footer__right-col">
        <v-btn
          class="new-integration__footer-btn-save white--text"
          color="#2196f3"
          rounded
          @click="submit"
        >
          SAVE
        </v-btn>
      </div>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import PhoneNumber from '@/components/SmallComponents/PhoneNumber'
import { maxLength, minLength } from '@/utils/validations'
import FormGroup from '@/components/SmallComponents/FormGroup'
import KSelect from '@/components/Common/Inputs/KSelect'

export default {
  name: 'NewSmsSettings',
  components: {
    KSelect,
    AppModal,
    AppModalBodyHeader,
    PhoneNumber,
    FormGroup
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      providerItems: [],
      formValues: {
        provider: '',
        accountSid: '',
        authorizationToken: '',
        isActive: true,
        phoneNumber: ''
      },
      listItems: [],
      validations: {
        maxLength,
        minLength
      }
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    submit() {}
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.refForm.resetValidation()
    })
  }
}
</script>

<style lang="scss"></style>
