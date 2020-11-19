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
              <v-autocomplete
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
              </v-autocomplete>

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
        <v-btn class="cancel-btn" text color="#f56c6c" @click="onCancelClicked">CANCEL</v-btn>
        <v-btn v-if="step === 1" class="create-btn" text color="#2196f3" @click="onContinue"
          >NEXT
        </v-btn>
        <div v-if="step === 2">
          <v-btn
            style="border: 1px solid #2196f3 !important; border-radius: 20px;"
            class="mr-4"
            text
            color="#2196f3"
            @click="step = 1"
            >BACK
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

export default {
  components: { KSelect },
  props: {
    selectedPostTitle: {
      type: String
    }
  },
  data: () => ({
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
<style lang="scss" scoped>
.investigate-container {
  min-height: 100vh;
  width: 100%;

  .investigate-inner {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;

    .investigate-card {
      width: 100%;
      min-height: 100vh;
      padding: 32px 96px !important;
      padding-bottom: 100px !important;
    }

    .investigate-steps {
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: #f5f7fa;
      margin: 25px -96px;
      padding-left: 96px;
      height: 57px;

      .active-step {
        border: solid 1px #409eff !important;
        color: #409eff !important;
      }

      .steps {
        align-items: center;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        margin-right: 10px;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.5);

        .step-number {
          align-items: center;
          display: flex;
          justify-content: center;
          border-radius: 50%;
          border: solid 1px #909399;
          width: 24px;
          height: 24px;
          margin-right: 8px;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.87);
        }

        .active-step-num {
          border: solid 1px rgba(0, 0, 0, 0.87) !important;
        }

        .active-step-span {
          color: rgba(0, 0, 0, 0.87) !important;
        }

        hr {
          width: 69px;
          height: 1px;
          border: 1px solid #757575;
          margin: 0 10px;
        }
      }
    }

    .investigate-header {
      p {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
        margin-bottom: 0 !important;
      }

      span {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
      }
    }

    .investigation-content {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;

      .mail-preview {
        width: 600px;
      }

      .investigation-filters {
        width: 300px;
        background-color: white;
        box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
          0 3px 1px -2px rgba(80, 80, 80, 0.12);
        align-items: center;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        margin-left: 32px;
        transition: all 0.3s ease-in-out;

        @media only screen and (max-width: 1025px) {
          position: absolute;
          top: 170px;
          right: 0;
          z-index: 99999;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
            0 1px 1px -1px rgba(204, 204, 204, 0.12);
          border: solid 1px #2196f3;
        }

        .filter-part {
          border-bottom: 1px solid #b3d4fc;
          display: flex;
          flex-direction: column;
          padding-top: 24px;
          padding-bottom: 30px;
          width: 240px;
          transition: all 0.3s ease-in-out;

          ::v-deep .v-input--selection-controls.v-input {
            margin-top: 10px !important;
          }

          .select-header {
            transition: all 0.3s ease-in-out;
          }

          .switch-row {
            align-items: center;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;

            .img-wrapper {
              align-items: center;
              display: flex;
              min-width: 40px;
              max-width: 40px;

              img {
                padding-top: 25%;
                padding-right: 8px;
              }
            }

            label {
              margin-top: 10px;
              margin-left: 5px;
            }
          }

          ::v-deep .v-input--selection-controls:not(.v-input--hide-details) .v-input__slot {
            height: 25px !important;
            min-height: 25px !important;
            margin-bottom: 0 !important;
            max-width: 210px;

            label {
              height: 24px !important;
              margin-left: 8px !important;
              font-family: 'Open Sans', sans-serif !important;
              font-size: 14px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.5;
              letter-spacing: normal;
              color: rgba(0, 0, 0, 0.87);
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              display: block;
              max-width: 100%;
            }
          }

          ::v-deep .accent--text {
            color: #2196f3 !important;
          }

          ::v-deep .theme--light.v-messages {
            display: none !important;
          }
        }

        .filter-part:last-child {
          border-bottom: unset !important;
        }

        .filter-part:nth-child(2) {
          height: 274px;
        }

        .filter-part:first-child {
          padding-top: 14.2px !important;
        }
      }
    }
  }
}

.filters-content {
  display: flex;
  flex-direction: column;
  margin-top: 24px;

  .input-header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  .input-sub {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 16px;
  }

  .input-select {
    max-width: 205px;
    color: rgba(0, 0, 0, 0.72);
    font-family: 'Open Sans', sans-serif !important;
    font-size: 13px !important;
    margin-bottom: 32px;
  }

  .first-select {
    max-width: 554px;
  }

  ::v-deep .input-select > .v-input__control {
    max-width: 554px !important;
    align-items: center;
    display: flex;
    height: 40px !important;
  }

  .date-row {
    max-width: 390px !important;
    display: flex;
    flex-direction: row;

    @media only screen and (max-width: 1025px) {
      width: 100%;
      max-width: 100% !important;
    }
  }
}

.underlined-warn {
  border-bottom: 1px solid #f56c6c;
  color: inherit;

  .icon {
    color: #f56c6c !important;
    font-size: 24px !important;
    text-decoration: none !important;
    margin-left: 20px;
    margin-bottom: 7px;
  }
}

.post-wrapper {
  max-width: 696px;
}

.select-error {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 9px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #d0021b;
  margin-left: 8px;
  margin-top: 17px;
}

.select-row-wrap {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 24px;

  .select-row-inline {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 40%;

    .file-type-wrap {
      display: flex;
    }
  }
}

.email-name {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

.email-icon {
  font-size: 19px !important;
  padding-right: 24px;
}

.email-type {
  height: 25px;
  border-radius: 4px;
  background-color: #f56c6c;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 6px;
}

.email-time {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
}

.v-card-headline {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.4;
  letter-spacing: normal;
  color: #000;
}

.v-card-sub-header {
  font-family: Helvetica;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  color: #000 !important;
}

.edit-name-textfield,
.edit-description,
.edit-select {
  font-size: 13px !important;
}

.v-cart-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  margin-right: 24px;
  box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
  border: solid 1px rgba(100, 181, 246, 0.5);
  background-color: #e3f2fd;
}

.preview-header {
  margin-top: 32px;

  h2 {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 16px;
    width: max-content;
  }

  .header-info {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    padding-bottom: 43px;
    border-bottom: 1px solid #b3d4fc;
  }
}

.preview-body {
  margin-top: 24px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87);
  border-bottom: 1px solid #b3d4fc;
  position: relative;
  padding-bottom: 24px;
  min-height: auto;
  overflow: auto;

  h2 {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    padding-bottom: 16px;
  }

  .company-img {
    display: flex;
    position: absolute;
    right: 0;
    top: 20px;
    width: 84px;
    height: 84px;

    img {
      width: 100%;
      height: auto;
    }
  }
}

.bodyExpanded {
  height: 100% !important;
  max-height: 100% !important;
  padding-bottom: 56px;
}

.preview-footer {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  padding-bottom: 24px;

  h2 {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    padding-bottom: 16px;
  }

  .attachment-wrapper {
    display: flex;
    flex-direction: row;

    .attachment {
      width: 182px;
      height: 32px;
      align-items: center;
      display: flex;
      flex-direction: row;
      margin-right: 16px;
      border: 1px solid transparent;

      .attach-icon {
        min-width: 40px;
        height: 32px;
        align-items: center;
        display: flex;
        justify-content: center;
      }

      .red-icon {
        background-color: #bb2a45 !important;
      }

      .blue-icon {
        background-color: #2196f3 !important;
      }

      .file-name {
        width: 142px;
        text-align: left;
        display: block;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.58;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
      }
    }

    .red-attach {
      border: 1px solid #bb2a45;
    }

    .blue-attach {
      border: 1px solid #2196f3;
    }
  }
}

.unselected-warn {
  border-bottom: 1px solid #bb2a45;
  color: #bb2a45;
  padding: 0 2px !important;
}

::v-deep .v-autocomplete {
  .v-input__slot {
    box-shadow: unset !important;
    border: 1px solid rgba(0, 0, 0, 0.24) !important;
  }
}

::v-deep .v-text-field.v-text-field--enclosed .v-input__append-inner {
  margin-top: 0 !important;
  display: flex;
  align-items: center;
}

.first-date {
  ::v-deep .v-input__slot {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-right: none !important;

    label {
      padding-left: 65px !important;
    }
  }
}

.sec-date {
  ::v-deep .v-input__slot {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-left: none !important;

    label {
      padding-left: 60px !important;
    }
  }
}

.date-picker {
  font-family: 'Open Sans', sans-serif !important;

  ::v-deep .v-input__slot {
    box-shadow: unset !important;
    border: 1px solid rgba(0, 0, 0, 0.24);
    border-radius: 4px;
    text-align: center;

    input {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 13px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.54);
      padding-left: 50px !important;
      padding-top: 8px !important;
    }

    label {
      padding-top: 0 !important;
    }
  }

  ::v-deep .v-input__slot::after,
  ::v-deep .v-input__slot::before {
    display: none;
  }
}

.date-col {
  position: relative;

  @media only screen and (max-width: 1025px) {
    width: 35% !important;
    max-width: 35% !important;
    padding: 0 !important;
  }
}

.date-icon {
  top: 12px;
  left: 25px;
  position: absolute;
  font-size: 18px !important;
  z-index: 99;
}

.date-to {
  position: absolute;
  left: 0;
  top: 11px;
  font-family: 'Open Sans', sans-serif !important;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.72);
  z-index: 13;
}

.max-char {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
  max-width: 100%;
}

.text-selected {
  border-radius: 1px !important;
  background-color: #d1e9fc !important;
  border-bottom: 1px solid #2196f3 !important;
  color: rgba(0, 0, 0, 0.87) !important;
  width: max-content;
}

.clean-link {
  padding: 0 2px !important;
  border-radius: 1px !important;
  border-bottom: 1px solid #2196f3 !important;
  color: #2196f3 !important;
}

.selected-link {
  background-color: #d1e9fc !important;
}

.phishing-link {
  background-color: #f3e1e5 !important;
  border-bottom: 1px solid #bb2a45 !important;
  color: #bb2a45 !important;
  width: max-content;
}

.clean-attach {
  background-color: #f1f8fe;
  border: 1px solid transparent !important;
}

.malicious-attach {
  background-color: #f3e1e5;
  border: 1px solid transparent !important;
}

::v-deep .v-input > .v-input__control > .v-text-field__details {
  bottom: -24px !important;
  position: absolute;
  left: 0;
}

::v-deep .v-application input {
  border-radius: 8px !important;
  border: solid 1px rgba(0, 0, 0, 0.16) !important;
}

.required {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 9px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #474747;
  margin-left: 6px;
  margin-top: -2px;
}

.close-incident {
  position: absolute;
  right: 26px;
  top: 26px;
}

::v-deep
  .affect-input.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
  > .v-input__control
  > .v-input__slot {
  border: none !important;
}

.row-with-icon {
  align-items: center;
  display: flex;
  flex-direction: row;
}

.icon-btn {
  margin-top: unset;
  margin-left: -5px;
  height: 25px !important;
  width: 25px !important;
}

.step-name {
  width: max-content;
}

.filter-header {
  align-items: center;
  display: none;
  justify-content: space-between;
  padding-top: 24px;
  width: 240px;
  transition: all 0.3s ease-in-out;

  .select-header {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    transition: all 0.3s ease-in-out;
  }

  i {
    margin-top: 3px;
    font-size: 27px;
  }
}

.minify-filter {
  width: 120px !important;
}

.minify-part,
.minify-switch {
  padding-left: 10px;
  width: 100% !important;
}

.footer-actions {
  align-items: center;
  bottom: 0;
  background-color: #f5f7fa;
  display: flex;
  left: 0;
  position: fixed;
  justify-content: space-between;
  padding: 0 96px;
  height: 68px;
  width: 100%;
  z-index: 9999;

  .cancel-btn {
    background-color: transparent !important;
    border-radius: 18px !important;
    border: solid 1px #f56c6c !important;
    color: #f56c6c !important;
  }

  .previous-btn {
    border-radius: 18px !important;
    border: solid 1px #2196f3 !important;
    color: #2196f3 !important;
  }

  .create-btn {
    border-radius: 18px !important;
    box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
    background-color: #2196f3 !important;
    color: #fff !important;
  }
}

@media only screen and (max-width: 1025px) {
  .hide-step {
    display: none !important;
  }
  .filter-header {
    display: flex;
  }
}

.display-none {
  display: none !important;
}
</style>
