<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    :title="'New Client'"
    icon-name="mdi-plus"
    class-name="new-smtp-setting"
    :saveDisable="saveDisable"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header
        title="Add New Integration Client"
        sub-title="Add new client to provide integration service"
      />
      <v-form ref="refForm">
        <form-group
          title="Client Name"
          sub-title="This name will represent the client company"
          has-hint
        >
          <v-text-field
            placeholder="Enter name"
            outlined
            dense
            class="auth-key__textfield"
            hint="*Required"
            persistent-hint
            v-model.trim="formValues.clientName"
          ></v-text-field>
          <v-btn
            @click="submit"
            class="white--text btn-util"
            style="margin-bottom: 10px; box-shadow: none !important;"
            color="#2196f3"
            rounded
          >
            {{ labels.GenerateClientCred }}
          </v-btn>
        </form-group>
        <form-group title="Client ID" sub-title="Generated Client ID" class-name="auth-key">
          <div class="auth-key__container">
            <v-text-field
              placeholder="Generated Client ID"
              outlined
              dense
              class="auth-key__textfield"
              :disabled="true"
              v-model.trim="formValues.authSecret"
            ></v-text-field>
          </div>
        </form-group>
        <form-group
          title="Client Secret"
          sub-title="Please save API Secret in a safe place. It is only displayed once"
        >
          <v-text-field
            placeholder="Generated Client Secret"
            outlined
            dense
            class="auth-key__textfield"
            :disabled="true"
            v-model.trim="formValues.apiKey"
          ></v-text-field>
        </form-group>
        <form-group title="Status">
          <v-switch
            v-model="formValues.status"
            :label="formValues.status ? 'Active' : 'Inactive'"
            class="k-switch"
            color="#2196f3"
          />
        </form-group>
      </v-form>
    </template>
    <template v-slot:overlay-footer>
      <v-btn class="new-integration__footer-btn-cancel" @click="closeOverlay" rounded>
        {{ labels.Cancel }}
      </v-btn>
      <div class="new-integration__footer__right-col">
        <v-btn
          class="new-integration__footer-btn-save white--text"
          color="#2196f3"
          rounded
          @click="submit"
          :disabled="saveDisable"
        >
          {{ labels.Save }}
        </v-btn>
      </div>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import labels from '@/model/constants/labels'

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
      saveDisable: false,
      labels,
      formValues: {
        clientName: '',
        authSecret: '',
        apiKey: '',
        status: true
      }
    }
  },
  methods: {
    closeOverlay() {
      this.saveDisable = false
      this.$emit('closeOverlay')
    },
    submit() {
      this.saveDisable = false
      setTimeout(() => {
        this.saveDisable = false
      }, 5000)
    }
  }
}
</script>

<style lang="scss"></style>
