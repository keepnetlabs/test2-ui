<template>
  <div class="test-connection">
    <div
      id="btn-test-connection--mail-configuration"
      :class="{
        'd-flex': true,
        'test-connection__disabled-text': isLoading,
        '': isAllSuccess
      }"
      class="new-integration__api-key__text"
      @click="testConnection(false)"
    >
      <div v-if="isLoading" class="test-connection__button">
        TESTING CONNECTION
        <v-icon class="ml-2 loading-spin" color="#2196f3" left medium>mdi-rotate-left </v-icon>
      </div>
      <div class="test-connection__button" v-else>
        TEST CONNECTION
        <v-icon v-if="isAllSuccess && !isLoading" class="ml-2" color="#43a047" left medium
          >mdi-check
        </v-icon>
      </div>
    </div>
    <div class="test-connection__testing-content" v-if="isLoadingStarted">
      <div class="test-connection__testing-content__item" id="test-connection-item-authenticating">
        <div class="test-connection__testing-content__item--label">Authenticating</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus
            :state="checkApiConnectivity"
            :message="checkApiConnectivityMessage"
          />
        </div>
      </div>
      <div
        class="test-connection__testing-content__item"
        id="test-connection-item-checking-permissions"
      >
        <div class="test-connection__testing-content__item--label">Checking permissions</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkPrivileges" :message="checkPrivilegesMessage" />
        </div>
      </div>
      <div class="test-connection__testing-content__item" id="test-connection-item-fetching-users">
        <div class="test-connection__testing-content__item--label">Fetching users</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkInboxAccess" :message="checkInboxAccessMessage" />
        </div>
      </div>
      <div
        class="test-connection__testing-content__item"
        id="test-connection-item-fetching-email-body"
      >
        <div class="test-connection__testing-content__item--label">Fetching email body</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus
            :state="checkEmailBodyAccess"
            :message="checkEmailBodyAccessMessage"
          />
        </div>
      </div>
      <div
        class="test-connection__testing-content__item"
        id="test-connection-item-creating-category"
      >
        <div class="test-connection__testing-content__item--label">
          Testing: Create a new category
        </div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus
            :state="checkEmailHeaderAccess"
            :message="checkEmailHeaderAccessMessage"
          />
        </div>
      </div>
      <div class="test-connection__testing-content__item" id="test-connection-item-update-category">
        <div class="test-connection__testing-content__item--label">Testing: Update a category</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus
            :state="checkEmailMailFilter"
            :message="checkEmailMailFilterMessage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  checkApiConnectivityEWS,
  checkPrivilegesEWS,
  checkInboxAccessEWS,
  checkEmailBodyAccessEWS,
  checkEmailHeaderAccessEWS,
  checkEmailMailFilterEWS
} from '@/api/mailConfiguration'
import TestConnectivityStatus from './TestConnectivityStatus'
export default {
  inheritAttrs: true,
  name: 'TestConnection',
  components: {
    TestConnectivityStatus
  },
  props: ['values', 'isValidate', 'isEdit'],
  data() {
    return {
      isSave: false,
      loadingState: null,
      isLoadingStarted: false,
      checkApiConnectivity: null,
      checkPrivileges: null,
      checkInboxAccess: null,
      checkEmailBodyAccess: null,
      checkEmailHeaderAccess: null,
      checkEmailMailFilter: null,
      checkApiConnectivityMessage: null,
      checkPrivilegesMessage: null,
      checkInboxAccessMessage: null,
      checkEmailBodyAccessMessage: null,
      checkEmailHeaderAccessMessage: null,
      checkEmailMailFilterMessage: null
    }
  },
  computed: {
    isLoading() {
      let isLoading =
        this.checkApiConnectivity !== 'loading' &&
        this.checkPrivileges !== 'loading' &&
        this.checkInboxAccess !== 'loading' &&
        this.checkEmailBodyAccess !== 'loading' &&
        this.checkEmailHeaderAccess !== 'loading' &&
        this.checkEmailMailFilter !== 'loading'
      if (isLoading) {
        this.$emit('loading')
      }
      return !isLoading
    },
    isAllSuccess() {
      let isSuccess =
        this.checkApiConnectivity === 'success' &&
        this.checkPrivileges === 'success' &&
        this.checkInboxAccess === 'success' &&
        this.checkEmailBodyAccess === 'success' &&
        this.checkEmailHeaderAccess === 'success' &&
        this.checkEmailMailFilter === 'success'

      return isSuccess
    }
  },
  methods: {
    checkIfAllSuccess() {
      const isSuccess = this.isAllSuccess
      this.$emit('testConnectionValues', isSuccess, this.isSave)
      return isSuccess
    },
    testConnection(isSave) {
      this.isSave = isSave
      if (this.isValidate()) {
        this.isLoadingStarted = true
        this.setLoadingStates()
        let payload = {
          Username: this.values.Username,
          Password: this.values.Password,
          ServiceUrl: this.values.ServiceUrl,
          AccountType: this.values.AccountType,
          Email: this.values.Email,
          XAnchorMailbox: this.values.XAnchorMailBoxHeader,
          ExchangeVersion: this.values.ExchangeVersionLookupResourceId,
          ResourceId: null
        }
        if (this.isEdit) {
          payload.ResourceId = this.isEdit.ResourceId
        }
        checkApiConnectivityEWS(payload)
          .then(() => {
            this.checkApiConnectivity = 'success'
            this.checkIfAllSuccess(true)
          })
          .catch((error) => {
            this.checkApiConnectivity = 'error'
            this.checkApiConnectivityMessage =
              (error.response.data.validationMessages &&
                error.response.data.validationMessages[0]) ||
              error.response.data.message
            this.checkIfAllSuccess(false)
          })
        checkPrivilegesEWS(payload)
          .then(() => {
            this.checkPrivileges = 'success'
            this.checkIfAllSuccess(true)
          })
          .catch((error) => {
            this.checkPrivileges = 'error'
            this.checkPrivilegesMessage =
              (error.response.data.validationMessages &&
                error.response.data.validationMessages[0]) ||
              error.response.data.message
            this.checkIfAllSuccess(false)
          })
        checkInboxAccessEWS(payload)
          .then(() => {
            this.checkInboxAccess = 'success'
            this.checkIfAllSuccess(true)
          })
          .catch((error) => {
            this.checkInboxAccess = 'error'
            this.checkInboxAccessMessage =
              (error.response.data.validationMessages &&
                error.response.data.validationMessages[0]) ||
              error.response.data.message
            this.checkIfAllSuccess(false)
          })
        checkEmailBodyAccessEWS(payload)
          .then(() => {
            this.checkEmailBodyAccess = 'success'
            this.checkIfAllSuccess(true)
          })
          .catch((error) => {
            this.checkEmailBodyAccess = 'error'
            this.checkEmailBodyAccessMessage =
              (error.response.data.validationMessages &&
                error.response.data.validationMessages[0]) ||
              error.response.data.message
            this.checkIfAllSuccess(false)
          })
        checkEmailHeaderAccessEWS(payload)
          .then(() => {
            this.checkEmailHeaderAccess = 'success'
            this.checkIfAllSuccess(true)
          })
          .catch((error) => {
            this.checkEmailHeaderAccess = 'error'
            this.checkEmailHeaderAccessMessage =
              (error.response.data.validationMessages &&
                error.response.data.validationMessages[0]) ||
              error.response.data.message
            this.checkIfAllSuccess(false)
          })
          .finally(() => {
            checkEmailMailFilterEWS(payload)
              .then(() => {
                this.checkEmailMailFilter = 'success'
                this.checkIfAllSuccess(true)
              })
              .catch((error) => {
                this.checkEmailMailFilter = 'error'
                this.checkEmailMailFilterMessage =
                  (error.response.data.validationMessages &&
                    error.response.data.validationMessages[0]) ||
                  error.response.data.message
              })
          })
        checkInboxAccessEWS(payload)
          .then(() => {
            this.checkInboxAccess = 'success'
            this.checkIfAllSuccess(true)
          })
          .catch((error) => {
            this.checkInboxAccess = 'error'
            this.checkInboxAccessMessage =
              (error.response.data.validationMessages &&
                error.response.data.validationMessages[0]) ||
              error.response.data.message
            this.checkIfAllSuccess(false)
          })
      }
    },
    setLoadingStates() {
      this.checkApiConnectivity = 'loading'
      this.checkPrivileges = 'loading'
      this.checkInboxAccess = 'loading'
      this.checkEmailBodyAccess = 'loading'
      this.checkEmailHeaderAccess = 'loading'
      this.checkEmailMailFilter = 'loading'
    }
  }
}
</script>
