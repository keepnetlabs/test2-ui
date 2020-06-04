<template>
  <div class="new-community-container">
    <div class="new-community-inner">
      <v-card flat light class="pa-6" style="width: 600px;">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">mdi-send</v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Create New Community</v-list-item-title>
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
                :class="{ 'error-border': communNameAvailable }"
                v-model="name"
                :rules="[nameRules.regex, nameRules.required]"
                required
                @blur="checkCommunName()"
              >
              </v-text-field>
              <p
                v-if="communNameAvailable && nameRules.regex() && nameRules.required()"
                style="margin-top: -10px; margin-left: 12px;"
                class="v-messages theme--light error--text"
              >
                A Community Exists with the same name. Please try another name for your community
              </p>
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
                v-model="description"
                :rules="[descriptionRules.regex, descriptionRules.required, descriptionRules.empty]"
                required
                class="edit-description"
                placeholder="Description"
                no-resize
              ></v-textarea>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="edit-industry-area pb-4 pa-0">
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
        </v-form>
        <v-list-item class="edit-privacy-area pb-6 pt-4 pa-0">
          <v-list-item-content class="pt-0 pb-0">
            <label class="edit-labels">Privacy</label>
            <label class="edit-sub-labels">Select an industry category</label>
            <div class="edit-privacy-buttons">
              <button :class="{ btnActive: !privacy }" @click="privacy = false" class="public-btn">
                PUBLIC
              </button>
              <button :class="{ btnActive: privacy }" @click="privacy = true" class="private-btn">
                PRIVATE
              </button>
            </div>
            <label v-if="privacy" class="edit-privacy-bottom-label"
              >Only invited users can see posted threats</label
            >
            <label v-else class="edit-privacy-bottom-label"
              >Anyone can find the community and see posted threats</label
            >
          </v-list-item-content>
        </v-list-item>
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
      name: '',
      description: '',
      privacy: false,
      categories: [],
      selectedCategory: '',
      valid: false,
      nameRules: {
        required: (v) =>
          (v && v.length >= 5 && v.length <= 80) || 'Community Name must between 5-80 characters',
        regex: (v) =>
          /^[A-Za-z0-9ışŞğĞçÇöÖüÜ,.\-_\s]*$/gi.test(v) ||
          'Only use letters, digits, period, comma, underline and hyphen',
        empty: (v) => (v && !v.startsWith(' ')) || 'Comunity Name cannot start with space'
      },
      descriptionRules: {
        required: (v) =>
          (!!v && v.length >= 5 && v.length <= 300) ||
          'Description required and must between 5-300 characters.',
        regex: (v) =>
          /^[A-Za-z0-9ışŞğĞçÇöÖüÜ\/,\/.\/\-\/_\s]*$/gi.test(v) ||
          'Only use letters, digits, period, comma, underline and hyphen',
        empty: (v) => (v && !v.startsWith(' ')) || 'Description cannot start with space'
      },
      categoryRules: {
        required: (v) => (!!v && v.length < 1) || 'Category required for creating a community'
      }
    }
  },
  computed: {
    ...mapGetters({
      businessCategories: 'threadSharing/businessCategoryGetter',
      communNameAvailable: 'threadSharing/communNameAvailableGetter'
    }),
    categoryRule() {
      if (this.selectedCategory && this.selectedCategory.length) {
        return true
      } else {
        return 'Category required for creating a community'
      }
    }
  },
  methods: {
    onCancelClicked() {
      this.$emit('closeAdd')
    },
    onCreateClicked() {
      if (this.$refs.form.validate() && !this.communNameAvailable) {
        let selectedBusinessObj = this.businessCategories.filter(
          (item) => item.IDESC == this.selectedCategory
        )
        localStorage.setItem('communityName', this.name)
        const newCommunityObj = {
          Name: this.name,
          Description: this.description,
          IsPrivate: this.privacy,
          CreateUserId: localStorage.getItem('userId'),
          BusinessCategory: [
            {
              IKEY: selectedBusinessObj[0].IKEY
            }
          ],
          CommunityCompany: [
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
    checkCommunName() {
      if (this.name.length && !this.name.startsWith(' '))
        this.$store.dispatch('threadSharing/checkName', this.name)
    }
  },
  mounted() {
    let businessCats = []
    for (let cat of this.businessCategories) {
      businessCats.push(cat.IDESC)
    }
    this.categories = businessCats
  },
  beforeDestroy() {
    //this.$router.push("/threat-sharing")
  }
}
</script>
<style lang="scss" scoped>
.new-community-container {
  min-height: 100vh;
  height: 820px;
  overflow: visible;
  width: 100%;

  .new-community-inner {
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
</style>
