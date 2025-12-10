<template>
  <div v-if="isVisible">
    <div
      class="notification-templates-preview-overlay"
      :class="{ 'nested-overlay': isNested }"
      @click="handleOverlayClick"
    ></div>
    <VNavigationDrawer
      :value="isVisible"
      :class="getNavigationDrawerClass"
      :data-drawer-id="drawerId"
      fixed
      :overlay-color="null"
      right
      stateless
      width="calc(100% - 72px)"
      height="100%"
    >
      <div class="campaign-manager-scenario-statistics-modal__header--sticky">
        <div
          class="campaign-manager-scenario-statistics-modal__header k-navigation-drawer__header"
        >
          <div>
            <VListItem>
              <VListItemContent>
                <VListItemTitle class="k-overlay__title">
                  {{ getTitle }}
                </VListItemTitle>
              </VListItemContent>
            </VListItem>
          </div>
          <div>
            <VIcon class="cursor-pointer" color="#757575" @click="handleClose">
              mdi-close
            </VIcon>
          </div>
        </div>
      </div>
      <div
        class="campaign-manager-scenario-statistics-modal__body k-navigation-drawer__body"
      >
        <DatatableLoading v-if="isLoading" :loading="isLoading" />
        <div v-if="!isLoading && selectedLanguages.length > 0" class="mb-4 mt-6">
          <InputLanguagePreview
            :value="activeLanguage"
            :items="selectedLanguages"
            :label="languageLabel"
            style="max-width: 300px"
            @input="handleLanguageChange"
          />
        </div>
        <KEmailPreview v-if="!!emailTemplate" ref="refPreview" :html="emailTemplate" />
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import DatatableLoading from "@/components/SkeletonLoading/WidgetLoading";
import { getEmailTemplate } from "@/api/company";
import KEmailPreview from "@/components/KEmailPreview";
import InputLanguagePreview from "@/components/Common/Inputs/InputLanguagePreview.vue";
import useDrawerAnimation from "@/hooks/useDrawerAnimation";
export default {
  name: "NotificationTemplatesPreviewDialog",
  components: { InputLanguagePreview, KEmailPreview, DatatableLoading },
  mixins: [useDrawerAnimation],
  props: {
    status: {
      type: Boolean,
    },
    selectedRow: {
      type: Object,
    },
    templateData: {
      type: Object,
      default: null,
    },
    isNested: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLoading: false,
      emailTemplate: null,
      selectedLanguages: [],
      activeLanguage: "",
      languagesData: [],
    };
  },
  computed: {
    getNavigationDrawerClass() {
      return {
        "k-navigation-drawer k-navigation-drawer--email-template-preview": true,
        "nested-drawer": this.isNested,
      };
    },
    getTitle() {
      return "Notification Template Preview";
    },
    getSubtitle() {
      return this.selectedRow?.name || "";
    },
    languageLabel() {
      return `Template Language${this.selectedLanguages.length > 1 ? "s" : ""} (${
        this.selectedLanguages.length
      })`;
    },
  },
  created() {
    if (this.templateData) {
      this.setupFromTemplateData(this.templateData);
    } else if (this.selectedRow?.resourceId) {
      this.callForData();
    }
  },
  methods: {
    setupFromTemplateData(data) {
      const companyLogoUrl = this?.$store?.state?.whitelabel.emailTemplateLogoUrl || "";

      // Ana dil template'ini set et
      const mainTemplate = data.template?.replace(/{COMPANYLOGO}/g, companyLogoUrl) || "";

      // Languages data array'ini oluştur (ana dil + ek diller)
      this.languagesData = [];

      // Ek dilleri ekle (varsa)
      if (data.languages && data.languages.length > 0) {
        data.languages.forEach((lang) => {
          this.languagesData.push({
            languageTypeResourceId: lang.languageTypeResourceId,
            languageTypeName: lang.languageTypeName || "",
            template: lang.template?.replace(/{COMPANYLOGO}/g, companyLogoUrl) || "",
          });
        });
      }

      // selectedLanguages array'ini oluştur
      this.selectedLanguages = this.languagesData.map((lang) => ({
        text: lang.languageTypeName,
        value: lang.languageTypeResourceId,
      }));

      // İlk dili aktif yap
      this.activeLanguage = data.selectedLanguageResourceId;
      this.emailTemplate = mainTemplate;
    },
    callForData() {
      this.isLoading = true;
      getEmailTemplate(this.selectedRow.resourceId)
        .then((response) => {
          const data = response?.data?.data || {};
          const companyLogoUrl =
            this?.$store?.state?.whitelabel.emailTemplateLogoUrl || "";

          // Ana dil template'ini set et
          const mainTemplate =
            data.template?.replace(/{COMPANYLOGO}/g, companyLogoUrl) || "";

          // Languages data array'ini oluştur (ana dil + ek diller)
          this.languagesData = [
            {
              languageTypeResourceId: data.languageTypeResourceId,
              languageTypeName: data.languageTypeName || "",
              template: mainTemplate,
            },
          ];

          // Ek dilleri ekle (varsa)
          if (data.languages && data.languages.length > 0) {
            data.languages.forEach((lang) => {
              this.languagesData.push({
                languageTypeResourceId: lang.languageTypeResourceId,
                languageTypeName: lang.languageTypeName || "",
                template: lang.template?.replace(/{COMPANYLOGO}/g, companyLogoUrl) || "",
              });
            });
          }

          // selectedLanguages array'ini oluştur
          this.selectedLanguages = this.languagesData.map((lang) => ({
            text: lang.languageTypeName,
            value: lang.languageTypeResourceId,
          }));

          // İlk dili aktif yap
          this.activeLanguage = data.languageTypeResourceId;
          this.emailTemplate = mainTemplate;
        })
        .finally(() => (this.isLoading = false));
    },
    handleLanguageChange(languageResourceId) {
      this.activeLanguage = languageResourceId;
      const selectedLang = this.languagesData.find(
        (lang) => lang.languageTypeResourceId === languageResourceId
      );
      if (selectedLang) {
        this.emailTemplate = selectedLang.template;
      }
    },
    handleOverlayClick() {
      this.closeDrawer();
    },
    handleClose() {
      this.closeDrawer();
    },
  },
};
</script>

<style scoped lang="scss">
.notification-templates-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.17);
  z-index: 1002 !important;

  &.nested-overlay {
    z-index: 1113 !important;
    background-color: transparent;
  }
}

.k-navigation-drawer.k-navigation-drawer--email-template-preview {
  transition: right 0.25s ease-in-out;
  z-index: 1003 !important;

  &.nested-drawer {
    z-index: 1114 !important;
  }
}
</style>
