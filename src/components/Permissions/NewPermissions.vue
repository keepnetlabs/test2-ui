<template>
  <app-modal
    v-if="status"
    :status="status"
    :id="isEdit ? 'edit-permissions-modal' : 'new-permissions-modal'"
    confirm-button-id="btn-save--permissions-modal"
    cancel-button-id="btn-cancel--permissions-modal"
    @closeOverlay="closeOverlay"
    @submit="submit"
    :title="getTitle"
    icon-name="mdi-mailbox"
    class-name="new-permissions"
    :saveDisable="saveDisable"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header
        title="Define New Role"
        sub-title="Create a user role by defining permissons. Expand module rows to set detailed authorizations. "
      />
      <v-form ref="refForm">
        <form-group :title="'Role Title'" has-hint>
          <v-text-field
            placeholder="Enter Title"
            outlined
            dense
            v-model.trim="formValues.name"
            hint="*Required"
            persistent-hint
            :rules="[
              (v) => validations.required(v),
              (v) => validations.startsWithSpace(v),
              (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Title))
            ]"
          ></v-text-field>
        </form-group>
        <form-group title="Description">
          <v-textarea
            outlined
            dense
            rows="2"
            no-resize
            placeholder="Describe the role"
            height="100"
            v-model.trim="formValues.description"
            hint="*Required"
            persistent-hint
            :rules="[
              (v) => validations.required(v),
              (v) => validations.startsWithSpace(v),
              (v) => validations.maxLength(v, 300, labels.getMaxLengthMessage(labels.Description))
            ]"
          ></v-textarea>
        </form-group>
        <make-available-for
          v-if="showMakeAvailableFor"
          ref="refMakeAvailableForNewPermissions"
          v-model="formValues.availableForRequests"
          class="mb-2"
          :key="availableForKey"
        />
        <form-group :title="'Privileges'" has-hint class-name="mt-8">
          <v-text-field
            placeholder="Search for privileges"
            outlined
            dense
            v-model="search"
          ></v-text-field>
        </form-group>
        <form-group class-name="max-width--780">
          <div class="new-permissions__treeview-title">
            <div>Permission</div>
            <div>Grant</div>
          </div>
        </form-group>
        <form-group class-name="max-width--780">
          <v-treeview
            v-model="formValues.permissionResourceIdList"
            :items="permissions"
            item-key="permissionResourceId"
            selectable
            :open.sync="open"
            item-disabled="editable"
            :search="search"
            :filter="filter"
            open-on-click
          >
            <template v-slot:prepend="{ item }">
              {{
                item.permissionDescription ||
                item.parentGroupName ||
                item.groupName ||
                item.moduleName ||
                'No Name'
              }}
            </template>
          </v-treeview>
        </form-group>
      </v-form>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import * as validations from '@/utils/validations'
import { scrollToComponent } from '@/utils/functions'
import { getPermissionAll, createPermissionRoles, updatePermissionRoles } from '@/api/permissions'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import { getAvailableForListFromBackend, getAvailableForValues } from '@/utils/helperFunctions'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import store from '@/store'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

export default {
  name: 'NewPermissions',
  components: {
    MakeAvailableFor,
    AppModal,
    AppModalBodyHeader,
    FormGroup
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    resourceId: {
      type: String
    },
    permissions: {
      required: false
    },
    permissionEditData: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      search: null,
      saveDisable: false,
      open: [],
      showNoData: false,
      formValues: {
        name: null,
        description: null,
        availableForRequests: [],
        permissionResourceIdList: []
      },
      validations: validations,
      caseSensitive: false,
      availableForKey: 'initialKey'
    }
  },
  computed: {
    filter() {
      return (item, search, textKey = '') => {
        if (item) {
          if (item.permissionDescription) {
            let text = item.permissionDescription.toLowerCase()
            return text.indexOf(search.toLowerCase()) > -1
          }
        }
      }
    },
    getTitle() {
      return this.isEdit && this.resourceId ? 'Edit System User Role' : 'New System User Role'
    },
    getUserNameAndPasswordCommonProps() {
      if (!this.formValues.useAuthentication) {
        return null
      }
      return { hint: '*Required', persistentHint: true }
    },
    getUserNameRules() {
      const rules = [
        (v) =>
          validations.maxLength(
            v,
            128,
            labels.getMaxLengthMessage(labels.UserNameOrEmailAddress, 320)
          )
      ]
      if (this.formValues.useAuthentication) rules.unshift((v) => validations.required(v))
      return rules
    },
    getPasswordRules() {
      const rules = [
        (v) => validations.maxLength(v, 128, labels.getMaxLengthMessage(labels.Password, 128))
      ]
      if (this.formValues.useAuthentication) rules.unshift((v) => validations.required(v))
      return rules
    },
    showMakeAvailableFor() {
      return this.$store.state.auth.userRoleName !== 'CompanyAdmin'
    }
  },
  methods: {
    submit() {
      const { refForm, refMakeAvailableForNewPermissions } = this.$refs
      let isValid = true
      if (refMakeAvailableForNewPermissions) {
        refMakeAvailableForNewPermissions.validateAvailableFor(this.formValues.availableForRequests)
        isValid = refMakeAvailableForNewPermissions.isAvailableForValid
      }
      if (refForm.validate() && isValid) {
        this.saveDisable = true
        const payload = {
          Name: this.formValues.name,
          Description: this.formValues.description,
          AvailableForRequests: this.formValues.availableForRequests.map((item) => {
            return { Type: item.type, ResourceId: item.id }
          }),
          PermissionResourceIdList: this.formValues.permissionResourceIdList
        }
        if (this.isEdit) {
          this.updatePermissionRoles(payload)
        } else {
          this.createPermissionRoles(payload)
        }
      } else {
        return this.$nextTick(() => {
          this.saveDisable = false
          const el = refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
    },
    updatePermissionRoles(payload) {
      updatePermissionRoles(payload, this.resourceId)
        .then(() => {
          this.$emit('closeOverlayWithUpdate')
        })
        .finally(() => {
          this.saveDisable = false
        })
    },
    createPermissionRoles(payload) {
      createPermissionRoles(payload)
        .then(() => {
          this.$emit('closeOverlayWithUpdate')
        })
        .catch((error) => {
          this.$store.dispatch(
            'common/createSnackBar',
            {
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              message:
                (error.response.data &&
                  error.response.data.validationMessages &&
                  error.response.data.validationMessages[0]) ||
                error.response.data.message ||
                error.response.data.Message,
              icon: 'mdi-alert'
            },
            { root: true }
          )
        })
        .finally(() => {
          this.saveDisable = false
        })
    },
    closeOverlay() {
      this.$emit('closeOverlay')
    }
  },
  mounted() {
    if (this.isEdit && this.resourceId) {
      this.formValues = this.permissionEditData
      let _this = this
      this.$nextTick(() => {
        _this.formValues.availableForRequests = _this.$refs.refMakeAvailableForNewPermissions.getAvailableForListFromBackend(
          _this.permissionEditData.availableForList
        )
        this.availableForKey = 'updatedKey'
      })
    }
  }
}
</script>

<style lang="scss">
.new-permissions {
  &__treeview-title {
    display: flex;
    justify-content: space-between;
    padding: 0px 30px;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 8px;
  }
  .v-treeview-node__checkbox {
    position: absolute;
    right: 40px !important;
  }
  .v-treeview-node__content {
    margin-left: 0;
    max-width: 70%;
  }
  .v-treeview-node__root {
    border-bottom: 1px solid #f2f2f2;
    font-size: 18px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }
  .v-treeview-node--leaf {
    .v-treeview-node__content {
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      position: relative;
      &:after {
        content: '';
        background-color: #e0e0e0;
        height: 8px;
        width: 8px;
        position: absolute;
        left: -16px;
        border-radius: 36px;
        top: 7px;
      }
    }
  }
}
</style>
