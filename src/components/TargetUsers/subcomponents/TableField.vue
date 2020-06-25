<template>
  <div class="table-field">
    <div class="table-field__container">
      <v-icon left medium color="#757575" class="handle" style="cursor: move;">mdi-menu</v-icon>
      <v-text-field
        class="table-field__input"
        v-model="item.name"
        outlined
        dense
        :rules="[
          (v) => validations.required(v, 'Required'),
          (v) => validations.minLength(v, 4, 'Must between 5-50 characters'),
          (v) => validations.maxLength(v, 50, 'Must between 5-50 characters')
        ]"
      ></v-text-field>
      <v-select
        class="mx-2 table-field__input"
        v-model="item.fieldDataType"
        :items="fieldItems"
        dense
        outlined
      />
      <v-checkbox
        v-model="item.checkbox"
        color="#2196f3"
        class="ml-1"
        label="Required"
      ></v-checkbox>
      <v-btn icon v-if="isDeleteable" class="ml-4" @click="handleDelete">
        <v-icon color="#757575">mdi-close-circle</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { required, minLength, maxLength } from '../../../utils/validations'

export default {
  name: 'TableField',
  props: {
    isDeleteable: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object
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
          text: 'Number',
          value: 'Number'
        },
        {
          text: 'Date',
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
  },
  created() {}
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
      display: none;
    }
    .v-messages {
      display: none;
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
