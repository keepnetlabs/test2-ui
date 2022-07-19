<template>
  <div class="edit-community-container">
    <v-overlay
      id="edit-community-overlay"
      fixed
      :opacity="0.46"
      :value="privateToPublic"
      :z-index="999"
    >
      <v-card
        id="accept-all-requests-card"
        light
        class="confirm-dialog pb-4 pa-6"
        style="width: 491px;"
      >
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">mdi-account-plus</v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Accept all requests?</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="pl-0 pr-0 pt-7 pb-6">
          <span class="accept-info"
            >You are changing the privacy settings for community from private to public. All member
            requests will be accepted?</span
          >
        </v-list-item>
        <div class="d-flex flex-row flex-wrap justify-end">
          <v-btn id="privacy-cancel-all-btn" text color="#f56c6c" @click="cancelPrivateToPublic()"
            >{{ labels.Cancel }}
          </v-btn>
          <v-btn id="privacy-accept-all-btn" text color="#2196f3" @click="privateToPublic = false"
            >ACCEPT ALL
          </v-btn>
        </div>
      </v-card>
    </v-overlay>
    <v-card light id="edit-community" class="edit-community pb-4 pa-6" style="width: 600px;">
      <v-list-item class="pl-0 pr-0">
        <div class="v-btn v-cart-icon-wrapper">
          <v-icon medium left color="blue" class="ml-2">mdi-pencil</v-icon>
        </div>
        <v-list-item-content class="pt-0 pb-0">
          <v-list-item-title class="v-card-headline">Edit Community</v-list-item-title>
          <v-list-item-subtitle class="v-card-sub-header"
            >Edit general information and settings
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-list-item class="edit-name-area pt-10 pa-0">
          <v-list-item-content class="name-list-item-container pt-0 pb-0">
            <label class="edit-labels">Name</label>
            <v-text-field
              v-model="name"
              required
              placeholder="Placeholder"
              outlined
              :rules="[
                nameRules.required,
                nameRules.empty,
                nameRules.minLength,
                nameRules.maxLength
              ]"
              :class="{ 'error-border': communNameAvailableForUpdate }"
              class="edit-name-textfield"
              @blur="checkCommunName()"
            />
            <p
              v-if="communNameAvailableForUpdate && nameRules.regex() && nameRules.required()"
              style="margin-top: -10px; margin-left: 12px;"
              class="v-messages theme--light error--text"
            >
              A Community Exists with the same name. Please try another name for your community
            </p>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="edit-descrition-area pa-0">
          <v-list-item-content class="description-item-container pt-0 pb-0">
            <label class="edit-labels">Description</label>
            <label class="edit-sub-labels"
              >Describe the community’s goals and rules. (Max. 300 characters)</label
            >
            <v-textarea
              v-model="description"
              name="description"
              outlined
              :rules="[
                descriptionRules.required,
                descriptionRules.empty,
                descriptionRules.minLength,
                descriptionRules.maxLength
              ]"
              class="edit-description"
              placeholder="Description"
              required
              no-resize
            />
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="edit-industry-area pb-4 pa-0">
          <v-list-item-content class="pt-0 pb-0">
            <label class="edit-labels">Industry</label>
            <label class="edit-sub-labels">Select an industry category</label>
            <k-select
              type="autocomplete"
              :items="categories"
              return-object
              item-text="name"
              placeholder="Select the industry category"
              outlined
              class="edit-select"
              v-model.trim="selectedCategory"
              :rules="[categoryRule]"
              required
            ></k-select>
          </v-list-item-content>
        </v-list-item>
      </v-form>
      <v-list-item class="edit-privacy-area pb-6 pt-4 pa-0">
        <v-list-item-content class="pt-0 pb-0">
          <label class="edit-labels">Privacy</label>
          <label class="edit-sub-labels">Select a privacy option</label>
          <div class="edit-privacy-buttons">
            <button :class="{ btnActive: !privacy }" @click="privacy = false" class="public-btn">
              PUBLIC
            </button>
            <button :class="{ btnActive: privacy }" @click="privacy = true" class="private-btn">
              PRIVATE
            </button>
          </div>
          <label class="edit-privacy-bottom-label"
            >Anyone can find the community and see posted threats</label
          >
        </v-list-item-content>
      </v-list-item>
      <div class="d-flex flex-row flex-wrap justify-end">
        <v-btn text color="#f56c6c" @click="onCancelClicked">{{ labels.Cancel }}</v-btn>
        <v-btn text color="#2196f3" @click="onSaveClicked">{{ labels.Save }}</v-btn>
      </div>
    </v-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import * as validations from '@/utils/validations'

export default {
  components: { KSelect },
  data() {
    return {
      labels,
      name: '',
      communId: '',
      description: '',
      privacy: false,
      categories: [],
      selectedCategory: '',
      valid: false,
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
      privateToPublic: false,
      mountedPrivacy: null
    }
  },
  computed: {
    ...mapGetters({
      selectedCommunity: 'threatSharing/selectedCommunityGetter',
      fetchedCommunity: 'threatSharing/fetchedCommunGetter',
      businessCategories: 'threatSharing/businessCategoryGetter',
      communNameAvailableForUpdate: 'threatSharing/communNameAvailableForUpdateGetter'
    }),
    categoryRule() {
      if (this.selectedCategory && this.selectedCategory.length) {
        return true
      } else {
        return 'Category required for creating a community'
      }
    }
  },
  watch: {
    privacy(val) {
      if (this.mountedPrivacy === true && val === false) {
        this.privateToPublic = true
      }
    }
  },
  methods: {
    onCancelClicked() {
      this.$emit('closeEdit')
      this.name = ''
      this.description = ''
      this.selectedCategory = ''
      this.$store.commit('threatSharing/SET_COMMUN_NAME', false)
    },
    onSaveClicked() {
      this.checkCommunName()
      setTimeout(() => {
        if (this.$refs.form.validate() && !this.communNameAvailableForUpdate) {
          const updateObj = {
            communityId: this.selectedCommunity.id || localStorage.getItem('communityId'),
            name: this.name,
            description: this.description,
            privacy: this.privacy,
            userId: localStorage.getItem('userId'),
            ikey: this.getIKEY(),
            companyId: localStorage.getItem('companyId'),
            industry: this.selectedCategory
          }
          const refThis = this
          this.$store.dispatch('threatSharing/updateCommunity', updateObj).then(() => {
            refThis.$emit('closeEdit')
            localStorage.setItem('communityName', refThis.name)
            localStorage.setItem('communityDesc', refThis.description)
            localStorage.setItem('communityPrivacy', refThis.privacy)
            this.$store.dispatch('threatSharing/getCommunities')
          })
        }
      }, 500)
    },
    getIKEY() {
      let theIKEY = this.businessCategories.filter((c) => c.IDESC == this.selectedCategory)
      return theIKEY[0].IKEY
    },
    checkCommunName() {
      if (this.name.length && !this.name.startsWith(' ')) {
        let obj = {
          name: this.name,
          communId: this.communId
        }
        this.$store.dispatch('threatSharing/checkNameForUpdate', obj)
      }
    },
    cancelPrivateToPublic() {
      this.privateToPublic = false
      this.privacy = this.mountedPrivacy
    }
  },
  created() {
    if (this.$router.currentRoute.name === 'Community') {
      this.privacy = JSON.parse(localStorage.getItem('communityPrivacy'))
      this.mountedPrivacy = JSON.parse(localStorage.getItem('communityPrivacy'))
    } else {
      this.privacy = this.selectedCommunity.privacy
      this.mountedPrivacy = this.selectedCommunity.privacy
    }
  },
  mounted() {
    this.name = this.selectedCommunity.name || localStorage.getItem('communityName')
    this.description = this.selectedCommunity.description || localStorage.getItem('communityDesc')
    this.selectedCategory = this.selectedCommunity.industry || localStorage.getItem('communityCat')
    this.communId = this.selectedCommunity.id || localStorage.getItem('communityId')
    let businessCats = []
    for (let cat of this.businessCategories) {
      businessCats.push(cat.IDESC)
    }
    this.categories = businessCats
  }
}
</script>
