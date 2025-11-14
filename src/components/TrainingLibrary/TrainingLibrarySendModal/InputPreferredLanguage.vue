<template>
  <FormGroup has-hint :title="title" :sub-title="subtitle">
    <KSelect
      v-model="internalValue"
      :items="computedItems"
      :placeholder="placeholder"
      outlined
      dense
      hint="*Required"
      persistent-hint
      :rules="[(v) => v.length > 0 || 'Required']"
      :slots="{ item: true, selection: true }"
      @input="$emit('input', $event)"
    >
      <template #item="{ item }">
        <div class="d-flex flex-column" style="width: 100%;">
          <span class="font-primary-color" style="font-size: 14px !important;">{{
            item.text
          }}</span>
          <span style="color: #757575; font-size: 9px; line-height: 1.2; letter-spacing: 0.2px;">
            {{ item.description }}
          </span>
        </div>
      </template>
      <template #selection="{ item }">
        <span>{{ item.text }}</span>
      </template>
    </KSelect>
  </FormGroup>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import KSelect from '@/components/Common/Inputs/KSelect'

export default {
  name: 'InputPreferredLanguage',
  components: {
    FormGroup,
    KSelect
  },
  props: {
    value: {
      type: [String, Number],
      default: 'company'
    },
    items: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: 'Delivery Method'
    },
    subtitle: {
      type: String,
      default: 'Select how the training will be delivered to the target audience.'
    },
    placeholder: {
      type: String,
      default: 'Select Option'
    },
    useDefaultItems: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    internalValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    computedItems() {
      if (this.useDefaultItems && this.items.length === 0) {
        return [
          {
            text: `Send in the company's language`,
            value: 'company',
            description: `Send the notification template to all users in the company's language.`
          },
          {
            text: `Send in the target users' preferred language`,
            value: 'user',
            description: `Send the notification template to each user in their preferred language. If not set, the company's language is used.`
          }
        ]
      }
      return this.items
    }
  }
}
</script>
