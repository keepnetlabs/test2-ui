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
import TestConnectivityStatus from '@/components/MailConfiguration/TestConnectivityStatus'
import {
  checkAllUsersAccessGoogleWorkspace,
  checkApiConnectivityGoogleWorkspace,
  checkCreateNewCategoryGoogleWorkspace,
  checkDeleteEmailGoogleWorkspace,
  checkEmailAccessGoogleWorkspace,
  checkInboxAccessGoogleWorkspace,
  checkPrivilegesGoogleWorkspace,
  checkUpdateCategoryGoogleWorkspace
} from '@/api/mailConfiguration'
export default {
  name: 'TestConnectionGoogleWorkspace',
  components: { TestConnectivityStatus },
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
    },
    isAllSuccess() {
      return (
        this.checkApiConnectivity === 'success' &&
        this.checkPrivileges === 'success' &&
        this.checkAllUsersAccess === 'success' &&
        this.checkEmailAccess === 'success' &&
        this.checkCreateNewCategory === 'success' &&
        this.checkUpdateCategory === 'success' &&
        this.checkDeleteEmail === 'success' &&
        this.checkInboxAccess === 'success'
      )
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
      if (!this.isValidate()) return
      this.isLoadingStarted = true
      this.setLoadingStates()
      let payload = {
        CredentialJson: this.values.authJson,
        Email: this.values.email,
        ResourceId: null
      }
      if (this.isEdit) {
        payload.ResourceId = this.isEdit.resourceId
      }
      checkApiConnectivityGoogleWorkspace(payload)
        .then(() => {
          this.checkApiConnectivity = 'success'
          this.checkIfAllSuccess(true)
        })
        .catch((error) => {
          this.checkApiConnectivity = 'error'
          this.checkApiConnectivityMessage = this.getAxiosErrorMessage(error)
          this.checkIfAllSuccess(false)
        })
      checkPrivilegesGoogleWorkspace(payload)
        .then(() => {
          this.checkPrivileges = 'success'
          this.checkIfAllSuccess(true)
        })
        .catch((error) => {
          this.checkPrivileges = 'error'
          this.checkPrivilegesMessage = this.getAxiosErrorMessage(error)
          this.checkIfAllSuccess(false)
        })
      checkAllUsersAccessGoogleWorkspace(payload)
        .then(() => {
          this.checkAllUsersAccess = 'success'
          this.checkIfAllSuccess(true)
        })
        .catch((error) => {
          this.checkAllUsersAccess = 'error'
          this.checkAllUsersAccessMessage = this.getAxiosErrorMessage(error)
          this.checkIfAllSuccess(false)
        })
      checkEmailAccessGoogleWorkspace(payload)
        .then(() => {
          this.checkEmailAccess = 'success'
          this.checkIfAllSuccess(true)
        })
        .catch((error) => {
          this.checkEmailAccess = 'error'
          this.checkEmailAccessMessage = this.getAxiosErrorMessage(error)
          this.checkIfAllSuccess(false)
        })
      checkCreateNewCategoryGoogleWorkspace(payload)
        .then(() => {
          this.checkCreateNewCategory = 'success'
          this.checkIfAllSuccess(true)
        })
        .catch((error) => {
          this.checkCreateNewCategory = 'error'
          this.checkCreateNewCategoryMessage = this.getAxiosErrorMessage(error)
          this.checkIfAllSuccess(false)
        })
        .finally(() => {
          checkUpdateCategoryGoogleWorkspace(payload)
            .then(() => {
              this.checkUpdateCategory = 'success'
              this.checkIfAllSuccess(true)
            })
            .catch((error) => {
              this.checkUpdateCategory = 'error'
              this.checkUpdateCategoryMessage = this.getAxiosErrorMessage(error)
            })
        })
      checkDeleteEmailGoogleWorkspace(payload)
        .then(() => {
          this.checkDeleteEmail = 'success'
          this.checkIfAllSuccess(true)
        })
        .catch((error) => {
          this.checkDeleteEmail = 'error'
          this.checkDeleteEmailMessage = this.getAxiosErrorMessage(error)
          this.checkIfAllSuccess(false)
        })
      checkInboxAccessGoogleWorkspace(payload)
        .then(() => {
          this.checkInboxAccess = 'success'
          this.checkIfAllSuccess(true)
        })
        .catch((error) => {
          this.checkInboxAccess = 'error'
          this.checkInboxAccessMessage = this.getAxiosErrorMessage(error)
          this.checkIfAllSuccess(false)
        })
    },
    getAxiosErrorMessage(error) {
      return (
        (error?.response?.data?.validationMessages &&
          error?.response?.data?.validationMessages[0]) ||
        error?.response?.data?.message
      )
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
