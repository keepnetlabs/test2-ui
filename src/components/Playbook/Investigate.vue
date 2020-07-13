<template>
  <div>
    <v-row align="center">
      <v-col md="5">
        <v-list-item class="py-0">
          <v-list-item-content class="py-0">
            <label>Target users</label>
            <v-list-item-title class="v-card-sub-header bottom-margin">
              Select departments, groups or users to investigate
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="5">
        <div class="target-users-select__radio-group">
          <v-radio-group
            v-model="targetUserType"
            :mandatory="false"
            @change="targetUsersValue = []"
            row
          >
            <v-radio value="AllUsers" label="All Users" color="primary"></v-radio>
            <v-radio value="Groups" label="User Groups" color="primary"></v-radio>
            <v-radio value="SpecificUsers" label="Specific Users" color="primary"></v-radio>
          </v-radio-group>
        </div>
        <div class="target-users-select__input-area">
          <v-combobox
            :items="[]"
            :placeholder="targetUserType == 'AllUsers' ? 'All Users' : 'Select user groups'"
            outlined
            class="edit-select standard-height"
            item-text="name"
            multiple
            dense
            persistent-hint
            small-chips
            :return-object="false"
            v-if="targetUserType == 'AllUsers'"
            :disabled="targetUserType == 'AllUsers'"
            required
          ></v-combobox>
          <v-combobox
            :items="targetUsersList"
            :placeholder="targetUserType == 'AllUsers' ? 'All Users' : 'Select user groups'"
            outlined
            class="edit-select target-users-select-multi"
            v-model="targetUsersValue"
            :rules="[(v) => validations.required(v, 'Required')]"
            item-text="name"
            multiple
            dense
            persistent-hint
            small-chips
            :return-object="true"
            v-if="targetUserType == 'Groups'"
            required
          ></v-combobox>
          <v-combobox
            :items="[]"
            v-if="targetUserType == 'SpecificUsers'"
            placeholder="Enter Email Addresses"
            item-text="name"
            multiple
            dense
            :rules="[(v) => validations.required(v, 'Required')]"
            persistent-hint
            small-chips
            :return-object="false"
            required
            outlined
            class="edit-name-textfield edit-select target-users-select__specific-user-input target-users-select-multi"
            v-model="targetUsersValue"
          ></v-combobox>
        </div>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col md="5">
        <v-list-item class="py-0">
          <v-list-item-content class="py-0">
            <label>Filters</label>
            <v-list-item-title class="v-card-sub-header bottom-margin">
              Select attributes of the email to investigate
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="5">
        <v-select
          v-model="investigationFilter"
          :items="act.investigateFilters"
          outlined
          hide-details
          multiple
        />
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col md="5">
        <v-list-item class="py-0">
          <v-list-item-content class="py-0">
            <label>Email Date Range</label>
            <v-list-item-title class="v-card-sub-header bottom-margin">
              Select range of emails sending date according to reporting date
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="5">
        <v-select
          v-model="investigationRange"
          :items="act.investigateRanges"
          outlined
          hide-details
        />
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col md="5">
        <v-list-item class="py-0">
          <v-list-item-content class="py-0">
            <label>Duration</label>
            <v-list-item-title class="v-card-sub-header bottom-margin">
              Select how many days the investigation will run
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="5">
        <v-select
          v-model="investigationDuration"
          :items="act.investigateDurations"
          outlined
          hide-details
        />
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col md="5">
        <v-list-item class="py-0">
          <v-list-item-content class="py-0">
            <label>Actions</label>
            <v-list-item-title class="v-card-sub-header bottom-margin">
              Select action to be executed if email is found
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col md="7">
        <v-row>
          <v-col>
            <v-select
              v-model="investigateAction"
              :items="act.investigateActions"
              outlined
              hide-details
            />
          </v-col>
          <v-col v-if="investigateAction == 'Notify users'">
            <v-select
              v-model="investigateActionNotification"
              :items="act.investigateActionNotifications"
              outlined
              hide-details
            />
          </v-col>
          <v-col v-if="investigateAction == 'Notify users'">
            <v-select
              v-model="investigateActionNotificationTemplate"
              :items="act.notifyTemplates"
              item-text="label"
              item-value="value"
              outlined
              hide-details
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { required } from '../../utils/validations'

export default {
  name: 'Investigate',
  props: {
    act: {
      type: Object
    }
  },
  data() {
    return {
      investigationFilter: ['URLs', 'Attachments'],
      investigationRange: '3 days before and after',
      investigationDuration: '3 days',
      investigateAction: 'Delete email',
      investigateActionNotification: '',
      investigateActionNotificationTemplate: '',
      targetUsersValue: [],
      targetUserType: 'AllUsers',
      validations: {
        required
      }
    }
  }
}
</script>

<style lang="scss"></style>
