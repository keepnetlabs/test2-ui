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
      <VTooltip bottom>
        <template #activator="{ on }">
          <VIcon
            v-on="on"
            color="#2196f3"
            class="executive-reports-card__right-btn"
            small
            @click="handleScheduleClick"
            >mdi-calendar-clock</VIcon
          >
        </template>
        <span>Schedule Report</span>
      </VTooltip>
      <VTooltip bottom>
        <template #activator="{ on }">
          <VIcon
            v-on="on"
            color="#2196f3"
            small
            :class="getEditButtonClasses"
            @click="handleEditClick"
            >mdi-pencil</VIcon
          >
        </template>
        <span>{{ card.isEditable ? 'Edit' : 'You are not authorized to edit this template' }}</span>
      </VTooltip>
      <VTooltip bottom>
        <template #activator="{ on }">
          <VIcon
            v-on="on"
            color="#2196f3"
            class="executive-reports-card__right-btn"
            small
            @click="handleContentDuplicateClick"
            >mdi-content-copy</VIcon
          >
        </template>
        <span>Duplicate</span>
      </VTooltip>
      <VTooltip bottom>
        <template #activator="{ on }">
          <VIcon
            v-on="on"
            color="#2196f3"
            class="executive-reports-card__right-btn"
            small
            @click="handleDownloadClick"
            >mdi-download</VIcon
          >
        </template>
        <span>Download Report</span>
      </VTooltip>
      <VTooltip bottom>
        <template #activator="{ on }">
          <VIcon
            v-on="on"
            color="#2196f3"
            small
            @click="handleDeleteClick"
            :class="getDeleteButtonClasses"
            >mdi-delete</VIcon
          >
        </template>
        <span>{{
          card.isDeletable ? 'Delete' : 'You are not authorized to delete this template'
        }}</span>
      </VTooltip>
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
      const classes = ['executive-reports-card__right-btn']
      if (!this.card.isEditable) classes.push('executive-reports-card__right-btn--disabled')
      return classes
    },
    getDeleteButtonClasses() {
      const classes = ['executive-reports-card__right-btn']
      if (!this.card.isDeletable) classes.push('executive-reports-card__right-btn--disabled')
      return classes
    }
  },
  methods: {
    handlePreviewClick() {
      this.$router.push({
        name: 'Preview Executive Report',
        params: {
          id: this.card.resourceId || 'gürkan'
        }
      })
    },
    handleScheduleClick() {
      this.$emit('on-schedule', this.card)
    },
    handleEditClick() {
      if (!this.card.isEditable) return false
      this.$router.push({
        name: 'Edit Executive Report',
        params: {
          id: this.card.resourceId || 'gürkan'
        }
      })
    },
    handleContentDuplicateClick() {
      this.$router.push({
        name: 'Duplicate Executive Report',
        params: {
          id: this.card.resourceId || 'gürkan'
        }
      })
    },
    handleDownloadClick() {},
    handleDeleteClick() {
      this.$emit('on-delete', this.card)
    }
  }
}
</script>
