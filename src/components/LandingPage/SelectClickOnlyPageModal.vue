<template>
  <div v-if="isVisible">
    <VNavigationDrawer
      v-click-outside="handleClickOutside"
      :value="isVisible"
      class="select-click-only-drawer"
      :data-drawer-id="drawerId"
      fixed
      :overlay-color="null"
      right
      stateless
      width="calc(100% - 72px)"
      height="100%"
    >
      <div class="select-click-only-drawer__content-wrapper">
        <div class="select-click-only-drawer__header">
          <span class="select-click-only-drawer__header-title"
            >Add Landing Page Template</span
          >
          <VIcon color="#757575" style="font-size: 32px;" @click="handleClose">
            mdi-close
          </VIcon>
        </div>

        <div class="select-click-only-drawer__section-header">
          <ConfigureCompanyStepHeader
            title="Landing Page Template"
            :subtitle="stepSubtitle"
          />
        </div>

        <div class="select-click-only-drawer__body">
          <LandingPageTemplateListPreview
            ref="templateListPreview"
            :scenario-details-lookup="scenarioDetailsLookup"
            :method="''"
            :languages="languages"
            :type="type"
            v-bind="apiFuncs ? { apiFuncs } : {}"
            @selectedLandingPageTemplateResourceId="selectedResourceId = $event"
          />
        </div>

        <div class="select-click-only-drawer__footer">
          <VBtn
            class="k-overlay__btn-cancel"
            rounded
            outlined
            @click="handleClose"
          >
            CANCEL
          </VBtn>
          <VBtn
            rounded
            color="#2196f3"
            dark
            :disabled="!selectedResourceId"
            style="
              box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1),
                0 2px 5px 0 rgba(33, 150, 243, 0.3) !important;
              font-weight: 600;
            "
            @click="handleAddTemplate"
          >
            ADD TEMPLATE
          </VBtn>
        </div>
      </div>
    </VNavigationDrawer>
  </div>
</template>

<script>
import LandingPageTemplateListPreview from "@/components/workshop/LandingPageTemplateListPreview.vue";
import ConfigureCompanyStepHeader from "@/components/Companies/ConfigureCompanyStepHeader.vue";
import { createRandomCryptStringNumber } from "@/utils/functions";

export default {
  name: "SelectClickOnlyPageModal",
  components: { LandingPageTemplateListPreview, ConfigureCompanyStepHeader },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    method: {
      type: String,
      default: ""
    },
    scenarioDetailsLookup: {
      type: Object,
      default: () => ({})
    },
    languages: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ""
    },
    apiFuncs: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isVisible: false,
      drawerId: `drawer-${createRandomCryptStringNumber()}`,
      selectedResourceId: null,
      isJustOpened: false
    };
  },
  computed: {
    stepSubtitle() {
      return "Select a Click Only or Data Submission type landing page";
    }
  },
  watch: {
    status(newVal) {
      if (newVal && !this.isVisible) {
        this.isVisible = true;
        this.isJustOpened = true;
        this.$nextTick(() => {
          this.openDrawer();
          setTimeout(() => {
            this.isJustOpened = false;
          }, 300);
        });
      } else if (!newVal && this.isVisible) {
        this.closeDrawer();
      }
    }
  },
  methods: {
    openDrawer() {
      const el = document.querySelector(`[data-drawer-id="${this.drawerId}"]`);
      if (el) {
        el.style.right = "-100%";
        setTimeout(() => {
          el.style.right = "0";
        }, 10);
      }
    },
    closeDrawer() {
      const el = document.querySelector(`[data-drawer-id="${this.drawerId}"]`);
      if (el) el.style.right = "-100%";
      setTimeout(() => {
        this.isVisible = false;
        this.selectedResourceId = null;
        this.$emit("close");
      }, 250);
    },
    handleClose() {
      this.closeDrawer();
    },
    handleClickOutside(event) {
      if (this.isJustOpened) return;
      const target = event?.target;
      if (
        target &&
        (target.closest(".el-select-dropdown") ||
          target.closest(".el-picker-panel") ||
          target.closest(".el-popper") ||
          target.closest(".v-menu__content"))
      ) {
        return;
      }
      this.handleClose();
    },
    handleAddTemplate() {
      if (!this.selectedResourceId) return;
      const pageIndex = this.getSelectedPageIndex();
      this.$emit("add", this.selectedResourceId, pageIndex);
    },
    getSelectedPageIndex() {
      const tab = this.$refs.templateListPreview?.selectedLandingPageTab;
      const index = Number.parseInt(tab, 10) - 1;
      return Number.isNaN(index) || index < 0 ? 0 : index;
    }
  }
};
</script>
