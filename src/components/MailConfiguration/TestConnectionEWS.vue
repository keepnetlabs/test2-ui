<template>
  <div class="test-connection">
    <div
      id="btn-test-connection--mail-configuration"
      :class="{
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
} from '../../api/mailConfiguration'
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
    }
  },
  methods: {
    isAllSuccess() {
      let isSuccess =
        this.checkApiConnectivity === 'success' &&
        this.checkPrivileges === 'success' &&
        this.checkInboxAccess === 'success' &&
        this.checkEmailBodyAccess === 'success' &&
        this.checkEmailHeaderAccess === 'success' &&
        this.checkEmailMailFilter === 'success'
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
          .then((response) => {
            this.checkApiConnectivity = 'success'
            this.isAllSuccess(true)
          })
          .catch((error) => {
            this.checkApiConnectivity = 'error'
            this.checkApiConnectivityMessage =
              (error.response.data.validationMessages &&
                error.response.data.validationMessages[0]) ||
              error.response.data.message
            this.isAllSuccess(false)
          })
        checkPrivilegesEWS(payload)
          .then((response) => {
            this.checkPrivileges = 'success'
            this.isAllSuccess(true)
          })
          .catch((error) => {
            this.checkPrivileges = 'error'
            this.checkPrivilegesMessage =
              (error.response.data.validationMessages &&
                error.response.data.validationMessages[0]) ||
              error.response.data.message
            this.isAllSuccess(false)
          })
        checkInboxAccessEWS(payload)
          .then((response) => {
            this.checkInboxAccess = 'success'
            this.isAllSuccess(true)
          })
          .catch((error) => {
            this.checkInboxAccess = 'error'
            this.checkInboxAccessMessage =
              (error.response.data.validationMessages &&
                error.response.data.validationMessages[0]) ||
              error.response.data.message
            this.isAllSuccess(false)
          })
        checkEmailBodyAccessEWS(payload)
          .then((response) => {
            this.checkEmailBodyAccess = 'success'
            this.isAllSuccess(true)
          })
          .catch((error) => {
            this.checkEmailBodyAccess = 'error'
            this.checkEmailBodyAccessMessage =
              (error.response.data.validationMessages &&
                error.response.data.validationMessages[0]) ||
              error.response.data.message
            this.isAllSuccess(false)
          })
        checkEmailHeaderAccessEWS(payload)
          .then((response) => {
            this.checkEmailHeaderAccess = 'success'
            this.isAllSuccess(true)
          })
          .catch((error) => {
            this.checkEmailHeaderAccess = 'error'
            this.checkEmailHeaderAccessMessage =
              (error.response.data.validationMessages &&
                error.response.data.validationMessages[0]) ||
              error.response.data.message
            this.isAllSuccess(false)
          })
          .finally((response) => {
            checkEmailMailFilterEWS(payload)
              .then((response) => {
                this.checkEmailMailFilter = 'success'
                this.isAllSuccess(true)
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
          .then((response) => {
            this.checkInboxAccess = 'success'
            this.isAllSuccess(true)
          })
          .catch((error) => {
            this.checkInboxAccess = 'error'
            this.checkInboxAccessMessage =
              (error.response.data.validationMessages &&
                error.response.data.validationMessages[0]) ||
              error.response.data.message
            this.isAllSuccess(false)
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

<style lang="scss">
.test-connection {
  &__button {
    width: 230px;
    height: 36px;
    border-radius: 18px;
    border: solid 1px #2196f3;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #2196f3;
    margin-bottom: 24px;
  }
  &__testing-content {
    &__item {
      display: flex;
      padding: 0 5px;
      margin-top: 2px;
      &--label {
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
        margin-right: 8px;
        min-width: 202px;
      }
    }
  }
}
</style>
