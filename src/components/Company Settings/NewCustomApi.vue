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
      <v-list-item class="pl-0 pr-0 mt-8 white-labeling__list-item">
        <v-list-item-content>
          <v-list-item-title class="new-smtp-setting__title">
            Rest API Configuration
          </v-list-item-title>
          <v-list-item-subtitle class="new-smtp-setting__sub-title mb-6">
            Set new API
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-form ref="refForm">
        <v-list-item class="white-labeling__list-item">
          <v-list-item-content>
            <v-list-item-title class="new-integration__label">
              Client Name
            </v-list-item-title>
            <v-list-item-subtitle class="new-smtp-setting__sub-title mb-2">
              This name will respresent the client company
            </v-list-item-subtitle>
            <v-text-field
              placeholder="Enter name"
              outlined
              dense
              class="auth-key__textfield"
              v-model.trim="formValues.clientName"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <div class="auth-key">
          <v-list-item-title class="new-integration__label">
            Customer’s Keepnet ID
          </v-list-item-title>
          <v-list-item-subtitle class="new-smtp-setting__sub-title mb-2">
            This name will respresent the client company
          </v-list-item-subtitle>
          <div class="mt-2 auth-key__container">
            <v-text-field
              placeholder="Enter Keepnet Customer ID"
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
        </div>
        <v-list-item class="white-labeling__list-item">
          <v-list-item-content>
            <v-list-item-title class="new-integration__label">
              API Key
            </v-list-item-title>
            <v-list-item-subtitle class="new-smtp-setting__sub-title mb-2">
              Copy generated key and send it to your client
            </v-list-item-subtitle>
            <v-text-field
              placeholder="Generate API Key first"
              outlined
              dense
              class="auth-key__textfield"
              v-model.trim="formValues.apiKey"
            ></v-text-field>
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
export default {
  name: 'NewCustomApi',
  components: {
    AppModal
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
