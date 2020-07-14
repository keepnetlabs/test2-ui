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
            v-model="investigateData.targetUserType"
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
            :placeholder="
              investigateData.targetUserType === 'AllUsers' ? 'All Users' : 'Select user groups'
            "
            outlined
            class="edit-select standard-height"
            item-text="name"
            v-model="investigateData.targetUsers"
            multiple
            dense
            persistent-hint
            small-chips
            :return-object="false"
            v-if="investigateData.targetUserType === 'AllUsers'"
            :disabled="investigateData.targetUserType === 'AllUsers'"
            hide-details
            required
          ></v-combobox>
          <v-combobox
            :items="targetUsersList"
            :placeholder="
              investigateData.targetUserType === 'AllUsers' ? 'All Users' : 'Select user groups'
            "
            outlined
            v-model="investigateData.targetUsers"
            class="edit-select target-users-select-multi"
            :rules="[targetUsers.required]"
            item-text="name"
            multiple
            dense
            persistent-hint
            small-chips
            :return-object="true"
            v-if="investigateData.targetUserType === 'Groups'"
            hide-details
            required
          ></v-combobox>
          <v-combobox
            :items="[]"
            v-if="investigateData.targetUserType === 'SpecificUsers'"
            placeholder="Enter Email Addresses"
            item-text="name"
            multiple
            dense
            persistent-hint
            small-chips
            :return-object="false"
            :rules="[targetUsers.required]"
            required
            outlined
            class="edit-name-textfield edit-select target-users-select__specific-user-input target-users-select-multi"
            v-model="investigateData.targetUsers"
            hide-details
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
          v-model="investigateData.filters"
          :items="act.investigateFilters"
          placeholder="Select Filters"
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
          <v-col v-if="investigateAction === 'Notify users'">
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
import { mapGetters } from 'vuex'

export default {
  name: 'Investigate',
  props: {
    act: {
      type: Object
    },
    index: {
      type: Number
    },
    isCreatedByAnalyzer: {
      type: Boolean
    },
    investigateData: {
      type: Object,
      default: () => {
        return {
          isCreatedByAnalyzer: false,
          scanTypes: [],
          filters: [],
          expireDate: '',
          startDate: new Date(new Date().setDate(new Date().getDate() - 1))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0],
          endDate: new Date(new Date().setDate(new Date().getDate() + 1))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0],
          targetUserType: 'AllUsers',
          targetUsers: [],
          actionType: '',
          actionNotifyTargetUserType: '',
          actionNotifyTargetUsers: [],
          emailTemplateId: 1
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      targetUsersList: 'investigations/getTargetUsersListGetter' // for using getters
    })
  },
  watch: {
    investigationRange(val) {
      let date = new Date()
      switch (val) {
        case this.act.investigateRanges[0]:
          date = new Date()
          this.investigateData.startDate = new Date(date.setDate(date.getDate() - 1))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          this.investigateData.endDate = new Date(date.setDate(date.getDate() + 1))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          break
        case this.act.investigateRanges[1]:
          date = new Date()
          this.investigateData.startDate = new Date(date.setDate(date.getDate() - 3))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          this.investigateData.endDate = new Date(date.setDate(date.getDate() + 3))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          break
        case this.act.investigateRanges[2]:
          date = new Date()
          this.investigateData.startDate = new Date(date.setDate(date.getDate() - 7))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          this.investigateData.endDate = new Date(date.setDate(date.getDate() + 7))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          break
        case this.act.investigateRanges[3]:
          date = new Date()
          this.investigateData.startDate = new Date(date.setDate(date.getDate() - 14))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          this.investigateData.endDate = new Date(date.setDate(date.getDate() + 14))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          break
        default:
          break
      }
    },
    investigationDuration(val) {},
    investigateData(val) {
      let date = new Date()
      switch (val) {
        case this.act.investigateDurations[0]:
          date = new Date()
          this.investigateData.expireDate = new Date(date.setDate(date.getDate() + 1))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          break
        case this.act.investigateDurations[1]:
          this.investigateData.expireDate = new Date(date.setDate(date.getDate() + 3))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          break
        case this.act.investigateDurations[2]:
          this.investigateData.expireDate = new Date(date.setDate(date.getDate() + 7))
            .toISOString()
            .split('T')
            .join(' ')
            .split('.')[0]
          break
        default:
          break
      }
    }
  },
  data() {
    return {
      filters: ['URLs', 'Attachments'],
      investigationRange: '3 days before and after',
      expireDate: '',
      startDate: '',
      endDate: '',
      investigationDuration: '3 days',
      investigateAction: 'Delete email',
      investigateActionNotification: 'Reporter',
      investigateActionNotificationTemplate: '18',
      targetUsersValue: [],
      targetUserType: 'AllUsers',
      validations: {
        required
      },
      targetUsers: {
        required: (v) =>
          (!!v && v.length > 0) || 'Target users required for creating a investigation'
      }
    }
  },
  created() {
    console.log('index', this.index)
    this.$store.dispatch('investigations/getTargetUsersList').then() //module name than method name
  }
}
</script>

<style lang="scss"></style>
