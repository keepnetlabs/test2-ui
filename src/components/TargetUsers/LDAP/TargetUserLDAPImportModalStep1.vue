<template>
  <Fragment>
    <CreateNewUserGroupModal
      v-if="isTargetGroupModalVisible"
      :status="isTargetGroupModalVisible"
      :is-create-button-disabled="isCreateTargetGroupButtonDisabled"
      @changeNewUserGroupStatus="handleCloseTargetGroupModal"
      @handleSave="handleConfirmTargetGroupModal"
    />
    <v-form ref="refForm">
      <KButtonRadioGroup
        v-model="selectedRadioGroupIndex"
        class="mb-8"
        :items="radioGroupItems"
        @on-item-click="handleRadioGroupItemClick"
      />
      <FormGroup
        v-if="selectedRadioGroupIndex === 1"
        class-name="w-100 max-w-100 ldap-import-table"
        :title="labels.LDAPGroups"
        :sub-title="labels.LDAPGroupsSub"
      >
        <TargetUserLDAPImportTable
          ref="refImportTable"
          :style="getLDAPTargetUserTableStyle"
          @on-selection-change="handleTableSelectionChange"
        />
        <CustomError
          class="mb-6 ml-2"
          style="margin-top: 2px;"
          :is-valid="isLDAPGroupsValid"
          :error-message="getLDAPGroupsErrorMessage"
        />
      </FormGroup>
      <FormGroup :title="labels.SelectTargetGroup" :sub-title="labels.SelectTargetGroupSub">
        <KSelect
          v-model.trim="targetGroupResourceId"
          ref="refTargetGroupSelect"
          type="autocomplete"
          id="input--target-user-groups-ldap"
          custom-menu-class="target-user-ldap__target-groups"
          outlined
          clearable
          autocomplete="off"
          placeholder="- All Users -"
          no-data-text="No user group available"
          :position="selectedRadioGroupIndex === 0 ? 'bottom' : 'top'"
          :items="targetGroupItems"
          :disabled="isEdit"
          :slots="{ item: true, prependItem: true }"
        >
          <template #prependItem>
            <v-list-item ripple @mousedown.prevent @click="handleCreateGroup">
              <v-list-item-action>
                <v-icon color="#757575">
                  mdi-plus
                </v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  <span style="font-weight: 600;">Create new group</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <template #item="{ item }">
            <v-tooltip v-if="item.disabled" bottom>
              <template #activator="{on}">
                <span v-on="on">
                  {{ item.text }}
                </span>
              </template>
              <span>This user group is already synced with LDAP</span>
            </v-tooltip>
            <span v-else>
              {{ item.text }}
            </span>
          </template>
        </KSelect>
      </FormGroup>
      <FormGroup v-if="isEdit" :title="labels.Status" class="mb-6">
        <v-switch
          v-model.trim="isActive"
          id="input--switch-ldap"
          class="k-switch mt-0"
          hide-details
          color="#2196f3"
          style="max-width: 100px;"
          :label="getSwitchLabel"
        />
      </FormGroup>
    </v-form>
  </Fragment>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import TargetUserLDAPImportTable from '@/components/TargetUsers/LDAP/TargetUserLDAPImportTable'
import CustomError from '@/components/CustomError'
import labels from '@/model/constants/labels'
import LDAPService from '@/api/ldap'
import KSelect from '@/components/Common/Inputs/KSelect'
import * as Validations from '@/utils/validations'
import KButtonRadioGroup from '@/components/ButtonRadioGroup/KButtonRadioGroup'
import CreateNewUserGroupModal from '@/components/TargetUsers/CreateNewUserGroupModal'
import { Fragment } from 'vue-frag'
import { createTargetGroup } from '@/api/targetUsers'

export default {
  name: 'TargetUserLDAPImportModalStep1',
  components: {
    KButtonRadioGroup,
    KSelect,
    CustomError,
    TargetUserLDAPImportTable,
    FormGroup,
    Fragment,
    CreateNewUserGroupModal
  },
  props: {
    selectedLDAPItems: {
      type: Array,
      default: () => []
    },
    isLDAPGroupsValid: {
      type: Boolean
    },
    step1TargetGroupResourceId: {
      type: String,
      default: ''
    },
    step1Step: {
      type: Number
    }
  },
  inject: {
    isEdit: {
      type: Boolean,
      default: false
    },
    getServerSideSelectionParams: {
      type: Function
    },
    handleServerSideSelectionParams: {
      type: Function
    }
  },
  data() {
    return {
      isTargetGroupModalVisible: false,
      isCreateTargetGroupButtonDisabled: false,
      labels,
      Validations,
      isActive: true,
      targetGroupItems: [],
      targetGroupResourceId: '',
      selectedRadioGroupIndex: 0,
      radioGroupItems: [
        {
          label: 'ENTIRE LDAP',
          infoText: 'Select this option to sync all users in your active directory.'
        },
        {
          label: 'SELECT LDAP GROUPS',
          infoText: 'Select this option to sync users in certain LDAP groups.'
        }
      ]
    }
  },
  computed: {
    getLDAPGroupsErrorMessage() {
      return this?.selectedLDAPItems?.length ? '' : 'Required'
    },
    getSwitchLabel() {
      return this.isActive ? labels.Active : labels.Passive
    },
    getLDAPTargetUserTableStyle() {
      return this.isLDAPGroupsValid
        ? {}
        : {
            border: '1px solid rgb(255, 82, 82) !important',
            borderRadius: '12px !important'
          }
    }
  },
  watch: {
    targetGroupResourceId(newValue) {
      this.$emit('update:step1TargetGroupResourceId', newValue)
    },
    selectedRadioGroupIndex(newValue) {
      this.$emit('update:step1Step', newValue)
    }
  },
  created() {
    this.callForTargetGroups()
  },
  methods: {
    handleCreateGroup() {
      this.isTargetGroupModalVisible = true
      if (this.$refs?.refTargetGroupSelect?.$refs?.refComponent)
        this.$refs.refTargetGroupSelect.$refs.refComponent.isMenuActive = false
    },
    handleCloseTargetGroupModal() {
      this.isTargetGroupModalVisible = false
    },
    handleConfirmTargetGroupModal(group) {
      this.isCreateTargetGroupButtonDisabled = true
      createTargetGroup(group)
        .then((response) => {
          this.isTargetGroupModalVisible = false
          this.targetGroupItems.unshift({
            text: group.name,
            value: response.data.data.resourceId
          })
          this.targetGroupResourceId = response.data.data.resourceId
        })
        .finally(() => (this.isCreateTargetGroupButtonDisabled = false))
    },
    callForTargetGroups() {
      LDAPService.getTargetGroupsForLDAP().then((response) => {
        const {
          data: { data }
        } = response
        this.targetGroupItems = data.map((item) => ({
          text: item.name,
          value: item.resourceId,
          disabled: !item.isSelectable,
          attrs: {
            usedLdapName: item.message
          }
        }))
      })
    },
    validateForm() {
      const serverSideSelectionParams = this.getServerSideSelectionParams()
      let comparator = true
      if (this.selectedRadioGroupIndex === 1 && !serverSideSelectionParams?.isSelectedAllEver)
        comparator = this.selectedLDAPItems.length
      return this?.$refs?.refForm?.validate() && comparator
    },
    handleTableSelectionChange(selectedLDAPItems) {
      if (selectedLDAPItems.length) this.$emit('update:isLDAPGroupsValid', true)
      else this.$emit('update:isLDAPGroupsValid', false)
      this.$emit('update:selectedLDAPItems', selectedLDAPItems)
    },
    handleRadioGroupItemClick(item) {
      if (item.label === this.radioGroupItems[0].label) {
        this.handleTableSelectionChange([])
        this.$emit('update:isLDAPGroupsValid', true)
        this.handleServerSideSelectionParams({
          isSelectedAllEver: false,
          excludedResourceIdList: []
        })
      }
    }
  }
}
</script>
