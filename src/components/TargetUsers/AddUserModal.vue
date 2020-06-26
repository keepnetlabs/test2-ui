<template>
  <app-modal
    :status="status"
    @closeOverlay="status = false"
    icon-name="mdi-account-plus"
    title="Add New User"
    className="add-user-overlay"
  >
    <template v-slot:overlay-body>
      <v-list-item class="add-user-overlay__list-item mt-8">
        <v-list-item-content>
          <v-list-item-title class="add-user-overlay__main-title">
            Add New User Manually
          </v-list-item-title>
          <v-list-item-subtitle class="add-user-overlay__main-sub-title"
            >Define user properties
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        class="add-user-overlay__list-item mt-6"
        :class="[!hasFirstNameError && !formValues.firstName ? 'mb-2' : '']"
      >
        <v-list-item-content>
          <label class="add-user-overlay__label" for="firstName">First Name</label>
          <v-text-field
            placeholder="Enter first name"
            outlined
            dense
            v-model="formValues.firstName"
            :rules="[(v) => validations.required(v, 'Required')]"
            id="firstName"
            @blur="hasFirstNameError = true"
            height="40"
          ></v-text-field>
          <div
            v-if="!hasFirstNameError && !formValues.firstName"
            class="email-settings__required__text"
          >
            *Required
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        class="add-user-overlay__list-item"
        :class="[!hasLastNameError && !formValues.lastName ? 'mb-2' : '']"
      >
        <v-list-item-content>
          <label class="add-user-overlay__label" for="lastName">Last Name</label>
          <v-text-field
            placeholder="Enter last name"
            outlined
            dense
            v-model="formValues.lastName"
            :rules="[(v) => validations.required(v, 'Required')]"
            id="lastName"
            height="40"
            @blur="hasLastNameError = true"
          ></v-text-field>
          <div
            v-if="!hasLastNameError && !formValues.lastName"
            class="email-settings__required__text"
          >
            *Required
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        class="add-user-overlay__list-item"
        :class="[!hasEmailError && !formValues.email ? 'mb-2' : '']"
      >
        <v-list-item-content>
          <label class="add-user-overlay__label" for="email">Email</label>
          <v-text-field
            placeholder="Enter email address"
            outlined
            dense
            v-model="formValues.email"
            :rules="[
              (v) => validations.required(v, 'Required'),
              (v) => validations.mail(v, 'Invalid email address')
            ]"
            id="email"
            height="40"
            @blur="hasEmailError = true"
          ></v-text-field>
          <div v-if="!hasEmailError && !formValues.email" class="email-settings__required__text">
            *Required
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="add-user-overlay__list-item">
        <v-list-item-content>
          <label class="add-user-overlay__label" for="department">Department</label>
          <v-text-field
            placeholder="Enter department name"
            outlined
            dense
            v-model="formValues.department"
            id="department"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="add-user-overlay__list-item">
        <v-list-item-content>
          <label class="add-user-overlay__label" for="priority">Priority</label>
          <v-select
            :items="priorityItems"
            outlined
            dense
            v-model="formValues.priority"
            id="department"
            height="40"
          ></v-select>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="add-user-overlay__list-item">
        <v-list-item-content>
          <label class="add-user-overlay__label" for="addUserGroup">Add To User Groups</label>
          <v-autocomplete
            placeholder="Type to search user groups"
            outlined
            dense
            chips
            multiple
            deletable-chips
            :items="autoCompleteItems"
            v-model="formValues.addToUserGroups"
            id="addUserGroup"
            item-text="name"
            item-value="resourceId"
          ></v-autocomplete>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="add-user-overlay__list-item">
        <v-list-item-content>
          <label class="add-user-overlay__label" for="isActive">Active</label>
          <v-switch
            id="isActive"
            v-model="formValues.isActive"
            color="#2196f3"
            :label="formValues.isActive ? 'Yes' : 'No'"
          />
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-slot:overlay-footer>
      <v-btn class="add-user-overlay__footer-btn-cancel" rounded @click="closeOverlay">
        CANCEL
      </v-btn>
      <v-btn
        class="add-user-overlay__footer-btn-save white--text"
        color="#2196f3"
        rounded
        @click="submit"
      >
        SAVE
      </v-btn>
    </template>
  </app-modal>
</template>

<script>
import { required, mail } from '../../utils/validations'
import { createTargetUser, getTargetGroups } from '../../api/targetUsers'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import AppModal from '../AppModal'
export default {
  name: 'AddUserModal',
  components: { AppModal },
  props: {
    status: {
      type: Boolean
    }
  },
  data() {
    return {
      formValues: {
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        priority: 'Medium',
        addToUserGroups: [],
        isActive: true
      },
      autoCompleteItems: [],
      priorityItems: ['VeryLow', 'Low', 'Medium', 'High', 'VeryHigh'],
      validations: {
        required,
        mail
      },
      hasFirstNameError: false,
      hasLastNameError: false,
      hasEmailError: false
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeAddUserModal')
    },
    submit() {
      this.callForCreateTargetUser()
    },
    callForCreateTargetUser() {
      const payload = {
        ...this.formValues
      }

      createTargetUser(payload)
        .then(({ data }) => {
          if (data.status === 'FAILED') {
            this.$store.dispatch('common/createSnackBar', {
              message: data.message,
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR
            })
          } else {
            this.$store.dispatch('common/createSnackBar', {
              message: '1 user added to Users List ',
              icon: 'mdi-check-circle',
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR
            })
          }
          this.$emit('closeAddUserModal')
        })
        .catch((error) => {})
    },
    callForTargetGroups() {
      getTargetGroups().then((response) => {
        const { data } = response.data
        this.autoCompleteItems = data
      })
    }
  },
  created() {
    /*
    this.callForTargetGroups()
     */
  }
}
</script>

<style lang="scss">
.add-user-overlay {
  .v-overlay__content {
    width: 100%;
    height: 100%;
    background-color: white;
    position: fixed;
    left: 0;
    top: 0;
    overflow-y: auto;
    padding-bottom: 68px !important;
  }

  &__list-item {
    padding: 0 !important;
    margin-top: -4px;
    .v-list-item__content {
      padding: 0;
      max-width: 554px;
      overflow: visible;
    }
  }

  &__container {
    padding: 32px 96px 0 96px;
    box-shadow: none;
  }

  &__footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #f5f7fa;
    padding: 16px 96px !important;
    display: flex;
    justify-content: space-between;
    z-index: 9;

    &-btn-cancel {
      color: #f56c6c !important;
      border: 1px solid #f56c6c !important;
      box-shadow: none !important;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      width: 86px;
      height: 36px !important;
    }

    &-btn-save {
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
      width: 72px;
      height: 36px !important;
      border-radius: 18px;
      background-color: #2196f3;
    }
  }

  &__main-title {
    font-size: 24px;
    font-weight: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__main-sub-title {
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  &__label {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: normal;
    margin-bottom: 8px !important;
    color: rgba(0, 0, 0, 0.87) !important;
  }
  .v-input--switch {
    margin-top: 0;
    label {
      font-size: 16px;
      font-weight: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
      margin-left: 8px;
    }
    .v-messages {
      display: none;
    }
  }
}
</style>
