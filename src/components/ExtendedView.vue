<template>
  <div
    class="settings-popup edit-popup"
    v-if="
      options && options.col && options.col.length && copyOfEditedRows && copyOfEditedRows.length
    "
    :style="[
      containerStyle,
      editMode && {
        top: getTop()
      },
      createMode && {
        height: '250px'
      }
    ]"
  >
    <div class="inline-wrapper">
      <div class="edit-popup__header">
        <span class="settings-span" v-if="value.length === 1">
          {{ copyOfEditedRows[0][options.titleKey] || options.title }}
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
      <div class="edit-popup__body" v-if="options && options.col && options.col.length">
        <v-form lazy-validation ref="refForm">
          <div class="items-wrapper">
            <div
              :key="col.label"
              class="row-edit-div"
              v-for="col in options.col"
              v-if="
                !col.hideLabel && col.property !== 'createDate' && col.property !== 'lastUpdateDate'
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
                    col.property !== 'lastUpdateDate'
                  "
                  :class="[multipleValues(col.property) ? 'font-italic' : '']"
                >
                  Multiple Values
                </span>
                <span
                  v-else-if="
                    (!editMode || !col.isEditable) &&
                    col.type === 'text' &&
                    col.property !== 'createDate' &&
                    col.property !== 'lastUpdateDate'
                  "
                >
                  {{ copyOfEditedRows[0][col.property] }}
                </span>
                <span
                  v-else-if="
                    (!editMode || !col.isEditable) &&
                    col.type === 'copy' &&
                    col.property !== 'createDate' &&
                    col.property !== 'lastUpdateDate'
                  "
                  style="display: flex;"
                >
                  <span>
                    {{ copyOfEditedRows[0][col.property] }}
                  </span>
                  <v-icon
                    style="cursor: pointer;"
                    class="ml-2"
                    @click="writeTextToClipBoard(copyOfEditedRows[0][col.property])"
                    small
                    >mdi-content-copy</v-icon
                  >
                </span>
                <span
                  v-else-if="
                    (!editMode || !col.isEditable) &&
                    col.type === 'analysisSource' &&
                    col.property !== 'createDate' &&
                    col.property !== 'lastUpdateDate'
                  "
                >
                  <span
                    v-if="
                      copyOfEditedRows[0].matchingPlaybooks &&
                      copyOfEditedRows[0].matchingPlaybooks.length === 0
                    "
                  >
                    {{
                      copyOfEditedRows[0].source === 'Auto'
                        ? 'Auto Analysis'
                        : copyOfEditedRows[0].source
                    }}
                  </span>
                  <router-link
                    tag="span"
                    :key="item.resourceId"
                    v-else
                    :to="{ name: 'Playbook', params: { playbookId: item.resourceId } }"
                    v-for="item in copyOfEditedRows[0].matchingPlaybooks"
                    class="incident-responder-parent__link"
                    >{{ item.name }}</router-link
                  >
                </span>
                <span
                  v-else-if="
                    (!editMode || !col.isEditable) &&
                    (col.type === 'colorfulText' || col.showColorfulText) &&
                    col.property !== 'createDate' &&
                    col.property !== 'lastUpdateDate'
                  "
                  :style="[
                    { color: getTextColor(copyOfEditedRows[0][col.property]), fontWeight: 600 }
                  ]"
                >
                  {{ getDataTableFieldLabel(copyOfEditedRows[0][col.property]) }}
                </span>
                <badge
                  v-else-if="
                        ((!editMode || !col.isEditable) && (col.type === 'status' ||
                        col.type === 'detected' || col.type==='badge'))
                      "
                  size="small"
                  :color="getBtnStatusColor(copyOfEditedRows[0][col.property])"
                  :text="getDataTableFieldLabel(copyOfEditedRows[0][col.property])"
                />
                <div
                  v-else-if="
                        (copyOfEditedRows[0][col.property] && (!editMode || !col.isEditable) && (col.type === 'smallBadge'))
                      "
                >
                  <badge
                    size="small"
                    :color="'#2196f3'"
                    v-for="badge in copyOfEditedRows[0][col.property]"
                    class-name="mr-1 mb-1"
                    :key="badge"
                    :text="badge"
                  />
                </div>

                <badge
                  v-else-if="(!editMode || !col.isEditable) && col.type === 'priority'"
                  size="small"
                  :color="getBtnPriorityColor(copyOfEditedRows[0][col.property])"
                  :text="getDataTableFieldLabel(copyOfEditedRows[0][col.property])"
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
                <v-combobox
                  v-if="
                        (!multipleValues(col.property) && editMode && col.isEditable && col.editOptions.component === 'combobox')
                      "
                  :items="[]"
                  placeholder="Enter Tag"
                  outlined
                  class="edit-combo-box"
                  multiple
                  dense
                  deletable-chips
                  small-chips
                  :return-object="false"
                  :value="getComboBoxValue(copyOfEditedRows[0][col.property])"
                  @input="handleEditComboBoxChange($event, col.property)"
                ></v-combobox>
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
                  no-resize
                ></v-textarea>
                <v-select
                  class="edit-select"
                  dense
                  outlined
                  v-bind="col.editOptions.props"
                  :disabled="
                    col.editOptions.getDisabledValue
                      ? col.editOptions.getDisabledValue(copyOfEditedRows[0])
                      : false
                  "
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
                  :class="[multipleValues(col.property) && 'multiple-values-input']"
                  dense
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

                <v-combobox
                  class="edit-combo-box"
                  :items="[]"
                  outlined
                  multiple
                  dense
                  deletable-chips
                  small-chips
                  :return-object="false"
                  :readonly="!multipleEditDisables[col.property]"
                  :placeholder="!multipleEditDisables[col.property] && 'Multiple Values'"
                  :class="[multipleValues(col.property) && 'multiple-values-input']"
                  v-if="
                    multipleValues(col.property) &&
                    editMode &&
                    col.isEditable &&
                    col.type !== 'chart' &&
                    col.type !== 'progress' &&
                    col.type !== 'date' &&
                    col.property !== 'createDate' &&
                    col.editOptions.component === 'combobox'
                  "
                  :value="getMultipleComboValue(multipleEditModels[col.property])"
                  @input="handleMultipleComboEdit(copyOfEditedRows, col.property, $event)"
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
                </v-combobox>

                <v-select
                  class="edit-select"
                  dense
                  outlined
                  v-bind="col.editOptions.props"
                  :readonly="!multipleEditDisables[col.property]"
                  :placeholder="!multipleEditDisables[col.property] && 'Multiple Values'"
                  :class="[multipleValues(col.property) && 'multiple-values-input']"
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
              <slot name="footer">
                <div class="edit-footer-date">
                  <div
                    class="edit-date-created"
                    v-if="copyOfEditedRows[0]['createDate'] !== undefined"
                  >
                    <label>{{ options.footer[0].label }}</label>
                    <span>{{
                      multipleValues('createDate')
                        ? 'Multiple Values'
                        : copyOfEditedRows[0][options.footer[0].key]
                    }}</span>
                  </div>
                  <div
                    class="edit-date-created"
                    v-if="copyOfEditedRows[0]['lastUpdateDate'] !== undefined"
                  >
                    <label>{{ options.footer[1].label }}</label>
                    <span>{{
                      multipleValues('lastUpdateDate')
                        ? 'Multiple Values'
                        : copyOfEditedRows[0][options.footer[1].key]
                    }}</span>
                  </div>
                </div>
                <div class="edit-footer-settings" v-show="isPopupDateEditable">
                  <v-btn icon color="#fff" style="text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);">
                    <v-icon>mdi-cog</v-icon>
                  </v-btn>
                </div>
              </slot>
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
   type --> string (text,date,status,priority,detected,progress,chart,badge,slot,copy,analysisSource)
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
      type: Object,
      default: () => {
        return {}
      }
    },
    createMode: {
      type: Boolean,
      default: false
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
    chartOptions: {
      type: Object
    },
    isPopupDateEditable: {
      type: Boolean,
      default: false
    },
    isEditableRuntime: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(rows) {
      this.copyOfEditedRows = JSON.parse(JSON.stringify(rows))
      this.defaultValues = JSON.parse(JSON.stringify(rows))
    },
    options(val) {}
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
      multipleEditDisables: [],
      defaultValues: []
    }
  },
  methods: {
    multipleValues(key, val) {
      // This method controls whether selected items has same value or not
      if (this.value && this.value.length > 1) {
        let value = true
        for (let a = 0; a <= this.value.length - 2; a++) {
          let el = this.value[a]
          for (let b = a + 1; b <= this.value.length - 1; b++) {
            if (
              el[key] === this.value[b][key] ||
              JSON.stringify(el[key]) === JSON.stringify(this.value[b][key])
            ) {
              value = false
            } else {
              return true
            }
          }
        }
        return value
      }
    },
    getTop() {
      const a =
        this.containerStyle && this.containerStyle.top
          ? Number(this.containerStyle.top.substring(0, this.containerStyle.top.indexOf('p'))) -
            120 +
            'px'
          : false
      return a
    },
    getMultipleComboValue(prop) {
      return prop ? prop : []
    },
    handleMultipleComboEdit(item, key, value) {
      item.map((i) => {
        i[key] = value ? value.join(',') : value
      })
      this.multipleEditModels[key] = value
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
    getComboBoxValue(prop) {
      if (typeof prop === 'string' && prop.length > 0) {
        if (prop.charAt(prop.length - 1) === ',') {
          return prop.substring(0, prop.length - 1).split(',')
        } else {
          return prop && prop.split(',')
        }
      } else if (typeof prop === 'object') {
        return prop
      }
      return []
    },
    cancelEditedOnes() {
      if (this.createMode) {
        this.$emit('closeCreateMode')
      } else {
        this.editMode = false
        this.multipleEditModels = []
        this.editedPopupProperties = []
        this.copyOfEditedRows = JSON.parse(JSON.stringify(this.defaultValues))
        this.multipleEditDisables = []
      }
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
        return item['createDate'] || item['lastUpdateDate']
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
    handleEditComboBoxChange(value, props) {
      this.copyOfEditedRows.map((item) => {
        item[props] = value.join(',')
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
    },
    writeTextToClipBoard(text) {
      navigator.clipboard.writeText(text)
    }
  },
  created() {
    this.copyOfEditedRows = JSON.parse(JSON.stringify(this.value))
    this.defaultValues = JSON.parse(JSON.stringify(this.value))
    this.editMode = this.createMode
  }
}
</script>

<style lang="scss"></style>
