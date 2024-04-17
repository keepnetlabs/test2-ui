<template>
  <div class="executive-reports-card">
    <div class="executive-reports-card__left">
      {{ card.name }}
    </div>
    <div class="executive-reports-card__right">
      <VBtn
        class="training-library-card__footer-btn executive-reports-card__preview-btn"
        color="#fff"
        rounded
        :ripple="false"
        @click="handlePreviewClick"
      >
        PREVIEW
      </VBtn>
      <VIcon
        color="#2196f3"
        class="executive-reports-card__right-btn"
        small
        @click="handleScheduleClick"
        >mdi-calendar-clock</VIcon
      >
      <VIcon color="#2196f3" small :class="getEditButtonClasses" @click="handleEditClick"
        >mdi-pencil</VIcon
      >
      <VIcon
        color="#2196f3"
        class="executive-reports-card__right-btn"
        small
        @click="handleContentDuplicateClick"
        >mdi-content-copy</VIcon
      >
      <VIcon
        color="#2196f3"
        class="executive-reports-card__right-btn"
        small
        @click="handleDownloadClick"
        >mdi-download</VIcon
      >
      <VIcon color="#2196f3" small @click="handleDeleteClick" :class="getDeleteButtonClasses"
        >mdi-delete</VIcon
      >
    </div>
  </div>
</template>
<script>
export default {
  name: 'ExecutiveReportsCard',
  props: {
    card: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    getEditButtonClasses() {
      return ['executive-reports-card__right-btn']
    },
    getDeleteButtonClasses() {
      return ['executive-reports-card__right-btn']
    }
  },
  methods: {
    handlePreviewClick() {},
    handleScheduleClick() {},
    handleEditClick() {},
    handleContentDuplicateClick() {},
    handleDownloadClick() {},
    handleDeleteClick() {}
  }
}
</script>
