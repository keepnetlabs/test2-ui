<template>
  <KContainer id="phishing-simulator">
    <el-tabs v-model="tab">
      <el-tab-pane v-if="getEtsQuickScanPermissionSearch" label="Scans" name="scans" id="tab-scans">
        <Scans v-if="tab === 'scans'" ref="refScans" />
      </el-tab-pane>
      <el-tab-pane
        v-if="getEmailTemplatesSearchPermissions"
        label="Attacks Vectors"
        name="attacksVectors"
        id="tab-attacks-vectors"
      >
        <AttacksVectors v-if="tab === 'attacksVectors'" ref="refAttacksVectors" />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import AttacksVectors from "@/components/EmailThreatSmulator/AttacksVectors";
import Scans from "@/components/EmailThreatSmulator/Scans";
import { mapGetters } from "vuex";
import KContainer from "@/components/KContainer/KContainer";

export default {
  name: "EMailThreatSimulator",
  components: {
    KContainer,
    AttacksVectors,
    Scans,
  },
  data() {
    return {
      tab: "scans",
    };
  },
  computed: {
    ...mapGetters({
      getEtsQuickScanPermissionSearch: "permissions/getEtsQuickScanPermissionSearch",
      getEmailTemplatesSearchPermissions: "permissions/getEmailTemplatesSearchPermissions",
    }),
  },
  methods: {
    changeTabStatus(tabStatus) {
      this.tab = tabStatus;
    },
  },
  created() {
    if (!this.getEtsQuickScanPermissionSearch && this.getEmailTemplatesSearchPermissions) {
      this.tab = "emailTemplates";
    } else if (
      !this.getPhishingScenariosSearchPermissions &&
      !this.getEtsQuickScanPermissionSearch &&
      this.getLandingPageTemplatesSearchPermissions
    ) {
      this.tab = "landingPage";
    }
  },
  beforeRouteLeave(to, from, next) {
    const { refScans, refAttacksVectors } = this.$refs;

    if (refScans && refScans.modalStatus) {
      refScans.checkIfCanCLoseNewScenarioModal();
      next(false);
    } else if (refScans && refScans.isShowFastLaunch) {
      if (refScans?.$refs?.fastLaunch?.isSubmitted) return next();
      refScans.checkIfCanCloseFastLaunchModal();
      next(false);
    } else if (
      refAttacksVectors &&
      refAttacksVectors.$refs.newEmailTemplate &&
      refAttacksVectors.$refs.newEmailTemplate.$refs.refEmailTemplate &&
      refAttacksVectors.$refs.newEmailTemplate.$refs.refEmailTemplate.showGrapesModal
    ) {
      refAttacksVectors.checkIfCanCloseGrapesJSModal();
      next(false);
    } else if (refAttacksVectors && refAttacksVectors.modalStatus) {
      refAttacksVectors.checkIfCanCloseNewEmailTemplate();
      next(false);
    } else {
      next();
    }
  },
};
</script>
