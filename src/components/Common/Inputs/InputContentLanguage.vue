<template>
  <FormGroup has-hint :title="title">
    <KSelect
      ref="refSelect"
      :value="value"
      persistent-hint
      dense
      outlined
      chips
      deletable-chips
      multiple
      small-chips
      autocomplete="off"
      hint="*Required"
      :placeholder="placeholder"
      :slots="{ item: true, selection: true }"
      :rules="[(v) => v.length > 0 || 'Required']"
      :items="contentLanguageItems"
      :item-disabled="checkIsItemDisabled"
      :disabled="disabled"
      @input="($event) => $emit('input', $event)"
    >
      <template #item="{ item, index }">
        <ContentLanguageSelecItem
          :item="item"
          :index="index"
          :isDisabled="checkIsItemDisabled(item)"
          :isFirst="item.value === 'All'"
          :isSelected="getCheckboxCheckedValue(item)"
        />
      </template>
      <template #selection="data">
        <v-chip
          v-if="data.item.value !== 'All'"
          v-show="!isAllSelected"
          v-bind="data.attrs"
          close
          small
          :key="JSON.stringify(data.item)"
          :input-value="data.selected"
          :disabled="data.disabled"
          @click:close="data.parent.selectItem(data.item)"
        >
          {{ data.item.text }}
        </v-chip>
        <div v-else>
          {{ data.item.text }}
        </div>
      </template>
    </KSelect>
  </FormGroup>
</template>
<script>
import ContentLanguageSelecItem from '@/components/AwarenessEducator/SendTraining/ContentLanguageSelecItem'
import KSelect from '@/components/Common/Inputs/KSelect'
import FormGroup from '@/components/SmallComponents/FormGroup'
import AwarenessEducatorService from '@/api/awarenessEducator'
import labels from '@/model/constants/labels'
export default {
  name: 'InputContentLanguage',
  components: { FormGroup, KSelect, ContentLanguageSelecItem },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    trainingId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: labels.ContentLanguage
    },
    placeholder: {
      type: String,
      default: 'Select content language'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isAddDefaultValue: {
      type: Boolean,
      default: true
    },
    languageOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      labels,
      contentLanguageItems: []
    }
  },
  computed: {
    isAllSelected() {
      return this.value.includes(labels.All)
    }
  },
  watch: {
    isAllSelected(newVal) {
      if (newVal === true) {
        const validOptionValues = this.contentLanguageItems.map((item) => item.value)
        this.$emit('input', [...validOptionValues])
      } else {
        this.$emit('input', [])
      }
    },
    trainingId: {
      immediate: true,
      handler(newVal) {
        if (newVal) this.callForContentLanguageItems()
      }
    }
  },
  methods: {
    callForContentLanguageItems() {
      if (!this.trainingId) return
      AwarenessEducatorService.getContentLanguageItems(this?.trainingId).then((response) => {
        this.contentLanguageItems =
          response?.data?.data?.map((lang) => ({
            text:
              this.languageOptions.find((option) => option.code === lang.code)?.isoFriendlyName ||
              lang.name,
            value: lang.id
          })) || []
        this.contentLanguageItems.unshift({
          text: labels.AllLanguages,
          value: labels.All
        })
        this.$emit('on-api-call-finished')
        if (this.isAddDefaultValue) this.setDefaultValue()
      })
    },
    setDefaultValue() {
      this.$emit('input', this.contentLanguageItems.map((item) => item.value))
    },
    checkIsItemDisabled(item) {
      if (item.value === labels.All) return false
      return !!this.isAllSelected
    },
    getCheckboxCheckedValue(item) {
      return !!(this.value.includes(item.value) || this.isAllSelected)
    }
  }
}
</script>
