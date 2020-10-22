<template>
  <div class="test-connection">
    <div
      :class="{
        'test-connection__disabled-text': isLoading
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
      <div class="test-connection__testing-content__item">
        <div class="test-connection__testing-content__item--label">Authenticating</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkApiConnectivity" />
        </div>
      </div>
      <div class="test-connection__testing-content__item">
        <div class="test-connection__testing-content__item--label">Checking permissions</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkPrivileges" />
        </div>
      </div>
      <div class="test-connection__testing-content__item">
        <div class="test-connection__testing-content__item--label">Fetching users</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkAllUsersAccess" />
        </div>
      </div>
      <div class="test-connection__testing-content__item">
        <div class="test-connection__testing-content__item--label">Fetching email body</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkEmailAccess" />
        </div>
      </div>
      <div class="test-connection__testing-content__item">
        <div class="test-connection__testing-content__item--label">
          Testing: Create a new category
        </div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkCreateNewCategory" />
        </div>
      </div>
      <div class="test-connection__testing-content__item">
        <div class="test-connection__testing-content__item--label">Testing: Update a category</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkUpdateCategory" />
        </div>
      </div>
      <div class="test-connection__testing-content__item">
        <div class="test-connection__testing-content__item--label">Testing: Delete an email</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkDeleteEmail" />
        </div>
      </div>
      <div class="test-connection__testing-content__item">
        <div class="test-connection__testing-content__item--label">Accessing user inbox</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkInboxAccess" />
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
      checkApiConnectivity: null,
      checkPrivileges: null,
      checkAllUsersAccess: null,
      checkEmailAccess: null,
      checkCreateNewCategory: null,
      checkUpdateCategory: null,
      loadingState: null,
      checkDeleteEmail: null,
      checkInboxAccess: null,
      isLoadingStarted: false
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
      return !isLoading
    }
  },
  methods: {
    testConnection() {
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
          })
          .catch((error) => {
            this.checkApiConnectivity = 'error'
          })
        checkPrivileges(payload)
          .then((response) => {
            this.checkPrivileges = 'success'
          })
          .catch((error) => {
            this.checkPrivileges = 'error'
          })
        checkAllUsersAccess(payload)
          .then((response) => {
            this.checkAllUsersAccess = 'success'
          })
          .catch((error) => {
            this.checkAllUsersAccess = 'error'
          })
        checkEmailAccess(payload)
          .then((response) => {
            this.checkEmailAccess = 'success'
          })
          .catch((error) => {
            this.checkEmailAccess = 'error'
          })
        checkCreateNewCategory(payload)
          .then((response) => {
            this.checkCreateNewCategory = 'success'
          })
          .catch((error) => {
            this.checkCreateNewCategory = 'error'
          })
          .finally((response) => {
            checkUpdateCategory(payload)
              .then((response) => {
                this.checkUpdateCategory = 'success'
              })
              .catch((error) => {
                this.checkUpdateCategory = 'error'
              })
          })
        checkDeleteEmail(payload)
          .then((response) => {
            this.checkDeleteEmail = 'success'
          })
          .catch((error) => {
            this.checkDeleteEmail = 'error'
          })
        checkInboxAccess(payload)
          .then((response) => {
            this.checkInboxAccess = 'success'
          })
          .catch((error) => {
            this.checkInboxAccess = 'error'
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
        margin-right: 5px;
      }
      &--value {
      }
    }
  }
}
</style>
