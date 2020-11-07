<template>
  <div class="new-community-container">
    <app-dialog
      :status="isWantToAccept"
      icon="mdi-account-plus"
      title="Accept all requests?"
      subtitle=""
      body="You are changing the privacy settings for community from private to public. All member requests will be accepted?"
    >
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <v-btn
            text
            color="#f56c6c"
            class="k-dialog__button"
            @click=";(isWantToAccept = false), (privacystatusid = oldPrivacyValue)"
            >CANCEL</v-btn
          >
          <v-btn text color="#2196f3" class="k-dialog__button" @click="isWantToAccept = false"
            >Accept All</v-btn
          >
        </div>
      </template>
    </app-dialog>
    <div class="new-community-inner">
      <v-card flat light class="pa-0" style="width: 600px;">
        <v-list-item class="pl-0 pr-0 new-community-inner__title-section">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">mdi-send</v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline"
              >{{ resourceId ? 'Edit' : 'Create New' }} Community</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-list-item class="edit-name-area pt-10 pa-0">
            <v-list-item-content class="pt-0 pb-0">
              <label class="pb-3 edit-labels">Community Name</label>
              <v-text-field
                placeholder="Community Name"
                outlined
                class="edit-name-textfield"
                v-model.trim="name"
                :rules="[nameRules.empty, nameRules.required]"
                required
              >
              </v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="edit-descrition-area pa-0">
            <v-list-item-content class="pt-0 pb-0">
              <label class="edit-labels">Description</label>
              <label class="edit-sub-labels"
                >Describe the community’s goals and rules. (Max. 300 characters)</label
              >
              <v-textarea
                name="description"
                outlined
                v-model.trim="description"
                :rules="[descriptionRules.required, descriptionRules.empty]"
                required
                class="edit-description"
                placeholder="Description"
                no-resize
              ></v-textarea>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="edit-industry-area-autocomplete pb-0 pa-0">
            <v-list-item-content class="pt-0 pb-0">
              <label class="edit-labels">Industry</label>
              <label class="edit-sub-labels">Select an industry category</label>
              <v-autocomplete
                :items="categories"
                return-object
                item-text="name"
                placeholder="Select the industry category"
                outlined
                class="edit-select"
                v-model.trim="selectedCategory"
                :rules="[categoryRule]"
                required
              ></v-autocomplete>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="edit-industry-area pa-0 target-users-select">
            <v-list-item-content class>
              <label class="edit-labels">Privacy</label>
              <label class="edit-sub-labels pb-0">Select a privacy option</label>
              <div class="new-community__radio-group">
                <v-radio-group v-model="privacystatusid" :mandatory="false" row>
                  <v-radio value="1" label="Public" color="primary"></v-radio>
                  <v-radio value="2" label="Private" color="primary"></v-radio>
                  <v-radio value="3" label="Hidden" color="primary"></v-radio>
                </v-radio-group>
                <label v-if="privacystatusid == '1'" class="edit-privacy-bottom-label"
                  >Anyone can find the community and see posted threats</label
                >
                <label v-else-if="privacystatusid == '2'" class="edit-privacy-bottom-label"
                  >Only members can see posted threats and community is listed</label
                >
                <label v-else class="edit-privacy-bottom-label"
                  >Only members can see posted threats and the group in communities list</label
                >
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="p-0">
            <v-list-item-content class="pt-1 pb-0">
              <div class="d-flex" style="margin-bottom: 8px;">
                <v-checkbox
                  id="accept-terms-and-conditions-post-incident"
                  class="k-checkbox accept-terms-and-conditions-checkbox"
                  color="#2196f3"
                  v-model="acceptCheckbox"
                  :rules="[checkboxRule.required]"
                  @change="checkCheckboxValidation()"
                />
                <div class="d-flex accept-terms-and-conditions-label-group">
                  <label :for="'accept-terms-and-conditions-post-incident'" class="mr-1"
                    >I accept
                  </label>
                  <a
                    :href="termsAndConditionsUrl"
                    @click="(event) => event.stopPropagation()"
                    class="mr-1"
                    target="_blank"
                    >terms and conditions</a
                  >
                  <label :for="'accept-terms-and-conditions-post-incident'"> for communities</label>
                </div>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-form>
      </v-card>
    </div>
    <div class="footer-actions">
      <v-btn class="cancel-btn" text color="#f56c6c" @click="onCancelClicked">CANCEL</v-btn>
      <v-btn class="create-btn" text color="#2196f3" @click="onCreateClicked">{{
        resourceId ? 'Update' : 'Create'
      }}</v-btn>
    </div>
  </div>
</template>
<script>
import { createCommunity, listBusinessCategories, updateCommunity } from '../../api/threadSharing'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import AppDialog from '../AppDialog'
import { scrollToComponent } from '../../utils/functions'

export default {
  components: {
    AppDialog
  },
  props: {
    resourceId: {
      required: false
    },
    communityItem: {
      required: false
    }
  },
  data() {
    return {
      termsAndConditionsUrl: 'https://www.keepnetlabs.com/terms-conditions/',
      isWantToAccept: false,
      oldPrivacyValue: null,
      name: '',
      description: '',
      privacy: false,
      categories: [],
      selectedCategory: '',
      valid: false,
      privacystatusid: '1',
      acceptCheckbox: false,
      isCheckboxChecked: false,
      nameRules: {
        required: (v) =>
          (v && v.length >= 5 && v.length <= 80) || 'Community Name must between 5-80 characters',
        regex: (v) =>
          /^[a-z\d\-_\s]+$/i.test(v) ||
          'Only use letters, digits, period, comma, underline and hyphen',
        empty: (v) => (v && !v.startsWith(' ')) || 'Community Name cannot start with space'
      },
      checkboxRule: {
        required: (v) => {
          return v || 'You must accept terms and conditions before creating the community'
        }
      },
      descriptionRules: {
        required: (v) =>
          (!!v && v.length >= 5 && v.length <= 300) ||
          'Description is required and must be between 5-300 characters.',
        empty: (v) => (v && !v.startsWith(' ')) || 'Description cannot start with space'
      },
      categoryRules: {
        required: (v) => (!!v && v.length < 1) || 'Category required for creating a community'
      }
    }
  },
  watch: {
    privacystatusid: function (newVal, oldVal) {
      this.oldPrivacyValue = oldVal
      if (this.resourceId) {
        if (newVal == 1 && oldVal == 2) {
          this.isWantToAccept = true
        } else {
          this.isWantToAccept = false
        }
      }
    }
  },
  computed: {
    categoryRule() {
      if (this.selectedCategory) {
        return true
      } else {
        return 'Category required for creating a community'
      }
    }
  },
  methods: {
    blurIndustry() {
      if (!this.selectedCategory || !this.selectedCategory.name) {
        this.selectedCategory = null
      }
    },
    checkCheckboxValidation() {
      this.isCheckboxChecked = this.acceptCheckbox
    },
    onCancelClicked() {
      this.$emit('closeAdd')
    },
    onCreateClicked() {
      const refThis = this
      if (this.$refs.form.validate()) {
        const payload = {
          name: this.name,
          description: this.description,
          privacystatusid: this.privacystatusid,
          industryresourceid: this.selectedCategory.resourceId,
          istermsandconditionsaccepted: this.acceptCheckbox
        }
        if (!!this.resourceId) {
          updateCommunity(this.resourceId, payload)
            .then((response) => {
              this.$store.dispatch('common/createSnackBar', {
                color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
                message: 'Community have been updated'
              })
              refThis.$emit('closeAdd')
              this.isWantToAccept = false
              localStorage.setItem('communityName', this.name)
              localStorage.setItem('communityResourceIdForRedirect', this.resourceId)
              this.$router.push(`/community/${this.resourceId}`)
            })
            .catch((error) => {
              this.$store.dispatch('common/createSnackBar', {
                color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
                message: 'Community can not be updated'
              })
            })
        } else {
          createCommunity(payload)
            .then((response) => {
              this.$store.dispatch('common/createSnackBar', {
                color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
                message: 'New community has been created'
              })
              //refThis.$emit('closeAdd')
              this.isWantToAccept = false
              localStorage.setItem('communityName', this.name)
              localStorage.setItem('communityResourceIdForRedirect', response.data.data.resourceId)
              this.$router.push(`/community/${response.data.data.resourceId}`)
            })
            .catch((error) => {
              this.$store.dispatch('common/createSnackBar', {
                color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
                message: 'New community can not be created'
              })
            })
        }
      } else {
        const el = this.$refs.form.$el
        scrollToComponent(el)
      }
    },
    getBusinessCategories() {
      listBusinessCategories()
        .then((response) => {
          this.categories = response.data.data
          if (!!this.resourceId) {
            this.name = this.communityItem.communityName
            this.description = this.communityItem.communityDescription
            this.privacystatusid = this.communityItem.privacyStatusId.toString()
            this.selectedCategory = {
              resourceId: this.communityItem.industryResourceId,
              name: this.categories.find(
                (item) => item.resourceId == this.communityItem.industryResourceId
              ).name
            }
          }
        })
        .catch((error) => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'Error when getting business category list'
          })
        })
    }
  },
  mounted() {
    this.getBusinessCategories()
  },
  created() {
    document.querySelector('html').style.overflowY = 'hidden'
  },
  beforeDestroy() {
    document.querySelector('html').style.overflowY = ''
  }
}
</script>
<style lang="scss">
.new-community-container {
  min-height: 100vh;
  height: 820px;
  overflow: visible;
  width: 100%;

  .v-list-item__content {
    overflow: visible;
    padding-left: 10px;
  }
  .k-checkbox .v-messages {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .k-checkbox {
    &__checkbox-text {
      position: absolute;
      top: 13px;
      left: 45px;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      cursor: pointer;
    }
  }
  .v-text-field__slot input,
  textarea,
  .v-select__slot input {
    font-size: 13px;
    font-weight: normal !important;
    font-stretch: normal !important;
    font-style: normal !important;
    line-height: normal !important;
    letter-spacing: normal !important;
    color: rgba(0, 0, 0, 0.72) !important;
  }
  .v-radio .v-label {
    font-size: 14px !important;
    font-weight: normal !important;
    font-stretch: normal !important;
    font-style: normal !important;
    line-height: 1.5 !important;
    letter-spacing: normal !important;
    color: rgba(0, 0, 0, 0.87) !important;
  }
  .new-community {
    &__radio-group {
      .v-input--radio-group {
        margin-top: 0;
        .v-messages {
          display: none !important;
        }
      }
    }
  }

  .new-community-inner {
    width: 100%;
    height: 100%;
    padding: 31px 96px;
    position: relative;
    display: flex;
    overflow: visible;
    &__title-section {
      padding-left: 10px !important;
    }
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
    padding: 0 104px;
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
  .v-list-item__content {
    overflow: visible;
  }

  .v-text-field__details {
    position: absolute;
    left: 0;
    bottom: -28px;
  }
}
</style>
