<template>
  <div>
    <div class="switch-account__container">
      <template v-show="!loading" v-for="(item, i) in items">
        <v-lazy
          transition="none"
          :key="i"
          :options="{
            threshold: 0
          }"
          min-height="48"
        >
          <v-treeview
            dense
            hoverable
            return-object
            item-text="name"
            item-key="resourceId"
            :items="[item]"
            @input="handleTreeViewChange"
          >
            <template #prepend="{ item }">
              <img
                :src="item.logoUrl || require('../assets/img/no-logo.png')"
                alt=""
                style="
                  width: 32px;
                  height: 32px;
                  display: flex;
                  align-items: center;
                  cursor: pointer;
                "
                @click="handleTreeViewChange(item)"
              />
            </template>
            <template #label="{item}">
              <span style="cursor: pointer;" @click="handleTreeViewChange(item)">{{
                item.name
              }}</span>
            </template>
          </v-treeview>
        </v-lazy>
      </template>
      <div v-show="items.length === 0" class="switch-account__select-footer">
        <v-icon class="ml-2" color="orange" style="font-size: 22px;">mdi-alert-circle</v-icon>
        <span class="ml-1" style="line-height: 1.2;">No results found...</span>
      </div>
    </div>
    <k-select-loading v-if="loading && isShowingMenu" style="bottom: -44px;" />
  </div>
</template>

<script>
import KSelectLoading from '@/components/KSelectLoading'
export default {
  name: 'SwitchAccountTreeView',
  components: { KSelectLoading },
  props: {
    items: {
      type: Array
    },
    loading: {
      type: Boolean
    },
    search: {
      type: String
    },
    isShowingMenu: {
      type: Boolean
    }
  },
  methods: {
    handleTreeViewChange(item) {
      this.$emit('on-selected-account', { label: item.name, id: item.resourceId })
    }
  }
}
</script>
<style lang="scss">
.switch-account__container {
  max-height: 300px;
  overflow-y: auto;
  padding: 8px 0;
  border-radius: 8px;
  box-shadow: 0 5px 12px 2px rgba(91, 91, 91, 0.12), 0 3px 18px 2px rgba(56, 59, 65, 0.04);
  position: absolute;
  top: 46px;
  z-index: 99;
  background: white;
  width: 100%;
  will-change: opacity;
  opacity: 0;
}
.switch-account__select-footer {
  span {
    color: #383b41;
    font-size: 13px;
  }
}
</style>
