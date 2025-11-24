<template>
  <div class="position-relative" v-click-outside="handleClickOutside">
    <DataTableTooltip
      v-if="showOverFlowTooltip"
      class="input-languages-tooltip"
      :tooltipStyle="overFlowTooltipStyle"
      :content="overFlowTooltipContent"
    />

    <div class="d-flex gap-4">
      <div v-if="isShowLocalizeButton" class="position-relative">
        <div>
          <VTooltip v-if="!isLocalizeReady || showRedFlags" bottom max-width="260">
            <template #activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <VBtn
                  :ripple="false"
                  class="fw-600"
                  rounded
                  outlined
                  color="#2196f3"
                  :style="getLocalizeButtonStyle"
                  @click="handleLocalizeClick"
                >
                  <VIcon>mdi-web</VIcon>
                  <span class="button-new__text ml-1" style="text-transform: none;">Localize</span>
                </VBtn>
              </div>
            </template>
            <span>
              {{
                showRedFlags
                  ? 'To use this action, first hide the Red Flag.'
                  : 'To start localization, fill in all required fields.'
              }}
            </span>
          </VTooltip>
          <VBtn
            v-else
            class="fw-600"
            rounded
            outlined
            color="#2196f3"
            :style="getLocalizeButtonStyle"
            @click="handleLocalizeClick"
          >
            <VIcon>mdi-web</VIcon>
            <span class="button-new__text ml-1" style="text-transform: none;">Localize</span>
          </VBtn>
        </div>
        <div
          v-show="!loading || isShowLanguages"
          class="switch-account__container input-language-settings__container"
          :style="getMenuContainerStyle"
        >
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
                  :value="selectedLanguages"
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
                  :items="computedItems"
                  @input="handleTreeViewChange"
                >
                  <template #label="{ item }">
                    <template>
                      <span
                        v-if="item.text === 'All Languages'"
                        style="
                          background-color: #e0e0e0;
                          width: 100%;
                          height: 1px;
                          display: inline-block;
                        "
                      ></span>
                      <div
                        v-else
                        :class="
                          item.text === 'Preferred Languages'
                            ? 'd-flex flex-column mt-1'
                            : 'd-flex flex-column'
                        "
                        style="margin-top: 1px; position: relative;"
                      >
                        <div
                          v-if="
                            item.text !== 'Preferred Languages' && item.text !== 'All Languages'
                          "
                        >
                          <span>{{ item.text }}</span>
                        </div>
                        <div
                          v-if="
                            item.text !== 'Preferred Languages' &&
                            item.text !== 'All Languages' &&
                            isLanguageAlreadyLocalized(item)
                          "
                          style="color: rgba(56, 59, 65, 0.72); font-size: 9px; margin-top: 2px;"
                        >
                          Localized
                        </div>

                        <div v-if="item.text === 'Preferred Languages'">
                          <div class="fw-400 mt-1 mb-1">
                            Languages your employees prefer
                          </div>
                        </div>
                      </div>
                    </template>
                  </template>
                  <template #append="{ item }">
                    <div
                      v-if="
                        item.text !== 'Preferred Languages' &&
                        item.text !== 'All Languages' &&
                        isLanguageAlreadyLocalized(item) &&
                        !hiddenRelocalizeLanguageIds.includes(item.value)
                      "
                      class="d-flex align-center cursor-pointer"
                      style="color: #2196f3; font-size: 12px; font-weight: 600;"
                      @click.stop="handleRelocalizeClick(item, $event)"
                    >
                      <VTooltip bottom max-width="135">
                        <template #activator="{ on, attrs }">
                          <VIcon
                            v-bind="attrs"
                            v-on="on"
                            color="#2196f3"
                            small
                            style="font-size: 20px;"
                          >
                            mdi-refresh
                          </VIcon>
                        </template>
                        <span>Update Localization</span>
                      </VTooltip>
                    </div>
                  </template>
                </VTreeview>
              </div>
            </div>
          </div>
          <div class="p-4 input-language-settings__footer">
            <VTooltip bottom max-width="135">
              <template #activator="{ on, attrs }">
                <VBtn
                  v-bind="attrs"
                  v-on="on"
                  text
                  id="btn-confirm--switch-company-dashboard-popup"
                  color="#2196f3"
                  class="k-dialog__button k-dialog__button--localize mr-2 px-0"
                  :style="getAddButtonStyle"
                  @click="handleAdd"
                >
                  LOCALIZE
                </VBtn>
              </template>
              <span>Applies only to newly selected languages.</span>
            </VTooltip>
          </div>
        </div>
      </div>
      <VTooltip v-if="!isNotificationTemplate && !isLocalizeReady" bottom max-width="260">
        <template #activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <VBtn
              :ripple="false"
              lass="fw-600"
              rounded
              outlined
              color="#2196f3"
              :style="getRedFlagButtonStyle"
              @click="handleShowRedFlagsClick"
            >
              <VIcon>mdi-flag</VIcon>
              <span class="button-new__text fw-600 ml-1" style="text-transform: none;">{{
                redFlagsText
              }}</span>
            </VBtn>
          </div>
        </template>
        <span>
          To see red flags, fill in all required fields.
        </span>
      </VTooltip>
      <VBtn
        v-else-if="!isNotificationTemplate && isLocalizeReady"
        lass="fw-600"
        rounded
        outlined
        color="#2196f3"
        @click="handleShowRedFlagsClick"
      >
        <VIcon>mdi-flag</VIcon>
        <span class="button-new__text fw-600 ml-1" style="text-transform: none;">{{
          redFlagsText
        }}</span>
      </VBtn>
      <VIcon
        v-if="isLandingPage"
        color="#2196f3"
        class="executive-reports-card__right-btn"
        small
        @click="handleAIAlly"
        >mdi-lightbulb-on-outline</VIcon
      >
      <VIcon
        v-if="isLandingPage"
        :color="isPhishingLinkOpen ? '#fff' : '#2196f3'"
        :class="[
          'executive-reports-card__right-btn',
          { 'input-languages-settings__link-icon--active': isPhishingLinkOpen }
        ]"
        small
        @click="handleLinkChange"
        >{{ isPhishingLinkOpen ? 'mdi-close' : 'mdi-link-variant' }}</VIcon
      >
      <VTooltip v-if="showRedFlags" bottom max-width="142">
        <template #activator="{ on }">
          <div v-on="on">
            <VIcon
              color="#2196f3"
              class="executive-reports-card__right-btn"
              small
              :style="getEditModeIconStyle"
              @click="handleEditModeClick"
              >mdi-pencil</VIcon
            >
          </div>
        </template>
        <span>To use this action, first hide the Red Flag.</span>
      </VTooltip>
      <VIcon
        v-else
        color="#2196f3"
        class="executive-reports-card__right-btn"
        small
        @click="handleEditModeClick"
        >mdi-pencil</VIcon
      >
      <VMenu
        v-if="!isNotificationTemplate"
        :key="showRedFlags ? 'red-flags' : 'normal'"
        bottom
        :offset="24"
        nudge-bottom="40"
        nudge-left="40"
      >
        <template #activator="{ on }">
          <VTooltip v-if="showRedFlags" bottom max-width="142">
            <template #activator="{ on: onTooltip }">
              <div v-on="onTooltip">
                <VIcon
                  v-on="on"
                  color="#2196f3"
                  class="executive-reports-card__right-btn"
                  :style="getEditModeIconStyle"
                  small
                  >mdi-dots-vertical</VIcon
                >
              </div>
            </template>
            <span>To use this action, first hide the Red Flag.</span>
          </VTooltip>

          <VIcon
            v-else
            v-on="on"
            color="#2196f3"
            class="executive-reports-card__right-btn"
            :style="getEditModeIconStyle"
            small
            >mdi-dots-vertical</VIcon
          >
        </template>

        <VList>
          <VListItem class="cursor-pointer" @click="handleUploadEmailButtonClick">
            <VListItemTitle>
              <VIcon>mdi-upload</VIcon>
              <span>Import Email</span>
            </VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
    </div>
  </div>
</template>

<script>
import { createRandomCryptStringNumber } from '@/utils/functions'
import DataTableTooltip from '@/components/DataTableComponents/DataTableTooltip.vue'
export default {
  name: 'InputLanguagesSettings',
  components: {
    DataTableTooltip
  },
  props: {
    value: {
      type: Array
    },
    subject: {
      type: String,
      default: ''
    },
    fromName: {
      type: String,
      default: ''
    },
    fromAddress: {
      type: String,
      default: ''
    },
    isFromAddressValid: {
      type: Boolean,
      default: true
    },
    isGenerateWithAIDisabled: {
      type: Boolean,
      default: false
    },
    isTemplateTypeSelected: {
      type: Boolean,
      default: true
    },
    languageItems: {
      type: Array,
      default: () => []
    },
    showRedFlags: {
      type: Boolean,
      default: false
    },
    activeLanguage: {
      type: String,
      default: ''
    },
    translatedLanguageResourceIds: {
      type: Array,
      default: () => []
    },
    companyPreferredLanguageId: {
      type: String,
      default: ''
    },
    canRemoveLanguages: {
      type: Boolean,
      default: false
    },
    initialDisabledLanguageIds: {
      type: Array,
      default: () => []
    },
    isNotificationTemplate: {
      type: Boolean,
      default: false
    },
    isLandingPage: {
      type: Boolean,
      default: false
    },
    isShowLocalizeButton: {
      type: Boolean,
      default: true
    },
    isPhishingLinkOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      appendIcon: 'mdi-menu-down',
      treeViewKey: `key-${createRandomCryptStringNumber()}`,
      selectedLanguages: this.value || [],
      loading: false,
      isShowLanguages: false,
      menuMaxHeight: '300px',
      searchValue: '',
      items: this.languageItems,
      showOverFlowTooltip: false,
      overFlowTooltipContent: 'Active language can’t be removed. Switch to another language first.',
      overFlowTooltipStyle: {
        top: '0px',
        left: '0px'
      },
      activeNodes: [],
      relocalizeConfirmFor: null,
      showRelocalizeConfirm: false,
      relocalizeConfirmStyle: {
        top: '0px',
        left: '0px'
      },
      confirmRowEl: null,
      confirmRowWrapper: null,
      confirmMode: null,
      hiddenRelocalizeLanguageIds: [],
      pendingRemoveConfirm: {},
      pendingRelocalizeConfirm: {}
    }
  },
  computed: {
    isLocalizeReady() {
      return (
        Boolean(this.subject) &&
        Boolean(this.fromName) &&
        Boolean(this.fromAddress) &&
        this.isFromAddressValid &&
        this.isTemplateTypeSelected
      )
    },
    getLocalizeButtonStyle() {
      const style = {}
      if (!this.isLocalizeReady || this.showRedFlags) {
        style.opacity = '0.5'
        style.cursor = 'default'
        style.pointerEvents = 'none'
      }
      return style
    },
    redFlagsText() {
      return this.showRedFlags ? 'Hide Red Flags' : 'Show Red Flags'
    },
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
      const style = { marginTop: '2px', padding: '0 8px' }
      const disable = !this.hasUnlocalizedSelected
      if (disable) {
        style.color = '#2196f3 !important'
        style.opacity = '0.5'
        style.pointerEvents = 'none'
        style.cursor = 'default'
      }
      return style
    },
    hasUnlocalizedSelected() {
      if (!Array.isArray(this.selectedLanguages) || !this.selectedLanguages.length) return false
      const translated = new Set(this.translatedLanguageResourceIds || [])
      return this.selectedLanguages.some((lang) => !translated.has(lang?.value))
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
    getMenuContainerStyle() {
      return {
        marginLeft: '-124px'
      }
    },
    computedItems() {
      const cloned = JSON.parse(JSON.stringify(this.items))
      // SADECE prop'tan gelen initial disabled dilleri disable et (yeni localized diller değil)
      const disabledSet = new Set(this.initialDisabledLanguageIds || [])

      cloned.forEach((group) => {
        if (Array.isArray(group.children)) {
          group.children = group.children.map((child) => ({
            ...child,
            disabled: disabledSet.has(child.value)
          }))
        }
      })
      return cloned
    },
    computedTreeItems() {
      const clone = JSON.parse(JSON.stringify(this.items))
      if (!this.relocalizeConfirmFor) return clone
      clone.forEach((group) => {
        const idx = (group.children || []).findIndex((c) => c.value === this.relocalizeConfirmFor)
        if (idx !== -1) {
          group.children.splice(idx + 1, 0, {
            value: `${this.relocalizeConfirmFor}-confirm`,
            text: 'RelocalizeConfirm',
            isRelocalizeRow: true,
            parentValue: this.relocalizeConfirmFor
          })
        }
      })
      return clone
    },
    isGenerateButtonDisabled() {
      return this.value.length <= 1 || this.isGenerateWithAIDisabled
    },
    getEditModeIconStyle() {
      return {
        opacity: this.showRedFlags ? '0.5' : '1',
        cursor: this.showRedFlags ? 'default' : 'pointer',
        pointerEvents: this.showRedFlags ? 'none' : 'initial'
      }
    },
    getRedFlagButtonStyle() {
      const style = {}
      if (!this.isLocalizeReady) {
        style.opacity = '0.5'
        style.pointerEvents = 'none'
        style.cursor = 'default'
      }
      return style
    }
  },
  watch: {
    loading(val) {
      if (!val) {
        this.$nextTick(() => {
          this.handleMenuHeight()
        })
      }
    },
    translatedLanguageResourceIds: {
      handler() {
        this.$nextTick(() => this.refreshAllConfirmRowsDisabledState())
      }
    },
    treeViewKey() {
      this.$nextTick(() => {
        this.setupDisabledTooltips()
      })
    },
    canRemoveLanguages() {
      this.$nextTick(() => {
        this.setupDisabledTooltips()
      })
    }
  },
  mounted() {
    this.setupDisabledTooltips()
  },
  methods: {
    setupDisabledTooltips() {
      if (this.canRemoveLanguages === true) return

      this.$nextTick(() => {
        const disabledCheckboxes = this.$el.querySelectorAll(
          '.v-treeview-node--disabled .mdi-checkbox-marked.v-treeview-node__checkbox'
        )
        disabledCheckboxes.forEach((button) => {
          button.addEventListener('mouseenter', (e) => {
            this.overFlowTooltipContent =
              'Cannot be removed. This email template is active in one or more campaigns.'
            const { top, left, height } = button.getBoundingClientRect()
            this.overFlowTooltipStyle = {
              top: `${top + height + 5}px`,
              left: `${left - 100}px`,
              zIndex: '100000000000',
              maxWidth: '254px !important',
              padding: '8px 12px'
            }
            this.showOverFlowTooltip = true
          })

          button.addEventListener('mouseleave', (e) => {
            this.showOverFlowTooltip = false
          })

          // Click'i engelle
          button.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()
          })
        })
      })
    },
    isRemovingLastLocalized(languageId) {
      const translatedIds = new Set(
        (this.translatedLanguageResourceIds || []).map((id) => String(id))
      )
      const currentId = String(languageId)
      const remainingCount = [...translatedIds].filter((id) => id !== currentId).length
      return remainingCount === 0
    },
    refreshConfirmRowDisabledState(value) {
      const rec = this.pendingRemoveConfirm && this.pendingRemoveConfirm[value]
      if (!rec || !rec.el) return
      const removeBtn = rec.el.querySelector('.js-remove')
      if (!removeBtn) return
      const disabled = this.isRemovingLastLocalized(value)
      removeBtn.classList.toggle('is-disabled', disabled)
    },
    refreshAllConfirmRowsDisabledState() {
      Object.keys(this.pendingRemoveConfirm || {}).forEach((val) => {
        this.refreshConfirmRowDisabledState(val)
      })
    },
    isConfirmRowFor(item) {
      if (!this.relocalizeConfirmFor) return false
      return item && item.value === this.relocalizeConfirmFor
    },
    isLanguageAlreadyLocalized(item) {
      if (!item || item.text === 'Preferred Languages' || item.text === 'All Languages')
        return false
      return this.translatedLanguageResourceIds.includes(item.value)
    },
    handleRelocalizeClick(item, event) {
      this.relocalizeConfirmFor = item?.value || null
      // Do not remove other relocalize rows; add per-language inline confirm
      if (!this.pendingRelocalizeConfirm[item.value]) {
        this.insertConfirmRow({ item, event, mode: 'relocalize' })
      }
      this.$emit('on-relocalize-click', item)
    },
    handleRelocalizeReplace(item) {
      this.$emit('on-relocalize-replace', { language: item })
      this.removeRelocalizeRowFor(item?.value)
    },
    handleRelocalizeCancel() {
      // Keeps backwards compatibility if called externally
      Object.keys(this.pendingRelocalizeConfirm || {}).forEach((val) =>
        this.removeRelocalizeRowFor(val)
      )
      this.$emit('on-relocalize-cancel')
    },
    insertConfirmRow({ item, event, mode = 'relocalize' }) {
      this.confirmMode = mode
      const tree = this.$el.querySelector('.input-languages-settings-treeview')
      if (!tree) return
      let wrapper = event?.target?.closest?.('.v-treeview-node')
      if (!wrapper) {
        // Find by label text when no event or data-value attribute
        const labels = Array.from(tree.querySelectorAll('.v-treeview-node__label span'))
        const labelEl = labels.find((el) => el.textContent.trim() === (item.text || ''))
        if (labelEl) wrapper = labelEl.closest('.v-treeview-node')
      }
      if (!wrapper) {
        wrapper = tree.querySelector('.v-treeview-node__root')?.closest('.v-treeview-node')
      }
      if (!wrapper) return
      const root = wrapper.querySelector('.v-treeview-node__root')
      if (!root) return
      const el = document.createElement('div')
      el.className = 'relocalize-inline-confirm'
      const isRemove = mode === 'remove'
      // Disable remove when this action would result in zero localized languages remaining.
      // Consider all currently pending removals together with the clicked item.
      let isLastTranslated = false
      if (isRemove) {
        isLastTranslated = this.isRemovingLastLocalized(item.value)
      }
      const message = isRemove
        ? 'Localization will be removed.'
        : 'Updating will replace the template.'
      const primaryLabel = isRemove ? 'Remove' : 'Replace'
      const primaryClass =
        (isRemove ? 'js-remove' : 'js-replace') + (isLastTranslated ? ' is-disabled' : '')
      el.innerHTML = `
        <div class="relocalize-inline-confirm__left">
          <i class="v-icon notranslate v-icon--link mdi mdi-information" style="color:#2196f3"></i>
          <span class="relocalize-inline-confirm__text">${message}</span>
        </div>
        <div class="relocalize-inline-confirm__actions">
          <span class="relocalize-inline-confirm__link ${primaryClass}">${primaryLabel}</span>
          <span class="relocalize-inline-confirm__link js-cancel">Cancel</span>
        </div>
      `
      root.insertAdjacentElement('afterend', el)
      const replaceBtn = el.querySelector('.js-replace')
      const removeBtn = el.querySelector('.js-remove')
      const cancelBtn = el.querySelector('.js-cancel')
      if (replaceBtn) {
        replaceBtn.addEventListener('click', (e) => {
          e.stopPropagation()
          this.handleRelocalizeReplace(item)
        })
      }
      if (removeBtn && !isLastTranslated) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation()
          // Keep deselected, just close row
          if (!this.hiddenRelocalizeLanguageIds.includes(item.value)) {
            this.hiddenRelocalizeLanguageIds = [...this.hiddenRelocalizeLanguageIds, item.value]
          }
          // If active language removed, switch preview to another selected language
          if (this.activeLanguage === item.value) {
            const fallback =
              (this.selectedLanguages || [])
                .map((l) => l.value)
                .find((v) => v && v !== item.value) || ''
            this.$emit('on-active-language-change', fallback)
          }
          // Commit removal to parent (updates languagesPayload via v-model handler):
          // emit current selected plus any pending removals EXCEPT this one
          const pendingIds = Object.keys(this.pendingRemoveConfirm || {}).filter(
            (id) => String(id) !== String(item.value)
          )
          const flat = (this.items || []).flatMap((g) => g.children || [])
          const existsSet = new Set((this.selectedLanguages || []).map((l) => l.value))
          const effective = [...(this.selectedLanguages || [])]
          pendingIds.forEach((id) => {
            const found = flat.find((c) => c.value === id)
            if (found && !existsSet.has(found.value)) effective.push(found)
          })
          // disabled property'sini kaldır
          const cleanedEffective = effective.map((item) => {
            const { disabled, ...rest } = item
            return rest
          })
          this.$emit('input', cleanedEffective)
          // Emit specific event for language removal
          if (isRemove) {
            this.$emit('on-language-removed', {
              languageName: item.text,
              languageId: item.value
            })
            this.removeConfirmRowFor(item.value)
          } else {
            this.removeRelocalizeRowFor(item.value)
          }
        })
      }
      if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
          e.stopPropagation()
          if (isRemove) {
            // Revert deselection
            const exists = this.selectedLanguages?.some?.((l) => l.value === item.value)
            if (!exists) {
              this.selectedLanguages = [...(this.selectedLanguages || []), item]
            }
            // Propagate revert to parent: include all pending removals
            const pendingIds = Object.keys(this.pendingRemoveConfirm || {})
            const flat = (this.items || []).flatMap((g) => g.children || [])
            const existsSet = new Set((this.selectedLanguages || []).map((l) => l.value))
            const effective = [...(this.selectedLanguages || [])]
            pendingIds.forEach((id) => {
              const found = flat.find((c) => c.value === id)
              if (found && !existsSet.has(found.value)) effective.push(found)
            })
            // disabled property'sini kaldır
            const cleanedEffective = effective.map((item) => {
              const { disabled, ...rest } = item
              return rest
            })
            this.$emit('input', cleanedEffective)
            this.removeConfirmRowFor(item.value)
            return
          }
          // For relocalize, only remove this row and notify parent
          this.removeRelocalizeRowFor(item.value)
          this.$emit('on-relocalize-cancel')
        })
      }
      // Ensure disabled state is correct after render
      this.$nextTick(() => {
        if (isRemove) this.refreshConfirmRowDisabledState(item.value)
      })
      if (isRemove) {
        // track per-language confirm rows so multiple can stay visible
        if (!this.pendingRemoveConfirm[item.value]) {
          this.pendingRemoveConfirm = {
            ...this.pendingRemoveConfirm,
            [item.value]: { el, wrapper }
          }
        }
      } else {
        if (!this.pendingRelocalizeConfirm[item.value]) {
          this.pendingRelocalizeConfirm = {
            ...this.pendingRelocalizeConfirm,
            [item.value]: { el, wrapper }
          }
        }
      }
    },
    removeConfirmRow() {
      if (this.confirmRowEl && this.confirmRowEl.parentNode) {
        this.confirmRowEl.parentNode.removeChild(this.confirmRowEl)
      }
      if (this.confirmRowWrapper && this.confirmRowWrapper.style) {
        this.confirmRowWrapper.style.marginBottom = ''
      }
      this.confirmRowEl = null
      this.confirmRowWrapper = null
      this.confirmMode = null
    },
    removeConfirmRowFor(value) {
      const rec = this.pendingRemoveConfirm && this.pendingRemoveConfirm[value]
      if (rec && rec.el && rec.el.parentNode) {
        rec.el.parentNode.removeChild(rec.el)
      }
      if (rec && rec.wrapper && rec.wrapper.style) {
        rec.wrapper.style.marginBottom = ''
      }
      if (this.pendingRemoveConfirm[value]) {
        const copy = { ...this.pendingRemoveConfirm }
        delete copy[value]
        this.pendingRemoveConfirm = copy
      }
    },
    removeRelocalizeRowFor(value) {
      const rec = this.pendingRelocalizeConfirm && this.pendingRelocalizeConfirm[value]
      if (rec && rec.el && rec.el.parentNode) {
        rec.el.parentNode.removeChild(rec.el)
      }
      if (rec && rec.wrapper && rec.wrapper.style) {
        rec.wrapper.style.marginBottom = ''
      }
      if (this.pendingRelocalizeConfirm[value]) {
        const copy = { ...this.pendingRelocalizeConfirm }
        delete copy[value]
        this.pendingRelocalizeConfirm = copy
      }
    },
    applyRootExpandedSpacing(item, event) {
      const tree = this.$el.querySelector('.input-languages-settings-treeview')
      if (!tree) return
      this.resetRootSpacing()
      let wrapperNode = null
      if (event && event.target) {
        wrapperNode = event.target.closest('.v-treeview-node')
      }
      if (!wrapperNode) {
        const root = tree.querySelector(`.v-treeview-node__root[data-value="${item.value}"]`)
        wrapperNode = root ? root.closest('.v-treeview-node') : null
      }
      if (!wrapperNode) return
      wrapperNode.style.marginBottom = '36px'
    },
    resetRootSpacing() {
      const tree = this.$el.querySelector('.input-languages-settings-treeview')
      if (!tree) return
      tree.querySelectorAll('.v-treeview-node').forEach((el) => {
        if (el && el.style) el.style.marginBottom = ''
      })
    },
    getConfirmLanguageItem() {
      const flat = []
      this.items.forEach((g) => flat.push(...(g.children || [])))
      return (
        flat.find((c) => c.value === this.relocalizeConfirmFor) || {
          value: this.relocalizeConfirmFor
        }
      )
    },
    handleLocalizeClick() {
      if (!this.isLocalizeReady) return
      this.rebuildItemsForSelection()
      this.isShowLanguages = true
      //this.setupLanguageNodeTooltips()
      this.changeMenuStatus('visible')
    },
    handleAdd() {
      // Keep languages pending removal in the emitted model until user confirms Remove
      const pendingIds = Object.keys(this.pendingRemoveConfirm || {})
      let effectiveSelected = [...(this.selectedLanguages || [])]
      if (pendingIds.length) {
        const flat = (this.items || []).flatMap((g) => g.children || [])
        const pendingItems = pendingIds
          .map((id) => flat.find((c) => c.value === id))
          .filter(Boolean)
        const existsSet = new Set(effectiveSelected.map((l) => l.value))
        pendingItems.forEach((pi) => {
          if (!existsSet.has(pi.value)) effectiveSelected.push(pi)
        })
      }
      // disabled property'sini kaldır (InputLanguagePreview için gerekli değil)
      const cleanedSelected = effectiveSelected.map((item) => {
        const { disabled, ...rest } = item
        return rest
      })
      this.$emit('input', cleanedSelected)
      this.changeMenuStatus('hidden')
      this.removeLanguageNodeEventListeners()
      this.handleGenerateWithAI()
    },
    handleClickOutside() {
      this.treeViewKey = `key-${createRandomCryptStringNumber()}`
      this.handleTreeViewChange(this.value)
      this.changeMenuStatus('hidden')
      this.removeLanguageNodeEventListeners()
    },
    handleTreeViewChange(event) {
      // Commit selection first so checkbox reflects immediately
      const previousValues = (this.selectedLanguages || []).map((l) => l.value)
      this.selectedLanguages = event
      const currentValues = (event || []).map((l) => l.value)
      const removedValues = previousValues.filter((v) => !currentValues.includes(v))
      const addedValues = currentValues.filter((v) => !previousValues.includes(v))
      if (removedValues.length) {
        const flatChildren = (this.items || []).flatMap((g) => g.children || [])
        removedValues.forEach((removedValue) => {
          const removedItem = flatChildren.find((c) => c.value === removedValue)
          // Close relocalize confirm if its checkbox is deselected
          if (this.pendingRelocalizeConfirm && this.pendingRelocalizeConfirm[removedValue]) {
            this.removeRelocalizeRowFor(removedValue)
          }
          if (removedItem && this.isLanguageAlreadyLocalized(removedItem)) {
            if (!this.pendingRemoveConfirm || !this.pendingRemoveConfirm[removedItem.value]) {
              this.insertConfirmRow({
                item: removedItem,
                event: null,
                mode: 'remove'
              })
            }
          }
          // If a relocalize row is open for this language, keep it until replace/cancel
          // No action needed here, we don't clear relocalize on selection changes
        })
      }
      // If user re-selected languages with pending removal, close only those rows
      addedValues.forEach((val) => {
        if (this.pendingRemoveConfirm && this.pendingRemoveConfirm[val]) {
          this.removeConfirmRowFor(val)
        }
      })
      // Do not clear pendingRelocalizeConfirm on any selection change
      this.$nextTick(() => this.refreshAllConfirmRowsDisabledState())
    },
    handleSearchInputFocus() {
      this.changeMenuStatus('visible')
      this.setupLanguageNodeTooltips()
    },
    handleTooltipShow(e) {
      const node = e.target
      if (node.parentElement.classList.contains('v-treeview-node--disabled')) {
        this.updateTooltipPosition(e)
        this.showOverFlowTooltip = true
      }
    },
    handleTooltipHide() {
      this.showOverFlowTooltip = false
      this.overFlowTooltipStyle = {
        top: '0px',
        left: '0px'
      }
    },
    updateTooltipPosition(e) {
      const { left, top, height } = e.target.getBoundingClientRect()
      this.overFlowTooltipStyle = {
        top: `${top + height + 5}px`,
        left: `${left}px`,
        zIndex: '100000000000',
        maxWidth: '220px !important',
        padding: '8px 12px'
      }
    },
    setupLanguageNodeTooltips() {
      this.activeNodes = document.querySelectorAll(
        '.input-languages-settings-treeview .v-treeview-node--leaf .v-treeview-node__root'
      )
      this.activeNodes.forEach((node) => {
        node.addEventListener('mouseover', this.handleTooltipShow)
        node.addEventListener('mouseout', this.handleTooltipHide)
      })
    },
    removeLanguageNodeEventListeners() {
      this.activeNodes.forEach((node) => {
        node.removeEventListener('mouseover', this.handleTooltipShow)
        node.removeEventListener('mouseout', this.handleTooltipHide)
      })
      this.activeNodes = []
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
    },
    handleEditModeClick() {
      this.$emit('on-edit-mode')
    },
    handleUploadEmailButtonClick() {
      this.$emit('on-upload-email-button-click')
    },
    handleShowRedFlagsClick() {
      this.$emit('on-show-red-flags-click')
    },
    rebuildItemsForSelection() {
      const translated = new Set(this.translatedLanguageResourceIds || [])
      const selectedSet = new Set((this.selectedLanguages || []).map((l) => l.value))
      const base = JSON.parse(JSON.stringify(this.languageItems || []))
      const pref = base.find((g) => g && g.text === 'Preferred Languages') || {
        children: []
      }
      const all = base.find((g) => g && g.text === 'All Languages') || {
        children: []
      }
      const originalPreferred = Array.isArray(pref.children) ? pref.children : []
      const originalAll = Array.isArray(all.children) ? all.children : []
      const byValue = new Map([...originalPreferred, ...originalAll].map((c) => [c.value, c]))
      const preferredSet = new Set(originalPreferred.map((c) => c.value))
      const selectedNotInPreferred = [...selectedSet].filter((v) => !preferredSet.has(v))
      const selectedItems = selectedNotInPreferred.map((v) => byValue.get(v)).filter(Boolean)
      // New preferred children: original preferred + newly selected
      let newPreferred = [...originalPreferred, ...selectedItems]
      // Remove duplicates
      const seen = new Set()
      newPreferred = newPreferred.filter((c) => {
        if (!c) return false
        if (seen.has(c.value)) return false
        seen.add(c.value)
        return true
      })
      // New all children: original all minus those present in preferred now
      const newPreferredSet = new Set(newPreferred.map((c) => c.value))
      let newAll = originalAll.filter((c) => !newPreferredSet.has(c.value))
      // Sort inside groups: localized first, then by text
      const sorter = (a, b) => {
        const aLoc = translated.has(a.value) ? 0 : 1
        const bLoc = translated.has(b.value) ? 0 : 1
        if (aLoc !== bLoc) return aLoc - bLoc
        return String(a.text || '').localeCompare(String(b.text || ''))
      }
      newPreferred.sort(sorter)
      newAll.sort(sorter)
      // Apply
      base.forEach((g) => {
        if (g.text === 'Preferred Languages') g.children = newPreferred
        if (g.text === 'All Languages') g.children = newAll
      })
      this.items = base
      this.treeViewKey = `key-${createRandomCryptStringNumber()}`
    },
    handleAIAlly() {
      this.$emit('on-ai-ally')
    },
    handleLinkChange() {
      this.$emit('on-link-change')
    }
  }
}
</script>
<style>
/* Disabled treeview node - pointer events açık hover için */
.input-languages-settings-treeview .v-treeview-node--disabled {
  pointer-events: auto;
}

.input-languages-settings__link-icon--active {
  background-color: #2196f3 !important;
  border-radius: 4px;
  padding: 4px;
}

/* Checkbox button pointer-events açık override Vuetify */
.input-languages-settings-treeview .v-treeview-node--disabled .v-treeview-node__checkbox {
  pointer-events: auto !important;
}

/* Sadece checkbox button'u opacity ve renkle */
.input-languages-settings-treeview
  .v-treeview-node--disabled
  .mdi-checkbox-marked.v-treeview-node__checkbox {
  opacity: 0.5;
  color: #2196f3 !important;
  pointer-events: auto !important;
  cursor: default;
}

/* Tooltip width override */
.input-languages-tooltip {
  max-width: 250px !important;
}

.relocalize-confirm {
  position: absolute;
  margin-left: -29px;
  top: 28px;
  background: #e9f0f8;
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.relocalize-confirm--overlay {
  z-index: 10000;
}
.relocalize-confirm__left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.relocalize-confirm__text {
  color: rgba(56, 59, 65, 0.9);
  font-size: 10px;
}
.relocalize-confirm__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.relocalize-confirm__link {
  color: #2196f3;
  font-weight: 600;
  font-size: 10px;
  cursor: pointer;
}
/* icon size for overlay confirm */
.relocalize-confirm .v-icon {
  font-size: 14px !important;
}

/* Inline confirm row inserted as DOM sibling */
.relocalize-inline-confirm {
  background: #e9f0f8;
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0 0 48px;
}
.relocalize-inline-confirm__left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.relocalize-inline-confirm__text {
  color: rgba(56, 59, 65, 0.9);
  font-size: 10px;
}
.relocalize-inline-confirm__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.relocalize-inline-confirm__link {
  color: #2196f3;
  font-weight: 600;
  font-size: 10px;
  cursor: pointer;
}
.relocalize-inline-confirm__link.is-disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: default;
}
/* icon size for inline confirm */
.relocalize-inline-confirm .v-icon {
  font-size: 14px !important;
}
</style>
