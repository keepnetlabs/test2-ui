<template>
  <v-card class="email-template__container">
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
      <v-tab-item>
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
        <div class="email-template-preview">
          <div class="email-template-preview__header">
            <div class="email-template-preview__logo-container">
              <div class="email-template-preview__logo">
                Logo Here
              </div>
            </div>
            <v-btn
              rounded
              color="#2196f3"
              class="email-template-preview__button"
              @click="editHtmlTemplate"
            >
              <v-icon class="mr-2 text-h6">mdi-pencil</v-icon> Edit</v-btn
            >
          </div>
          <div class="email-template-preview__body">
            <div class="email-template-preview__body-header">
              Let’s design an email template
            </div>
            <div class="email-template-preview__body-sub-header">
              <span>
                To design an email template, first click the Edit button to enter design mode
              </span>
            </div>
          </div>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
export default {
  name: 'EmailTemplate',
  data() {
    return {
      tabItems: ['English', 'Turkish', 'German', 'Arabic', 'Sweden'],
      tab: 0,
      formValues: {
        subject: '',
        fromName: '',
        email: ''
      }
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
    editHtmlTemplate() {}
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
    }
  }
}
</style>
