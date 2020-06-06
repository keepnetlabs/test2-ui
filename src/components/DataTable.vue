<template>
  <div class="k-table__wrapper">
    <v-overlay :opacity="0.46" :value="isWantToDownload" :z-index="999" fixed>
      <v-card
        class="pb-4 pa-6"
        light
        style="
          max-width: 580px;
          border-radius: 12px !important;
          padding: 24px 24px 16px 24px !important;
        "
      >
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon class="ml-2" color="blue" left medium>mdi-download</v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Download Current Page</v-list-item-title>
            <v-list-item-subtitle class="v-card-sub-header">Select file type</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="check-wrapper pl-0 pr-0">
          <v-radio-group class="ml-3" row v-model="downloadType">
            <v-radio color="#2196f3" label="XLS" value="XLS" />
            <v-radio color="#2196f3" label="CSV" value="CSV" />
            <v-radio color="#2196f3" label="PDF" value="PDF" />
          </v-radio-group>
        </v-list-item>
        <div class="d-flex download-buttons flex-row flex-wrap">
          <v-btn @click="changeDownloadModalStatus(false)" color="#f56c6c" text>CANCEL</v-btn>
          <v-btn @click="downloadEvent" color="#2196f3" text>DOWNLOAD</v-btn>
        </div>
      </v-card>
    </v-overlay>

    <v-overlay :opacity="0.46" :value="isWantToAddUsers" :z-index="999" fixed>
      <v-card class="download-card pb-4 pa-6" light style="max-width: 580px;">
        <v-list-item>
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon class="ml-2" color="blue" left medium>mdi-account-plus</v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Add row overlay</v-list-item-title>
            <v-list-item-subtitle class="v-card-sub-header">Subtitle...</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="check-wrapper pl-0 pr-0">
          <div class="check-row">
            <v-checkbox
              class="k-checkbox"
              color="#2196f3"
              label="ITEM 1"
              v-model="download.xls"
              value="XLS"
            />
          </div>
          <div class="check-row">
            <v-checkbox
              class="k-checkbox"
              color="#2196f3"
              label="ITEM 2"
              v-model="download.csv"
              value="CSV"
            />
          </div>
        </v-list-item>
        <div class="d-flex download-buttons flex-row flex-wrap">
          <v-btn @click="isWantToAddUsers = false" color="#f56c6c" text>CANCEL</v-btn>
          <v-btn @click="addRow()" color="#2196f3" text>ADD</v-btn>
        </div>
      </v-card>
    </v-overlay>

    <v-card class="card">
      <v-list-item class="pl-2 pr-0 pb-8" v-if="title && title.icon">
        <div class="v-btn v-cart-icon-wrapper">
          <v-icon class="ml-2" color="blue" left medium>{{ title.icon }}</v-icon>
        </div>
        <v-list-item-content class="pt-0 pb-0">
          <v-list-item-title class="v-card-headline">{{ title.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ title.subtitle }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <div class="table-wrapper">
        <div class="settings-popup" v-show="isSettingsOpened">
          <div class="settings-header">
            <span>Table Settings</span>
            <v-icon @click="isSettingsOpened = false" class="close-icon">mdi-close</v-icon>
          </div>
          <div class="sub-header">Show / Hide Columns</div>
          <div :key="ind" class="popup-row" v-for="(col, ind) of columns" v-if="ind != 0">
            {{ col.label }}
            <v-switch v-model="col.show" />
          </div>
          <div class="sub-header">Freeze Columns</div>
          <div class="popup-row">
            First Column
            <v-switch v-model="firstColFixed" />
          </div>
          <div class="popup-row">
            Last Column
            <v-switch v-model="lastColFixed" />
          </div>
        </div>
        <div
          class="settings-popup"
          style="width: 360px;"
          v-show="copyOfEditedRows && copyOfEditedRows.length && isWantToEditRow"
        >
          <div
            class="inline-wrapper"
            v-if="copyOfEditedRows && copyOfEditedRows.length && columns && columns.length"
          >
            <div class="settings-header">
              <span class="settings-span" v-if="multipleSelection.length === 1">
                {{ copyOfEditedRows[0][columns[0].property] }}
              </span>
              <span class="settings-span" v-else>{{ copyOfEditedRows.length }} Items Selected</span>
              <div class="edit-actions">
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
                <v-btn
                  @click="saveEditedOnes()"
                  class="pl-1 pr-1"
                  color="#2196f3"
                  dense
                  text
                  v-if="editMode"
                  >SAVE
                </v-btn>
              </div>
            </div>
            <div
              class="edit-popup-body"
              v-if="copyOfEditedRows && copyOfEditedRows.length && columns && columns.length"
            >
              <div
                :key="item[columns[ind].property]"
                class="items-wrapper"
                v-for="(item, ind) of copyOfEditedRows"
                v-show="ind === 0"
              >
                <div
                  :key="key"
                  class="row-edit-div"
                  v-for="(value, key) in item"
                  v-show="key !== 'id' && key !== 'children'"
                >
                  <label
                    :class="[Array.isArray(item[key]) ? 'mt-n5' : '']"
                    v-if="key !== 'progress' || !editMode"
                    >{{ getColumnLabel(key, value) }}</label
                  >
                  <span
                    :class="[getColumnLabelClass(key, value)]"
                    v-if="!editMode && !Array.isArray(item[key]) && key !== 'progress'"
                    >{{ value }}</span
                  >
                  <v-text-field
                    :autofocus="item[key] === copyOfEditedRows[0][columns[0].property]"
                    :label="columns[ind].label"
                    class="edit-text-field"
                    dense
                    solo
                    v-if="
                      !multipleValues(key, item[key]) &&
                      editMode &&
                      !Array.isArray(item[key]) &&
                      key !== 'progress' &&
                      key !== 'priority' &&
                      key !== 'status' &&
                      key !== 'detected'
                    "
                    v-model="item[key]"
                  />
                  <v-select
                    :autofocus="item[key] === copyOfEditedRows[0][columns[0].property]"
                    :items="editablePriorityItems"
                    class="edit-select"
                    dense
                    solo
                    v-if="
                      !multipleValues(key, item[key]) &&
                      editMode &&
                      !Array.isArray(item[key]) &&
                      key === 'priority'
                    "
                    v-model="item[key]"
                  />
                  <v-select
                    :autofocus="item[key] === copyOfEditedRows[0][columns[0].property]"
                    :items="editableStatusItems"
                    class="edit-select"
                    dense
                    solo
                    v-if="
                      !multipleValues(key, item[key]) &&
                      editMode &&
                      !Array.isArray(item[key]) &&
                      key === 'status'
                    "
                    v-model="item[key]"
                  />
                  <v-select
                    :autofocus="item[key] === copyOfEditedRows[0][columns[0].property]"
                    :items="editableDetectedItems"
                    class="edit-select"
                    dense
                    solo
                    v-if="
                      !multipleValues(key, item[key]) &&
                      editMode &&
                      !Array.isArray(item[key]) &&
                      key === 'detected'
                    "
                    v-model="item[key]"
                  />

                  <v-text-field
                    :autofocus="item[key] === copyOfEditedRows[0][columns[0].property]"
                    :value="multipleEditModels[key]"
                    @input="handleMultipleEdits(item, key, $event)"
                    class="edit-text-field"
                    dense
                    label="Multiple Values"
                    placeholder="Multiple Values"
                    solo
                    v-if="
                      multipleValues(key, item[key]) &&
                      editMode &&
                      !Array.isArray(item[key]) &&
                      key !== 'progress' &&
                      key !== 'detected' &&
                      key !== 'status' &&
                      key !== 'priority'
                    "
                  />

                  <v-select
                    :autofocus="item[key] === copyOfEditedRows[0][columns[0].property]"
                    :items="getMultipleSelectItems(key)"
                    class="edit-select"
                    dense
                    solo
                    label="Multiple Values"
                    placeholder="Multiple Values"
                    v-if="
                      multipleValues(key, item[key]) &&
                      editMode &&
                      !Array.isArray(item[key]) &&
                      (key === 'detected' || key === 'status' || key === 'priority')
                    "
                    :value="multipleEditModels[key]"
                    @input="handleMultipleEdits(item, key, $event)"
                  />

                  <div class="popup__apexchart-container" v-else-if="Array.isArray(item[key])">
                    <apexchart
                      :options="chartOptions"
                      :series="item[key]"
                      :width="chartOptions.chart.width"
                    />
                  </div>
                  <div v-if="key === 'progress' && !editMode">
                    <span class="progress-per">{{ item[key] }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="edit-popup-footer">
              <div class="edit-footer-date">
                <div class="edit-date-created">
                  <label>Date Created</label>
                  <span>14/12/2018</span>
                </div>
                <div class="edit-date-created">
                  <label>Last update</label>
                  <span>14/12/2018</span>
                </div>
              </div>
              <div class="edit-footer-settings">
                <v-btn disabled icon>
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </div>
        <div class="table-header" v-if="tableData && tableData.length && (filterable || options)">
          <div class="table-search" v-if="filterable">
            <v-text-field
              @mouseover.native="hover = true"
              class="filter-field"
              dense
              label="Search"
              outlined
              prepend-inner-icon="mdi-magnify"
              v-model="search"
              ref="searchInput"
              @keyup="searchChangedEvent"
            />
          </div>
          <div class="table-settings" v-if="options">
            <v-btn
              class="clust-btn btn-hover mr-2"
              color="#2196f3"
              icon
              outlined
              style="border-radius: 6px !important;"
              v-if="groupable"
            >
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-btn>
            <v-btn
              class="clust-btn cluster-btn btn-hover mr-4"
              color="white"
              icon
              style="border-radius: 6px !important;"
              v-if="groupable"
            >
              <v-icon>mdi-format-list-text</v-icon>
              <v-menu bottom offset-y transition="scale-transition" v-model="clusterChevron">
                <template v-slot:activator="{ on }">
                  <div @click="clusterChevron = !clusterChevron" class="header-list-item" v-on="on">
                    <v-icon :class="{ 'chevron-down': clusterChevron }">mdi-chevron-down</v-icon>
                  </div>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>
                      <label class="cluster-label">Cluster By</label>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    :key="item.name + key"
                    @click="clusterSelected(item.name, key)"
                    v-for="(item, key) of clusterItems"
                  >
                    <v-list-item-title>
                      <span class="cluster-span">{{ item.name }}</span>
                      <v-icon color="#2196f3" v-if="item.selected">mdi-check</v-icon>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-menu
                  offset-y
                  transition="scale-transition"
                  v-if="addUsers && addUsers.show && !addUsers.popUp && !addUsers.action"
                  v-on="on"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn class="btn-hover mr-1" icon v-on="on">
                      <v-icon>mdi-plus-circle</v-icon>
                    </v-btn>
                  </template>
                  <v-list class="v-cart-dropdown-list">
                    <v-list-item>
                      <v-list-item-title>Add users manually</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Import .xls</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>LDAP Integration</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

                <v-btn
                  class="btn-add mr-1"
                  icon
                  v-else-if="addUsers && addUsers.show && addUsers.popUp"
                  v-on="on"
                >
                  <v-icon @click="isWantToAddUsers = true">mdi-plus</v-icon>
                </v-btn>
                <v-btn
                  class="btn-add mr-1"
                  icon
                  v-else-if="addUsers && addUsers.show && addUsers.action"
                  v-on="on"
                >
                  <v-icon @click="addUsersAction(addUsers.action, row)">mdi-plus</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Add</span>
            </v-tooltip>

            <slot name="addUsers">
              <v-tooltip bottom opacity="1">
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="btn-add mr-1"
                    icon
                    v-if="addButton && addButton.show && addButton.action"
                    v-on="on"
                  >
                    <v-icon @click="addButtonFunction(addButton.action)">mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span class="tooltip-span">{{
                  (addButton && addButton.tooltip) || 'Add Users'
                }}</span>
              </v-tooltip>
            </slot>

            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="changeDownloadModalStatus(true)"
                  class="btn-hover mr-1"
                  icon
                  v-on="on"
                >
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Download Options</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn class="btn-hover mr-1" icon v-on="on">
                  <v-icon @click="printMethod()">mdi-printer</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Print Options</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn @click="isSettingsOpened = true" class="btn-hover mr-1" icon v-on="on">
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Table Settings</span>
            </v-tooltip>
          </div>
        </div>
        <div class="selection-row" v-if="multipleSelection.length">
          <v-checkbox
            :indeterminate="selectionRowCheckboxDeterminate"
            @click.native="toggleAll()"
            class="selection-all-check"
            color="white"
            v-model="selectionCheckbox"
          />
          <span class="selection-span">{{ multipleSelection.length }} Selected</span>
          <div class="action-icons">
            <v-tooltip bottom opacity="1" v-if="selectEvent && selectEvent.clipboard">
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="handleCopy(multipleSelection)"
                  class="btn-selected-hover mr-1"
                  icon
                  v-on="on"
                >
                  <v-icon class="selection-icons" color="white">mdi-clipboard-text</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Clipboard</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1" v-if="selectEvent && selectEvent.edit">
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="isWantToEditRow = true"
                  class="btn-selected-hover mr-1"
                  icon
                  v-on="on"
                >
                  <v-icon class="selection-icons" color="white">mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Edit Selected Rows</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1" v-if="selectEvent && selectEvent.delete">
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="handleDelete(multipleSelection)"
                  class="btn-selected-hover mr-1"
                  icon
                  v-on="on"
                >
                  <v-icon class="selection-icons" color="white">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Delete selected rows</span>
            </v-tooltip>
            <v-tooltip
              bottom
              opacity="1"
              v-if="selectEvent && selectEvent.download"
              z-index="99999999"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="handleDownload(multipleSelection)"
                  class="btn-selected-hover mr-1"
                  icon
                  v-on="on"
                >
                  <v-icon class="selection-icons" color="white">mdi-download</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Download Selected Rows</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1" v-if="selectEvent && selectEvent.warning">
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="handleWarning(multipleSelection)"
                  class="btn-selected-hover mr-1"
                  icon
                  v-on="on"
                >
                  <v-icon class="selection-icons" color="white">mdi-alert</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Send users a warning message</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1" v-if="selectEvent && selectEvent.deleteAndNotify">
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="handleDeleteAndNotify(multipleSelection)"
                  class="btn-selected-hover mr-1"
                  icon
                  v-on="on"
                >
                  <v-icon class="selection-icons" color="white">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Delete And Notify Users</span>
            </v-tooltip>
          </div>
        </div>
        <div
          class="table-container"
          id="table-container"
          ref="tableContainer"
          v-if="tableData && tableData.length"
        >
          <el-table
            :border="border"
            :data="showfilteredData ? filteredData : tableData"
            :default-sort="{ prop: defaultSort || '', order: defaultSort || '' }"
            :highlight-current-row="false"
            :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange"
            default-expand-all
            id="data-table-container"
            lazy
            ref="elTableRef"
            row-key="id"
            stle="width:100%"
            v-if="!allHidden"
            @sort-change="sortChangedEvent"
          >
            <el-table-column align="center" type="selection" v-if="selectable" width="60" />
            <el-table-column
              :align="col.align"
              :fixed="col.fixed"
              :key="col.property + ind"
              :label="col.label"
              :maxWidth="col.maxWidth || ''"
              :minWidth="col.minWidth || ''"
              :prop="col.property"
              :sortable="col.sortable"
              :width="col.width || ''"
              v-for="(col, ind) of columns"
              v-if="col.show"
            >
              <template slot-scope="scope">
                <data-table-text :col="col" :scope="scope" v-if="col.type === 'text'" />
                <data-table-array :col="col" :scope="scope" v-if="col.type === 'array'" />
                <data-table-attachment
                  :col="col"
                  :scope="scope"
                  v-else-if="col.type === 'attachment'"
                />
                <data-table-chart
                  :chartOptions="chartOptions"
                  :col="col"
                  :scope="scope"
                  v-if="col.type === 'chart'"
                />
                <data-table-detected :col="col" :scope="scope" v-if="col.type === 'detected'" />
                <data-table-user-status
                  :col="col"
                  :scope="scope"
                  v-if="col.type === 'userStatus'"
                />
                <data-table-fiber :col="col" :scope="scope" v-if="col.type === 'fiber'" />
                <data-table-progress :col="col" :scope="scope" v-if="col.type === 'progress'" />
                <data-table-service :col="col" :scope="scope" v-if="col.type === 'service'" />
                <div v-if="col.type === 'status'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        :class="[
                          'btn-status',
                          scope.row.status === 'Pending' ? 'btn-pending' : '',
                          scope.row.status === 'Clean' ? 'btn-pending' : '',
                          scope.row.status === 'Active' ? 'btn-active' : '',
                          scope.row.status === 'Inactive' ? 'btn-inactive' : '',
                          scope.row.status === 'Warning' ? 'btn-warning' : '',
                          scope.row.status === 'Malicious' ? 'btn-warning' : '',
                          scope.row.status === 'Cancelled' ? 'btn-cancelled' : '',
                          scope.row.status === 'Phishing' ? 'btn-cancelled' : '',
                          scope.row.status === 'Idle' ? 'btn-cancelled' : '',
                          scope.row.status === 'None' ? 'btn-none' : '',
                          scope.row.status === 'Quedued' ? 'btn-none' : '',
                          scope.row.status === 'Running' ? 'btn-primary' : '',
                          scope.row.status === 'Expired' ? 'btn-warning' : '',
                          scope.row.status === 'Completed' ? 'btn-success' : '',
                          scope.row.status === 'Cancelled' ? 'btn-cancelled' : '',
                          scope.row.status === 'No Match' ? 'btn-no_match' : '',
                          scope.row.status === 'Finished' ? 'btn-success' : '',
                          scope.row.status === 'Offline' ? 'btn-warning' : '',
                          scope.row.status === 'Online' ? 'btn-success' : '',
                          scope.row.status === 'Disabled' ? 'btn-cancelled' : '',
                          scope.row.status === 'Network Error' ? 'btn-cancelled' : '',
                          scope.row.status === 'Deactivated' ? 'btn-no_match ' : '',
                          scope.row.status === 'User Unavailable' ? 'btn-no_match ' : '',
                          scope.row.status === 'Not Installed' ? 'btn-no_match ' : '',
                          scope.row.status === 'N/A' ? 'btn-none' : '',
                          col.fullWidth ? 'full-width' : ''
                        ]"
                        block
                        rounded
                        v-if="scope.row && scope.row[col.property]"
                        v-on="on"
                        >{{ scope.row.status || 'Empty' }}
                      </v-btn>
                      <span v-else>-</span>
                    </template>
                    <span class="tooltip-span">
                      <slot name="tooltipText">
                        {{ scope.row.status || 'Empty' }}
                      </slot>
                    </span>
                  </v-tooltip>
                </div>
                <div v-if="col.type === 'priority'">
                  <v-tooltip bottom opacity="1">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        :class="[
                          'btn-status',
                          scope.row.priority === 'Active' ? 'btn-active' : '',
                          scope.row.priority === 'Inactive' ? 'btn-inactive' : '',
                          scope.row.priority === 'Low' ? 'btn-low' : '',
                          scope.row.priority === 'Very Low' ? 'btn-very_low' : '',
                          scope.row.priority === 'High' ? 'btn-high' : '',
                          scope.row.priority === 'Medium' ? 'btn-active' : '',
                          scope.row.priority === 'Very High' ? 'btn-very_high' : '',
                          scope.row.priority === 'N/A' ? 'btn-none' : '',

                          col.fullWidth ? 'full-width' : ''
                        ]"
                        block
                        rounded
                        v-if="scope.row && scope.row[col.property]"
                        v-on="on"
                        >{{ scope.row.priority }}
                      </v-btn>
                      <span v-else>-</span>
                    </template>
                    <span class="tooltip-span">{{ scope.row.priority || 'Empty' }}</span>
                  </v-tooltip>
                </div>
                <div v-if="col.type === 'popup'">
                  <slot name="datatable-column-popup" :col="col" :scope="scope"></slot>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              :fixed="actionFixed"
              :min-width="150"
              align="right"
              class-name="actions-container"
              label="Actions"
              label-class-name="actions-label"
              v-if="rowActions && rowActions.length > 2"
            >
              <template slot-scope="scope">
                <template v-if="rowActions[0].action === 'edit'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn @click="handleEdit(scope.row)" class="btn-hover" icon v-on="on">
                        <v-icon>{{ rowActions[0].icon }}</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ rowActions[0].name }}</span>
                  </v-tooltip>
                </template>
                <template v-else>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        @click="rowAct(rowActions[0].action, scope.row)"
                        class="btn-hover"
                        icon
                        v-on="on"
                      >
                        <v-icon>{{ rowActions[0].icon }}</v-icon>
                      </v-btn>
                    </template>
                    <span> {{ rowActions[0].name }} </span>
                  </v-tooltip>
                </template>
                <v-menu bottom left offset-y transition="scale-transition">
                  <template v-slot:activator="{ on }">
                    <v-btn class="btn-hover" icon v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list class="v-cart-dropdown-list">
                    <v-list-item
                      :key="ind"
                      class="sub-menu-el"
                      v-for="(act, ind) of rowActions"
                      v-if="!act.subElements && !act.isNotShow"
                    >
                      <v-list-item-title @click="rowAct(act.action, scope.row)">
                        <v-icon class="pr-3">{{ act.icon }}</v-icon>
                        <span>{{ act.name }}</span>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      :key="ind + 'sub-item'"
                      v-for="(act, ind) of rowActions"
                      v-if="act.subElements && act.subElements.length"
                    >
                      <v-menu :content-class="'sub-menu-sub'" open-on-hover>
                        <template v-slot:activator="{ on }">
                          <v-list-item-title class="sub-element-wrapper" v-on="on">
                            <v-icon class="pr-3">{{ act.icon }}</v-icon>
                            <span>{{ act.name }}</span>
                            <v-icon style="float: right;">mdi-chevron-right</v-icon>
                          </v-list-item-title>
                        </template>
                        <v-list>
                          <v-list-item
                            :key="item"
                            @click="handleSubMenuItemClick(item)"
                            v-for="item of act.subElements"
                          >
                            {{ item }}
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </el-table-column>
            <el-table-column
              :fixed="actionFixed"
              :min-width="150"
              align="right"
              class-name="actions-container--first"
              label="Actions"
              label-class-name="actions-label"
              v-if="rowActions && rowActions.length === 1"
            >
              <template slot-scope="scope">
                <v-tooltip bottom right>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click.native="rowAct(rowActions[0].action, scope.row)"
                      class="btn-hover"
                      icon
                      v-on="on"
                    >
                      <v-icon>{{ rowActions[0].icon }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ rowActions[0].name }}</span>
                </v-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              :fixed="actionFixed"
              :min-width="150"
              align="right"
              class-name="actions-container"
              label="Actions"
              label-class-name="actions-label"
              v-if="rowActions && rowActions.length === 2"
            >
              <template slot-scope="scope">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click.native="rowAct(rowActions[0].action, scope.row)"
                      class="btn-hover"
                      icon
                      v-on="on"
                    >
                      <v-icon>{{ rowActions[0].icon }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ rowActions[0].name }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :disabled="
                        scope.row.status === 'Cancelled' ||
                        scope.row.status === 'Expired' ||
                        scope.row.status === 'Finished' ||
                        scope.row.status === 'NoMatch'
                      "
                      @click.native="rowAct(rowActions[1].action, scope.row)"
                      class="btn-hover"
                      icon
                      v-on="on"
                    >
                      <v-icon>{{ rowActions[1].icon }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ rowActions[1].name }}</span>
                </v-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div v-else>
            <div class="empty-table">
              <div class="empty-inline">
                <h2>There is no visible column. Set visible to see of them.</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="empty-table" v-else>
          <div class="empty-inline">
            <h2>{{ empty.message }}</h2>
            <p>{{ empty.subMes }}</p>
            <v-btn @click="onEmptyBtnClicked" class="empty-btn" v-if="empty.btn">
              <!-- empty action -->
              <v-icon class="mr-2">{{ empty.icon }}</v-icon>
              {{ empty.btn }}
            </v-btn>
          </div>
        </div>
      </div>
      <div class="pagination block" v-if="pageSizes.length">
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="countRow || rowCount"
          :page-sizes="pageSizes || [5, 10, 20, 50, 100]"
          :total="dataLength || initialData.length"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next"
          style="font-family: 'Open Sans', sans-serif !important;"
        />
      </div>
    </v-card>
  </div>
</template>
<script>
import Vue from 'vue'
import DataTableText from './DataTableComponents/DataTableText'
import DataTableArray from './DataTableComponents/DataTableArray'
import DataTableAttachment from './DataTableComponents/DataTableAttachment'
import DataTableChart from './DataTableComponents/DataTableChart'
import DataTableDetected from './DataTableComponents/DataTableDetected'
import DataTableUserStatus from './DataTableComponents/DataTableUserStatus'
import DataTableFiber from './DataTableComponents/DataTableFiber'
import DataTableProgress from './DataTableComponents/DataTableProgress'
import DataTableService from './DataTableComponents/DataTableService'

window.Vue = Vue
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import VueApexCharts from 'vue-apexcharts'
import { mapGetters } from 'vuex'

Vue.use(ElementUI, { locale })
import printJS from 'print-js'

export default {
  components: {
    apexchart: VueApexCharts,
    DataTableText,
    DataTableAttachment,
    DataTableChart,
    DataTableArray,
    DataTableDetected,
    DataTableUserStatus,
    DataTableFiber,
    DataTableProgress,
    DataTableService
  },
  props: {
    columns: {
      type: Array,
      required: true
    },
    editableStatusItems: {
      type: Array,
      default: () => {
        return ['Active', 'Inactive', 'N/A']
      }
    },
    editablePriorityItems: {
      type: Array,
      default: () => {
        return ['Very Low', 'Low', 'Medium', 'High', 'Very High']
      }
    },
    editableDetectedItems: {
      type: Array,
      default: () => {
        return ['Active', 'Inactive', 'N/A']
      }
    },
    rowActionsMinWidth: {
      type: Number,
      default: 60
    },
    table: {
      type: Array,
      required: false
    },
    refName: {
      type: String,
      required: true
    },
    title: {
      type: Object,
      required: false
    },
    pageSizes: {
      type: Array,
      required: false
    },
    defaultSort: {
      type: String,
      required: false
    },
    selectable: {
      type: Boolean,
      required: false
    },
    countRow: {
      type: Number,
      required: false
    },
    filterable: {
      type: Boolean,
      required: false
    },
    options: {
      type: Boolean,
      required: false
    },
    groupable: {
      type: Boolean,
      required: false
    },
    rowActions: {
      type: Array,
      required: false
    },
    addUsers: {
      type: Object,
      required: false
    },
    addButton: {
      type: Object,
      required: false
    },
    empty: {
      type: Object,
      required: false
    },
    selectEvent: {
      type: Object,
      required: false
    },
    chartOptions: {
      type: Object,
      required: false
    },
    clusterItems: {
      type: Array,
      required: false
    },
    border: {
      type: Boolean,
      default: true
    },
    requestParams: {
      type: Object,
      required: false
    },
    isServerSide: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      isWantToDownload: 'common/getDownloadModalStatus' // for using getters
    })
  },
  data() {
    return {
      filteredData: [],
      showfilteredData: false,
      initialData: [],
      dataLength: 0,
      tableData: [],
      rowCount: 10,
      totalCount: 100,
      currentPage: 1,
      multipleSelection: [],
      selectionCheckbox: false,
      selectionAll: false,
      series: [44, 55, 13, 43],
      search: '',
      isSettingsOpened: false,
      isWantToAddUsers: false,
      isWantToEditRow: false,
      editMode: false,
      firstColFixed: true,
      lastColFixed: true,
      copyOfEditedRows: [],
      download: {
        xls: false,
        csv: false,
        pdf: false
      },
      multipleEditModels: [],
      downloadType: 'PDF',
      actionFixed: 'right',
      allHidden: false,
      printObj: {
        id: 'table-container',
        popTitle: 'Datatable Print',
        extraCss: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      },
      clusterChevron: false,
      actionsWidth: 0,
      init: true,
      selectionRowCheckboxDeterminate: false
    }
  },
  watch: {
    tableData(data) {
      if (!this.tableData || this.tableData.length === 0) return []
      else return data
    },
    firstColFixed(val) {
      if (!val) {
        const fixedCol = this.columns.filter((c) => c.fixed === 'left')
        if (fixedCol && fixedCol.length) {
          fixedCol[0].fixed = false
          this.firstColFixed = false
        }
      } else {
        const disabledCol = this.columns.filter((c) => c.fixed === false)
        disabledCol[0].fixed = 'left'
        this.firstColFixed = true
      }
    },
    lastColFixed(val) {
      if (!val) {
        this.actionFixed = false
      } else {
        this.actionFixed = 'right'
      }
    },
    multipleSelection(selecteds) {
      if (selecteds.length === this.tableData.length) {
        this.selectionCheckbox = true
        this.selectionRowCheckboxDeterminate = false
      } else if (selecteds.length > 0) {
        this.selectionRowCheckboxDeterminate = true
      } else {
        this.selectionCheckbox = false
      }
    },
    columns: {
      deep: true,
      handler(val) {
        if (!val.some((col) => col.show)) this.allHidden = true
        else this.allHidden = false
      }
    }
  },
  created() {
    if (this.table && this.table.length) {
      this.initialData = this.table
      this.tableData = this.table
    }
    this.tableData = this.tableData.slice(0, this.countRow || this.rowCount)
    if (this.countRow) this.rowCount = this.countRow
  },
  updated() {
    if (this.init) {
      this.init = false
      this.calculateWidths()
    }
  },
  mounted() {
    this.init = true
    window.addEventListener('resize', this.calculateWidths)
    if (window.outerWidth < 1023) {
      this.actionFixed = false
      const leftFixed = this.columns.filter((col) => col.fixed === 'left')
      if (leftFixed && leftFixed.length) {
        leftFixed[0].fixed = false
        this.firstColFixed = false
      }
      const rightFixed = this.columns.filter((col) => col.fixed === 'right')
      if (rightFixed && rightFixed.length) {
        rightFixed[0].fixed = false
      }
      this.lastColFixed = false
      this.actionFixed = false
    }
  },

  methods: {
    handleTableData() {
      return this.showfilteredData ? this.filteredData : this.tableData
    },

    sortChangedEvent(sortProps) {
      this.$emit('sortChangedEvent', sortProps)
    },

    paginationChangedEvent(paginationProps) {
      this.$emit('paginationChangedEvent', paginationProps)
    },

    searchChangedEvent() {
      if (this.isServerSide) {
        const filterItems = this.columns
          .filter((column) => column.isFilterable)
          .reduce((acc, filterItem) => {
            acc.push({
              FieldName: filterItem.property,
              Operator: filterItem.filterType === 'number' ? '=' : 'Contains',
              Value: this.$refs.searchInput.value
            })
            return acc
          }, [])
        const bodyDataFilter = {
          filter: {
            Condition: 'AND',
            FilterGroups: [
              {
                Condition: 'OR',
                FilterItems: filterItems
              }
            ]
          }
        }
        this.$emit('searchChangedEvent', bodyDataFilter)
      } else {
        const searchValue = this.search
        this.showfilteredData = !!searchValue.length
        this.filteredData = this.tableData.reduce((acc, item) => {
          const data = Object.values(item).find((i) => {
            if (
              typeof i === 'string' &&
              i.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
            )
              return acc.push(item)
          })
          return acc
        }, [])
      }
    },
    addUsersAction(actionName, row) {
      switch (actionName) {
        case 'createCommunityFromMobileInfo':
          this.$emit('createCommunityFromMobileInfo', true)
          break
        case 'stopInvestigationFunc':
          this.$emit('stopInvestigationFunc', row)
          break
        case 'investigationDetails':
          this.$emit('investigationDetails', row)
          break
        case 'deleteInvestigationDetails':
          this.$emit('deleteInvestigationDetailsFunction', row)
          break
        case 'deleteAndNotifyInvestigationDetails':
          this.$emit('deleteAndNotifyInvestigationDetailsFunction', row)
          break
        case 'sendWarningMessage':
          this.$emit('sendInvestigationdetailsWarningMessage', row)
          break
        default:
          break
      }
    },
    getMultipleSelectItems(key) {
      switch (key) {
        case 'priority':
          return this.editablePriorityItems
        case 'status':
          return this.editableStatusItems
        case 'detected':
          return this.editableDetectedItems
        default:
          return []
      }
    },
    cancelEditedOnes() {
      this.editMode = false
      this.multipleEditModels = []
    },
    handleMultipleEdits(item, key, value) {
      item[key] = value
      this.multipleEditModels[key] = value
    },
    getColumnLabelClass(key, value) {
      if (key === 'priority' || key === 'status' || key === 'detected') {
        return 'popup__badge'
      }
    },
    getColumnLabel(key, value) {
      const answer = this.columns.find((item) => {
        return item['property'] === key
      })

      return (answer && answer.label) || key
    },
    addButtonFunction(action, row) {
      this.$emit(action, row)
    },
    tableRowClassName(row) {
      const ans = this.multipleSelection.some((r) => JSON.stringify(r) === JSON.stringify(row.row))
      if (ans) {
        return 'selected-row'
      }
      return ''
    },
    handleSelectionChange(val) {
      if (this.currentPage === 1) {
        this.multipleSelection = val
        this.copyOfEditedRows = JSON.parse(JSON.stringify(val))
      } else {
        this.multipleSelection.push(val)
        this.copyOfEditedRows.push(JSON.parse(JSON.stringify(val)))
      }
    },
    changeDownloadModalStatus(status) {
      this.$store.dispatch('common/changeDownloadModalStatus', status)
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    handleSizeChange(rows) {
      this.rowCount = rows
      if (this.isServerSide) {
        this.paginationChangedEvent({ pageSize: rows, pageNumber: this.currentPage })
      } else {
        if (this.currentPage === 1) {
          this.tableData = this.initialData.slice(0, rows)
        } else {
          this.tableData = this.initialData.slice(
            (this.currentPage - 1) * rows,
            this.currentPage * rows
          )
        }
      }
    },
    handleCurrentChange(pageNum) {
      this.currentPage = pageNum
      if (this.isServerSide) {
        this.paginationChangedEvent({ pageSize: this.rowCount, pageNumber: pageNum })
      } else {
        if (pageNum === 1) {
          this.tableData = this.initialData.slice(0, this.rowCount)
        } else {
          this.tableData = this.initialData.slice(
            (pageNum - 1) * this.rowCount,
            pageNum * this.rowCount
          )
        }
      }
    },
    onEmptyBtnClicked(e) {
      this.$emit('onEmptyBtnClicked', e)
    },
    downloadEvent(e) {
      this.$emit('downloadEvent', this.downloadType)
    },
    handleSubMenuItemClick(item) {
      this.$emit('submenuItemClick', item)
    },
    toggleAll() {
      this.$refs.elTableRef.toggleAllSelection()
    },
    rowAct(action, row, multiSelection, tableData) {
      switch (action) {
        case 'details':
          this.$router.push('/analysis-details')
          break
        case 'stopInvestigationFunc':
          this.$emit('stopInvestigationFunc', { row })
          break
        case 'investigationDetails':
          this.$emit('investigationDetails', { row })
          break
        case 'deleteInvestigationDetails':
          this.$emit(
            'deleteInvestigationDetailsFunction',
            this.multipleSelection.length > 0 ? this.multipleSelection : row
          )
          break
        case 'deleteAndNotifyInvestigationDetails':
          this.$emit(
            'deleteAndNotifyInvestigationDetailsFunction',
            this.multipleSelection.length > 0 ? this.multipleSelection : row
          )
          break
        case 'sendWarningMessage':
          this.$emit(
            'sendInvestigationdetailsWarningMessage',
            this.multipleSelection.length > 0 ? this.multipleSelection : row
          )
          break
        case 'delete':
        default:
          this.$emit(action, this.multipleSelection.length > 0 ? this.multipleSelection : row)
          return false
      }
    },
    printMethod() {
      printJS('table-container', 'html')
    },
    addRow() {
      // Do something
    },
    clusterSelected(name, ind) {
      this.clusterItems[ind].selected = !this.clusterItems[ind].selected
      // emit to parent with name --- this.$emit(name)
      // On Target Users page 43.line, if a tableData object has 'children: []' prop then cluster work fine.
    },
    handleCopy(selections) {
      let headerKeys = this.columns.reduce((acc, item) => {
        acc.push(item.property)
        return acc
      }, [])
      let headerText = this.columns.reduce((acc, item) => {
        acc.push(item.label)
        return acc
      }, [])

      const columnsLength = []
      let text = ''
      selections.forEach((item, index) => {
        headerKeys.forEach((a, i) => {
          if (!item[a]) item[a] = 'Empty'
          let lengthOfItem = item[a].toString().length || 0
          lengthOfItem -= a.length - 1
          if (lengthOfItem < 0) {
            lengthOfItem = 0
          }

          if (columnsLength[i]) {
            if (columnsLength[i] < lengthOfItem) {
              columnsLength[i] = lengthOfItem
            }
          } else {
            columnsLength.push(lengthOfItem)
          }
          text += `${item[a]} `
        })
        text += '\n'
      })

      const getHeader = headerText.reduce((acc, item, index) => {
        acc += item
        for (let i = 0; i < columnsLength[index]; i++) {
          acc += '\xa0'
        }
        return acc
      }, '')

      navigator.clipboard.writeText(text)
    },
    handleEdit(selections) {
      if (typeof selections === 'object' && !this.multipleSelection.length) {
        this.multipleSelection.push(selections)
      }
      // Edit actions should handle here.
      // selections property is an array and has the selected row object data
      if (selections) {
        this.$refs.elTableRef.toggleRowSelection(selections, true)
        this.isWantToEditRow = true
      } else {
        // Nothing selected
      }
    },
    handleDelete(selections) {
      switch (this.refName) {
        case 'investigationDetailsListTable':
          this.$emit('deleteInvestigationDetailsFunction', selections)
          break

        default:
          break
      }
      // You should handle the Delete row action in here
    },
    handleWarning(selections) {
      this.rowAct('sendWarningMessage', selections)
    },
    handleDeleteAndNotify(selections) {
      this.rowAct('deleteAndNotifyInvestigationDetails', selections)
    },
    handleDownload(selections) {
      // You should handle the Download row action in here
    },
    multipleValues(key, val) {
      // This method controls whether selected items has same value or not
      if (this.multipleSelection && this.multipleSelection.length > 1) {
        const refThis = this
        for (let a = 0; a < this.multipleSelection.length - 1; a++) {
          let el = this.multipleSelection[a]
          if (el[key] === refThis.multipleSelection[a + 1][key]) {
            return false
          } else {
            return true
          }
        }
      }
    },
    closeEditPopup() {
      this.editMode = false
      this.isWantToEditRow = false
      this.$refs.elTableRef.clearSelection()
      this.multipleSelection = []
    },
    saveEditedOnes() {
      // After user edited the row and pressed SAVE button
      this.multipleSelection.map((item, index) => {
        const keys = Object.keys(item)
        keys.map((key) => {
          //birden çok edited row olsada bir tanesi v-modella bağlı. Bu değeri almamız yeterli.
          item[key] = this.copyOfEditedRows[0][key]
        })
      })
      this.$refs.elTableRef.clearSelection()
      this.editMode = false
      this.isWantToEditRow = false
      this.multipleSelection = []
      this.multipleEditModels = []
      this.copyOfEditedRows = []
    },
    loadWithDataArray(data, responseParams) {
      this.initialData = data
      this.dataLength = responseParams && responseParams.totalNumberOfRecords
      this.tableData = data.slice(0, this.rowCount || this.countRow)
    },
    calculateWidths() {
      /*
                                                          if (this.$refs.tableContainer) {
                                                            const widthOfContainer = this.$refs.tableContainer.getBoundingClientRect().width
                                                            const columnsTotalWidth = this.getColumnsWidth()
                                                            const actionsWidth = widthOfContainer - columnsTotalWidth - 61
                                                            this.actionsWidth = actionsWidth < 200 ? 200 : actionsWidth
                                                          }

                                                           */
    },
    getColumnsWidth() {
      return this.columns.reduce((acc, item) => {
        acc += Number(item.width)
        return acc
      }, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  border-radius: 20px;
  padding-bottom: 24px;
  position: relative;
  height: max-content;

  @media only screen and (max-width: 500px) {
    padding-bottom: 200px;
  }

  .card {
    padding: 24px;
    border-radius: 12px !important;
    box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
    background-color: #fff;
    display: flex;
    justify-content: center;
    flex-direction: column;

    @media only screen and (max-width: 500px) {
      padding: 13px 0;
    }

    .table-wrapper {
      max-width: 100%;
      height: auto;
      position: relative;
      display: block;
      font-family: 'Open Sans', sans-serif !important;
      border-radius: 12px;
      box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
        0 1px 1px -1px rgba(204, 204, 204, 0.12);
      padding: 16px 0;

      .table-container {
        width: auto;
        max-width: 100%;

        #data-table-container {
          margin-left: 0;
        }
      }

      .settings-popup {
        background-color: #fff;
        top: 40px;
        border: 1px solid #2196f3;
        border-radius: 12px;
        box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
          0 1px 1px -1px rgba(204, 204, 204, 0.12);
        padding: 24px;
        position: absolute;
        right: 0;
        transition: all 0.2s ease-in-out;
        overflow: hidden;
        z-index: 999999;
        width: 277px;

        .settings-header {
          align-items: center;
          display: flex;
          justify-content: space-between;
          flex-direction: row;
          padding-bottom: 19px;

          .settings-span {
            text-overflow: ellipsis;
            display: block;
            overflow: hidden;
            white-space: nowrap;
            max-width: 100%;
            font-size: 20px !important;
            font-weight: 600 !important;
          }

          .close-icon {
            cursor: pointer;
          }

          span {
            font-family: 'Open Sans', sans-serif !important;
            font-size: 24px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.29;
            letter-spacing: normal;
            color: rgba(0, 0, 0, 0.87);
          }
        }

        .edit-actions {
          max-width: 100%;
          display: flex;
          flex-direction: row;
        }

        .edit-popup-body {
          width: 100%;
          position: relative;

          .items-wrapper {
            > .row-edit-div {
              width: 100%;
              align-items: center;
              display: flex;
              flex-direction: row;
              padding-bottom: 7px;

              ::v-deep .v-input__slot {
                box-shadow: unset !important;
                border: 1px solid rgba(205, 205, 205, 0.5);
                border-radius: 8px !important;
              }

              ::v-deep .v-text-field.v-text-field--solo.v-input--dense > .v-input__control {
                min-height: 32px !important;
              }

              ::v-deep .v-text-field__details {
                display: none !important;
              }

              ::v-deep input {
                font-size: 13px !important;
                padding: 6px 0 !important;
              }
            }

            label {
              width: 120px;
              min-width: 120px;
              text-transform: capitalize;
              text-overflow: ellipsis;
              white-space: nowrap;
              display: block;
              overflow: hidden;
              font-family: 'Open Sans', sans-serif !important;
              font-size: 12px;
              font-weight: 600;
            }

            span {
              max-width: 100%;
              text-overflow: ellipsis;
              white-space: nowrap;
              display: block;
              overflow: hidden;
              font-family: 'Open Sans', sans-serif !important;
              font-size: 12px;
            }
          }
        }

        .edit-popup-footer {
          width: 360px;
          height: 68px;
          border-radius: 0;
          background-color: #f1f8fe;
          margin: -24px;
          padding: 24px;
          margin-top: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .edit-footer-date {
            min-width: 120px;
            display: flex;
            flex-direction: row;

            .edit-date-created {
              display: flex;
              flex-direction: column;
              margin-right: 54px;

              label {
                font-family: 'Open Sans', sans-serif !important;
                font-size: 12px;
                font-weight: 600;
                font-stretch: normal;
                font-style: normal;
                line-height: normal;
                letter-spacing: normal;
                color: rgba(0, 0, 0, 0.87);
              }

              span {
                font-family: 'Open Sans', sans-serif !important;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.87);
              }
            }
          }
        }

        .sub-header {
          display: block;
          font-family: 'Open Sans', sans-serif !important;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.75;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.87);
          margin-bottom: 14px;
        }

        .popup-row {
          align-items: center;
          padding-bottom: 10px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;

          ::v-deep .v-input--selection-controls {
            margin-top: 0 !important;

            .accent--text {
              color: #2196f3 !important;
            }

            .v-input__slot {
              margin-bottom: 0 !important;
            }

            .v-messages {
              display: none !important;
            }
          }
        }
      }

      ::v-deep .el-table {
        border-bottom: unset !important;
        margin: 0 auto;
        width: 100% !important;
      }

      ::v-deep .el-table::before {
        display: none;
      }

      ::v-deep .el-table tr {
        height: 45px !important;
      }

      ::v-deep .el-table td {
        padding: 12px 0;
        height: 45px !important;
        border: none !important;
      }

      ::v-deep .el-table th {
        border-bottom: 1px solid #9e9e9e;
        padding: 5px 0 !important;

        .el-checkbox {
          z-index: 2;
        }

        .el-checkbox__inner {
          margin-bottom: 3px;
        }
      }

      ::v-deep .el-table tr:nth-child(even) {
        background-color: #fafafa;
      }

      ::v-deep .el-table .hover-row {
        background-color: #f1f8fe !important;
      }

      ::v-deep .el-table td > .cell {
        color: #212121;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px;
        white-space: nowrap !important;
        width: 100%;
      }

      ::v-deep .el-table th > .cell {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.3rem;
        color: #000000;
        //min-height: 21px;
        padding-left: 10px !important;

        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: #2196f3;
          border-color: #2196f3 !important;
        }

        .el-checkbox:first-child {
          margin-left: -2.5px !important;
        }

        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: #2196f3;
          border-color: #2196f3 !important;
        }

        .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
          content: '';
          position: absolute;
          display: block;
          background-color: #fff;
          height: 3px;
          left: -1.4px;
          right: 0;
          top: 5px;
          width: 16px;
        }
      }

      ::v-deep .el-checkbox__input {
        line-height: 0;
      }

      ::v-deep .el-checkbox__inner {
        border: 1.5px solid #757575;
        border-radius: 3px;
        height: 16px;
        width: 16px;
      }

      ::v-deep .el-checkbox__input.is-checked > .el-checkbox__inner {
        border: 1.5px solid #2196f3;
      }

      ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner::after {
        border: 1.3px solid #fff;
        border-left: 0;
        border-top: 0;
        height: 8px;
        left: 4px;
        top: 0px;
        width: 4px;
      }

      .progress-per {
        font-family: 'Open Sans', sans-serif !important;
        font-size: 10px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.9;
        letter-spacing: normal;
        text-align: center;
        color: rgba(0, 0, 0, 0.87);
      }

      ::v-deep .v-progress-linear {
        margin-bottom: 7px !important;
        margin-top: 5px !important;
      }

      .btn-status {
        border-radius: 18px !important;
        box-shadow: unset !important;
        color: #fff;
        font-family: 'Open Sans', sans-serif !important;
        font-size: 14px !important;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.71;
        margin-bottom: 3px;
        margin: 0 auto;
        text-transform: capitalize;
        min-width: 96px !important;
        max-width: 125px !important;
        height: 32px !important;
      }

      .btn-pending {
        background-color: #00bcd4;
      }

      .btn-active {
        background-color: #2196f3;
      }

      .btn-low {
        background-color: #00bcd4;
      }

      .btn-very_low {
        background-color: #757575;
      }

      .btn-high {
        background-color: #e6a23c;
      }

      .btn-very_high {
        background-color: #f56c6c;
      }

      .btn-add {
        width: 36px;
        height: 36px;
        border-radius: 18px;
        box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5);
        background-color: #2196f3;
        color: white;

        .v-icon {
          font-size: 18px !important;
        }
      }

      .btn-inactive {
        background-color: #f56c6c;
      }

      .btn-warning {
        background-color: #e6a23c;
      }

      .btn-cancelled,
      .btn-offline {
        background-color: #f56c6c;
      }

      .btn-primary {
        background-color: #2196f3;
      }

      .btn-none,
      .btn-quedued,
      .btn-online {
        background-color: #00bcd4;
      }

      .btn-success {
        background-color: #43a047;
      }

      .btn-no_match {
        background-color: #757575;
      }

      ::v-deep .selected-row {
        background-color: #bde0ff !important;
      }

      .selection-row {
        align-items: center;
        background-color: #2196f3;
        display: flex;
        height: 47px;
        padding: 0 12px;
        position: absolute;
        top: 75px;
        width: 100%;
        z-index: 4;

        .selection-span {
          font-family: 'Open Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: #fff;
          margin-left: 20px;
        }

        .action-icons {
          margin-left: 109px;

          .selection-icons {
            cursor: pointer;
          }
        }
      }

      .table-header {
        align-items: center;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-bottom: 20px;
        position: relative;
        width: 100%;
        min-height: 50px;
        padding-left: 24px;

        @media only screen and (max-width: 500px) {
          flex-direction: column;
          .table-search {
            width: 100% !important;
          }
        }

        .table-search {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 40px;
          width: 328px;

          ::v-deep .v-text-field.v-text-field--enclosed {
            height: 40px !important;
          }
        }

        .table-settings {
          cursor: pointer;

          @media only screen and (max-width: 500px) {
            padding-right: 0;
            padding-top: 13px;
          }
        }

        ::v-deep label {
          font-family: 'Open Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.54);
        }

        > div {
          padding-right: 10px;
        }

        .filter-icon {
          cursor: pointer;
        }
      }
    }

    .pagination {
      padding-top: 20px;
      align-items: center;
      display: flex;
      justify-content: flex-end;
      width: 100%;
    }

    ::v-deep .el-pagination .el-select .el-input {
      width: 90px;

      .el-input__inner {
        background-color: #f2f2f2;
      }
    }

    ::v-deep .el-select .el-input .el-select__caret {
      color: rgba(0, 0, 0, 0.87);
      font-weight: 700;
    }

    ::v-deep .el-pager {
      padding-left: 0 !important;
    }

    ::v-deep .el-pager > li {
      font-family: 'Open Sans', sans-serif;
      font-size: 12px;
      min-width: 13px;
    }
  }
}

.v-tooltip__content {
  background: #6d6d6d !important;
}

::v-deep .k-grid td.k-state-selected,
::v-deep .k-grid tr.k-state-selected > td {
  background-color: rgba(0, 188, 212, 0.05) !important;
}

.v-list-item__subtitle {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.2 !important;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87) !important;
  margin-left: 2px;
}

::v-deep .v-sheet {
  border-radius: unset !important;
}
.v-sheet {
  border-radius: 20px !important;
}

.v-card-headline {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 24px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.4;
  letter-spacing: normal;
  color: #2196f3;
}

.v-cart-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  margin-right: 24px;
  box-shadow: 0 2px 20px 0 rgba(100, 181, 246, 0.5);
  border: solid 1px rgba(100, 181, 246, 0.5);
  background-color: #e3f2fd;
}

.table-row .wrapper .download-card {
  display: flex;
  flex-direction: column;
  min-width: 420px;
  min-height: 300px;
  position: relative;
  border-radius: 12px !important;
  padding: 16px !important;

  .check-wrapper {
    display: flex;
    flex-direction: column;

    .check-row {
      padding-left: 70px;
      width: 100%;

      ::v-deep .v-input--selection-controls.v-input {
        margin-top: 0 !important;
      }

      ::v-deep .v-label {
        font-size: 14px !important;
      }

      ::v-deep .v-messages {
        display: none;
      }
    }

    .check-row:first-child {
      padding-top: 27px;
    }

    .check-row:last-child {
      padding-bottom: 18px;
    }
  }

  .download-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: absolute;
    bottom: 10px;
    width: 100%;
    padding: 0 16px;
  }
}

.btn-hover:hover {
  color: #2196f3;
}

.btn-selected-hover {
  color: rgba(0, 0, 0, 0.87) !important;
}

.tooltip-span {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: rgba(255, 255, 255, 0.87);
}

.filter-field {
  border-radius: 8px;
  //border: solid 1px #dcdfe6;

  ::v-deep .v-label {
    font-weight: normal !important;
    font-stretch: normal;
    font-style: normal;
    font-size: 16px !important;
    font-family: 'Open Sans', sans-serif !important;
    line-height: normal;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
  }

  ::v-deep .v-icon.v-icon {
    font-size: 20px;
    margin-top: 5.2px !important;
  }
}

.sub-menu-el {
  cursor: pointer;
}

.sub-element-wrapper {
  cursor: pointer;
}

.empty-table {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;

  .empty-inline {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    h2 {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 24px;
      line-height: 1.29;
      font-weight: 400 !important;
      color: rgba(0, 0, 0, 0.87);
      padding-bottom: 16px;
      margin-bottom: 0 !important;
    }

    p {
      font-family: 'Open Sans', sans-serif !important;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 8px !important;
    }

    .empty-btn {
      border-radius: 18px;
      box-shadow: 0 2px 5px 0 rgba(100, 181, 246, 0.5) !important;
      background-color: #2196f3 !important;
      color: #fff !important;
      text-transform: capitalize !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      height: 36px !important;
    }
  }
}

::v-deep .el-table__body,
.el-table__footer,
.el-table__header {
  border-collapse: collapse !important;
}

.sub-menu-sub {
  left: unset !important;
  right: 220px !important;
}

::v-deep .el-table [class*='el-table__row--level'] .el-table__expand-icon {
  float: right !important;
  margin-top: 2px;

  .el-icon-arrow-right:before {
    font-weight: 900;
    font-size: 15px;
  }
}

.cluster-btn {
  background-color: #2196f3 !important;
  color: #fff;
  width: 60px !important;
}

.chevron-down {
  transition: 0.3s all ease-in-out;
  transform: rotate(180deg);
}

.header-list-item {
  border-left: 2px solid white;
  margin-left: 5px;
  height: 34px;
  width: 16px;

  .v-icon {
    margin-top: 5px;
    margin-left: -1px;
  }
}

.clust-btn {
  height: 34px;
}

::v-deep .selection-all-check {
  margin-left: 6px !important;

  i {
    color: white !important;
  }
}

::v-deep .cluster-label {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 12px;
  font-weight: 600;
}

.cluster-span {
  padding-right: 8px;
}

.full-width {
  width: 100% !important;
}

.edit-select {
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
}

/*.date-format {
                                            text-align: left !important;
                                            span {
                                              text-overflow: ellipsis;
                                              white-space: normal;
                                            }
                                          }*/

::v-deep .actions-label {
  padding-right: 49px !important;
}

::v-deep .actions-container {
  padding-right: 17.5px !important;

  &--first {
    padding-right: 40px !important;
  }
}

.popup {
  &__badge {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 25px;
    padding: 6px 6px 6px 6px;
    border-radius: 4px;
    color: white;
    background: #2196f3;
    font-size: 12px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.13;
    font-family: 'Open Sans', sans-serif !important;
    letter-spacing: normal;
    text-align: center;
  }

  &__apexchart-container {
    height: 80px;
    width: 80px;
    padding-top: 6px;
    margin-left: -23px;
    margin-top: -20px;
  }
}

::v-deep .el-table__fixed-body-wrapper {
  z-index: 2;
}
</style>
<!--
  DataTable COMPONENT
  - Element UI's Table component used
  - Props used for Configuration and Show some data.
  - When you want use this component just import it anywhere and don't forget the configuration of required props.
  - Methods defined for what is used for, you can add more on that
  - <el-table-column> attributes defines the table; show, type etc.
  - You can add more columns if needed. Just don't forget this component used on all project.
  - You can use elTableRef as a referance of the table.
  - Also we have to Watch some data changes and response on the table.
-->
