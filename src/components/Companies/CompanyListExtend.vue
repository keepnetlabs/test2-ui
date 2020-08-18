<template>
  <div class="company-list-extend" :style="cssStyle">
    <div class="company-list-extend__header">
      <div class="company-list-extend__header-title">
        {{ selectedRow.companyName }}
      </div>
      <div class="company-list-extend__header-icon">
        <v-btn icon small text @click="$emit('editAction', selectedRow)">
          <v-icon size="24">mdi-pencil</v-icon>
        </v-btn>
      </div>
      <div class="company-list-extend__header-icon">
        <v-btn icon small text @click="$emit('close')">
          <v-icon size="24">mdi-close</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="company-list-extend__body">
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Company Name</div>
        <div class="company-list-extend__body-value">{{ selectedRow.companyName }}</div>
      </div>
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Industry</div>
        <div class="company-list-extend__body-value">{{ selectedRow.industryName }}</div>
      </div>
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Total Users</div>
        <div class="company-list-extend__body-value">{{ selectedRow.numberOfUsers }}</div>
      </div>
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Address</div>
        <div class="company-list-extend__body-value">{{ selectedExtend.address }}</div>
      </div>
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Website</div>
        <div class="company-list-extend__body-value">
          <a :href="selectedExtend.websiteUrl" target="_blank">{{ selectedExtend.websiteUrl }}</a>
        </div>
      </div>
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Country</div>
        <div class="company-list-extend__body-value">
          {{ selectedExtend.countryName }}
        </div>
      </div>
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Notif. Templates</div>
        <div class="company-list-extend__body-value">
          {{ selectedExtend.notificationTemplateTypeName }}
        </div>
      </div>
      <div class="company-list-extend__body-item">
        <div class="company-list-extend__body-key">Smtp Settings</div>
        <div class="company-list-extend__body-value">
          {{ selectedExtend.smtpConfigurationTypeName }}
        </div>
      </div>
    </div>
    <div class="company-list-extend__footer">
      <div class="company-list-extend__footer-item">
        <div class="company-list-extend__footer-key">Licence Type</div>
        <div class="company-list-extend__footer-value">{{ selectedRow.licenseTypeName }}</div>
      </div>
      <div class="company-list-extend__footer-item">
        <div class="company-list-extend__footer-key">Licence Expires on</div>
        <div class="company-list-extend__footer-value">{{ selectedRow.licenseEndDate }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompanyListExtend',
  props: {
    selectedRow: {
      type: Object
    },
    selectedExtend: {
      type: Object
    },
    cssStyle: {
      type: Object
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss">
.company-list-extend {
  top: 24px;
  position: absolute;
  right: 0;
  overflow: hidden;
  z-index: 5;
  width: 360px;
  border-radius: 12px;
  box-shadow: 0 1px 1px -1px rgba(204, 204, 204, 0.12), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
    0 1px 3px 0 rgba(142, 142, 142, 0.2);
  border: solid 1px #2196f3;
  background-color: #ffffff;
  color: rgba(0, 0, 0, 0.87);

  &__header {
    padding: 16px;
    display: flex;
    align-items: center;
    &-title {
      line-height: 24px;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: normal;
      flex-grow: 1;
    }
    &-icon {
      width: auto;
      padding: 0 10px;
      &:nth-child(2) {
        padding-left: 0;
      }
      &:nth-child(3) {
        padding-right: 0;
      }
    }
  }
  &__body {
    padding: 8px 16px 16px 16px;
    &-item {
      display: flex;
      margin-bottom: 4px;
    }
    &-key {
      min-width: 100px;
      line-height: 17px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 4px;
    }
    &-value {
      line-height: 19px;
      font-size: 12px;
    }
  }
  &__footer {
    padding: 16px;
    background-color: #f1f8fe;
    display: flex;
    &-item {
      margin-right: 48px;
    }
    &-key {
      line-height: 17px;
      font-size: 12px;
      font-weight: 600;
    }
    &-value {
      line-height: 19px;
      font-size: 12px;
    }
  }
}
</style>
