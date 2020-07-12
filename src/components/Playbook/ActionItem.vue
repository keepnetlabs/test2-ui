<template>
  <div class="action-items">
    <!-- <p>{{ id }}</p> -->
    <p>{{ actionItemType }}</p>
    <p>{{ actions }}</p>
    <p>{{ openEnginesModal }}</p>
    <p>{{ analysisEngines }}</p>
    <app-dialog
      size="big"
      :status="openEnginesModal"
      class-name="download-modal"
      @changeStatus="openEnginesModal = false"
    >
      <template v-slot:app-dialog-body>
        <div class="bg-white">
          <div class="">
            <div class="analyze__main__select-row-wrap check-all">
              <div class="checkbox-and-text">
                <v-checkbox
                  class="k-checkbox"
                  color="#2196f3"
                  v-model="acceptAllAnalysisEngines"
                  @change="acceptAllAnalysisEnginesClick"
                />
                <span class="checkbox-text">Select All</span>
              </div>
              <div class="analyze__main__select-row-inline">
                <span type="button" class="analyze__main__select-row-inline__button">
                  Hash
                </span>
                <span type="button" class="analyze__main__select-row-inline__button">
                  File
                </span>
                <span type="button" class="analyze__main__select-row-inline__button">
                  Url
                </span>
              </div>
            </div>
          </div>
          <div>
            <div class="analyze__main__select-row-wrap">
              <div
                v-for="(engine, index) in analysisEngines"
                :key="index"
                class="analyze__main__select-row-wrap__item"
              >
                <div class="checkbox-and-text">
                  <v-checkbox
                    class="k-checkbox"
                    color="#2196f3"
                    v-model="engine.selected"
                    @change="engine.selected != engine.selected"
                  />
                  <span class="checkbox-text">{{ engine.name }}</span>
                </div>
                <div class="analyze__main__select-row-inline">
                  <span
                    class="analyze__main__select-row-inline__button"
                    :class="
                      engine.isSendFileHash
                        ? 'analyze__main__select-row-inline__button-selected'
                        : ''
                    "
                    @click="engine.isSendFileHash = !engine.isSendFileHash"
                  >
                    Hash
                  </span>
                  <span
                    class="analyze__main__select-row-inline__button"
                    :class="
                      engine.isSendFile ? 'analyze__main__select-row-inline__button-selected' : ''
                    "
                    @click="engine.isSendFile = !engine.isSendFile"
                  >
                    File
                  </span>
                  <span
                    class="analyze__main__select-row-inline__button"
                    :class="
                      engine.isSendUrl ? 'analyze__main__select-row-inline__button-selected' : ''
                    "
                    @click="engine.isSendUrl = !engine.isSendUrl"
                  >
                    Url
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:app-dialog-footer>
        <div class="delete-user__footer">
          <v-btn
            @click="openEnginesModal = false"
            color="#f56c6c"
            class="delete-user__footer-button"
            text
            >CANCEL</v-btn
          >
        </div>
      </template>
    </app-dialog>
    <v-row
      v-for="(action, index) in actions"
      :key="index"
      class="vqb-rule rounded-xl action-items__item"
    >
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
      <v-col
        v-if="actionItemType == 'analyze'"
        md="auto"
        class="mr-2 flex-grow-1 d-flex col-md-auto col analyze__main"
      >
        <v-text-field
          outlined
          hide-details
          placeholder="Select Action Type"
          height="40"
          v-model="analyzeModel"
          @click="openEnginesModal = true"
          class="analysis-engines-select"
        >
        </v-text-field>
        <v-col class="analyze__main-checkbox">
          <v-checkbox class="k-checkbox" color="#2196f3" v-model="analyzeCheckbox" />
          <span class="checkbox-text">Investigate according to analyze results</span>
        </v-col>
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
        <v-select v-model="notifyType" :items="act.notifyTypes" outlined hide-details />
      </v-col>
      <v-col v-if="notifyType == 'A user'" md="2" class="mr-2">
        <v-select outlined hide-details />
      </v-col>
      <v-col v-if="notifyType == 'A group'" md="2" class="mr-2">
        <v-select outlined hide-details />
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
      <v-col class="text-right flex-grow-0">
        <!-- Remove act button -->
        <v-btn icon @click="removeAction(index)">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-col>
      <v-col v-if="actionItemType == 'investigate'" md="12">
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
            <v-text-field outlined hide-details="auto" placeholder="deneme"></v-text-field>
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
            <v-text-field outlined hide-details="auto" placeholder="deneme"></v-text-field>
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
            <v-text-field hide-details="auto" outlined placeholder="deneme"></v-text-field>
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
            <v-text-field hide-details="auto" outlined placeholder="deneme"></v-text-field>
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
          <v-col md="5">
            <v-text-field hide-details="auto" outlined placeholder="deneme"></v-text-field>
          </v-col>
        </v-row>
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
import { getAnalysisEngine } from '../../api/playbook'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import AppDialog from '../AppDialog'

export default {
  components: { AppDialog },
  name: 'ActionItem',
  props: {
    id: Number,
    actionData: Object
  },
  data() {
    return {
      analyzeModel: false,
      analyzeCheckbox: false,
      openEnginesModal: false,
      acceptAllAnalysisEngines: false,
      analysisEngines: [],
      actionItemType: 'markAs',
      markAsOpts: 'Clean',
      acceptCheckbox: false,
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
        investigateFilters: ['Subject', 'From', 'To', 'CC', 'Sender IP', 'URLS', 'Attachments'],
        investigateRanges: [
          '1 day before and after',
          '3 days before and after',
          '7 day before and after',
          '2 weeks before and after'
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
    this.getAnalysisEngine()
  },
  methods: {
    asd(e) {
      e.preventDefault()
      this.analyzeModel = ''
    },
    acceptAllAnalysisEnginesClick() {},
    getAnalysisEngine() {
      const payload = {
        pageNumber: 1,
        pageSize: 500,
        orderBy: 'CreateDate',
        ascending: true,
        filter: {
          Condition: 'AND',
          FilterGroups: [{}]
        }
      }
      getAnalysisEngine(payload)
        .then((response) => {
          const data = response.data.data.results.map((item) => {
            return {
              ...item,
              isSendUrl: true,
              isSendFileHash: true,
              isSendFile: true,
              selected: true
            }
          })
          this.analysisEngines = data
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting analysis engines data!'
          })
        })
    },
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
<style lang="scss" src="./ActionItem.scss" />
