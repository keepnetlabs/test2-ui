<template>
  <v-card class="email-template__container">
    <app-modal
      :status="showGrapesModal"
      v-if="showGrapesModal"
      icon-name="mdi-check"
      title="Notification Template"
      z-index="999999"
      @submit="saveGrapeJs"
      @closeOverlay="toggleShowGrapesModal"
    >
      <template v-slot:overlay-body>
        <GrapesWebPageModal ref="grapesJsPostIncident" :htmlData="htmlData"></GrapesWebPageModal>
      </template>
    </app-modal>
    <v-tabs
      active-class="pr-tab-active"
      background-color="transparent"
      color="basil"
      class="k-tabs"
      v-model="tab"
      show-arrows
    >
      <v-tab
        :key="tab"
        @click="changeTabStatus(index)"
        class="k-tab"
        v-for="(tab, index) in getRenderedTabItems"
      >
        {{ tab }}
      </v-tab>
      <v-menu v-if="getTabCountStatus" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            class="align-self-center"
            style="border-left: 1px solid #e0e0e0;"
            v-bind="attrs"
            v-on="on"
          >
            {{ getMoreLanguageCount }}
            <v-icon right>mdi-menu-down</v-icon>
          </v-btn>
        </template>

        <v-list class="grey lighten-3">
          <v-list-item v-for="item in getMoreLanguages" :key="item" @click="addTabItem(item)">
            {{ item }}
          </v-list-item>
        </v-list>
      </v-menu>
      <div class="new-integration__api-key__footer-left-side" @click="addLanguage">
        <v-icon color="#2196f3" style="cursor: pointer !important;">mdi-plus-circle-outline</v-icon>
        <div class="ml-2 new-integration__api-key__text">ADD LANGUAGE</div>
      </div>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item :key="item" v-for="item in getRenderedTabItems">
        <div style="display: none;">{{ item }}</div>
        <div class="email-template__item">
          <label>Subject</label>
          <v-text-field
            placeholder="Enter subject"
            outlined
            dense
            v-model.trim="formValues.subject"
          ></v-text-field>
        </div>
        <div class="email-template__item">
          <label>From Name</label>
          <v-text-field
            placeholder="Enter sender name"
            outlined
            dense
            v-model.trim="formValues.fromName"
          ></v-text-field>
        </div>
        <div class="email-template__item">
          <label>From Email</label>
          <v-text-field
            placeholder="Enter email address"
            outlined
            dense
            v-model.trim="formValues.email"
          ></v-text-field>
        </div>
        <v-divider class="email-template__divider mb-6" />
        <v-btn
          rounded
          color="#2196f3"
          class="email-template-preview__button"
          @click="editHtmlTemplate"
        >
          <v-icon class="mr-2 text-h6">mdi-pencil</v-icon> Edit</v-btn
        >
        <div class="email-template-preview">
          <div v-if="htmlData" v-html="htmlData" ref="refPreview" />
          <table style="width: 600px; margin: 0 auto;" v-else ref="refPreview">
            <tbody>
              <tr
                style="
                  font-size: 24px;
                  line-height: 1.29;
                  letter-spacing: normal;
                  color: rgba(0, 0, 0, 0.87);
                  opacity: 0.7;
                  max-width: 200px;
                  min-height: 72px;
                  display: flex;
                  justify-content: center;
                  border-radius: 4px;
                  margin: 0 auto 30px auto;
                  vertical-align: middle;
                  background-color: #e0e0e0;
                  align-items: center;
                "
              >
                <td>
                  <p style="margin: 0;">Logo Here</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p :style="getHeaderStyle()">
                    Let’s design an email template
                  </p>
                </td>
              </tr>
              <tr :style="[{ marginTop: '16px' }]">
                <td>
                  <p :style="getSubHeaderStyle()">
                    To design an email template, first click the Edit button to enter design mode
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p :style="getPStyle()">
                    Once there choose the layout, use blocks, text, images and other features you
                    need to design a responsive email, really fast.
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p :style="getPStyle()">
                    Give your content a style by changing fonts, colors, borders and other
                    properties.
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p :style="getPStyle()">
                    Use shortcodes to define user names, email addresses, URLs, training pieces,
                    dates and many more properties
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p :style="getPStyle()">
                    Upload files as attachments to track who downloads and runs suspicious files
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <hr
                    style="margin: 8px auto 16px auto; max-width: 600px; border: 1px solid #b3d4fc;"
                  />
                </td>
              </tr>
              <tr :style="{ marginTop: '16px', justifyContent: 'center' }">
                <td style="text-align: center;">
                  <img src="../../assets/img/iconfinder-facebook-834722.svg" alt="facebook-icon" />
                  <img
                    src="../../assets/img/iconfinder-twitter-834708.svg"
                    alt="twitter-icon"
                    style="margin-left: 48px;"
                  />
                  <img
                    src="../../assets/img/iconfinder-instagram-2-834717.svg"
                    style="margin-left: 48px;"
                    alt="instagram-icon"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <hr
                    style="
                      margin: 14px auto 14px auto;
                      max-width: 600px;
                      border: 1px solid #b3d4fc;
                    "
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <p :style="{ ...getPStyle(), textAlign: 'center', marginBottom: '0' }">
                    This email is sent by {User_Name} from {Company_Name} on {Date_Sent}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import AppModal from '@/components/AppModal'
import GrapesWebPageModal from '@/components/GrapesJs/WebPage/GrapesWebPageModal'
export default {
  name: 'EmailTemplate',
  components: {
    AppModal,
    GrapesWebPageModal
  },
  data() {
    return {
      tabItems: ['English', 'Turkish', 'German', 'Arabic', 'Sweden'],
      tab: 0,
      showGrapesModal: false,
      formValues: {
        subject: '',
        fromName: '',
        email: ''
      },
      htmlData: null
    }
  },
  methods: {
    changeTabStatus(index) {
      this.tab = index
    },
    addTabItem(item) {},
    addLanguage() {
      this.tabItems.push('randomLang')
    },
    editHtmlTemplate() {
      this.htmlData = this.$refs.refPreview[0].outerHTML
      this.toggleShowGrapesModal()
    },
    getPStyle() {
      return {
        maxWidth: '550px',
        margin: '0 auto 6px auto',
        fontSize: '14px',
        lineHeight: 1.5,
        color: 'rgba(0, 0, 0, 0.87)',
        letterSpacing: 'normal'
      }
    },
    getSubHeaderStyle() {
      return {
        maxWidth: '550px',
        margin: '0 auto 14px auto',
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: 'rgba(0, 0, 0, 0.87)'
      }
    },
    getHeaderStyle() {
      return {
        maxWidth: '550px',
        margin: '0 auto 14px auto',
        fontSize: '34px',
        fontWeight: 'normal',
        lineHeight: 1.15,
        letterSpacing: 'normal',
        color: 'rgba(0, 0, 0, 0.87)'
      }
    },

    toggleShowGrapesModal() {
      this.showGrapesModal = !this.showGrapesModal
    },
    saveGrapeJs() {
      this.htmlData = this.$refs.grapesJsPostIncident.getGrapesEditorContent()
      this.toggleShowGrapesModal()
    }
  },
  computed: {
    getTabCountStatus() {
      return this.tabItems.length > 3
    },
    getMoreLanguageCount() {
      return `+${this.tabItems.length - 3}`
    },
    getMoreLanguages() {
      return this.tabItems.slice(3, this.tabItems.length)
    },
    getRenderedTabItems() {
      const renderedMaxItemLength = this.tabItems.length > 3 ? 3 : this.tabItems.length
      return this.tabItems.slice(0, renderedMaxItemLength)
    }
  }
}
</script>

<style lang="scss">
.email-template {
  max-width: 100% !important;
  .v-window {
    margin-right: 24px;
    padding-bottom: 16px;
  }
  &__container {
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12) !important;
    border-radius: 0 !important;
    padding-left: 24px;
    padding-top: 10px;
  }
  &__item {
    display: flex;
    align-items: center;
    &:not(:first-child) {
      margin-top: -12px;
    }
    &:last-child {
      border-bottom: 1px solid #b3d4fc;
    }
    label {
      min-width: 130px;
      font-size: 16px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      margin-top: -20px;
    }
  }
  &__divider {
    border-color: #b3d4fc !important;
  }
  &-preview {
    &__header {
      display: flex;
      margin-bottom: 32px;
    }
    &__logo {
      &-container {
        flex-basis: 95%;
        text-align: center;
      }
      font-size: 24px;
      line-height: 1.29;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      opacity: 0.7;
      max-width: 200px;
      min-height: 72px;
      display: flex;
      justify-content: center;
      border-radius: 4px;
      margin: 0 auto;
      vertical-align: middle;
      background-color: #e0e0e0;
      align-items: center;
    }
    &__button {
      box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3) !important;
      .v-btn__content {
        font-size: 14px;
        font-weight: 600;
        line-height: 1.71;
        letter-spacing: normal;
        color: #ffffff;
      }
      position: absolute;
      right: 0;
    }
    &__body {
      max-width: 550px;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      &-header {
        font-size: 34px;
        font-weight: normal;
        line-height: 1.15;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
      }
      &-sub-header {
        font-size: 18px;
        font-weight: 600;
        line-height: normal;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87);
      }
      p {
        font-size: 14px;
        font-weight: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87) !important;
        margin-bottom: 8px;
      }
    }
    .email-template__divider {
      max-width: 600px;
      margin: 0 auto;
    }
    &__logos {
      max-width: 240px;
      margin: 16px auto 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-around;
      &--facebook {
        font-size: 35px !important;
      }
      &--twitter {
        background-color: #55acee;
        padding: 4px;
        height: 32px;
        border-radius: 50%;
      }
      &--instagram {
        background-color: #2a5b83;
        padding: 4px;
        height: 32px;
        border-radius: 50%;
      }
    }
    &__footer {
      max-width: 550px;
      margin: 16px auto 0 auto;
      p {
        font-weight: normal;
        line-height: 1.5;
        letter-spacing: normal;
        text-align: center;
        color: rgba(0, 0, 0, 0.87) !important;
        font-size: 14px;
        margin-bottom: 0;
      }
    }
  }
}
</style>
