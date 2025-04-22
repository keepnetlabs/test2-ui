<template>
  <AppModal
    v-if="status"
    :status="status"
    :id="resourceId ? 'edit-community-modal' : 'new-community-modal'"
    :title="resourceId ? 'Edit Community' : 'Create New Community'"
    :save-disable="saveDisable"
    confirm-button-id="btn-save--new-community-modal"
    cancel-button-id="btn-cancel--new-community-modal"
    title-id="text--new-community-modal-title"
    icon-name="mdi-send"
    @closeOverlay="onCancelClicked"
    @submit="onCreateClicked"
  >
    <template #overlay-body>
      <PrivacySettingsDialog
        v-if="isShowPrivacySettingsDialog"
        :status="isShowPrivacySettingsDialog"
        @on-close="toggleShowPrivacyDialog"
        @on-confirm="toggleShowPrivacyDialog(false)"
      />
      <v-form ref="form" class="mt-8">
        <FormGroup has-hint title="Community Name">
          <InputEntityName
            v-model.trim="name"
            id="input--threat-sharing-community-name"
            entity-name="community name"
            initial-placeholder="Community Name"
            :initial-rules="communityNameRules"
          />
        </FormGroup>
        <FormGroup
          has-hint
          title="Description"
          sub-title="Describe the community’s goals and rules. (Max. 300 characters)"
        >
          <InputDescription
            v-model.trim="description"
            id="input--threat-sharing-community-description"
            initial-placeholder="Description"
            :initial-rules="communityDescriptionRules"
            :required="true"
          />
        </FormGroup>
        <FormGroup has-hint title="Industry" sub-title="Select an industry category">
          <k-select
            v-model.trim="selectedCategory"
            type="autocomplete"
            id="input--threat-sharing-community-industry-category"
            custom-menu-class="menu--threat-sharing-community-industry-category"
            class="edit-select"
            item-text="name"
            item-value="resourceId"
            outlined
            required
            persistent-hint
            return-object
            hint="*Required"
            placeholder="Select the industry category"
            :items="categories"
            :rules="[(v) => !!v || 'Required']"
          ></k-select>
        </FormGroup>
        <FormGroup title="Privacy" sub-title="Select a privacy option">
          <div class="new-community__radio-group">
            <v-radio-group
              v-model="privacyStatusId"
              :mandatory="false"
              class="my-0 p-0"
              id="input--threat-sharing-community-privacy-status"
              row
            >
              <v-radio
                id="input--threat-sharing-community-privacy-status-public"
                color="primary"
                label="Public"
                value="1"
              ></v-radio>
              <v-radio
                id="input--threat-sharing-community-privacy-status-privacy"
                color="primary"
                label="Private"
                value="2"
              ></v-radio>
              <v-radio
                id="input--threat-sharing-community-privacy-status-hidden"
                color="primary"
                label="Hidden"
                value="3"
              ></v-radio>
            </v-radio-group>
            <div v-if="privacyStatusId === '1'" class="edit-privacy-bottom-label pt-0">
              Anyone can find the community and see posted threats
            </div>
            <div v-else-if="privacyStatusId === '2'" class="edit-privacy-bottom-label pt-0">
              Only members can see posted threats and community is listed
            </div>
            <div v-else class="edit-privacy-bottom-label pt-0">
              Only members can see posted threats and the group in communities list
            </div>
          </div>
        </FormGroup>
        <v-list-item class="p-0">
          <v-list-item-content class="pt-1 pb-0">
            <div class="d-flex" style="margin-bottom: 8px;">
              <v-checkbox
                v-model="acceptCheckbox"
                id="input--threat-sharing-community-is-accept"
                :rules="[checkboxRule.required]"
                class="k-checkbox accept-terms-and-conditions-checkbox"
                color="#2196f3"
              />
              <div class="d-flex accept-terms-and-conditions-label-group">
                <label :for="'input--threat-sharing-community-is-accept'" class="mr-1"
                  >I accept
                </label>
                <a
                  :href="termsAndConditionsUrl"
                  class="mr-1"
                  target="_blank"
                  @click="(event) => event.stopPropagation()"
                  >terms and conditions</a
                >
                <label :for="'input--threat-sharing-community-is-accept'"> for communities</label>
              </div>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-form>
    </template>
  </AppModal>
</template>
<script>
import { createCommunity, listBusinessCategories, updateCommunity } from '@/api/threatSharing'
import { scrollToComponent, isDifferent, createRandomCryptNumber } from '@/utils/functions'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import * as validations from '@/utils/validations'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import FormGroup from '@/components/SmallComponents/FormGroup'
import PrivacySettingsDialog from '@/components/ThreatSharing/NewCommunity/PrivacySettingsDialog'
import AppModal from '@/components/AppModal'

export default {
  components: {
    AppModal,
    PrivacySettingsDialog,
    FormGroup,
    KSelect,
    InputEntityName,
    InputDescription
  },
  props: {
    status: {
      type: Boolean
    },
    resourceId: {
      required: false
    },
    communityItem: {
      required: false
    }
  },
  data() {
    return {
      isSubmitted: false,
      saveDisable: false,
      isShowPrivacySettingsDialog: false,
      labels,
      termsAndConditionsUrl: 'https://www.keepnetlabs.com/terms-conditions/',
      oldPrivacyValue: null,
      initialFormValues: {},
      name: '',
      description: '',
      categories: [],
      selectedCategory: null,
      privacyStatusId: '1',
      acceptCheckbox: false,
      communityNameRules: [
        (v) => validations.required(v, labels.Required),
        (v) => validations.startsWithSpace(v),
        (v) => validations.minLength(v, 5, labels.getMinLengthMessage(labels.CommunityName, 5)),
        (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.CommunityName, 64))
      ],
      communityDescriptionRules: [
        (v) => validations.required(v, labels.Required),
        (v) => validations.startsWithSpace(v),
        (v) => validations.minLength(v, 5, labels.getMinLengthMessage(labels.Description, 5)),
        (v) => validations.maxLength(v, 300, labels.getMaxLengthMessage(labels.Description, 300))
      ],
      checkboxRule: {
        required: (v) => {
          return v || 'You must accept terms and conditions before creating the community'
        }
      }
    }
  },
  watch: {
    privacyStatusId: function (newVal, oldVal) {
      this.oldPrivacyValue = oldVal
      if (this.resourceId) {
        this.isShowPrivacySettingsDialog = !!(newVal === '1' && oldVal === '2')
      }
    }
  },
  created() {
    this.getBusinessCategories()
  },
  methods: {
    toggleShowPrivacyDialog(isCancelled = true) {
      if (isCancelled) this.privacyStatusId = this.oldPrivacyValue
      this.isShowPrivacySettingsDialog = !this.isShowPrivacySettingsDialog
    },
    onCancelClicked() {
      const currentFormValues = {
        name: this.name,
        description: this.description,
        selectedCategory: this.selectedCategory,
        privacyStatusId: this.privacyStatusId,
        acceptCheckbox: this.acceptCheckbox
      }
      const isChanged = isDifferent(currentFormValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit('closeAdd')
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit('closeAdd')
        }
      })
    },
    onCreateClicked() {
      if (this.$refs.form.validate()) {
        this.saveDisable = true
        const payload = {
          name: this.name,
          description: this.description,
          privacyStatusId: this.privacyStatusId,
          industryResourceId: this.selectedCategory.resourceId,
          isTermsAndConditionsAccepted: this.acceptCheckbox
        }
        if (this.resourceId) {
          updateCommunity(this.resourceId, payload)
            .then(() => {
              this.isSubmitted = true
              this.$emit('closeAdd')
              localStorage.setItem('communityName', this.name)
              localStorage.setItem('communityResourceIdForRedirect', this.resourceId)
              const methodName = this.$route.name === 'Community' ? 'replace' : 'push'
              this.$router[methodName]({
                name: 'Community',
                params: {
                  communityName: this.name,
                  rnd: createRandomCryptNumber(),
                  id: this.resourceId
                }
              }).catch(() => {})
              this.$store.dispatch('tableReload/setTableReload', true)
              setTimeout(() => {
                this.$parent.$parent.$parent.$parent.$parent.$parent.communityName = this.name
              }, 200)
            })
            .finally(() => (this.saveDisable = false))
        } else {
          createCommunity(payload)
            .then((response) => {
              this.isSubmitted = true
              localStorage.setItem('communityName', this.name)
              localStorage.setItem('communityResourceIdForRedirect', response.data.data.resourceId)
              this.$store.dispatch('tableReload/setTableReload', true)
              this.$router.push({
                name: 'Community',
                params: {
                  communityName: this.name,
                  rnd: createRandomCryptNumber(),
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
        if (this.resourceId) {
          this.name = this.communityItem.communityName
          this.description = this.communityItem.communityDescription
          this.privacyStatusId = this.communityItem.privacyStatusId.toString()
          this.selectedCategory = {
            resourceId: this.communityItem.industryResourceId,
            name: this.categories.find(
              (item) => item.resourceId === this.communityItem.industryResourceId
            ).name
          }
          this.acceptCheckbox = true
        }
        this.initialFormValues = {
          name: this.name,
          description: this.description,
          selectedCategory: this.selectedCategory,
          privacyStatusId: this.privacyStatusId,
          acceptCheckbox: this.acceptCheckbox
        }
      })
    }
  }
}
</script>
