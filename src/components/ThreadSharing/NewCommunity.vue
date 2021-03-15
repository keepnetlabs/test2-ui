<template>
  <div class="new-community-container">
    <app-dialog
      :status="isWantToAccept"
      body="You are changing the privacy settings for community from private to public. All member requests will be accepted?"
      icon="mdi-account-plus"
      subtitle=""
      title="Accept all requests?"
    >
      <template v-slot:app-dialog-footer>
        <div class="d-flex download-buttons flex-row flex-wrap justify-end">
          <v-btn
            class="k-dialog__button"
            color="#f56c6c"
            text
            id="threat-sharing-new-community-accept-modal-cancel-button"
            @click=";(isWantToAccept = false), (privacystatusid = oldPrivacyValue)"
            >{{ labels.Cancel }}
          </v-btn>
          <v-btn
            id="threat-sharing-new-community-accept-modal-accept-all-button"
            class="k-dialog__button"
            color="#2196f3"
            text
            @click="isWantToAccept = false"
            >Accept All
          </v-btn>
        </div>
      </template>
    </app-dialog>
    <div class="new-community-inner">
      <v-card class="pa-0" flat light style="width: 600px;">
        <v-list-item class="pl-0 pr-0 new-community-inner__title-section">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon class="ml-2" color="blue" left medium>mdi-send</v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline"
              >{{ resourceId ? 'Edit' : 'Create New' }} Community
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-list-item class="edit-name-area pt-10 pa-0">
            <v-list-item-content class="pt-0 pb-0">
              <label class="pb-3 edit-labels">Community Name</label>
              <v-text-field
                v-model.trim="name"
                :rules="[
                  nameRules.required,
                  nameRules.empty,
                  nameRules.minLength,
                  nameRules.maxLength
                ]"
                class="edit-name-textfield"
                outlined
                placeholder="Community Name"
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
                v-model.trim="description"
                :rules="[
                  descriptionRules.required,
                  descriptionRules.empty,
                  descriptionRules.minLength,
                  descriptionRules.maxLength
                ]"
                class="edit-description"
                name="description"
                no-resize
                outlined
                placeholder="Description"
                required
              ></v-textarea>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="edit-industry-area-autocomplete pb-0 pa-0">
            <v-list-item-content class="pt-0 pb-0">
              <label class="edit-labels">Industry</label>
              <label class="edit-sub-labels">Select an industry category</label>
              <k-select
                v-model.trim="selectedCategory"
                :items="categories"
                :rules="[categoryRule]"
                class="edit-select"
                item-text="name"
                outlined
                placeholder="Select the industry category"
                required
                return-object
                type="autocomplete"
              ></k-select>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="edit-industry-area pa-0 target-users-select">
            <v-list-item-content class>
              <label class="edit-labels">Privacy</label>
              <label class="edit-sub-labels pb-0">Select a privacy option</label>
              <div class="new-community__radio-group">
                <v-radio-group v-model="privacystatusid" :mandatory="false" row>
                  <v-radio color="primary" label="Public" value="1"></v-radio>
                  <v-radio color="primary" label="Private" value="2"></v-radio>
                  <v-radio color="primary" label="Hidden" value="3"></v-radio>
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
                  v-model="acceptCheckbox"
                  :rules="[checkboxRule.required]"
                  class="k-checkbox accept-terms-and-conditions-checkbox"
                  color="#2196f3"
                  @change="checkCheckboxValidation()"
                />
                <div class="d-flex accept-terms-and-conditions-label-group">
                  <label :for="'accept-terms-and-conditions-post-incident'" class="mr-1"
                    >I accept
                  </label>
                  <a
                    :href="termsAndConditionsUrl"
                    class="mr-1"
                    target="_blank"
                    @click="(event) => event.stopPropagation()"
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
      <v-btn
        id="threat-sharing-new-community-cancel-modal-button"
        class="cancel-btn"
        color="#f56c6c"
        text
        @click="onCancelClicked"
        >{{ labels.Cancel }}
      </v-btn>
      <v-btn
        :disabled="saveDisable"
        class="create-btn"
        color="#2196f3"
        text
        @click="onCreateClicked"
        id="threat-sharing-new-community-update-or-create-modal-button"
        >{{ resourceId ? 'Update' : 'Create' }}
      </v-btn>
    </div>
  </div>
</template>
<script>
import { createCommunity, listBusinessCategories, updateCommunity } from '../../api/threadSharing'
import { COMMON_CONSTANTS } from '../../model/constants/commonConstants'
import AppDialog from '../AppDialog'
import { scrollToComponent } from '../../utils/functions'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import * as validations from '@/utils/validations'

export default {
  components: {
    KSelect,
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
      saveDisable: false,
      labels,
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
        required: (v) => validations.required(v, labels.Required),
        minLength: (v) =>
          validations.minLength(v, 5, labels.getMinLengthMessage(labels.CommunityName, 5)),
        maxLength: (v) =>
          validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.CommunityName, 64)),
        regex: (v) =>
          /^[a-z\d\-_\s]+$/i.test(v) ||
          'Only use letters, digits, period, comma, underline and hyphen',
        empty: (v) => (v && !v.startsWith(' ')) || 'Community Name cannot start with space'
      },
      descriptionRules: {
        required: (v) => validations.required(v, labels.Required),
        minLength: (v) =>
          validations.minLength(v, 5, labels.getMinLengthMessage(labels.Description, 5)),
        maxLength: (v) =>
          validations.maxLength(v, 300, labels.getMaxLengthMessage(labels.Description, 300)),
        empty: (v) => (v && !v.startsWith(' ')) || 'Description cannot start with space'
      },
      checkboxRule: {
        required: (v) => {
          return v || 'You must accept terms and conditions before creating the community'
        }
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
        this.saveDisable = true
        const payload = {
          name: this.name,
          description: this.description,
          privacystatusid: this.privacystatusid,
          industryresourceid: this.selectedCategory.resourceId,
          istermsandconditionsaccepted: this.acceptCheckbox
        }
        if (!!this.resourceId) {
          updateCommunity(this.resourceId, payload)
            .then(() => {
              refThis.$emit('closeAdd')
              this.isWantToAccept = false
              localStorage.setItem('communityName', this.name)
              localStorage.setItem('communityResourceIdForRedirect', this.resourceId)
              refThis.$router.replace({
                name: 'Community',
                params: { communityName: this.name, rnd: Math.random(), id: this.resourceId }
              })
              this.$store.dispatch('tableReload/setTableReload', true)
              setTimeout(() => {
                refThis.$parent.$parent.$parent.$parent.$parent.$parent.communityName = this.name
              }, 200)
            })
            .finally(() => (this.saveDisable = false))
        } else {
          createCommunity(payload)
            .then((response) => {
              this.isWantToAccept = false
              localStorage.setItem('communityName', this.name)
              localStorage.setItem('communityResourceIdForRedirect', response.data.data.resourceId)
              this.$store.dispatch('tableReload/setTableReload', true)
              this.$router.push({
                name: 'Community',
                params: {
                  communityName: this.name,
                  rnd: Math.random(),
                  id: response.data.data.resourceId
                }
              })
            })
            .finally(() => (this.saveDisable = false))
        }
      } else {
        this.saveDisable = false
        const el = this.$refs.form.$el
        scrollToComponent(el)
      }
    },
    getBusinessCategories() {
      listBusinessCategories().then((response) => {
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
<style lang="scss" src="./NewCommunity.scss"></style>
