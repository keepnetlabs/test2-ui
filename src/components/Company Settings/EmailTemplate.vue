<template>
  <v-card class="email-template__container">
    <app-modal
      v-if="showGrapesModal"
      :status="showGrapesModal"
      icon-name="mdi-check"
      :title="labels.NotificationTemplate"
      z-index="999999"
      :show-header="false"
      @submit="saveGrapeJs"
      @closeOverlay="toggleShowGrapesModal"
    >
      <template v-slot:overlay-body>
        <GrapesNewsletterModal
          ref="grapesJsPostIncident"
          :htmlData="template"
          :key="grapeJsKey"
          :blockManagerComponents="activeBlockManagerComponents"
        />
      </template>
    </app-modal>
    <div class="email-template__item">
      <label>Subject</label>
      <v-text-field
        id="input--notification-template-subject"
        placeholder="Enter subject"
        outlined
        dense
        hint="*Required"
        persistent-hint
        :disabled="editItemsDisabled"
        :value="subject"
        :rules="[
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.Subject, 320))
        ]"
        @input="$emit('update:subject', $event)"
      ></v-text-field>
    </div>
    <div class="email-template__item">
      <label>From Name</label>
      <v-text-field
        id="input--notification-template-sender-name"
        placeholder="Enter sender name"
        outlined
        dense
        hint="*Required"
        persistent-hint
        :disabled="editItemsDisabled"
        :value="fromName"
        :rules="[
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.maxLength(v, 40, labels.getMaxLengthMessage(labels.FromName), 40)
        ]"
        @input="$emit('update:fromName', $event)"
      ></v-text-field>
    </div>
    <div class="email-template__item">
      <label>From Email</label>
      <InputEmail
        id="input--notification-template-from-email"
        :disabled="editItemsDisabled"
        :value="fromAddress"
        @input="$emit('update:fromAddress', $event)"
      />
    </div>
    <div class="email-template__item" v-if="isPhishingTemplate">
      <label>Attach File</label>
      <k-file-upload
        id="input--email-template-upload"
        hint="Only jpg, png, gif, bmp files. Max. file size 2MB"
        ref="refFileUpload"
        :value="AttachmentFiles"
        @inputFile="onFileChanged"
        :size="2"
      />
    </div>
    <v-divider class="email-template__divider mb-6" />
    <v-btn
      id="btn-edit--notification-template-email-template"
      :disabled="editItemsDisabled"
      rounded
      color="#2196f3"
      class="email-template-preview__button"
      @click="editHtmlTemplate"
    >
      <v-icon class="mr-2 text-h6">mdi-pencil</v-icon> Edit</v-btn
    >
    <div class="email-template-preview">
      <div v-if="template" v-html="template" ref="refPreview" />
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
              <!--<img
                alt="logo"
                style="display: block; width: 100%; max-width: 200px; min-height: 72px;"
                :src="'{COMPANYLOGO}'"
              /> -->
              <img
                alt="logo"
                style="display: block; width: 100%; max-width: 200px; min-height: 72px;"
                :src="$store.state.dashboard.selectedCompanyObject.logoUrl"
              />
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              Let’s design an email template
            </td>
          </tr>
          <tr :style="[{ marginTop: '16px' }]">
            <td style="padding-top: 10px;">
              To design an email template, first click the Edit button to enter design mode
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              Once there choose the layout, use blocks, text, images and other features you need to
              design a responsive email, really fast.
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              Give your content a style by changing fonts, colors, borders and other properties.
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              Use shortcodes to define user names, email addresses, URLs, training pieces, dates and
              many more properties
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              Upload files as attachments to track who downloads and runs suspicious files
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
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
                style="margin-left: 48px; height: 32px;"
              />
              <img
                src="../../assets/img/iconfinder-instagram-2-834717.svg"
                style="margin-left: 48px; height: 32px;"
                alt="instagram-icon"
              />
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              <hr
                style="margin: 14px auto 14px auto; max-width: 600px; border: 1px solid #b3d4fc;"
              />
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              This email is sent by <span>{USERNAME}</span> from <span>{COMPANYNAME}</span> on
              <span>{DATESENT}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </v-card>
</template>

<script>
import AppModal from '@/components/AppModal'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import GrapesNewsletterModal from '@/components/GrapesJs/Newsletter/GrapesNewsletterModal'
import { mapGetters } from 'vuex'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
export default {
  name: 'EmailTemplate',
  components: {
    GrapesNewsletterModal,
    AppModal,
    InputEmail,
    KFileUpload
  },
  props: [
    'fromAddress',
    'fromName',
    'subject',
    'template',
    'AttachmentFiles',
    'activeBlockManagerComponents',
    'isEdit',
    'editItemsDisabled',
    'isPhishingTemplate',
    'setAttachmentFile'
  ],
  data() {
    return {
      labels,
      showGrapesModal: false,
      grapeJsKey: `${Math.random().toString().substring(0, 7)}-key`,
      Validations
    }
  },
  computed: {
    ...mapGetters({ emailTemplateLogo: 'whitelabel/getEmailTemplateLogoUrl' })
  },
  watch: {
    activeBlockManagerComponents() {
      if (!this.isEdit) {
        this.setDefaultTemplate()
      }
      this.grapeJsKey = `${Math.random().toString().substring(0, 7)}-key`
    }
  },
  mounted() {
    this.defaultTemplate = JSON.parse(JSON.stringify(this.$refs.refPreview.outerHTML))
  },
  methods: {
    onFileChanged(file) {
      this.$emit('setAttachmentFile', file)
    },
    changeTabStatus(index) {
      this.tab = index
    },
    editHtmlTemplate() {
      this.$emit('update:template', this.$refs.refPreview.outerHTML)
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
    setDefaultTemplate() {
      this.$emit('update:template', this.defaultTemplate)
    },
    toggleShowGrapesModal() {
      this.showGrapesModal = !this.showGrapesModal
    },
    saveGrapeJs() {
      this.$emit('update:template', this.$refs.grapesJsPostIncident.getGrapesEditorContent())
      this.toggleShowGrapesModal()
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
    padding: 24px 24px 16px 24px;
  }
  &__item {
    display: flex;
    align-items: center;
    &:not(:first-child) {
      margin-top: -2px;
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
      color: #383b41 !important;
      margin-top: -23px;
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
      right: 24px;
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
