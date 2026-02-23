<template>
  <div>
    <div v-show="!loading" class="switch-account__container" :style="{ maxHeight: menuMaxHeight }">
      <template v-for="(item, i) in items">
        <v-lazy
          transition="none"
          :key="item.name + i"
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
            :id="`switch-account-item-container-${item.name}`"
            :open-all="isOpenAll"
            @input="handleTreeViewChange"
          >
            <template #prepend="{ item }">
              <img
                :id="`switch-account-item-logo-${item.name}`"
                :src="item.logoUrl || require('../assets/img/no-logo.png')"
                alt=""
                style="
                  width: 32px;
                  height: 32px;
                  display: flex;
                  align-items: center;
                  cursor: pointer;
                  object-fit: contain;
                  transform: scale(1.2);
                "
                @click="handleTreeViewChange(item)"
              />
            </template>
            <template #label="{item}">
              <span
                :id="`switch-account-item-label-${item.name}`"
                style="
                  cursor: pointer;
                  height: 32px;
                  display: flex;
                  align-items: center;
                  padding-left: 6px;
                "
                @click="handleTreeViewChange(item)"
                >{{ item.name }}</span
              >
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
    },
    isOpenAll: {
      type: Boolean
    }
  },
  data() {
    return {
      menuMaxHeight: '300px'
    }
  },
  watch: {
    loading(val) {
      if (!val) {
        this.$nextTick(() => {
          this.handleMenuHeight()
        })
      }
    }
  },
  created() {
    window.addEventListener('resize', this.handleResizeMenuHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResizeMenuHeight)
  },
  methods: {
    handleResizeMenuHeight() {
      this.handleMenuHeight(true)
    },
    handleTreeViewChange(item) {
      this.$emit('on-selected-account', {
        label: item.name,
        id: item.resourceId,
        privacyDurationId: item.privacyDurationId,
        licenceExpired: item.licenceExpired
      })
    },
    handleMenuHeight(resize = false) {
      const menu = document.querySelector('.switch-account__container')
      if (menu) {
        const { bottom } = menu.getBoundingClientRect()
        const { innerHeight } = globalThis
        const maxBottom = bottom + (300 - Number.parseInt(this.menuMaxHeight.replace('px', '')))
        if (maxBottom > innerHeight) {
          const diff = Math.round(maxBottom - innerHeight) + 8
          const newMaxHeight = 300 - diff
          this.menuMaxHeight = `${newMaxHeight}px`
        } else if (resize) {
          this.menuMaxHeight = '300px'
        }
      }
    }
  }
}
</script>
