<template>
  <app-dialog
    :status="status"
    size="big"
    :title="title"
    :subtitle="subTitle"
    class-name="new-user-group"
    icon="mdi-account-multiple-plus"
    ref="appDialog"
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
          <v-text-field
            dense
            outlined
            placeholder="Enter user group name"
            v-model="groupName"
            :rules="[
              (v) => validations.required(v, 'Required'),
              (v) => validations.maxLength(v, 150, 'User group name cannot exceed 150 characters')
            ]"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="new-user-group__list-item mt-n2">
        <v-list-item-content>
          <v-list-item-title class="new-user-group__list-item-title">Priority</v-list-item-title>
          <v-list-item-subtitle class="new-user-group__list-item-sub-title"
            >Select priority level for this group</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="new-user-group__list-item mt-n2">
        <v-list-item-content>
          <v-radio-group v-model="priority" row>
            <v-radio value="VeryLow" label="Very Low" color="primary"></v-radio>
            <v-radio value="Low" label="Low" color="primary"></v-radio>
            <v-radio value="Medium" label="Medium" color="primary"></v-radio>
            <v-radio value="High" label="High" color="primary"></v-radio>
            <v-radio value="VeryHigh" label="Very High" color="primary"></v-radio>
          </v-radio-group>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="new-user-group__footer">
        <v-btn
          class="new-user-group__button"
          @click="changeNewUserGroupStatus(false)"
          color="#f56c6c"
          text
          >CANCEL</v-btn
        >
        <v-btn class="new-user-group__button mr-n4" @click="handleSave" color="#2196f3" text
          >SAVE</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
import { required, maxLength } from '@/utils/validations'

export default {
  name: 'CreateNewUserGroupModal',
  data() {
    return {
      groupName: '',
      priority: 'Medium',
      validations: {
        required,
        maxLength
      }
    }
  },
  props: {
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
  components: {
    AppDialog
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

<style lang="scss">
.new-user-group {
  &.v-dialog.v-dialog--active {
    overflow: auto !important;
  }
  &__footer {
    display: flex;
    justify-content: flex-end;
  }

  &__button {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
  }
  &__list-item {
    padding: 0 !important;
    .v-input--radio-group {
      width: 100%;
      &__input {
        display: flex;
        justify-content: space-between;
      }
    }
    &-title {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
    }

    &-sub-title {
      font-size: 14px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
    }
    .v-list-item__content {
      padding: 0;
      overflow: visible;
    }
  }
}
</style>
