<template>
  <div class="position-relative">
    <VTextField
      v-model.trim="getTextFieldValue"
      ref="refSearchTextField"
      id="input-language-settings"
      outlined
      hide-details
      autocomplete="off"
      placeholder="Search languages to manage"
      :append-icon="appendIcon"
      @focus="handleSearchInputFocus"
    />
    <div v-show="!loading" class="switch-account__container input-language-settings__container">
      <div>
        <div class="px-4 py-4 pb-12" :style="{ maxHeight: menuMaxHeight, overflowY: 'auto' }">
          <VTextField
            v-model.trim="searchValue"
            outlined
            hide-details
            autocomplete="off"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search"
          />
          <VTreeview
            class="input-languages-settings-treeview"
            dense
            return-object
            selectable
            open-all
            item-text="name"
            item-key="resourceId"
            :search="searchValue"
            :hoverable="false"
            :items="getItems"
            @input="handleTreeViewChange"
          >
          </VTreeview>
        </div>
      </div>
      <div class="p-4 input-language-settings__footer">
        <VBtn
          text
          id="btn-confirm--switch-company-dashboard-popup"
          color="#2196f3"
          class="k-dialog__button mr-2 py- px-0"
          :style="getAddButtonStyle"
          @click="handleAdd"
          >Add</VBtn
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputLanguagesSettings',
  data() {
    return {
      appendIcon: 'mdi-menu-down',
      selectedLanguages: [],
      loading: false,
      menuMaxHeight: '300px',
      searchValue: '',
      items: [
        {
          resourceId: 1,
          name: 'Preferred Languages',
          children: [
            { resourceId: 2, name: 'English (United Kingdom)' },
            { resourceId: 3, name: 'English (United States)', active: false, visible: false },
            { resourceId: 4, name: 'German' }
          ]
        },
        {
          resourceId: 5,
          name: 'All Languages',
          children: [
            { resourceId: 6, name: 'French' },
            { resourceId: 7, name: 'Spanish' },
            { resourceId: 8, name: 'Italian' }
          ]
        }
      ]
    }
  },
  computed: {
    getTextFieldValue() {
      return 'Languages(17)'
    },
    getAddButtonStyle() {
      const style = { marginTop: '2px' }
      if (!this.selectedLanguages.length) {
        style.color = '#2196f3 !important'
        style.opacity = '0.5'
        style.pointerEvents = 'none'
      }
      return style
    },
    getItems() {
      return this.items
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
  methods: {
    handleAdd() {},
    handleTreeViewChange() {},
    handleSearchInputFocus() {
      this.changeMenuStatus('visible')
    },
    changeMenuStatus(status = 'hidden') {
      const menu = document.querySelector('.switch-account__container')
      if (menu) {
        menu.style.visibility = status
      }
    },
    handleMenuHeight(resize = false) {
      const menu = document.querySelector('.switch-account__container')
      if (menu) {
        const { bottom } = menu.getBoundingClientRect()
        const { innerHeight } = window
        const maxBottom = bottom + (300 - parseInt(this.menuMaxHeight.replace('px', '')))
        if (maxBottom > innerHeight) {
          const diff = Math.round(maxBottom - innerHeight) + 8
          const newMaxHeight = 300 - diff
          this.menuMaxHeight = `${newMaxHeight}px`
        } else {
          if (resize) {
            this.menuMaxHeight = '300px'
          }
        }
      }
    }
  }
}
</script>
