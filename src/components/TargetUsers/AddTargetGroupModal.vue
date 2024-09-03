<template>
  <AppModal
    ref="refModal"
    :status="status"
    icon-name="mdi-account-multiple-plus"
    title="Create New User Group"
    title-id="text--add-or-edit-target-group-modal-title"
    :save-disable="isActionButtonDisabled"
    @closeOverlay="handleClose"
    @submit="handleSubmit"
  >
    <template #overlay-body>
      <AppModalBodyHeader
        title="Create New User Group"
        sub-title="Define new user group properties and add users to group"
      />
      <FormGroup has-hint title="Group Name" sub-title="Enter a name for the new group.">
        <InputEntityName
          v-model.trim="formData.name"
          id="input--target-group-name"
          entityName="user group"
        />
      </FormGroup>
      <FormGroup title="Priority" sub-title="Select priority level for this group">
        <v-radio-group
          v-model="formData.priority"
          id="input--target-group-priority"
          class="mt-0"
          hide-details
          row
        >
          <v-radio
            value="VeryLow"
            id="input--target-group-priority-very-low"
            label="Very Low"
            color="#2196f3"
          ></v-radio>
          <v-radio
            value="Low"
            id="input--target-group-priority-low"
            label="Low"
            color="#2196f3"
          ></v-radio>
          <v-radio
            value="Medium"
            id="input--target-group-priority-medium"
            label="Medium"
            color="#2196f3"
          ></v-radio>
          <v-radio
            value="High"
            id="input--target-group-priority-high"
            label="High"
            color="#2196f3"
          ></v-radio>
          <v-radio
            value="VeryHigh"
            id="input--target-group-priority-very-high"
            label="Very High"
            color="#2196f3"
          ></v-radio>
        </v-radio-group>
      </FormGroup>
      <FormGroup
        class-name="mt-6"
        title="Add Users To Group"
        sub-title="Select users and add them to your group"
      >
      </FormGroup>
      <TargetGroupUsersTable
        ref="refTargetGroupUsersTable"
        :has-row-actions="false"
        :has-add-button="false"
        :i-empty="iEmpty"
        resource-id="7Tna1kvZXAgX"
        exclude-group-users
        is-call-target-user-search
        @handleSelectionChange="handleSelectionChange"
      />
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal.vue'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader.vue'
import InputEntityName from '@/components/Common/Inputs/InputEntityName.vue'
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
import TargetGroupUsersTable from '@/components/TargetUsers/GroupUsers/TargetGroupUsersTable.vue'
import labels from '@/model/constants/labels'
import { bulkImportTargetUsersToGroups, createTargetGroup } from '@/api/targetUsers'

export default {
  name: 'AddTargetGroupModal',
  components: {
    TargetGroupUsersTable,
    FormGroup,
    InputEntityName,
    AppModalBodyHeader,
    AppModal
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        name: '',
        priority: 'Medium'
      },
      iEmpty: {
        message: labels.NoUsersToAdd
      },
      selectedUsers: [],
      excludedResourceIdList: [],
      isSelectedAllEver: false,
      payload: {
        selectAll: false,
        excludedResourceIdList: [],
        targetGroupResourceIds: [],
        targetUserResourceIds: []
      },
      isActionButtonDisabled: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('closeOverlay')
    },
    handleSelectionChange(
      selectedUsers = [],
      excludedResourceIdList = [],
      isSelectedAllEver = false
    ) {
      this.selectedUsers = selectedUsers.map((user) => user.resourceId)
      this.payload = {
        targetUserResourceIds: isSelectedAllEver ? [] : this.selectedUsers,
        selectAll: isSelectedAllEver,
        filter: this.$refs?.refTargetGroupUsersTable?.axiosPayload?.filter || {},
        excludedResourceIdList,
        targetGroupResourceIds: [this.resourceId]
      }
    },
    handleSubmit() {
      if (!this.$refs.refModal.$refs.refForm.validate()) return
      this.isActionButtonDisabled = true
      createTargetGroup({
        name: this.formData.name,
        priority: this.formData.priority
      })
        .then((response) => {
          const { resourceId } = response?.data?.data || {}
          if (!this.selectedUsers.length)
            return this.$router.push({
              name: 'Target Group Users',
              params: { id: resourceId, label: this.formData.name }
            })
          const serverSideParams = this.$refs?.refTargetGroupUsersTable?.$refs?.refTargetGroupUsersTable?.getServerSideSelectionParams() || {
            isSelectedAllEver: false,
            excludedResourceIdList: []
          }
          this.payload = {
            ...this.payload,
            selectAll: serverSideParams?.isSelectedAllEver || false,
            excludedResourceIdList: serverSideParams?.excludedResourceIdList || [],
            targetGroupResourceIds: [resourceId],
            targetUserResourceIds: serverSideParams?.isSelectedAllEver ? [] : this.selectedUsers
          }
          bulkImportTargetUsersToGroups(this.payload)
            .then(() => {
              this.$router.push({
                name: 'Target Group Users',
                params: { id: resourceId, label: this.formData.name }
              })
            })
            .finally(() => {
              this.isActionButtonDisabled = false
            })
        })
        .finally(() => {
          this.isActionButtonDisabled = false
        })
    }
  }
}
</script>
