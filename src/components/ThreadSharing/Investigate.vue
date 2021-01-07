<template>
  <div class="investigate-container">
    <div class="investigate-inner">
      <v-card light class="investigate-card pb-4 pa-6" style="border-radius: 0 !important;">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">
              mdi-magnify
            </v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">
              Investigate the Incident
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <div class="investigate-steps">
          <div class="steps" @click="stepChange(1)">
            <div :class="{ 'active-step': step === 1 }" class="step-number">
              1
            </div>
            <span :class="{ 'active-step-span': step === 1 }" class="step-name"
              >Define Filters</span
            >
          </div>
          <div class="steps">
            <hr />
          </div>
          <div class="steps" @click="stepChange(2)">
            <div :class="{ 'active-step': step === 2 }" class="step-number">
              2
            </div>
            <span :class="{ 'active-step-span': step === 2 }" class="step-name"
              >Investigation Settings</span
            >
          </div>
        </div>
        <div v-if="step === 1">
          <div class="investigate-header">
            <p>Define Investigation Filters</p>
            <span
              >Select attributes to filter emails for your investigation from the right-side</span
            >
          </div>
          <div class="investigation-content">
            <div class="mail-preview">
              <div class="preview-header">
                <h2
                  style="padding: 0 2px; border-bottom: 1px solid transparent;"
                  :class="{ 'text-selected': header.subject }"
                  v-if="incidentGetter && incidentGetter.header && incidentGetter.header.subject"
                >
                  Subject: Subject comes here
                </h2>
                <h2
                  style="padding: 0 2px; border-bottom: 1px solid transparent;"
                  :class="{ 'text-selected': header.subject }"
                  v-else
                >
                  Subject: <i>hidden by post owner</i>
                </h2>
                <div class="header-info">
                  <span
                    v-if="incidentGetter && incidentGetter.header && incidentGetter.header.sender"
                    :class="{ 'phishing-link': header.sender }"
                    >From: Name Surname &#60;mail@domain.com&#62;<br
                  /></span>
                  <span v-else :class="{ 'phishing-link': header.sender }"
                    >From: <i>hidden by post owner</i>
                  </span>
                  <div
                    style="padding: 0 2px; border-bottom: 1px solid transparent;"
                    :class="{ 'text-selected': header.receiver }"
                    v-if="incidentGetter && incidentGetter.header && incidentGetter.header.receiver"
                  >
                    To: Name Surname <br />
                    CC: Name Surname
                  </div>
                  <div
                    style="padding: 0 2px; border-bottom: 1px solid transparent;"
                    :class="{ 'text-selected': header.receiver }"
                    v-else
                  >
                    To: <i>hidden by post owner</i><br />
                    CC: <i>hidden by post owner</i>
                  </div>
                  Date: 07 August 2019 10:43<br />
                </div>
              </div>
              <div class="preview-body">
                <h2>Body</h2>
                Dear Name Surname,
                <br /><br />
                Please review
                <a
                  v-if="incidentGetter && incidentGetter.body && incidentGetter.body.phishing1"
                  :class="{ 'phishing-link': body.phishing1 }"
                  class="unselected-warn"
                  >Purchase Order.</a
                >
                <a v-else :class="{ 'phishing-link': body.phishing1 }" class="unselected-warn"
                  ><i>hidden by post owner</i></a
                >
                <br /><br />
                <div>
                  If you have any further feedback, <br />
                  please contact us through the mail address in the header <br />of the Purchase
                  <br />
                  Order. To see your profile
                  <a
                    v-if="incidentGetter && incidentGetter.body && incidentGetter.body.phishing2"
                    :class="{ 'phishing-link': body.phishing2 }"
                    class="unselected-warn"
                    >click here</a
                  >
                  <a v-else :class="{ 'phishing-link': body.phishing2 }" class="unselected-warn"
                    ><i>hidden by post owner</i></a
                  >
                  and to edit your setting
                  <a
                    v-if="incidentGetter && incidentGetter.body && incidentGetter.body.allLinks"
                    :class="{
                      'selected-link': body.allLinks
                    }"
                    class="clean-link"
                    >click here</a
                  >
                  <a
                    v-else
                    :class="{
                      'selected-link': body.allLinks
                    }"
                    class="clean-link"
                    ><i>hidden by post owner</i></a
                  >
                  <br />
                  Kind regards, Name Surname
                </div>
                <!--
                  <div class="company-img">
                    <img src="../../assets/img/logo-min.png" alt="KeepNet" />
                  </div>
                -->
              </div>
              <div class="preview-footer">
                <h2>Attachments</h2>
                <div class="attachment-wrapper">
                  <div
                    v-if="
                      incidentGetter && incidentGetter.footer && incidentGetter.footer.attachment1
                    "
                    :class="{ 'malicious-attach': footer.attachment1 }"
                    class="attachment red-attach"
                  >
                    <div class="attach-icon red-icon">
                      <v-icon color="white" style="font-size: 20px;">mdi-alert</v-icon>
                    </div>
                    <div class="file-name max-char">RG100055176610.doc</div>
                  </div>
                  <div
                    v-else
                    :class="{ 'malicious-attach': footer.attachment1 }"
                    class="attachment red-attach"
                  >
                    <i>hidden by post owner</i>
                  </div>
                  <div
                    v-if="
                      incidentGetter && incidentGetter.footer && incidentGetter.footer.attachment2
                    "
                    :class="{ 'clean-attach': footer.attachment2 }"
                    class="attachment blue-attach"
                  >
                    <div class="attach-icon blue-icon">
                      <v-icon color="white" style="font-size: 20px;">mdi-paperclip</v-icon>
                    </div>
                    <div class="file-name max-char">RG102342343240055176610.pdf</div>
                  </div>
                  <div
                    v-else
                    :class="{ 'clean-attach': footer.attachment2 }"
                    class="attachment blue-attach"
                  >
                    <i>hidden by post owner</i>
                  </div>
                </div>
              </div>
            </div>
            <div :class="{ 'minify-filter': !filterOpened }" class="investigation-filters">
              <div :class="{ 'minify-part': !filterOpened }" class="filter-header">
                <div class="select-header" v-if="filterOpened">Select Attributes</div>
                <v-icon @click="filterOpened = true" :class="{ 'display-none': filterOpened }"
                  >mdi-arrow-left
                </v-icon>
                <v-icon @click="filterOpened = false" :class="{ 'display-none': !filterOpened }"
                  >mdi-arrow-right
                </v-icon>
              </div>
              <div :class="{ 'minify-part': !filterOpened }" class="filter-part">
                <div :class="{ 'minify-switch': !filterOpened }" class="switch-row">
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/header-all.svg" />
                  </div>
                  <v-switch v-model="header.allHeader"></v-switch>
                  <label v-if="filterOpened">All Header</label>
                </div>
                <div :class="{ 'minify-switch': !filterOpened }" class="switch-row">
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/short-text.svg" />
                  </div>
                  <v-switch v-model="header.subject"></v-switch>
                  <label v-if="filterOpened">Subject</label>
                </div>
                <div :class="{ 'minify-switch': !filterOpened }" class="switch-row">
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/user-out.svg" />
                  </div>
                  <v-switch v-model="header.sender"></v-switch>
                  <label v-if="filterOpened">Sender Info</label>
                </div>
                <div :class="{ 'minify-switch': !filterOpened }" class="switch-row">
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/user-in.svg" />
                  </div>
                  <v-switch v-model="header.receiver"></v-switch>
                  <label v-if="filterOpened">Receiver Info</label>
                </div>
              </div>
              <div :class="{ 'minify-part': !filterOpened }" class="filter-part pt-4">
                <div :class="{ 'minify-switch': !filterOpened }" class="switch-row">
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/link.svg" />
                  </div>
                  <v-switch v-model="body.allLinks"></v-switch>
                  <label v-if="filterOpened">All Links</label>
                </div>
                <div :class="{ 'minify-switch': !filterOpened }" class="switch-row">
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/link-red.svg" />
                  </div>
                  <v-switch v-model="body.phishingLinks"></v-switch>
                  <label v-if="filterOpened">All Phishing Links</label>
                </div>
                <div :class="{ 'minify-switch': !filterOpened }" class="switch-row">
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/link-red.svg" />
                  </div>
                  <v-switch class="phishing-switchs" v-model="body.phishing1"></v-switch>
                  <label v-if="filterOpened">“Purchase Order”</label>
                </div>
                <div :class="{ 'minify-switch': !filterOpened }" class="switch-row">
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/link-red.svg" />
                  </div>
                  <v-switch class="phishing-switchs" v-model="body.phishing2"></v-switch>
                  <label v-if="filterOpened">“click here”</label>
                </div>
              </div>

              <div :class="{ 'minify-part': !filterOpened }" class="filter-part pt-5">
                <div :class="{ 'minify-switch': !filterOpened }" class="switch-row">
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/attachment-all.svg" />
                  </div>
                  <v-switch v-model="footer.allAttachments"></v-switch>
                  <label v-if="filterOpened">All Attachments</label>
                </div>
                <div :class="{ 'minify-switch': !filterOpened }" class="switch-row">
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/attach-file.svg" />
                  </div>
                  <v-switch v-model="footer.attachment1"></v-switch>
                  <label v-if="filterOpened">RG100055176612.doc</label>
                </div>
                <div :class="{ 'minify-switch': !filterOpened }" class="switch-row">
                  <div class="img-wrapper">
                    <img src="../../assets/img/filter-icons/attach-red.svg" />
                  </div>
                  <v-switch v-model="footer.attachment2"></v-switch>
                  <label v-if="filterOpened">RG100055176610.pdf</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="step === 2">
          <div class="investigate-header">
            <p>Investigation Settings</p>
            <span>Define settings for the investigation</span>
          </div>

          <v-form ref="form" v-model="valid" lazy-validation>
            <div class="filters-content">
              <div class="input-header">Target Users</div>
              <div class="input-sub">Select departments, groups or users to investigate</div>
              <k-select
                type="autocomplete"
                v-model="targetUsers"
                :items="targets"
                :search-input.sync="search"
                chips
                clearable
                item-text="name"
                item-value="symbol"
                label="Select users, groups, departments or companies"
                class="first-select input-select"
                solo
                :rules="autocomplete"
                required
                :slots="{ selection: true, item: true }"
              >
                <template v-slot:selection="{ attr, on, item, selected }">
                  <v-chip
                    v-bind="attr"
                    :input-value="selected"
                    color="#2196f3"
                    class="white--text"
                    v-on="on"
                  >
                    {{ item }}
                  </v-chip>
                </template>
                <template v-slot:item="{ item }">
                  {{ item }}
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </template>
              </k-select>

              <div class="input-header">Email Date Range</div>
              <div class="input-sub">Select range of emails’ sending date</div>
              <div class="date-row">
                <v-col class="date-col pa-0" cols="12" md="6">
                  <v-icon class="date-icon">mdi-calendar-range</v-icon>
                  <v-menu
                    ref="menu1"
                    v-model="menu1"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="startDate"
                        class="date-picker first-date"
                        label="Start Date"
                        solo
                        v-on="on"
                        required
                        readonly
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="startDate"
                      :allowed-dates="allowedDates"
                      no-title
                      @input="menu1 = false"
                      :min="minDate()"
                      :max="maxDate()"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col class="date-col pa-0" cols="12" md="6">
                  <span class="date-to">To</span>
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="endDate"
                        class="date-picker sec-date"
                        label="End Date"
                        solo
                        v-on="on"
                        required
                        readonly
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="endDate"
                      no-title
                      @input="menu2 = false"
                      :min="minDate()"
                      :max="maxDate()"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </div>

              <div class="input-header mt-6">Duration</div>
              <div class="input-sub">Select how many days the investigation will run</div>
              <k-select
                :items="durations"
                placeholder="3 days"
                outlined
                :menu-props="{ offsetY: true }"
                class="input-select"
                v-model="selectedDuration"
                :rules="[(v) => !!v || 'Duration is required']"
                required
              ></k-select>

              <div class="input-header">Action</div>
              <div class="input-sub">Select action to be executed if email is found</div>
              <k-select
                :items="actions"
                placeholder="Delete email"
                outlined
                :menu-props="{ offsetY: true }"
                class="input-select"
                v-model="selectedAction"
                :rules="[(v) => !!v || 'Action is required']"
                required
              ></k-select>
            </div>
          </v-form>
        </div>
      </v-card>
      <div class="footer-actions">
        <v-btn class="cancel-btn" text color="#f56c6c" @click="onCancelClicked">{{
          labels.Cancel
        }}</v-btn>
        <v-btn v-if="step === 1" class="create-btn" text color="#2196f3" @click="onContinue"
          >{{ labels.Next }}
        </v-btn>
        <div v-if="step === 2">
          <v-btn
            style="border: 1px solid #2196f3 !important; border-radius: 20px;"
            class="mr-4"
            text
            color="#2196f3"
            @click="step = 1"
            >{{ labels.Back }}
          </v-btn>
          <v-btn class="create-btn" text color="#2196f3" @click="onStart">START</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'

export default {
  components: { KSelect },
  props: {
    selectedPostTitle: {
      type: String
    }
  },
  data: () => ({
    labels,
    step: 1,
    header: {
      allHeader: true,
      subject: true,
      sender: true,
      receiver: true
    },
    body: {
      allLinks: true,
      phishingLinks: true,
      phishing1: true,
      phishing2: false,
      message: true
    },
    footer: {
      allAttachments: true,
      attachment1: true,
      attachment2: true
    },
    warnItem: true,
    categories: [],
    search: '',
    selectedCategory: '',
    menu1: false,
    menu2: false,
    model: '',
    targetUsers: '',
    targets: ['Departments', 'Companies', 'Groups'],
    durations: ['1 Day', '3 Days', '7 Days', '14 Days', '30 Days'],
    selectedDuration: '3 Days',
    actions: ['Delete email', 'Notify users', 'No action'],
    selectedAction: 'Delete email',
    valid: false,
    autocomplete: [(v) => !!v || 'Target is required'],
    startDate: new Date().toISOString().substr(0, 10),
    endDate: new Date().toISOString().substr(0, 10),
    filterOpened: true,
    flagData: {
      subject: false,
      sender: false,
      receiver: false,
      phishing: false,
      link: false,
      attachment: false
    }
  }),
  computed: {
    ...mapGetters({
      incidentGetter: 'threadSharing/incidentGetter'
    })
  },
  watch: {
    'header.allHeader': function (newVal, oldVal) {
      if (newVal === true && newVal != oldVal) {
        this.header.subject = true
        this.header.sender = true
        this.header.receiver = true
      }
    },
    'header.subject': function (newVal, oldVal) {
      if (newVal === false && newVal != oldVal) {
        this.header.allHeader = false
      }
    },
    'header.sender': function (newVal, oldVal) {
      if (newVal === false && newVal != oldVal) {
        this.header.allHeader = false
      }
    },
    'header.receiver': function (newVal, oldVal) {
      if (newVal === false && newVal != oldVal) {
        this.header.allHeader = false
      }
    },
    'body.phishingLinks': function (newVal, oldVal) {
      if (newVal === true && newVal != oldVal) {
        this.body.phishing1 = true
        this.body.phishing2 = true
      }
    },
    'body.phishing1': function (newVal, oldVal) {
      if (newVal === false && newVal != oldVal) {
        this.body.phishingLinks = false
      }
    },
    'body.phishing2': function (newVal, oldVal) {
      if (newVal === false && newVal != oldVal) {
        this.body.phishingLinks = false
      }
    },
    'footer.allAttachments': function (newVal, oldVal) {
      if (newVal === true && newVal != oldVal) {
        this.footer.attachment1 = true
        this.footer.attachment2 = true
      }
    },
    'footer.attachment1': function (newVal, oldVal) {
      if (newVal === false && newVal != oldVal) {
        this.footer.allAttachments = false
      }
    },
    'footer.attachment2': function (newVal, oldVal) {
      if (newVal === false && newVal != oldVal) {
        this.footer.allAttachments = false
      }
    }
  },
  methods: {
    onCancelClicked() {
      this.$emit('closeInvestigate')
    },
    stepChange(num) {
      this.step = num
    },
    onContinue() {
      if (this.step === 1) this.step = 2
      else return
    },
    onStart() {
      if (this.$refs.form.validate()) {
        this.$emit('closeInvestigate')
        this.$store.dispatch('threadSharing/investigationStarted', {
          title: this.selectedPostTitle
        })
      }
    },
    minDate() {
      var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [year - 1, month, day].join('-')
    },
    maxDate() {
      var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [year + 1, month, day].join('-')
    },
    allowedDates(val) {
      return val < this.endDate
    }
  },
  beforeDestroy() {
    //this.$emit('closeInvestigate')
    //this.$router.push("/threat-sharing")
  }
}
</script>
<style lang="scss" scoped src="./Investiage.scss"></style>
