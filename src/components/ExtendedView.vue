<template>
  <div class="settings-popup edit-popup" :style="[editMode && containerStyle]">
    <div class="inline-wrapper" v-if="options && options.length">
      <div class="edit-popup__header">
        <span class="settings-span" v-if="value.length === 1">
          {{ copyOfEditedRows[0][titleKey] }}
        </span>
        <span class="settings-span" v-else>{{ value.length }} Items Selected</span>
        <div class="edit-popup__edit-actions">
          <v-btn @click="editMode = true" icon v-if="!editMode">
            <v-icon class="close-icon">mdi-pencil</v-icon>
          </v-btn>
          <v-btn @click="closeEditPopup()" icon v-if="!editMode">
            <v-icon class="close-icon">mdi-close</v-icon>
          </v-btn>
          <v-btn
            @click="cancelEditedOnes"
            class="pl-1 pr-1"
            color="#f56c6c"
            dense
            text
            v-if="editMode"
            >CANCEL
          </v-btn>
          <v-btn @click="saveEditedOnes()" color="#2196f3" dense text v-if="editMode">SAVE </v-btn>
        </div>
      </div>
      <div class="edit-popup__body" v-if="options && options.length">
        <v-form lazy-validation ref="refForm">
          <div class="items-wrapper">
            <div
              :key="col.label"
              class="row-edit-div"
              v-for="col in options"
              v-if="
                !col.hideLabel && col.property !== 'createDate' && col.property !== 'lastUpdate'
              "
            >
              <div v-if="!col.showOnlyPreview || editMode">
                <label>
                  {{ col.label }}
                </label>
                <span
                  v-if="
                    (!editMode || !col.isEditable) &&
                    multipleValues(col.property) &&
                    col.property !== 'createDate' &&
                    col.property !== 'lastUpdate'
                  "
                  :class="[multipleValues(col.property) ? 'font-italic' : '']"
                >
                  Multiple Values
                </span>
                <span
                  v-else-if="
                    (!editMode || !col.isEditable) &&
                    (col.type === 'text' || col.type === 'slot' || col.type === 'colorfulText') &&
                    col.property !== 'createDate' &&
                    col.property !== 'lastUpdate'
                  "
                  :style="[
                    col.type === 'colorfulText'
                      ? { color: getTextColor(copyOfEditedRows[0][col.property]), fontWeight: 600 }
                      : ''
                  ]"
                >
                  {{ copyOfEditedRows[0][col.property] }}
                </span>
                <badge
                  v-else-if="
                        ((!editMode || !col.isEditable) && (col.type === 'status' ||
                        col.type === 'detected' || col.type==='badge'))
                      "
                  size="small"
                  :color="getBtnStatusColor(copyOfEditedRows[0][col.property])"
                  :text="copyOfEditedRows[0][col.property]"
                />
                <badge
                  v-else-if="
                        (copyOfEditedRows[0][col.property] && (!editMode || !col.isEditable) && (col.type === 'smallBadge'))
                      "
                  size="small"
                  :color="'#2196f3'"
                  v-for="badge in copyOfEditedRows[0][col.property]
                    .slice(0, copyOfEditedRows[0][col.property].length - 2)
                    .split(',')"
                  class-name="mr-1"
                  :key="badge"
                  :text="badge"
                />
                <badge
                  v-else-if="(!editMode || !col.isEditable) && col.type === 'priority'"
                  size="small"
                  :color="getBtnPriorityColor(copyOfEditedRows[0][col.property])"
                  :text="copyOfEditedRows[0][col.property]"
                />
                <router-link
                  v-else-if="(!editMode || !col.isEditable) && col.type === 'link'"
                  :to="`${col.href}/${copyOfEditedRows[0][col.hrefKey]}`"
                  class="k-table__link"
                  >{{ copyOfEditedRows[0][col.property] }}</router-link
                >
                <div
                  class="popup__apexchart-container"
                  style="display: flex; align-items: center;"
                  :class="[
                    Array.isArray(copyOfEditedRows[0][col.property]) &&
                    JSON.stringify(copyOfEditedRows[0][col.property]) !== JSON.stringify([0, 0])
                      ? 'popup__apexchart-container--1'
                      : ''
                  ]"
                  v-else-if="col.type === 'chart'"
                >
                  <template
                    v-if="
                      Array.isArray(copyOfEditedRows[0][col.property]) &&
                      JSON.stringify(copyOfEditedRows[0][col.property]) !== JSON.stringify([0, 0])
                    "
                  >
                    <apexchart
                      :options="chartOptions"
                      :series="copyOfEditedRows[0][col.property]"
                      :width="chartOptions.chart.width"
                    />
                  </template>
                  <div v-else class="datatable-chart__empty"></div>
                </div>
                <span v-else-if="col.type === 'progress'" style="margin-left: 2px;">
                  {{ copyOfEditedRows[0][col.property] }}%
                </span>
                <v-menu
                  ref="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                  v-else-if=" (!multipleValues(col.property) && editMode && col.isEditable && col.editOptions.component === 'datepicker')"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="copyOfEditedRows[0][col.property]"
                      label="Start Date"
                      class="edit-text-field"
                      dense
                      solo
                      append-icon="mdi-calendar-range"
                      v-on="on"
                      readonly
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    :value="copyOfEditedRows[0][col.property]"
                    @input="handleEditPopupDatePickerChange($event, col.property)"
                    no-title
                  ></v-date-picker>
                </v-menu>
                <v-checkbox
                  v-else-if="
                        (!multipleValues(col.property) && editMode && col.isEditable && col.editOptions.component === 'checkbox')
                      "
                  color="#2196f3"
                  :label="col.editOptions.checkboxLabel"
                  :value="copyOfEditedRows[0][col.property]"
                  @input="handleEditPopupCheckboxChange($event, col.property)"
                ></v-checkbox>
                <v-text-field
                  class="edit-text-field"
                  dense
                  outlined
                  v-bind="col.editOptions.props"
                  v-if="
                        (!multipleValues(col.property) && editMode && col.isEditable && col.editOptions.component === 'textfield')
                      "
                  :value="copyOfEditedRows[0][col.property]"
                  @input="handleEditPopupTextFieldChange($event, col.property)"
                />
                <v-textarea
                  outlined
                  dense
                  :value="copyOfEditedRows[0][col.property]"
                  @input="handleEditPopupTextFieldChange($event, col.property)"
                  v-if="
                        (!multipleValues(col.property) && editMode && col.isEditable && col.editOptions.component === 'textarea')
                      "
                  rows="2"
                  v-bind="col.editOptions.props"
                  row-height="20"
                ></v-textarea>
                <v-select
                  class="edit-select"
                  dense
                  outlined
                  v-bind="col.editOptions.props"
                  v-if="
                    !multipleValues(col.property) &&
                    editMode &&
                    col.isEditable &&
                    col.editOptions.component === 'select'
                  "
                  :value="copyOfEditedRows[0][col.property]"
                  @input="handleEditPopupSelectChange($event, col.property)"
                />
                <v-text-field
                  :autofocus="!multipleEditDisables[col.property]"
                  :value="multipleEditModels[col.property]"
                  @input="handleMultipleEdits(copyOfEditedRows, col.property, $event)"
                  class="edit-text-field"
                  dense
                  label="Multiple Values"
                  placeholder="Multiple Values"
                  outlined
                  :readonly="!multipleEditDisables[col.property]"
                  v-if="
                    multipleValues(col.property) &&
                    editMode &&
                    col.isEditable &&
                    col.type !== 'chart' &&
                    col.type !== 'progress' &&
                    col.type !== 'date' &&
                    col.property !== 'createDate' &&
                    col.editOptions.component === 'textfield'
                  "
                >
                  <template v-slot:append>
                    <v-btn
                      text
                      @click.native="handleEditClick(col.property)"
                      class="edit-popup__edit-component"
                    >
                      EDIT
                    </v-btn>
                  </template>
                </v-text-field>
                <v-menu
                  ref="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                  v-if="
                    multipleValues(col.property) &&
                    editMode &&
                    col.isEditable &&
                    col.type !== 'chart' &&
                    col.type !== 'progress' &&
                    col.type !== 'date' &&
                    col.property !== 'createDate' &&
                    col.editOptions.component === 'datepicker'
                  "
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="multipleEditModels[col.property]"
                      label="Start Date"
                      class="edit-text-field"
                      dense
                      outlined
                      append-icon="mdi-calendar-range"
                      v-on="on"
                      :readonly="!multipleEditDisables[col.property]"
                      :placeholder="!multipleEditDisables[col.property] && 'Multiple Values'"
                    >
                      <template v-slot:append>
                        <v-btn
                          text
                          @click.native="handleEditClick(col.property)"
                          class="edit-popup__edit-component"
                        >
                          EDIT
                        </v-btn>
                      </template>
                    </v-text-field>
                  </template>

                  <v-date-picker
                    :value="multipleEditModels[col.property]"
                    @input="handleMultipleEdits(copyOfEditedRows, col.property, $event)"
                    no-title
                  ></v-date-picker>
                </v-menu>

                <v-checkbox
                  v-else-if="
                        (multipleValues(col.property) && editMode && col.isEditable && col.editOptions.component === 'checkbox')
                      "
                  color="#2196f3"
                  :indeterminate="getCheckboxStatus(col.property)"
                  :label="getCheckboxLabel(col.property, col.editOptions.checkboxLabel)"
                  :value="copyOfEditedRows[0][col.property]"
                  @input="handleEditPopupCheckboxChange($event, col.property)"
                ></v-checkbox>

                <v-select
                  class="edit-select"
                  dense
                  outlined
                  v-bind="col.editOptions.props"
                  :readonly="!multipleEditDisables[col.property]"
                  :placeholder="!multipleEditDisables[col.property] && 'Multiple Values'"
                  v-if="
                    multipleValues(col.property) &&
                    editMode &&
                    col.isEditable &&
                    col.type !== 'chart' &&
                    col.type !== 'progress' &&
                    col.type !== 'date' &&
                    col.property !== 'createDate' &&
                    col.editOptions.component === 'select'
                  "
                  :value="multipleEditModels[col.property]"
                  @input="handleMultipleEdits(copyOfEditedRows, col.property, $event)"
                >
                  <template v-slot:append v-if="!multipleEditDisables[col.property]">
                    <v-btn
                      text
                      @click.native="handleEditClick(col.property)"
                      class="edit-popup__edit-component"
                    >
                      EDIT
                    </v-btn>
                  </template>
                </v-select>
              </div>
            </div>
            <slot name="body" v-if="editMode"> </slot>
            <div class="edit-popup__footer" v-if="hasEditPopupFooter()">
              <div class="edit-footer-date">
                <div
                  class="edit-date-created"
                  v-if="copyOfEditedRows[0]['createDate'] !== undefined"
                >
                  <label>Date Created</label>
                  <span>{{
                    multipleValues('createDate')
                      ? 'Multiple Values'
                      : copyOfEditedRows[0]['createDate']
                  }}</span>
                </div>
                <div
                  class="edit-date-created"
                  v-if="copyOfEditedRows[0]['lastUpdate'] !== undefined"
                >
                  <label>Last update</label>
                  <span>{{
                    multipleValues('lastUpdate')
                      ? 'Multiple Values'
                      : copyOfEditedRows[0]['lastUpdate']
                  }}</span>
                </div>
              </div>
              <div class="edit-footer-settings" v-show="isPopupDateEditable">
                <v-btn icon color="#fff" style="text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);">
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
/*
  **** props ****
  options:[] --> Array
  example
  [{property --> string
   show --> boolean
   hideLabel --> boolean
   label --> string
   type --> string (text,date,status,priority,detected,progress,chart,badge,slot)
   isEditable --> boolean
   editOptions --> object {component:"textfield,select,textarea,datepicker", props:{} dynamic props}
   }
   isEditableRuntime --> Boolean
   chartOptions --> Object
   titleKey --> Header title key
   isPopupDateEditable --> For footer
   value --> value of the component
  ]
   */
import Badge from './Badge'
import {
  getBtnPriorityColor,
  getBtnStatusColor,
  getTextColor,
  getDataTableFieldLabel
} from '../utils/functions'
export default {
  name: 'ExtendedView',
  components: {
    Badge
  },
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    containerStyle: {
      type: Object
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    titleKey: {
      type: String
    },
    chartOptions: {
      type: Object
    },
    isPopupDateEditable: {
      type: Boolean,
      default: true
    },
    isEditableRuntime: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(rows) {
      this.copyOfEditedRows = JSON.parse(JSON.stringify(rows))
    }
  },
  data() {
    //value --> gelen değer
    //copyofEditedRows  --> kopyalanan değeri
    //titleKey --> Headerda gösterilecek key
    return {
      copyOfEditedRows: [],
      editMode: false,
      multipleEditModels: [],
      editedPopupProperties: [],
      multipleEditDisables: []
    }
  },
  methods: {
    multipleValues(key, val) {
      // This method controls whether selected items has same value or not
      if (this.value && this.value.length > 1) {
        for (let a = 0; a < this.value.length - 1; a++) {
          let el = this.value[a]
          if (el[key] === this.value[a + 1][key]) {
            return false
          } else {
            return true
          }
        }
      }
    },
    getCheckboxStatus(prop) {
      return this.hasOneMoreCheckboxValue(prop)
    },
    getCheckboxLabel(prop, label) {
      return this.hasOneMoreCheckboxValue(prop) ? 'Multiple Values' : label
    },
    hasOneMoreCheckboxValue(prop) {
      const status = new Set()
      this.copyOfEditedRows.map((item) => {
        status.add(item[prop])
      })
      return status.size > 1
    },
    closeEditPopup() {
      this.$emit('closeEditPopup', true)
    },
    cancelEditedOnes() {
      this.editMode = false
      this.multipleEditModels = []
      this.editedPopupProperties = []
      this.multipleEditDisables = []
    },
    saveEditedOnes() {
      if (this.$refs.refForm.validate()) {
        if (this.isEditableRuntime) {
          if (this.value.length === 1) {
            this.value.map((item, index) => {
              const keys = Object.keys(item)
              keys.map((key) => {
                //birden çok edited row olsada bir tanesi v-modella bağlı. Bu değeri almamız yeterli.
                item[key] = this.copyOfEditedRows[0][key]
              })
            })
          } else {
            this.editedPopupProperties.map((key) => {
              this.value.map((item, index) => {
                item[key] = this.copyOfEditedRows[0][key]
              })
            })
            this.value.map((item, index) => {
              const keys = Object.keys(item)
              keys.map((key) => {
                const keyIndex = this.editedPopupProperties.findIndex((k) => {
                  return k === key
                })
                if (keyIndex === -1) {
                  item[key] = this.copyOfEditedRows[index][key]
                }
              })
            })
          }
        }

        this.$emit('handleEdit', this.copyOfEditedRows)
        this.closeEditPopup()
        this.editMode = false
        this.multipleEditDisables = []
        this.editedPopupProperties = []
        this.multipleEditModels = []
        this.copyOfEditedRows = []
      }
    },

    getBtnStatusColor(type) {
      return getBtnStatusColor(type)
    },
    getBtnPriorityColor(type) {
      return getBtnPriorityColor(type)
    },
    getTextColor(type) {
      return getTextColor(this.getDataTableFieldLabel(type))
    },
    getDataTableFieldLabel(type) {
      return getDataTableFieldLabel(type)
    },
    hasEditPopupFooter() {
      return this.copyOfEditedRows.some((item) => {
        return item['createDate'] || item['lastUpdate']
      })
    },
    handleMultipleEdits(item, key, value) {
      item.map((i) => {
        i[key] = value
      })
      this.multipleEditModels[key] = value
    },
    handleEditPopupTextFieldChange(value, props) {
      this.copyOfEditedRows.map((item) => {
        item[props] = value
      })
    },
    handleEditPopupCheckboxChange(value, props) {
      this.copyOfEditedRows.map((item) => {
        item[props] = value
      })
    },
    handleEditPopupDatePickerChange(value, props) {
      this.menu1 = false
      this.copyOfEditedRows.map((item) => {
        item[props] = value
      })
    },
    handleEditPopupSelectChange(value, props) {
      this.copyOfEditedRows.map((item) => {
        item[props] = value
      })
    },
    handleEditClick(prop) {
      this.multipleEditDisables[prop] = true
      this.editedPopupProperties.push(prop)
      this.$forceUpdate()
    }
  },
  created() {
    this.copyOfEditedRows = JSON.parse(JSON.stringify(this.value))
  }
}
</script>

<style lang="scss"></style>
