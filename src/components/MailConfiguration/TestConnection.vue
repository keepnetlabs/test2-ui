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
          <TestConnectivityStatus
            :state="checkAllUsersAccess"
            :message="checkAllUsersAccessMessage"
          />
        </div>
      </div>
      <div
        class="test-connection__testing-content__item"
        id="test-connection-item-fetching-email-body"
      >
        <div class="test-connection__testing-content__item--label">Fetching email body</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkEmailAccess" :message="checkEmailAccessMessage" />
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
            :state="checkCreateNewCategory"
            :message="checkCreateNewCategoryMessage"
          />
        </div>
      </div>
      <div class="test-connection__testing-content__item" id="test-connection-item-update-category">
        <div class="test-connection__testing-content__item--label">Testing: Update a category</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus
            :state="checkUpdateCategory"
            :message="checkUpdateCategoryMessage"
          />
        </div>
      </div>
      <div class="test-connection__testing-content__item" id="test-connection-item-deleting-email">
        <div class="test-connection__testing-content__item--label">Testing: Delete an email</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkDeleteEmail" :message="checkInboxAccessMessage" />
        </div>
      </div>
      <div
        class="test-connection__testing-content__item"
        id="test-connection-item-accessing-user-inbox"
      >
        <div class="test-connection__testing-content__item--label">Accessing user inbox</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkInboxAccess" :message="checkInboxAccessMessage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  checkAllUsersAccess,
  checkApiConnectivity,
  checkCreateNewCategory,
  checkDeleteEmail,
  checkEmailAccess,
  checkInboxAccess,
  checkPrivileges,
  checkUpdateCategory
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
      checkApiConnectivity: null,
      checkPrivileges: null,
      checkAllUsersAccess: null,
      checkEmailAccess: null,
      checkCreateNewCategory: null,
      checkUpdateCategory: null,
      loadingState: null,
      checkDeleteEmail: null,
      checkInboxAccess: null,
      isLoadingStarted: false,
      checkApiConnectivityMessage: null,
      checkPrivilegesMessage: null,
      checkAllUsersAccessMessage: null,
      checkEmailAccessMessage: null,
      checkCreateNewCategoryMessage: null,
      checkUpdateCategoryMessage: null,
      checkDeleteEmailMessage: null,
      checkInboxAccessMessage: null
    }
  },
  computed: {
    isLoading() {
      let isLoading =
        this.checkApiConnectivity !== 'loading' &&
        this.checkPrivileges !== 'loading' &&
        this.checkAllUsersAccess !== 'loading' &&
        this.checkEmailAccess !== 'loading' &&
        this.checkCreateNewCategory !== 'loading' &&
        this.checkUpdateCategory !== 'loading' &&
        this.checkDeleteEmail !== 'loading' &&
        this.checkInboxAccess !== 'loading'
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
        this.checkAllUsersAccess === 'success' &&
        this.checkEmailAccess === 'success' &&
        this.checkCreateNewCategory === 'success' &&
        this.checkUpdateCategory === 'success' &&
        this.checkDeleteEmail === 'success' &&
        this.checkInboxAccess === 'success'
      this.$emit('testConnectionValues', isSuccess, this.isSave)
      return isSuccess
    },
    testConnection(isSave) {
      this.isSave = isSave
      if (this.isValidate()) {
        this.isLoadingStarted = true
        this.setLoadingStates()
        let payload = {
          applicationId: this.values.applicationId,
          applicationSecret: this.values.applicationSecret,
          directoryId: this.values.directoryId,
          email: this.values.email
        }
        if (this.isEdit) {
          payload.resourceId = this.isEdit.resourceId
        }
        checkApiConnectivity(payload)
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
        checkPrivileges(payload)
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
        checkAllUsersAccess(payload)
          .then((response) => {
            this.checkAllUsersAccess = 'success'
            this.isAllSuccess(true)
          })
          .catch((error) => {
            this.checkAllUsersAccess = 'error'
            this.checkAllUsersAccessMessage =
              (error.response.data.validationMessages &&
                error.response.data.validationMessages[0]) ||
              error.response.data.message
            this.isAllSuccess(false)
          })
        checkEmailAccess(payload)
          .then((response) => {
            this.checkEmailAccess = 'success'
            this.isAllSuccess(true)
          })
          .catch((error) => {
            this.checkEmailAccess = 'error'
            this.checkEmailAccessMessage =
              (error.response.data.validationMessages &&
                error.response.data.validationMessages[0]) ||
              error.response.data.message
            this.isAllSuccess(false)
          })
        checkCreateNewCategory(payload)
          .then((response) => {
            this.checkCreateNewCategory = 'success'
            this.isAllSuccess(true)
          })
          .catch((error) => {
            this.checkCreateNewCategory = 'error'
            this.checkCreateNewCategoryMessage =
              (error.response.data.validationMessages &&
                error.response.data.validationMessages[0]) ||
              error.response.data.message
            this.isAllSuccess(false)
          })
          .finally((response) => {
            checkUpdateCategory(payload)
              .then((response) => {
                this.checkUpdateCategory = 'success'
                this.isAllSuccess(true)
              })
              .catch((error) => {
                this.checkUpdateCategory = 'error'
                this.checkUpdateCategoryMessage =
                  (error.response.data.validationMessages &&
                    error.response.data.validationMessages[0]) ||
                  error.response.data.message
              })
          })
        checkDeleteEmail(payload)
          .then((response) => {
            this.checkDeleteEmail = 'success'
            this.isAllSuccess(true)
          })
          .catch((error) => {
            this.checkDeleteEmail = 'error'
            this.checkDeleteEmailMessage =
              (error.response.data.validationMessages &&
                error.response.data.validationMessages[0]) ||
              error.response.data.message
            this.isAllSuccess(false)
          })
        checkInboxAccess(payload)
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
      this.checkAllUsersAccess = 'loading'
      this.checkEmailAccess = 'loading'
      this.checkCreateNewCategory = 'loading'
      this.checkUpdateCategory = 'loading'
      this.checkDeleteEmail = 'loading'
      this.checkInboxAccess = 'loading'
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
