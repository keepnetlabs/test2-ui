<template>
  <div class="input-merge-tag">
    <div v-if="mergeTags.length" class="input-merge-tag__tags">
      <v-btn
        v-for="mergeTag in mergeTags"
        :key="mergeTag.value"
        class="input-merge-tag__tag ma-1"
        elevation="0"
        small
        @click="handleMergeTagClick(mergeTag.value)"
      >
        {{ mergeTag.text }}
      </v-btn>
    </div>
    <v-textarea
      v-bind="requiredProps"
      ref="refInput"
      class="rounded-t-0"
      :value="value"
      outlined
      dense
      no-resize
      autocomplete="disabled"
      :height="height"
      :rows="rows"
      :disabled="disabled"
      :placeholder="placeholder"
      :rules="rules"
      :readonly="readonly"
      :hint="hint"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
export default {
  name: 'InputMergeTag',
  props: {
    value: {
      type: String
    },
    id: {
      type: String
    },
    initialPlaceholder: {
      type: String,
      default: ''
    },
    initialRules: {
      type: Array
    },
    entityName: {
      type: String,
      default: labels.Description
    },
    required: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: 2000
    },
    disabled: {
      default: false
    },
    readonly: {
      default: false
    },
    applyRules: {
      default: true
    },
    height: {
      type: String
    },
    rows: {
      type: String
    },
    hint: {
      type: String
    },
    mergeTags: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      rules: [
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),

        (v) =>
          Validations.maxLength(
            v,
            this.maxLength,
            labels.getMaxLengthMessage(this.entityName, this.maxLength)
          )
      ],
      mergeTagRules: [
        (v) => {
          if (!v) return true
          const matches = v.match(/{(.*?)}/gi)
          if (!matches?.length) return true
          const tags = this.mergeTags.map((tag) => tag.value)
          for (let i = 0; i < matches.length; i++) {
            if (!tags.includes(matches[i].toUpperCase())) {
              return `${matches[i]} is an incorrect merge tag. Please enter an existing merge tag.`
            }
          }
          return true
        },
        (v) => {
          if (!v) return true
          const regexp = new RegExp(
            `(${this.mergeTags.map((mergeTag) => mergeTag.value).join('|')})`,
            'gi'
          )
          const matches = v.match(regexp)
          if (!matches?.length) return true
          const mergeTags = this.mergeTags.map((tag) => tag.value)
          const usedMergeTags = mergeTags.filter((tag) =>
            matches.some((match) => match.toUpperCase() === tag)
          )
          return (
            matches.every((match) => usedMergeTags.includes(match)) ||
            'Only use uppercase letters for the merge tag'
          )
        }
      ],
      placeholder: '',
      requiredProps: {}
    }
  },
  watch: {
    required(val) {
      if (val) {
        this.requiredProps = {
          hint: this.hint || labels.RequiredStar,
          persistentHint: true
        }
        this.rules.unshift((v) => Validations.required(v))
      }
      this.rules = this.applyRules ? this.initialRules || this.rules : []
      this.rules.push(...this.mergeTagRules)
      this.placeholder = this.initialPlaceholder || labels.EnterDescription
    }
  },
  created() {
    if (this.required) {
      this.requiredProps = {
        hint: this.hint || labels.RequiredStar,
        persistentHint: true
      }
      this.rules.unshift((v) => Validations.required(v))
    }
    this.rules = this.applyRules ? this.initialRules || this.rules : []
    this.rules.push(...this.mergeTagRules)
    this.placeholder = this.initialPlaceholder || labels.EnterDescription
  },
  methods: {
    handleMergeTagClick(mergeTag) {
      let textarea = this.$refs?.refInput?.$el?.getElementsByTagName('textarea')?.[0]
      if (!textarea) return
      let start_position = textarea.selectionStart
      let end_position = textarea.selectionEnd
      const newValue = `${textarea.value.substring(
        0,
        start_position
      )}${mergeTag}${textarea.value.substring(end_position, textarea.value.length)}`
      this.$emit('input', newValue)
    }
  }
}
</script>
