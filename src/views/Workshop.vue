<template>
  <div class="workshop">
    <EmailTemplateListPreview></EmailTemplateListPreview>
    <ExerciseListPreview></ExerciseListPreview>
    <PhishingScenarioPreview></PhishingScenarioPreview>
    <TargetUserListPreview></TargetUserListPreview>
  </div>
</template>

<script>
import EmailTemplateListPreview from '../components/workshop/EmailTemplateListPreview'
import ExerciseListPreview from '@/components/workshop/ExerciseListPreview'
import TargetUserListPreview from '@/components/workshop/TargetUserListPreview'
import PhishingScenarioPreview from '@/components/workshop/PhishingScenarioPreview'
export default {
  name: 'Workshop',
  props: {},
  components: {
    PhishingScenarioPreview,
    TargetUserListPreview,
    ExerciseListPreview,
    EmailTemplateListPreview
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss">
.workshop {
  min-height: 80vh !important;
  padding-top: 10px;
  &-title {
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #383b41;
  }
  &-subtitle {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #383b41;
    margin-bottom: 16px;
  }
  &-content {
    border-radius: 20px;
    box-shadow: 0 1px 5px 0 rgba(80, 80, 80, 0.2), 0 2px 2px 0 rgba(80, 80, 80, 0.14),
      0 3px 1px -2px rgba(80, 80, 80, 0.12);
    background-color: #ffffff;
    &--search {
      border-bottom: 1px solid #e0e0e0;
    }
  }
  &__container {
    padding: 0 16px 24px 16px !important;
    width: 100%;
    &-main {
      border-radius: 20px;
      -webkit-box-shadow: 0 10px 15px -5px rgb(205 205 205 / 50%);
      box-shadow: 0 10px 15px -5px rgb(205 205 205 / 50%);
      background-color: #ffffff;
      padding: 24px !important;
    }
    &-card {
      box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
      padding: 10px 24px 0 24px !important;
      border-radius: 20px !important;
      width: 100%;
    }
  }
  .workshop-class {
    box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5) !important;
    border: solid 1px rgba(100, 181, 246, 0.5) !important;
    background-color: #e3f2fd !important;
  }
  .k-dialog__title {
    font-size: 24px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: #2196f3 !important;
  }
  .k-dialog__header-max-height {
    box-shadow: none !important;
    z-index: 9 !important;
    position: relative !important;
  }
  .k-dialog__header {
    padding: 0 !important;
    margin-bottom: 40px;
    border: none !important;
  }
  .template-list {
    padding: 16px 0 16px 24px;
    border-bottom: 1px solid #e0e0e0;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #4a4a4a;
    cursor: pointer;
    &:hover,
    &--selected {
      background-color: #f1f8fe;
      .template-list--item__header {
        color: #2196f3 !important;
      }
    }
    &--item {
      &:not(:last-child) {
        margin-bottom: 8px;
      }
      &__header {
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #383b41;
      }
      &__chip {
        padding: 4px 6px;
        border-radius: 4px;
        background-color: #2196f3;
        color: #ffffff;
      }
    }
  }
  .template-preview {
    max-width: 620px;
    margin: 0 auto;
    padding: 24px 0;
    &__icon {
      position: absolute;
      right: 8px;
      top: 8px;
      cursor: pointer;
    }
  }
  .multipane-resizer {
    // background: rgba(0, 0, 0, 0.51);
    // width: 8px;
  }

  .vertical-panes {
    width: 100%;
    height: 715px;
    padding: 0;
  }
  .vertical-panes > .pane {
    text-align: left;
    padding: 0;
    overflow: auto;
    background: #ffffff;
    &:first-child {
      border-bottom-left-radius: 24px;
      border-right: 5px solid #ccc;
    }
    &:last-child {
      border-bottom-right-radius: 24px;
    }
  }
}
</style>
