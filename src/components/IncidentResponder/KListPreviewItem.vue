<template>
  <div
    :class="['k-list-preview-item', { 'k-list-preview-item--active': isSelected }]"
    @click="handleItemClick"
  >
    <div class="k-list-preview-item__header">
      <div class="k-list-preview-item__header-title-container">
        <div class="k-list-preview-item__header-title">{{ item.name }}</div>
        <v-btn style="display: none;"></v-btn>
        <Badge
          v-if="isDefault"
          id="badge--k-list-preview-item"
          color="#2196F3"
          text="Default"
          :outline="false"
        />
      </div>
      <div class="k-list-preview-item__header-subtitle-container">
        <div class="k-list-preview-item__header-subtitle">{{ item['typeName'] }}</div>
        <div class="k-list-preview-item__header-created-by">by {{ item['companyName'] }}</div>
      </div>
    </div>
    <div class="k-list-preview-item__content">{{ item.subject }}</div>
    <div class="k-list-preview-item__footer">
      <div class="k-list-preview-item__footer-left">
        <badge v-for="tag in item.tags" :key="tag" />
      </div>
      <div class="k-list-preview-item__footer-right"></div>
    </div>
  </div>
</template>

<script>
import Badge from '@/components/Badge'
export default {
  name: 'KListPreviewItem',
  components: { Badge },
  props: {
    item: {
      type: Object
    },
    isDefault: {
      type: Boolean
    },
    isSelected: {
      type: Boolean
    }
  },
  methods: {
    handleItemClick() {
      this.$emit('on-item-click', this.item)
    }
  }
}
</script>

<style lang="scss">
.k-list-preview-item {
  min-height: 150px;
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  &--active {
    background-color: #f1f8fe;
    .k-list-preview-item__header-title {
      color: #2196f3;
    }
  }
  &__header {
    padding: 16px 24px 0 24px;
    &-title {
      font-weight: 600;
      font-size: 16px;
      color: #383b41;
      padding-bottom: 8px;
      &-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
        grid-gap: 8px;
        div:first-child {
          grid-column: 1 / 3;
        }
        div:last-child {
          grid-column: 1 span;
        }
      }
    }
    &-subtitle {
      &-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
        grid-gap: 8px;
        font-weight: 600;
        font-size: 12px;
        color: #757575;
        padding-bottom: 8px;
        .k-list-preview-item__header-subtitle {
          grid-column: 1 / 3;
        }
        .k-list-preview-item__header-created-by {
          grid-column: 1 span;
        }
      }
    }
  }
  &__content {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    padding: 0 24px 8px 24px;
    color: #383b41;
  }
}
</style>
