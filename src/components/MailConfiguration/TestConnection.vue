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
    <div class="test-connection__testing-content" v-if="isLoading">
      <div class="test-connection__testing-content__item">
        <div class="test-connection__testing-content__item--label">Authenticating</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkAuth" />
        </div>
      </div>
      <div class="test-connection__testing-content__item">
        <div class="test-connection__testing-content__item--label">Getting user data</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkUser" />
        </div>
      </div>
      <div class="test-connection__testing-content__item">
        <div class="test-connection__testing-content__item--label">Getting mail folders</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkMailFolder" />
        </div>
      </div>
      <div class="test-connection__testing-content__item">
        <div class="test-connection__testing-content__item--label">Getting mail body</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkMailBody" />
        </div>
      </div>
      <div class="test-connection__testing-content__item">
        <div class="test-connection__testing-content__item--label">Getting mail header</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkMailHeader" />
        </div>
      </div>
      <div class="test-connection__testing-content__item">
        <div class="test-connection__testing-content__item--label">Getting mail with filter</div>
        <div class="test-connection__testing-content__item--value">
          <TestConnectivityStatus :state="checkFilter" />
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
  checkPrivileges,
  checkUpdateCategory
} from '../../api/mailConfiguration'
import TestConnectivityStatus from './TestConnectivityStatus'
export default {
  name: 'TestConnection',
  components: {
    TestConnectivityStatus
  },
  data() {
    return {
      checkAuth: null,
      checkUser: null,
      checkMailFolder: null,
      checkMailBody: null,
      checkMailHeader: null,
      checkFilter: null,
      loadingState: null
    }
  },
  computed: {
    isLoading() {
      let isLoading =
        this.checkAuth !== 'loading' &&
        this.checkUser !== 'loading' &&
        this.checkMailFolder !== 'loading' &&
        this.checkMailBody !== 'loading' &&
        this.checkMailHeader !== 'loading' &&
        this.checkFilter !== 'loading'
      return !isLoading
    }
  },
  methods: {
    testConnection() {
      this.setLoadingStates()
      checkApiConnectivity()
        .then((response) => {})
        .catch((error) => {})
      checkPrivileges()
        .then((response) => {})
        .catch((error) => {})
      checkAllUsersAccess()
        .then((response) => {})
        .catch((error) => {})
      checkEmailAccess()
        .then((response) => {})
        .catch((error) => {})
      checkCreateNewCategory()
        .then((response) => {})
        .catch((error) => {})
      checkUpdateCategory()
        .then((response) => {})
        .catch((error) => {})
      checkDeleteEmail()
        .then((response) => {})
        .catch((error) => {})
    },
    setLoadingStates() {
      this.checkAuth = 'loading'
      this.checkUser = 'loading'
      this.checkMailFolder = 'loading'
      this.checkMailBody = 'loading'
      this.checkMailHeader = 'loading'
      this.checkFilter = 'loading'
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
