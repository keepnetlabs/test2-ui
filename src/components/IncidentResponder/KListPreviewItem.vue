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
