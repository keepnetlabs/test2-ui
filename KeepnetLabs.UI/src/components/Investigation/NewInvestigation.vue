<template>
  <div class="new-investigation-container">
    <div class="new-investigation-inner">
      <v-card flat light class="pa-6" style="width: 600px;">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">mdi-magnify</v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">New Investigation</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="pl-0 pr-0 pb-10">
          <v-list-item-content class="pt-10 pb-0">
            <v-list-item-title class="v-card-headline">Start New Investigation</v-list-item-title>
            <v-list-item-title class="v-card-sub-header"
              >Select filters and date options to start an investigation</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-list-item class="edit-name-area pt-1 0 pa-0">
            <v-list-item-content class="pt-0 pb-6">
              <label class="pb-3 edit-labels">Investigation Name</label>
              <v-text-field
                placeholder="Manual Investigation - 09.09.2019  16:25"
                outlined
                class="edit-name-textfield edit-select"
                v-model="investgationName"
                :rules="[nameRules.regex, nameRules.required, nameRules.empty]"
                required
              ></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="edit-industry-area pb-4 pa-0">
            <v-list-item-content class="pt-4 pb-0">
              <label class="edit-labels">Target Users</label>
              <label class="edit-sub-labels"
                >Select departments, groups or users to investigate</label
              >
              <v-combobox
                :items="categories"
                label="Select the target users"
                outlined
                class="edit-select"
                v-model="targetUsers"
                :rules="[categoryRule]"
                required
              ></v-combobox>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="edit-industry-area pb-4 pa-0">
            <v-list-item-content class="pt-10 pb-0 filter-container">
              <label class="edit-labels">Filters</label>
              <label class="edit-sub-labels">Define filters for the investigation</label>
              <div class="filter-item">
                <div class="filter-item__selectbox">
                  <v-combobox
                    :items="categories"
                    label="Select the target users"
                    outlined
                    class="edit-select"
                    :rules="[categoryRule]"
                    required
                  ></v-combobox>
                </div>
                <div class="filter-item__input">
                  <v-textarea
                    name="description"
                    outlined
                    :rules="[
                      descriptionRules.regex,
                      descriptionRules.required,
                      descriptionRules.empty
                    ]"
                    required
                    class="edit-description"
                    placeholder="e.g. 192.1.0.0"
                    no-resize
                  ></v-textarea>
                </div>
              </div>
              <button>
                <v-icon medium left color="blue" class="ml-2">mdi-plus</v-icon>Add Filter
              </button>
            </v-list-item-content> </v-list-item
          ><v-list-item class="edit-industry-area pb-4 pa-0">
            <v-list-item-content class="pt-0 pb-0">
              <label class="edit-labels">Industry</label>
              <label class="edit-sub-labels">Select an industry category</label>
              <v-combobox
                :items="categories"
                label="Select the industry category"
                outlined
                class="edit-select"
                v-model="selectedCategory"
                :rules="[categoryRule]"
                required
              ></v-combobox>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="edit-industry-area pb-4 pa-0">
            <v-list-item-content class="pt-10 pb-0">
              <label class="edit-labels">Email Date Range</label>
              <label class="edit-sub-labels">Select range of emails’ sending date</label>
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
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="edit-industry-area pb-4 pa-0">
            <v-list-item-content class="pt-4 pb-0">
              <label class="edit-labels">Duration</label>
              <label class="edit-sub-labels">Select how many days the investigation will run</label>
              <v-select
                :items="durations"
                label="3 days"
                outlined
                class="input-select"
                v-model="selectedDuration"
                :rules="[v => !!v || 'Duration is required']"
                required
              ></v-select>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="edit-industry-area pb-4 pa-0">
            <v-list-item-content class="pt-4 pb-0">
              <label class="edit-labels">Action</label>
              <label class="edit-sub-labels">Select action to be executed if email is found</label>
              <v-select
                :items="actions"
                label="Delete email"
                outlined
                class="input-select"
                v-model="selectedAction"
                :rules="[v => !!v || 'Action is required']"
                required
              ></v-select>
            </v-list-item-content>
          </v-list-item>
        </v-form>
      </v-card>
    </div>
    <div class="footer-actions">
      <v-btn class="cancel-btn" text color="#f56c6c" @click="onCancelClicked">CANCEL</v-btn>
      <v-btn class="create-btn" text color="#2196f3" @click="onCreateClicked">CREATE</v-btn>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      investgationName: '',
      targetUsers: '',
      startDate: '',
      endDate: '',
      selectedDuration: '',
      selectedAction: '',
      name: '',
      description: '',
      privacy: false,
      categories: [],
      selectedCategory: '',
      durations: ['1 Day', '3 Days', '7 Days', '14 Days', '30 Days'],
      actions: ['Delete email', 'Notify users', 'No action'],
      valid: false,
      menu1: '',
      menu2: '',
      nameRules: {
        required: v =>
          (v && v.length >= 5 && v.length <= 80) ||
          'Investigation Name must between 5-80 characters',
        regex: v =>
          /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
          'Only use letters, digits, period, comma, underline and hyphen',
        empty: v => (v && !v.startsWith(' ')) || 'Comunity Name cannot start with space'
      },
      descriptionRules: {
        required: v =>
          (!!v && v.length >= 5 && v.length <= 300) ||
          'Description required and must between 5-300 characters.',
        regex: v =>
          /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
          'Only use letters, digits, period, comma, underline and hyphen',
        empty: v => (v && !v.startsWith(' ')) || 'Description cannot start with space'
      },
      categoryRules: {
        required: v => (!!v && v.length < 1) || 'Category required for creating a investigation'
      }
    }
  },
  computed: {
    ...mapGetters({}),
    categoryRule() {
      if (this.selectedCategory && this.selectedCategory.length) {
        return true
      } else {
        return 'Category required for creating a investigation'
      }
    }
  },
  methods: {
    onCancelClicked() {
      this.$emit('closeAdd')
    },
    onCreateClicked() {
      if (this.$refs.form.validate() && !this.investigationNameAvailable) {
        let selectedBusinessObj = this.businessCategories.filter(
          item => item.IDESC == this.selectedCategory
        )
        localStorage.setItem('investigationName', this.name)
        const newInvestigationObj = {
          Name: this.name,
          Description: this.description,
          IsPrivate: this.privacy,
          CreateUserId: localStorage.getItem('userId'),
          BusinessCategory: [
            {
              IKEY: selectedBusinessObj[0].IKEY
            }
          ],
          InvestigationCompany: [
            {
              CompanyId: localStorage.getItem('companyId'),
              CompanyName: localStorage.getItem('companyName')
            }
          ]
        }
        const refThis = this
        this.$store.dispatch('threadSharing/createCommunity', newCommunityObj).then(() => {
          refThis.$emit('closeAdd')
        })
      }
    },
    checkInvestigationName() {
      if (this.name.length && !this.name.startsWith(' '))
        this.$store.dispatch('threadSharing/checkName', this.name)
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
        this.$store.dispatch('threadSharing/investigationStarted')
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
  mounted() {}
}
</script>
<style lang="scss" scoped>
.new-investigation-container {
  min-height: 100vh;
  height: 820px;
  overflow: visible;
  width: 100%;

  .new-investigation-inner {
    width: 100%;
    height: 100%;
    padding: 0 8vw;
    position: relative;
    display: flex;
    overflow: visible;
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

  .edit-labels {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 0 !important;
    padding-bottom: 3px;
  }
  .edit-sub-labels {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 0 !important;
    padding-bottom: 14px;
  }
  ::v-deep .edit-select > .v-input__control {
    align-items: center;
    display: flex;
    height: 40px !important;
  }
  ::v-deep .v-text-field.v-text-field--enclosed .v-input__append-inner {
    margin-top: 8px !important;
  }
  ::v-deep .edit-select > .v-input__control {
    align-items: center;
    display: flex;
    height: 40px !important;
  }
  ::v-deep .v-text-field.v-text-field--enclosed .v-input__append-inner {
    margin-top: 8px !important;
  }
  .edit-privacy-buttons {
    align-items: center;
    display: flex;
    width: 168px;

    button {
      border-radius: 18px !important;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px !important;
      font-weight: 400 !important;
      font-stretch: normal !important;
      font-style: normal !important;
      line-height: 1.71 !important;
      letter-spacing: normal !important;
      text-transform: none !important;
      padding: 0 16px !important;
    }
    .public-btn {
      border: 1px solid #757575;
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      height: 36px;
      margin-left: 4px;
    }
    .private-btn {
      border: 1px solid #757575;
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
      height: 36px;
      margin-left: 9px;
    }
  }
  .edit-privacy-bottom-label {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    color: #909399;
    padding-top: 8px;
    margin: 0 !important;
  }
  .theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
    background-color: unset;
  }
  .v-btn:not(.v-btn--text):not(.v-btn--outlined).v-btn--active:before {
    opacity: 1;
  }
  .v-btn-toggle > .v-btn.v-btn--active,
  .v-btn-toggle > .v-btn.v-btn--active::before {
    color: #fff;
  }
  .btnActive {
    height: 36px;
    border-radius: 18px;
    border: solid 1px #757575;
  }
  .btnActive,
  .btnActive:active,
  .btnActive:hover,
  .btnActive:focus {
    border: unset !important;
    outline: 0 !important;
  }
  .btnActive,
  .btnActive::before {
    border: unset !important;
    border-color: unset !important;
    color: #fff;
    background-color: #2196f3 !important;
    box-shadow: 0 2px 5px 0 #2196f3 !important;
  }
  .private-btn.v-btn.v-btn--active {
    border-left: transparent !important;
  }
  .v-btn-toggle--group > .v-btn.v-btn {
    border-color: #757575;
    border-left: 1px solid #757575 !important;
  }
  .v-btn:before {
    top: -1px !important;
    left: -1px !important;
  }
  .footer-actions {
    align-items: center;
    bottom: 0;
    background-color: #f5f7fa;
    display: flex;
    left: 0;
    position: fixed;
    justify-content: space-between;
    padding: 0 10vw;
    height: 68px;
    width: 100%;
    z-index: 9999;

    .cancel-btn {
      background-color: transparent !important;
      border-radius: 18px !important;
      border: solid 1px #f56c6c !important;
      color: #f56c6c !important;
    }
    .create-btn {
      border-radius: 18px !important;
      box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
      background-color: #2196f3 !important;
      color: #fff !important;
    }
  }
}
.error-border {
  ::v-deep fieldset {
    border: 2px solid #ff5252 !important;
  }
}
.edit-industry-area {
  ::v-deep .v-list-item__content {
    overflow: visible;
  }
  ::v-deep .v-text-field__details {
    position: absolute;
    left: 0;
    bottom: -28px;
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

.date-row {
  max-width: 390px !important;
  display: flex;
  flex-direction: row;

  @media only screen and (max-width: 1025px) {
    width: 100%;
    max-width: 100% !important;
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
        padding-left: 7px;
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
