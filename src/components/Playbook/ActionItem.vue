<template>
  <div>
    <!-- <p>{{ id }}</p> -->
    <p>{{ actionItemType }}</p>
    <p>{{ actions }}</p>
    <v-row v-for="(action, index) in actions" :key="index" class="vqb-rule rounded-xl">
      <v-col md="2" class="mr-2">
        <v-select
          v-model="actionItemType"
          :items="act.actionTypes"
          outlined
          hide-details
          placeholder="Select Action Type"
          height="40"
          item-text="name"
          item-value="val"
          @change="setAvailableItems"
        />
      </v-col>
      <v-col v-if="actionItemType == 'markAs'" md="2" class="mr-2">
        <v-select v-model="markAsOpts" :items="act.markAsOpts" outlined hide-details />
      </v-col>
      <v-col v-if="actionItemType == 'tag'" md="auto" class="mr-2 flex-grow-1">
        <v-combobox
          v-model="tags"
          :items="[]"
          chips
          deletable-chips
          :search-input.sync="tagsearch"
          @keyup.tab="updateTags"
          @paste="updateTags"
          outlined
          class="hide-caret"
          multiple
          dense
          persistent-hint
          small-chips
          :return-object="false"
          required
          hide-details="auto"
        ></v-combobox>
      </v-col>
      <v-col v-if="actionItemType == 'notify'" md="2" class="mr-2">
        <v-select
          v-model="notifyTemplate"
          :items="act.notifyTemplates"
          item-value="value"
          item-text="label"
          outlined
          hide-details
        />
      </v-col>
      <v-spacer v-if="actionItemType != 'tag'" />
      <v-col class="text-right flex-grow-0">
        <!-- Remove act button -->
        <v-btn icon @click="removeAction(index)">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn text color="primary" @click="addAction()">
          <v-icon>mdi-plus</v-icon> Add Action
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ActionItem',
  props: {
    id: Number,
    actionData: Object
  },
  data() {
    return {
      actionItemType: 'markAs',
      markAsOpts: 'Clean',
      tagsearch: '',
      tags: [],
      notifyType: '',
      notifyTemplate: '',
      searchUser: '',
      searchGroup: '',
      targets: [],
      targetUsers: '',
      act: {
        actionTypes: [
          {
            name: 'Mark as',
            val: 'markAs',
            selected: false
          },
          {
            name: 'Analyze',
            val: 'analyze',
            selected: false
          },
          {
            name: 'Investigate',
            val: 'investigate',
            selected: false
          },
          {
            name: 'Notify',
            val: 'notify',
            selected: false
          },
          {
            name: 'Tag',
            val: 'tag',
            selected: false
          }
        ],
        notifyTypes: ['The reporter', 'A user', 'A group'],
        markAsOpts: ['Clean', 'Phising', 'Malicious', 'Spam'],
        notifyTemplates: [
          { label: 'IR User Notification', value: '18' },
          { label: 'IR Delete Action Notification', value: '41' },
          { label: 'Incident Investigation', value: '46' },
          { label: 'About to Expire', value: '2282' },
          { label: 'Incident Investigation Progress Report', value: '2311' },
          { label: 'Incident Investigation Suspicious Email Analysis Report', value: '2320' }
        ],
        playbookAction: {
          markType: 'Clean',
          targetUser: '',
          targetGroupId: '',
          tags: ['']
        },
        playbookActionNotifications: [
          {
            targetUserType: 'Groups',
            targetUsers: [],
            emailTemplateId: 1
          }
        ],
        playbookActionAnalyzers: [
          {
            integrationId: 'faczwHLF1Jmw',
            isCheckHash: true,
            isCheckFile: false,
            isCheckUrl: true
          }
        ],
        playbookActionInvestigations: [
          {
            isCreatedByAnalyzer: false,
            expireDate: '2020-05-01 03:17:07.140',
            startDate: '2020-01-01 03:17:07.140',
            endDate: '2020-09-09 03:17:07.140',
            scanTypes: ['Outlook'],
            filters: [
              'From',
              'To',
              'Cc',
              'SenderIp',
              'Subject',
              'Keyword',
              'Url',
              'AttachmentName',
              'AttachmentExtension',
              'AttachmentHash'
            ],
            targetUserType: 'SpecificUsers',
            targetUsers: ['burak@keepnetlabs.com', 'burak.okmen@outlook.com'],
            actionType: 'Notify',
            actionNotifyTargetUserType: 'Reporter',
            actionNotifyTargetUsers: ['4B499616-1D96-4723-93F7-79B1E8F110A7'],
            emailTemplateId: 1
          }
        ]
      },
      actions: [{ actionItemType: 'markAs' }]
    }
  },
  mounted() {
    //console.log(this)
  },
  methods: {
    updateTags() {
      this.$nextTick(() => {
        this.tags.push(...this.tagsearch.split(','))
        this.$nextTick(() => {
          this.tagsearch = ''
        })
      })
    },
    setAvailableItems(selectedValue) {
      //this.act.actionTypes.find((item) => item.name == selectedValue).selected = true
    },
    addAction() {
      debugger
      const nextAvailableAction = this.act.actionTypes.find((item) => !item.selected)
      this.actions.push(nextAvailableAction)
      this.idCounter = this.idCounter + 1
    },
    removeAction(index) {
      this.actions.splice(index, 1)
    }
  }
}
</script>

<style></style>
