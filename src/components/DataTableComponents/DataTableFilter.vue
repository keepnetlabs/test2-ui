<template>
  <v-menu
    :offset-y="true"
    bottom
    min-width="232px"
    max-width="232px"
    :close-on-content-click="false"
    class="filter__container"
  >
    <template v-slot:activator="{ on }">
      <v-icon v-on="on" class="filter__icon">mdi-filter-variant</v-icon>
    </template>
    <div class="filter__body-container">
      <template v-if="filterableType === 'text'">
        <v-select
          :items="textFilterItems"
          dense
          height="40"
          outlined
          required
          v-model="filteredSelectValue"
        ></v-select>
        <v-text-field
          placeholder="Enter Value"
          class="filter__text"
          outlined
          dense
          v-model="filterValue"
          height="40"
        ></v-text-field>
      </template>
      <div class="filter__footer">
        <v-btn text class="filter__footer-button" color="#f56c6c">
          Clear
        </v-btn>
        <v-btn text class="filter__footer-button" color="#2196f3" @click="handleFilter">
          Filter
        </v-btn>
      </div>
    </div>
  </v-menu>
</template>

<script>
export default {
  name: 'DataTableFilter',
  props: {
    column: {
      type: Object
    },
    filterableType: {
      type: String
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      filteredSelectValue: 'Starts With',
      filterValue: '',
      textFilterItems: ['Starts With', 'Contains', 'Equal', 'Not Equal']
    }
  },
  methods: {
    handleFilter() {
      this.$emit('handleFilterColumn', {
        column: this.column,
        filteredSelectValue: this.filteredSelectValue,
        filterValue: this.filterValue
      })
    }
  }
}
</script>

<style scoped lang="scss">
.filter {
  &__icon {
    float: right;
    font-size: 20px;
    opacity: 0.5;
    order: 1;
  }
  &__container {
    // background-color: white;
  }
  &__body-container {
    background-color: white;
    padding: 20px 20px 0px 20px;
  }
  &__footer {
    display: flex;
    margin-right: -13px;
    margin-top: -10px !important;
    justify-content: flex-end;

    &-button {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
    }
  }

  &__text {
    margin-top: -13px;
  }

  &__textfield {
    border-radius: 8px;
    border: solid 1px rgba(0, 0, 0, 0.16);
    background-color: #ffffff;
  }
}
::v-deep {
  .v-input__slot {
    fieldset {
      border-radius: 8px;
      border: solid 1px rgba(0, 0, 0, 0.16);
      background-color: #ffffff;
    }
  }
}
</style>
