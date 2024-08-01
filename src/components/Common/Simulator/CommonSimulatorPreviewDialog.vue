<template>
  <AppDialog
    icon="mdi-eye"
    custom-size="1600"
    :status="status"
    :title="getTitle"
    :subtitle="getSubtitle"
    max-height
    max-height-size="900"
    class-name="campaign-manager-preview-dialog"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <div v-if="isPhishing && !isLoading" class="mb-6">
        <span class="template-preview__text--title">Category: </span>
        <span class="template-preview__text--body">{{ category }}</span>
      </div>
      <ElTabs v-if="!isLoading" v-model="tab">
        <ElTabPane id="campaign-manager-info--email-content" name="email" :label="getFirstTabLabel">
          <div class="template-preview pt-4">
            <div class="template-preview__text" v-if="!!emailTemplate">
              <div v-if="isQuishing">
                <span class="template-preview__text--title">Quishing Type: </span>
                <span class="template-preview__text--body">{{
                  emailTemplateParams.type || "Email"
                }}</span>
              </div>
              <div>
                <span class="template-preview__text--title">Template Name: </span>
                <span class="template-preview__text--body"
                  >{{ emailTemplateParams.name }}
                  <VTooltip v-if="emailTemplateParams.isAi" bottom>
                    <template #activator="{ on }">
                      <VIcon v-on="on" color="#2196F3" small>mdi-creation</VIcon>
                    </template>
                    <span>This template was generated with AI</span>
                  </VTooltip>
                </span>
              </div>
              <div v-if="!isQuishingTypeIndividualPrintOut">
                <span class="template-preview__text--title">From: </span>
                <span class="template-preview__text--body">{{ emailTemplateParams.fromName }}</span>
              </div>
              <div v-if="!isQuishingTypeIndividualPrintOut">
                <span class="template-preview__text--title">From Email Address: </span>
                <span class="template-preview__text--body">{{
                  emailTemplateParams.fromAddress
                }}</span>
              </div>
              <div v-if="!isQuishingTypeIndividualPrintOut">
                <span class="template-preview__text--subject">Subject: </span>
                <span class="template-preview__text--subject">{{
                  emailTemplateParams.subject
                }}</span>
              </div>
              <div
                v-if="isQuishingTypeIndividualPrintOut"
                class="d-flex justify-space-between align-center"
              >
                <div class="text-primary-color fs-4">Example Individual Printout</div>
                <VBtn
                  id="btn-preview-indiviual-printout"
                  class="white--text btn-util btn-download-add-in"
                  color="#2196F3"
                  rounded
                  :style="getIndividualPrintoutStyle"
                  @click="handlePreviewIndividualPrintout"
                >
                  <v-icon left>mdi-file-eye</v-icon>
                  {{ labels.PrintPreview }}
                </VBtn>
              </div>
            </div>
            <div
              v-if="emailTemplateParams.attachment"
              class="attachment-wrapper mt-2 position-relative"
            >
              <div class="attachment blue-attach mb-0">
                <AttachmentsPreview
                  :deletable="false"
                  :att="emailTemplateParams.attachment"
                  :isEmailTemplate="true"
                />
              </div>
            </div>
            <hr class="mt-4" v-if="!!emailTemplate" />
            <KEmailPreview v-if="!!emailTemplate" ref="refPreview" :html="emailTemplate" />
          </div>
        </ElTabPane>
        <ElTabPane
          v-if="!isAttachmentBasedScenario"
          :label="labels.LandingPage"
          name="landing-page"
          id="campaign-manager-info--landing-content"
        >
          <TabsWithMfaSettings
            class="tabs-with-mfa-settings"
            :type="type"
            :is-method-mfa="isMethodMfa"
            :landing-page-params="landingPageParams"
            :landing-page-templates="landingPageTemplates"
          />
        </ElTabPane>
      </ElTabs>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose id="btn-close--scenario-preview" @on-close="handleClose" />
    </template>
  </AppDialog>
</template>

<script>
import DatatableLoading from "@/components/SkeletonLoading/WidgetLoading.vue";
import TabsWithMfaSettings from "@/components/PhishingScenarios/TabsWithMfaSettings.vue";
import KEmailPreview from "@/components/KEmailPreview.vue";
import AttachmentsPreview from "@/components/ThreatSharing/AttachmentsPreview/AttachmentsPreview.vue";
import AppDialog from "@/components/AppDialog.vue";
import AppDialogFooterWithClose from "@/components/SmallComponents/AppDialogFooterWithClose.vue";
import labels from "@/model/constants/labels";
import { difficulties, methods } from "@/components/CampaignManager/CampaignManagerInfo/utils";
import { PREVIEW_DIALOG_TYPES, SCENARIO_TYPES } from "@/components/Common/Simulator/utils";
import { qrCodeString } from "@/components/GrapesJs/Newsletter/mergedTexts/qrCode";
import { QUISHING_EMAIL_TEMPLATE_TYPES } from "@/components/QuishingEmailTemplates/utils";
import QuishingService from "@/api/quishing";
export default {
  name: "CommonSimulatorPreviewDialog",
  components: {
    AppDialogFooterWithClose,
    AppDialog,
    AttachmentsPreview,
    KEmailPreview,
    TabsWithMfaSettings,
    DatatableLoading,
  },
  props: {
    status: {
      type: Boolean,
    },
    selectedRow: {
      type: Object,
    },
    apiFunc: {
      type: Function,
      required: true,
    },
    type: {
      type: String,
      default: PREVIEW_DIALOG_TYPES.PHISHING,
    },
  },
  data() {
    return {
      emailTemplate: null,
      landingPageTemplates: [],
      isMethodMfa: false,
      selectedLandingPageIndex: 0,
      emailTemplateParams: {},
      landingPageParams: {},
      category: "",
      tab: "email",
      isLoading: false,
      labels,
      timeoutId: "",
      isIndividualPrintoutButtonDisabled: false,
    };
  },
  computed: {
    getFirstTabLabel() {
      return this.type === PREVIEW_DIALOG_TYPES.PHISHING
        ? labels.JustEmail
        : labels.QuishingTemplate;
    },
    getIndividualPrintoutStyle() {
      const style = {
        textTransform: "capitalize",
      };
      if (this.isIndividualPrintoutButtonDisabled) {
        style.cursor = "default";
        style.opacity = 0.5;
      }
      return style;
    },
    isQuishing() {
      return this.type === PREVIEW_DIALOG_TYPES.QUISHING;
    },
    isPhishing() {
      return this.type === PREVIEW_DIALOG_TYPES.PHISHING;
    },
    isQuishingTypeIndividualPrintOut() {
      if (!this.isQuishing) return false;
      return (
        this?.emailTemplateParams?.type?.toLowerCase() ===
        QUISHING_EMAIL_TEMPLATE_TYPES.INDIVIDUAL_PRINTOUT.toLowerCase()
      );
    },
    isAttachmentBasedScenario() {
      return this.selectedRow?.method ? this.selectedRow?.method === "Attachment" : false;
    },
    getTitle() {
      return this.type === PREVIEW_DIALOG_TYPES.PHISHING
        ? labels.PhishingScenarioPreview
        : labels.QuishingScenarioPreview;
    },
    getSubtitle() {
      return this.selectedRow?.name || "";
    },
    getCurrentLandingPageTemplate() {
      return this.landingPageTemplates[this.selectedLandingPageIndex]?.content;
    },
  },
  created() {
    this.callForData();
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId);
  },
  methods: {
    callForData() {
      this.setLoading(true);
      const params = [this.selectedRow.resourceId];
      if (this.type === PREVIEW_DIALOG_TYPES.QUISHING)
        params.push(this.selectedRow.quishingType.toLowerCase());
      this.apiFunc(...params)
        .then((response) => {
          const { data: { data = {} } = {} } = response;
          let { emailTemplate, landingPageTemplate, quishingTemplate, category = "" } = data;
          if (!emailTemplate) emailTemplate = quishingTemplate;
          this.category = category;
          let {
            template,
            fromName,
            fromAddress,
            name,
            difficultyResourceId,
            phishingFileName,
            subject,
            type,
            resourceId,
            isAi = false,
          } = emailTemplate || {};

          this.emailTemplateParams = {
            resourceId,
            fromName,
            fromAddress,
            name,
            subject,
            isAi,
            difficulty: difficulties.find((item) => item.value === difficultyResourceId)?.text,
            attachment: phishingFileName
              ? {
                  name: phishingFileName,
                }
              : null,
            type,
          };
          if (this.type === PREVIEW_DIALOG_TYPES.QUISHING)
            template = template?.replaceAll("{QRCODEURLIMAGE}", qrCodeString);
          this.emailTemplate = template;

          const {
            name: landingPageName,
            description,
            landingPages,
            urlTemplate,
            difficultyTypeId,
            methodTypeId,
            isAi: isLandingPageAi = false,
          } = landingPageTemplate || [];

          this.landingPageParams = {
            name: landingPageName,
            isAi: isLandingPageAi,
            description,
            urlTemplate,
            difficulty: difficulties[difficultyTypeId - 1]?.text || "",
            method: methods[methodTypeId - 1]?.text || "",
            isAttachmentBasedTemplate: methodTypeId === 3,
            mfaTextTemplate: data.mfaTextTemplate,
            mfaSmsSenderNumber: data.mfaSmsSenderNumber,
          };
          this.landingPageTemplates = landingPages;
          this.isMethodMfa = data.methodTypeId === 4;
        })
        .finally(() => {
          this.timeoutId = setTimeout(() => {
            this.setLoading();
          }, 500);
        });
    },
    setLoading(flag = false) {
      this.isLoading = flag;
    },
    handleClose() {
      this.$emit("on-close");
    },
    handlePreviewIndividualPrintout() {
      this.isIndividualPrintoutButtonDisabled = true;
      QuishingService.getQuishingPdfPreviewContent(this.emailTemplateParams.resourceId)
        .then((response) => {
          const file = new File([response.data], "Quishing PDF Preview", {
            type: "application/pdf",
          });
          const fileURL = URL.createObjectURL(file);
          const newWindow = window.open(fileURL);
          newWindow.onload = function () {
            setTimeout(() => {
              newWindow.document.title = "Quishing PDF Preview";
            }, 250);
          };
        })
        .finally(() => {
          this.isIndividualPrintoutButtonDisabled = false;
        });
    },
  },
};
</script>
