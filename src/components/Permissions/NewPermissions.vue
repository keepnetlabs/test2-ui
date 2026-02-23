<template>
  <app-modal
    v-if="status"
    :status="status"
    :id="isEdit ? 'edit-permissions-modal' : 'new-permissions-modal'"
    confirm-button-id="btn-save--permissions-modal"
    cancel-button-id="btn-cancel--permissions-modal"
    title-id="text--new-permission-modal-title"
    icon-name="mdi-account-circle"
    class-name="new-permissions"
    :title="getTitle"
    :saveDisable="saveDisable"
    @closeOverlay="closeOverlay"
    @submit="submit"
  >
    <template #overlay-body>
      <app-modal-body-header
        title="Define New Role"
        sub-title="Create a user role by defining permissions. Expand module rows to set detailed authorizations. "
      />
      <v-form ref="refForm">
        <form-group title="Role Title" has-hint>
          <InputEntityName
            v-model.trim="formValues.name"
            id="input--permission-role-title"
            entity-name="Title"
          />
        </form-group>
        <form-group title="Description" has-hint>
          <InputDescription
            v-model.trim="formValues.description"
            id="input--permission-description"
            required
            initial-placeholder="Describe the role"
          />
        </form-group>
        <make-available-for
          ref="refMakeAvailableForNewPermissions"
          v-model="availableForRequests"
          class="mb-2"
          :key="availableForKey"
        />
        <form-group title="Privileges" has-hint>
          <v-text-field
            v-model="search"
            id="input--permission-privileges"
            outlined
            dense
            hide-details
            placeholder="Search for privileges"
            prepend-inner-icon="mdi-magnify"
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
            :key="treeViewKey"
            id="input--permission-description-list"
            item-key="permissionResourceId"
            selectable
            item-disabled="isDisabled"
            open-on-click
            :open.sync="open"
            :items="getPrivilegesItems"
          >
            <template v-slot:prepend="{ item }">
              <p v-if="getItemPermissionName(item)" class="new-permissions__permission-name">
                {{ getItemPermissionName(item) }}
              </p>
              {{ getItemSubName(item) }}
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
import { scrollToComponent, isDifferent, createRandomCryptStringNumber } from '@/utils/functions'
import { createPermissionRoles, updatePermissionRoles } from '@/api/permissions'
import labels from '@/model/constants/labels'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDescription from '@/components/Common/Inputs/InputDescription'
export default {
  name: 'NewPermissions',
  components: {
    InputDescription,
    InputEntityName,
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
      search: '',
      saveDisable: false,
      open: [],
      showNoData: false,
      treeViewKey: `scroll-key-${createRandomCryptStringNumber()}`,
      availableForRequests: [],
      initialFormValues: null,
      formValues: {
        name: null,
        description: null,
        permissionResourceIdList: []
      },
      validations: validations,
      caseSensitive: false,
      availableForKey: 'initialKey'
    }
  },
  computed: {
    getPrivilegesItems() {
      return this.search
        ? this.getSearchedItems(JSON.parse(JSON.stringify(this.permissions)))
        : this.permissions
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
    }
  },
  watch: {
    search(val) {
      if (!val.length) {
        this.$nextTick(() => {
          this.open = []
        })
      }
    },
    getPrivilegesItems(items) {
      items.forEach((item) => {
        this.open.push(item.permissionResourceId)
      })
      this.treeViewKey = `scroll-key-${createRandomCryptStringNumber()}`
    }
  },
  methods: {
    getItemPermissionName(item) {
      return item && item?.permissionDescription && item?.permissionName
    },
    getItemSubName(item) {
      item = item || {}
      return (
        item?.permissionDescription ||
        item?.parentGroupName ||
        item?.groupName ||
        item?.moduleName ||
        'No Name'
      )
    },
    getSearchedItems(items) {
      return items.reduce((acc, item) => {
        const { children } = item
        if (children) {
          item.children = this.getSearchedItems(children)
        }
        const { moduleName = '', groupName = '' } = item
        if (
          (moduleName && moduleName.toLowerCase().includes(this.search.toLowerCase())) ||
          (groupName && groupName.toLowerCase().includes(this.search.toLowerCase())) ||
          (item && item.children && item.children.length)
        ) {
          acc.push(item)
        }
        return acc
      }, [])
    },
    submit() {
      const { refForm, refMakeAvailableForNewPermissions } = this.$refs
      let isValid = true
      if (refMakeAvailableForNewPermissions) {
        refMakeAvailableForNewPermissions.validateAvailableFor(this.availableForRequests)
        isValid = refMakeAvailableForNewPermissions.isAvailableForValid
      }
      if (refForm.validate() && isValid) {
        this.saveDisable = true
        const payload = {
          Name: this.formValues.name,
          Description: this.formValues.description,
          AvailableForRequests: refMakeAvailableForNewPermissions.getAvailableForValues(
            this.availableForRequests
          ),
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
        .finally(() => {
          this.saveDisable = false
        })
    },
    closeOverlay() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (isChanged) {
        this.$store.dispatch('common/setIsShowLeavingDialog', {
          show: true,
          callback: () => {
            this.$emit('closeOverlay')
          }
        })
      } else {
        return this.$emit('closeOverlay')
      }
    }
  },
  mounted() {
    if (!this.isEdit) {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
    }
    if (this.isEdit && this.resourceId) {
      this.formValues = this.permissionEditData
      this.$nextTick(() => {
        if (
          this?.$refs?.refMakeAvailableForNewPermissions &&
          this.permissionEditData.availableForList.length
        ) {
          const availableForListFromBackend = this.$refs.refMakeAvailableForNewPermissions.getAvailableForListFromBackend(
            this.permissionEditData.availableForList
          )
          if (!availableForListFromBackend.length) {
            this.availableForRequests = [
              {
                id: 'MyCompanyOnly',
                label: 'My company only',
                type: 'MyCompanyOnly',
                resourceId: null
              }
            ]
          } else {
            this.availableForRequests = availableForListFromBackend
          }
        } else {
          this.availableForRequests = [
            {
              id: 'MyCompanyOnly',
              label: 'My company only',
              type: 'MyCompanyOnly',
              resourceId: null
            }
          ]
        }
        this.availableForKey = 'updatedKey'
      })
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
    }
  }
}
</script>
