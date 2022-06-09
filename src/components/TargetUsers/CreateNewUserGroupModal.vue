<template>
  <app-dialog
    :status="status"
    size="big"
    :title="title"
    :subtitle="subTitle"
    class-name="new-user-group"
    icon="mdi-account-multiple-plus"
    ref="appDialog"
    title-id="text--create-target-users-group-popup-title"
    subtitle-id="text--create-target-users-group-popup-subtitle"
    @changeStatus="changeNewUserGroupStatus"
  >
    <template v-slot:app-dialog-body>
      <v-list-item class="new-user-group__list-item">
        <v-list-item-content>
          <v-list-item-title class="new-user-group__list-item-title">Group Name</v-list-item-title>
          <v-list-item-subtitle class="new-user-group__list-item-sub-title"
            >Enter a name for the new group</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="new-user-group__list-item mt-2">
        <v-list-item-content>
          <InputEntityName
            v-model.trim="groupName"
            id="input--target-group-name"
            entityName="user group"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="new-user-group__list-item" style="margin-top: -2px;">
        <v-list-item-content>
          <v-list-item-title class="new-user-group__list-item-title">Priority</v-list-item-title>
          <v-list-item-subtitle class="new-user-group__list-item-sub-title"
            >Select priority level for this group</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="new-user-group__list-item mt-n2">
        <v-list-item-content>
          <v-radio-group v-model="priority" id="input--target-group-priority" hide-details row>
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
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="new-user-group__footer">
        <v-btn
          id="btn-cancel--target-users-group-create-new-user-group-modal"
          class="new-user-group__button"
          color="#f56c6c"
          text
          @click="changeNewUserGroupStatus(false)"
          >{{ labels.Cancel }}</v-btn
        >
        <v-btn
          id="btn-save--target-users-group-create-new-user-group-modal"
          class="new-user-group__button mr-n4"
          @click="handleSave"
          color="#2196f3"
          text
          :disabled="isCreateButtonDisabled"
          >{{ labels.Save }}</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
import { maxLength, required } from '@/utils/validations'
import labels from '@/model/constants/labels'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'

export default {
  name: 'CreateNewUserGroupModal',
  components: {
    AppDialog,
    InputEntityName
  },
  data() {
    return {
      labels,
      groupName: '',
      priority: 'Medium',
      validations: {
        required,
        maxLength
      }
    }
  },
  props: {
    isCreateButtonDisabled: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Create New User Group'
    },
    subTitle: {
      type: String,
      default: 'Enter name and priority for the new group'
    }
  },
  methods: {
    handleSave() {
      if (this.$refs.appDialog.$refs.refDialogForm.validate()) {
        this.$emit('handleSave', {
          name: this.groupName,
          priority: this.priority
        })
      }
    },
    changeNewUserGroupStatus(status) {
      this.$emit('changeNewUserGroupStatus', status)
    }
  }
}
</script>
