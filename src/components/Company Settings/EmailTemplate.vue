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
    <div class="email-template__item" v-if="!onlyGrapes">
      <label>Subject</label>
      <v-text-field
        id="input--notification-template-subject"
        placeholder="Enter email subject"
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
    <div v-if="!onlyGrapes" class="email-template__item">
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
    <div v-if="!onlyGrapes" class="email-template__item">
      <label>From Email</label>
      <InputEmail
        id="input--notification-template-from-email"
        :disabled="editItemsDisabled"
        :value="fromAddress"
        @input="$emit('update:fromAddress', $event)"
      />
    </div>
    <div class="d-flex email-template__item" v-if="isPhishingTemplate && !onlyGrapes">
      <label>Attach File</label>
      <k-file-upload
        id="input--email-template-upload"
        class="mb-2"
        hint="Only jpg, png, gif, bmp files. Max. file size 2MB"
        ref="refFileUpload"
        :value="AttachmentFiles"
        @inputFile="onFileChanged"
        :size="2"
      />
      <div class="email-template__attachment-list">
        <div
          v-for="item in attachmentFilesFromApi"
          :key="item.fileName"
          class="preview-attch-wrapper"
        >
          <div class="attachment-wrapper">
            <div class="attachment blue-attach" :id="'email-template-' + item.fileName">
              <AttachmentsPreview :att="item" :isEmailTemplate="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-divider v-if="!onlyGrapes" class="email-template__divider mb-6" />
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
    <div class="email-template-preview" style="pointer-events: none;">
      <div v-if="template" v-html="template" class="grapesjs-reset-css" ref="refPreview" />
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
              <img
                alt="logo"
                style="display: block; width: 100%; max-width: 200px; min-height: 72px;"
                :src="$store.state.dashboard.selectedCompanyObject.logoUrl"
              />
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              <p style="margin-bottom: 0;">
                Let’s design an email template
              </p>
            </td>
          </tr>
          <tr :style="[{ marginTop: '16px' }]">
            <td style="padding-top: 10px;">
              <p style="margin-bottom: 0;">
                To design an email template, first click the Edit button to enter design mode
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              <p style="margin-bottom: 0;">
                Once there choose the layout, use blocks, text, images and other features you need
                to design a responsive email, really fast.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              <p style="margin-bottom: 0;">
                Give your content a style by changing fonts, colors, borders and other properties.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              <p style="margin-bottom: 0;">
                Use shortcodes to define user names, email addresses, URLs, training pieces, dates
                and many more properties
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              <p style="margin-bottom: 0;">
                Upload files as attachments to track who downloads and runs suspicious files
              </p>
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
              <img
                alt="facebook-icon"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNjI0IC0xNDcxKSB0cmFuc2xhdGUoOTYgMTg2KSB0cmFuc2xhdGUoMCA1NzYpIHRyYW5zbGF0ZSgyIDQwKSB0cmFuc2xhdGUoMzIyIDI2NSkgdHJhbnNsYXRlKDIwNCA0MDQpIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IiM0NTYxOUQiIHJ4PSIxNiIvPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xOC41NCAzLjg0Yy00LjMzOCAwLTUuNzcgMS45OS01Ljc3IDUuNDA0djIuNzAySDkuOTJ2NC4wNTZoMi44NVYyOC4xNmg1LjI1NlYxNi4wMDJoMy41NzJsLjQ4LTQuMDU2aC00LjA1MnYtMi40MWMwLTEuMDkuMjQtMS42NDIgMS45My0xLjY0MmgyLjEyMlYzLjg0SDE4LjU0eiIvPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K"
              />

              <img
                alt="twitter-icon"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzA0IC0xNDcxKSB0cmFuc2xhdGUoOTYgMTg2KSB0cmFuc2xhdGUoMCA1NzYpIHRyYW5zbGF0ZSgyIDQwKSB0cmFuc2xhdGUoMzIyIDI2NSkgdHJhbnNsYXRlKDIwNCA0MDQpIHRyYW5zbGF0ZSg4MCkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IiM1NUFDRUUiIHJ4PSIxNiIvPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTkuODMgNy42NzdjLTIuMjcuMDU3LTQuMDkgMS45MTUtNC4wOSA0LjIgMCAuMzI5LjAzNC42NS4xMDYuOTU4LTMuNDkyLS4xNzUtNi41ODgtMS44NDgtOC42Ni00LjM5LS4zNjIuNjItLjU3IDEuMzQzLS41NyAyLjExMyAwIDEuNDU4Ljc0MyAyLjc0MyAxLjg3IDMuNDk2LS42ODgtLjAyMi0xLjMzNy0uMjExLTEuOTA0LS41MjZ2LjA1NGMwIDIuMDM2IDEuNDUgMy43MzIgMy4zNzIgNC4xMTktLjM1My4wOTUtLjcyNC4xNDctMS4xMDguMTQ3LS4yNyAwLS41MzMtLjAyNi0uNzktLjA3NS41MzUgMS42NjkgMi4wODUgMi44ODUgMy45MjMgMi45MTgtMS40MzggMS4xMjctMy4yNDcgMS43OTktNS4yMTYgMS43OTktLjMzOSAwLS42NzQtLjAxOS0xLjAwMy0uMDU4IDEuODYgMS4xOTMgNC4wNjcgMS44ODggNi40NCAxLjg4OCA3LjcyOSAwIDExLjk1NS02LjQwMyAxMS45NTUtMTEuOTU1IDAtLjE4Mi0uMDAzLS4zNjUtLjAxMS0uNTQ2LjgyLS41OTEgMS41MzMtMS4zMzEgMi4wOTYtMi4xNzQtLjc1My4zMzQtMS41NjMuNTYxLTIuNDEzLjY2Mi44NjgtLjUyIDEuNTM0LTEuMzQzIDEuODQ4LTIuMzI1LS44MTIuNDgyLTEuNzExLjgzMi0yLjY2OSAxLjAyMS0uNzY2LS44MTYtMS44NTgtMS4zMjYtMy4wNjctMS4zMjZoLS4xMDl6Ii8+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K"
                style="margin-left: 48px; height: 32px;"
              />
              <img
                alt="instagram-icon"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzg0IC0xNDcxKSB0cmFuc2xhdGUoOTYgMTg2KSB0cmFuc2xhdGUoMCA1NzYpIHRyYW5zbGF0ZSgyIDQwKSB0cmFuc2xhdGUoMzIyIDI2NSkgdHJhbnNsYXRlKDIwNCA0MDQpIHRyYW5zbGF0ZSgxNjApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMkE1QjgzIiByeD0iMTYiLz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZmlsbD0iI0ZGRiIgZD0iTTcuNzc0IDUuNzZjLS4wOTguMDE4LS4xOTUuMDItLjI5My4wNDItLjkwOC4yMDctMS41NzEuOTQ4LTEuNyAxLjg2OC0uMDA2LjAzOC0uMDE1LjA2Ni0uMDIxLjEwNHYxNi40NTJjLjAxOS4xMDMuMDM5LjIxMS4wNjIuMzE1LjIwMS44ODcuOTQ2IDEuNTYzIDEuODQ4IDEuNjc5LjA0My4wMDUuMDgzLjAxNC4xMjYuMDJoMTYuNDA4Yy4xMDctLjAxNy4yMS0uMDIuMzE1LS4wNDIuODM2LS4xNzggMS41MTUtLjg4IDEuNjc5LTEuNzIxLjAxNy0uMDkyLjAyNy0uMTgyLjA0Mi0uMjczVjcuNzk2Yy0uMDE0LS4wOS0uMDI1LS4xNjMtLjA0Mi0uMjUyLS4xOC0uOTE4LS45MzktMS42MzYtMS44NjgtMS43NjQtLjAzOS0uMDA0LS4wNjYtLjAxMy0uMTA0LS4wMkg3Ljc3NHptMTMuNDkzIDEuNjU3aDEuOTNjLjQ2Mi4wMDEuODE4LjM3Ny44MTguODR2MS45M2MwIC40MzUtLjM0Mi44MDktLjc3Ni44Mi0uMzM4LjAwNy0uNjcgMC0xLjAwNyAwLS4zMTEgMC0uNjMzLjAyLS45NDQuMDItLjM4Mi0uMDAyLS42ODItLjIyNS0uNzk4LS41NjYtLjAzLS4wOTEtLjA2Mi0uMTc3LS4wNjItLjI3My0uMDA1LS42NDEgMC0xLjI5IDAtMS45MyAwLS40NjQuMzc3LS44NC44MzktLjg0ek0xNiAxMS44NDVjMi4zMjUtLjAwMSA0LjIwNSAxLjkxNiA0LjE1NSA0LjI0LS4wNSAyLjI1My0xLjk0IDQuMTItNC4yNiA0LjA3LTIuMjI5LS4wNDgtNC4wODMtMS44OTQtNC4wNS00LjIxNy4wMzItMi4yNjIgMS44ODMtNC4wOTQgNC4xNTUtNC4wOTN6TTcuOTYzIDE0LjA3aDEuOTUyYy0uNTA4IDEuNzM2LS4zNjIgMy40LjUwNCA0Ljk5NC41ODEgMS4wNyAxLjQxNSAxLjkwMyAyLjQ3NSAyLjQ5NyAyLjA5OSAxLjE3OCA0LjY5NiAxLjA1MyA2LjY3My0uMjk0Ljc2Mi0uNTIgMS4zODgtMS4xNjQgMS44NjgtMS45NS40OC0uNzg4Ljc3My0xLjY0Ni44OC0yLjU2LjEwOS0uOTE2LjAyNi0xLjgwNS0uMjUtMi42ODdoMS45NXY5LjE0OWMwIC40NC0uMzU2Ljc5Ni0uNzk2Ljc5Nkg4Ljc4Yy0uNDM2IDAtLjgxOC0uMzYtLjgxOC0uNzk2VjE0LjA3eiIvPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg=="
                style="margin-left: 48px;"
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
              <p style="margin-bottom: 0;">
                This email is sent by <span>{USERNAME}</span> from <span>{COMPANYNAME}</span> on
                <span>{DATESENT}</span>
              </p>
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
import AttachmentsPreview from '../ThreadSharing/AttachmentsPreview'
export default {
  name: 'EmailTemplate',
  components: {
    GrapesNewsletterModal,
    AppModal,
    InputEmail,
    KFileUpload,
    AttachmentsPreview
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
    'setAttachmentFile',
    'attachmentFilesFromApi',
    'onlyGrapes'
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
  &__attachment-list {
    margin-left: 8px;
    .attachment {
      height: 44px;
      .attach-icon {
        height: 44px !important;
      }
    }
  }
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
.grapesjs-reset-css {
  .form-group {
    font-family: initial;
    font-weight: initial;
    input,
    textarea,
    button {
      border-style: inset;
      border-color: initial;
      background-color: initial;
    }
    button {
      padding: 1px 6px;
      background-color: rgb(239, 239, 239);
      border-radius: 2px;
      color: initial;
      border: 2px;
      font-family: initial;
      font-weight: initial;
    }
    .checkbox {
      margin: 3px 3px 3px 4px;
    }
  }
}
</style>
