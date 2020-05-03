<template>
  <div class="settings" id="settings">
    <v-tabs id="settings-tabs" class="settings-tabs" v-model="tab" background-color="#f5f7fa"
            color="basil"
            active-class="settings-tab-active">
      <v-tab id="pr-tab-users" class="settings-tab  p-2" @click="changeTabStatus(0)">
        Add-in Settings
      </v-tab>
      <v-tab class="settings-tab p-2" @click="changeTabStatus(1)">Email Settings
      </v-tab>
      <v-tab class="settings-tab  p-2" @click="changeTabStatus(2)">Other Settings
      </v-tab>
      <v-tab class="settings-tab p-2" @click="changeTabStatus(3)">Diagnostic Tool
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="settings-tabs__container">
      <v-tab-item>
        <addin-settings/>
      </v-tab-item>
      <v-tab-item>
        <email-settings/>
      </v-tab-item>
      <v-tab-item>
        <other-settings/>
      </v-tab-item>
      <v-tab-item>
        <diagnostic-tool/>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
  import AddinSettings from "./AddinSettings";
  import DiagnosticTool from "./DiagnosticTool";
  import EmailSettings from "./EmailSettings";
  import OtherSettings from "./OtherSettings";

  export default {
    name: "Settings",
    components: {
      AddinSettings,
      EmailSettings,
      OtherSettings,
      DiagnosticTool
    },
    data() {
      return {
        tab: 0,
      }
    },
    methods: {
      changeTabStatus(status) {
        this.tab = status
      }
    }
  }
</script>

<style scoped lang="scss">

  .settings {
    margin-right: 20px;
    margin-top: -20px;

    &-tabs {
      &-container {
        margin-top: 10px !important;
      }
      ::v-deep .v-tabs-slider-wrapper {
        bottom:0 !important;
        color: #0486fe !important;
      }
    }

    &-tab {
      font-family: "Open Sans", sans-serif !important;
      font-size: 14px;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #212121 !important;

      text-transform: capitalize;
      &-active {
        color: #2196f3 !important;
        font-weight: 600 !important;
      }


    }
  }

  ::v-deep .v-slide-group__content {
    border: none !important;
  }
</style>
