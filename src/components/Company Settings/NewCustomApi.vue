<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    :title="'New Client'"
    icon-name="mdi-plus"
    class-name="new-smtp-setting"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header
        title="Add New Integration Client"
        sub-title="Add new client to provide integration service"
      />
      <v-form ref="refForm">
        <form-group title="Client Name" sub-title="This name will represent the client company">
          <v-text-field
            placeholder="Enter name"
            outlined
            dense
            class="auth-key__textfield"
            v-model.trim="formValues.clientName"
          ></v-text-field>
        </form-group>
        <form-group
          title="Generate API Key for Customer ID"
          sub-title="Enter Customer ID of the client to generate an API Key"
          class-name="auth-key"
        >
          <div class="auth-key__container">
            <v-text-field
              placeholder="Enter Customer ID"
              outlined
              dense
              class="auth-key__textfield"
              v-model.trim="formValues.authSecret"
            ></v-text-field>
            <v-btn
              @click="submit"
              class="white--text btn-util btn-save-changes ml-6"
              color="#2196f3"
              rounded
            >
              GENERATE API KEY
            </v-btn>
          </div>
        </form-group>
        <form-group title="API Key" sub-title="Copy generated key and send it to your client">
          <v-text-field
            placeholder="Generate API Key first"
            outlined
            dense
            class="auth-key__textfield"
            v-model.trim="formValues.apiKey"
          ></v-text-field>
        </form-group>
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
import FormGroup from '@/components/SmallComponents/FormGroup'
export default {
  name: 'NewCustomApi',
  components: {
    AppModal,
    AppModalBodyHeader,
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
      formValues: {
        clientName: '',
        authSecret: '',
        apiKey: ''
      }
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    submit() {}
  }
}
</script>

<style lang="scss"></style>
