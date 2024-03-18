<template>
  <div class="training-library-card">
    <div :class="['training-library-card__type', getBgColor]">
      {{ item.type }}
    </div>
    <div class="training-library-card__img">
      <img v-if="item.coverImageUrl" :src="item.coverImageUrl" :alt="item.title" />
      <div class="training-library-card__img--no-img" v-else>
        <VIcon size="82" color="#fff">mdi-image</VIcon>
        <div class="training-library-card__img--no-img-text">No Cover Image</div>
      </div>
    </div>
    <div class="training-library-card__body">
      <div class="training-library-card__body-title">{{ item.trainingName }}</div>
      <div class="training-library-card__body-sub">
        <div>{{ item.createdBy }}</div>
        <div class="training-library-card__body-sub-bull"></div>
        <div>{{ item.category }}</div>
      </div>
      <div class="training-library-card__body-description">
        <div class="d-flex gap-2">
          <div v-if="item.tags.length" class="training-library-card__body-tag">
            {{ item.tags[0] }}
          </div>
          <VTooltip v-if="item.tags.length > 1" bottom>
            <template #activator="{ on }">
              <div v-on="on" class="training-library-card__body-tag">+ {{ item.tags.length }}</div>
            </template>
            <span>{{ item.tags.slice(1).toString() }}</span>
          </VTooltip>
        </div>
        <div class="training-library-card__body-languages">
          <VIcon>mdi-web</VIcon>
          <div v-for="(language, languageIndex) in item.languages.slice(0, 2)" :key="language">
            {{ language }}<span v-if="item.languages.length - 1 > languageIndex">|</span>
          </div>
        </div>
      </div>
      <div class="training-library-card__footer">
        <div class="training-library-card__footer-left-side">
          <VBtn
            class="w-100 training-library-card__footer-btn"
            color="#fff"
            rounded
            :ripple="false"
            @click="handlePreviewClick"
          >
            <VIcon class="mr-1" left>mdi-eye</VIcon>
            Preview
          </VBtn>
        </div>
        <div class="training-library-card__footer-right-side">
          <VIcon color="#2196f3" class="training-library-card__footer-btn" small>mdi-send</VIcon>
          <VMenu bottom offset-y>
            <template #activator="{ on }">
              <VIcon v-on="on" color="#2196f3" class="training-library-card__footer-btn" small
                >mdi-dots-vertical</VIcon
              >
            </template>
            <VListItem
              class="training-library-filtering-options-parent-list-item"
              @click="handleListItemClick(item.text)"
            >
              <VListItemTitle class="training-library-filtering-options-parent-list-item-title"
                >{{ item.text }} <VIcon>{{ item.icon }}</VIcon></VListItemTitle
              >
            </VListItem>
          </VMenu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrainingLibraryCard',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    getBgColor() {
      return 'training-library-card__type--training'
      return `training-library-card__type--${this.item.type}`
    }
  },
  methods: {
    handlePreviewClick() {},
    handleListItemClick() {}
  }
}
</script>
