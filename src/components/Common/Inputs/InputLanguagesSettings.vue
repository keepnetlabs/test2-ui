<template>
  <div class="position-relative" v-click-outside="handleClickOutside">
    <div class="d-flex gap-4">
      <VTextField
        v-model.trim="getTextFieldValue"
        ref="refSearchTextField"
        id="input-language-settings"
        outlined
        hide-details
        readonly
        autocomplete="off"
        placeholder="Search languages to manage"
        :append-icon="appendIcon"
        :disabled="isGenerateWithAIDisabled"
        @focus="handleSearchInputFocus"
      />
      <VBtn
        class="fw-600"
        rounded
        outlined
        color="#2196f3"
        :style="getGenerateWithAIButtonStyle"
        @click="handleGenerateWithAI"
      >
        <VIcon :style="getGenerateWithAIButtonIconStyle">mdi-creation</VIcon>
        <span class="button-new__text">Generate with AI</span>
      </VBtn>
    </div>
    <div v-show="!loading" class="switch-account__container input-language-settings__container">
      <div>
        <div class="px-4 py-4 pb-12" :style="{ maxHeight: menuMaxHeight, overflowY: 'auto' }">
          <div>
            <VTextField
              v-model.trim="searchValue"
              outlined
              hide-details
              autocomplete="off"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search"
            />
            <VTreeview
              :key="treeViewKey"
              ref="refTreeView"
              :value="value"
              class="input-languages-settings-treeview"
              dense
              selectable
              open-all
              return-object
              item-text="text"
              item-key="value"
              item-disabled="disabled"
              :search="searchValue"
              :hoverable="false"
              :items="items"
              @input="handleTreeViewChange"
            >
            </VTreeview>
          </div>
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
import { createRandomCryptStringNumber } from '@/utils/functions'

export default {
  name: 'InputLanguagesSettings',
  props: {
    value: {
      type: Array
    },
    isGenerateWithAIDisabled: {
      type: Boolean,
      default: false
    },
    languageItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      appendIcon: 'mdi-menu-down',
      treeViewKey: `key-${createRandomCryptStringNumber()}`,
      selectedLanguages: this.value || [],
      loading: false,
      menuMaxHeight: '300px',
      searchValue: '',
      items: this.languageItems
    }
  },
  computed: {
    getGenerateWithAIButtonIconStyle() {
      return {
        fontSize: '20px',
        marginTop: '1px',
        opacity: this.isGenerateButtonDisabled ? '0.5' : '1'
      }
    },
    getTextFieldValue() {
      const length = this.value.length
      return `Language${length > 1 ? 's' : ''} (${length})`
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
    getGenerateWithAIButtonStyle() {
      const style = {}
      if (this.isGenerateButtonDisabled) {
        style.opacity = '0.5'
        style.pointerEvents = 'none'
        style.cursor = 'default'
      }
      return style
    },
    isGenerateButtonDisabled() {
      return this.value.length <= 1 || this.isGenerateWithAIDisabled
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
    handleAdd() {
      this.$emit('input', this.selectedLanguages)
      this.changeMenuStatus('hidden')
    },
    handleClickOutside() {
      this.treeViewKey = `key-${createRandomCryptStringNumber()}`
      this.selectedLanguages = this.value
      this.changeMenuStatus('hidden')
    },
    handleTreeViewChange(event) {
      this.selectedLanguages = event
      if (this.selectedLanguages.length >= 10) {
        this.items.forEach((item) => {
          item.children.forEach((child) => {
            const findedLanguage = this.selectedLanguages.find((item) => item.value === child.value)
            if (!findedLanguage) {
              this.$set(child, 'disabled', true)
            }
          })
        })
      } else {
        this.items.forEach((item) => {
          item.children.forEach((child) => {
            this.$set(child, 'disabled', false)
          })
        })
      }
    },
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
        } else if (resize) {
          this.menuMaxHeight = '300px'
        }
      }
    },
    handleGenerateWithAI() {
      this.$emit('on-generate-with-ai')
    }
  }
}
</script>
