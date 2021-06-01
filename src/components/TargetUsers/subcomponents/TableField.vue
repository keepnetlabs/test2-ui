<template>
  <div class="table-field">
    <div class="table-field__container">
      <v-icon left medium color="#757575" class="handle" style="cursor: move;">mdi-menu</v-icon>
      <v-text-field
        v-model="item.name"
        :id="`input--target-user-custom-field-value-${item.fieldDataType}-${index}`"
        class="table-field__input"
        autofocus
        outlined
        dense
        placeholder="Enter column name"
        :rules="[
          (v) => validations.required(v, 'Required'),
          (v) => validations.maxLength(v, 50, 'Max 50 characters')
        ]"
      ></v-text-field>
      <k-select
        v-model="item.fieldDataType"
        class="mx-2 table-field__input"
        :id="`input--target-user-custom-field-type-${item.fieldDataType}-${index}`"
        :items="fieldItems"
        dense
        outlined
      />
      <v-checkbox
        v-model="item.isRequired"
        :id="`input--target-user-custom-field-required-${item.fieldDataType}-${index}`"
        color="#2196f3"
        class="ml-1"
        label="Required"
      ></v-checkbox>
      <v-btn
        v-if="isDeleteable"
        icon
        :id="`btn-delete--target-user-custom-field-${item.fieldDataType}-${index}`"
        class="ml-4"
        @click="handleDelete"
      >
        <v-icon color="#757575">mdi-close-circle</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { required, minLength, maxLength } from '@/utils/validations'
import KSelect from '@/components/Common/Inputs/KSelect'

export default {
  name: 'TableField',
  components: { KSelect },
  props: {
    isDeleteable: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      fieldItems: [
        {
          text: 'Text',
          value: 'String'
        },
        {
          text: 'Numeric',
          value: 'Number'
        },
        {
          text: 'Email',
          value: 'Email'
        },
        {
          text: 'Date',
          value: 'Date'
        },
        {
          text: 'Date and Time',
          value: 'DateTime'
        },
        {
          text: 'Boolean',
          value: 'Boolean'
        }
      ],
      validations: {
        required,
        minLength,
        maxLength
      }
    }
  },
  methods: {
    handleDelete() {
      this.$emit('deleteTableField', this.values)
    }
  }
}
</script>

<style lang="scss">
.table-field {
  margin-top: 4px;
  margin-bottom: 4px;
  border-radius: 20px;
  background-color: #f2f2f2;
  max-width: 612px;
  min-height: 64px;
  &__container {
    padding: 12px 12px 12px 27px;
    display: flex;
    align-items: center;
    min-height: 64px;
    .v-text-field__details {
      position: absolute;
      bottom: -21px;
      left: -5px;
    }
    .v-input--checkbox {
      .v-messages {
        display: none;
      }
    }
  }

  &__input {
    max-width: 188px;
    .v-input__control {
      height: 40px;
    }
  }
  .v-input--selection-controls {
    padding-top: 0;
  }
}
</style>
