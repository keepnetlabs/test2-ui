<template>
  <div class="wrapper">
    <v-overlay fixed :opacity="0.46" :value="isWantToDownload" :z-index="999">
      <v-card light class="pb-4 pa-6" style="max-width: 580px; border-radius: 12px !important;">
        <v-list-item class="pl-0 pr-0">
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">mdi-download</v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Download Current Page</v-list-item-title>
            <v-list-item-subtitle class="v-card-sub-header">Select file type</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="check-wrapper pl-0 pr-0">
          <v-radio-group row class="ml-3" v-model="downloadType">
            <v-radio color="#2196f3" label="XLS" value="XLS"/>
            <v-radio color="#2196f3" label="CSV" value="CSV"/>
            <v-radio color="#2196f3" label="PDF" value="PDF"/>
          </v-radio-group>
        </v-list-item>
        <div class="d-flex download-buttons flex-row flex-wrap">
          <v-btn text color="#f56c6c" @click="isWantToDownload = false">CANCEL</v-btn>
          <v-btn text color="#2196f3" @click="downloadEvent">DOWNLOAD</v-btn>
        </div>
      </v-card>
    </v-overlay>

    <v-overlay fixed :opacity="0.46" :value="isWantToAddUsers" :z-index="999">
      <v-card light class="download-card pb-4 pa-6" style="max-width: 580px;">
        <v-list-item>
          <div class="v-btn v-cart-icon-wrapper">
            <v-icon medium left color="blue" class="ml-2">mdi-account-plus</v-icon>
          </div>
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="v-card-headline">Add row overlay</v-list-item-title>
            <v-list-item-subtitle class="v-card-sub-header">Subtitle...</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="check-wrapper pl-0 pr-0">
          <div class="check-row">
            <v-checkbox color="#2196f3" v-model="download.xls" label="ITEM 1" value="XLS"/>
          </div>
          <div class="check-row">
            <v-checkbox color="#2196f3" v-model="download.csv" label="ITEM 2" value="CSV"/>
          </div>
        </v-list-item>
        <div class="d-flex download-buttons flex-row flex-wrap">
          <v-btn text color="#f56c6c" @click="isWantToAddUsers = false">CANCEL</v-btn>
          <v-btn text color="#2196f3" @click="addRow()">ADD</v-btn>
        </div>
      </v-card>
    </v-overlay>

    <v-card class="card">
      <v-list-item v-if="title && title.icon" class="pl-2 pr-0 pb-8">
        <div class="v-btn v-cart-icon-wrapper">
          <v-icon medium left color="blue" class="ml-2">{{ title.icon }}</v-icon>
        </div>
        <v-list-item-content class="pt-0 pb-0">
          <v-list-item-title class="v-card-headline">{{ title.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ title.subtitle }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <div class="table-wrapper">
        <div v-show="isSettingsOpened" class="settings-popup">
          <div class="settings-header">
            <span>Table Settings</span>
            <v-icon @click="isSettingsOpened = false" class="close-icon">mdi-close</v-icon>
          </div>
          <div class="sub-header">Show / Hide Columns</div>
          <div class="popup-row" v-for="(col, ind) of columns" :key="ind" v-if="ind != 0">
            {{ col.label }}
            <v-switch v-model="col.show"></v-switch>
          </div>
          <div class="sub-header">Freeze Columns</div>
          <div class="popup-row">
            First Column
            <v-switch v-model="firstColFixed"></v-switch>
          </div>
          <div class="popup-row">
            Last Column
            <v-switch v-model="lastColFixed"></v-switch>
          </div>
        </div>
        <div
          v-show="multipleSelection && multipleSelection.length && isWantToEditRow"
          class="settings-popup"
          style="width: 360px"
        >
          <div
            v-if="multipleSelection && multipleSelection.length && columns && columns.length"
            class="inline-wrapper"
          >
            <div class="settings-header">
              <span v-if="multipleSelection.length === 1" class="settings-span">
                {{
                multipleSelection[0][columns[0].property]
                }}
              </span>
              <span v-else
                    class="settings-span">{{ multipleSelection.length }} Items Selected</span>
              <div class="edit-actions">
                <v-btn icon v-if="!editMode" @click="editMode = true">
                  <v-icon class="close-icon">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon v-if="!editMode" @click="closeEditPopup()">
                  <v-icon class="close-icon">mdi-close</v-icon>
                </v-btn>
                <v-btn
                  class="pl-1 pr-1"
                  v-if="editMode"
                  text
                  dense
                  @click="editMode = false"
                  color="#f56c6c"
                >CANCEL
                </v-btn>
                <v-btn
                  class="pl-1 pr-1"
                  v-if="editMode"
                  text
                  dense
                  @click="saveEditedOnes()"
                  color="#2196f3"
                >SAVE
                </v-btn>
              </div>
            </div>
            <div
              v-if="multipleSelection && multipleSelection.length && columns && columns.length"
              class="edit-popup-body"
            >
              <div
                v-for="(item, ind) of multipleSelection"
                v-show="ind === 0"
                :key="item[columns[ind].property]"
                class="items-wrapper"
              >
                <div
                  class="row-edit-div"
                  v-show="i !== 'id' && i !== 'children'"
                  v-for="(obj, i) in item"
                  :key="i"
                >
                  <label v-if="i !== 'progress' || !editMode">{{ i }}</label>
                  <span
                    v-if="!editMode && !Array.isArray(item[i]) && i !== 'progress'">{{ obj }}</span>
                  <v-text-field
                    :label="JSON.stringify(item[i])"
                    dense
                    solo
                    class="edit-text-field"
                    v-if="
                      !multipleValues(i, item[i]) &&
                        editMode &&
                        !Array.isArray(item[i]) &&
                        i !== 'progress'
                    "
                    v-model="item[i]"
                  ></v-text-field>
                  <v-text-field
                    label="Multiple Values"
                    placeholder="Multiple Values"
                    dense
                    solo
                    class="edit-text-field"
                    v-if="
                      multipleValues(i, item[i]) &&
                        editMode &&
                        !Array.isArray(item[i]) &&
                        i !== 'progress'
                    "
                    disabled
                  ></v-text-field>

                  <apexchart
                    v-else-if="Array.isArray(item[i])"
                    :options="chartOptions"
                    :series="item[i]"
                    :width="chartOptions.chart.width"
                  ></apexchart>
                  <div v-if="i === 'progress' && !editMode" style="width: 50px;">
                    <span class="progress-per">{{ item[i] }}%</span>
                    <v-progress-linear
                      background-color="#b3d4fc"
                      color="#2196f3"
                      reactive
                      rounded
                      height="4"
                      width="100"
                      :value="item[i]"
                    ></v-progress-linear>
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
                <v-btn icon disabled>
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </div>
        <div v-if="filterable || options" class="table-header">
          <div v-if="filterable" class="table-search">
            <v-icon class="pl-5 pr-6">mdi-magnify</v-icon>
            <v-text-field
              @mouseover.native="hover = true"
              label="Not working for now..."
              outlined
              dense
              class="filter-field"
              v-model="search"
            ></v-text-field>
            <v-icon class="filter-icon pl-2">mdi-filter-variant</v-icon>
          </div>
          <div v-if="options" class="table-settings">
            <v-btn
              v-if="groupable"
              icon
              color="#2196f3"
              outlined
              class="clust-btn btn-hover mr-2"
              style="border-radius: 6px !important"
            >
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-btn>
            <v-btn
              v-if="groupable"
              icon
              color="white"
              class="clust-btn cluster-btn btn-hover mr-4"
              style="border-radius: 6px !important"
            >
              <v-icon>mdi-format-list-text</v-icon>
              <v-menu v-model="clusterChevron" bottom offset-y transition="scale-transition">
                <template v-slot:activator="{ on }">
                  <div v-on="on" @click="clusterChevron = !clusterChevron" class="header-list-item">
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
                    @click="clusterSelected(item.name, key)"
                    v-for="(item, key) of clusterItems"
                    :key="item.name + key"
                  >
                    <v-list-item-title>
                      <span class="cluster-span">{{ item.name }}</span>
                      <v-icon v-if="item.selected" color="#2196f3">mdi-check</v-icon>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-menu
                  v-if="addUsers && addUsers.show && !addUsers.popUp && !addUsers.action"
                  offset-y
                  transition="scale-transition"
                  v-on="on"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn icon class="btn-hover mr-1" v-on="on">
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
                  v-else-if="addUsers && addUsers.show && addUsers.popUp"
                  icon
                  v-on="on"
                  class="btn-hover mr-1"
                >
                  <v-icon @click="isWantToAddUsers = true">mdi-plus-circle</v-icon>
                </v-btn>
                <v-btn
                  icon
                  class="btn-hover mr-1"
                  v-else-if="addUsers && addUsers.show && addUsers.action"
                  v-on="on"
                >
                  <v-icon @click="addUsersAction(addUsers.action, row)">mdi-plus-circle</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Add</span>
            </v-tooltip>

            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{on}">
                <v-btn
                  icon
                  class="btn-add mr-1"
                  v-if="addButton && addButton.show && addButton.action"
                  v-on="on"
                >
                  <v-icon @click="addButtonFunction(addButton.action)">mdi-plus</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Add</span>
            </v-tooltip>

            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn @click="isWantToDownload = true" icon class="btn-hover mr-1" v-on="on">
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Download options</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn icon class="btn-hover mr-1" v-on="on">
                  <v-icon @click="printMethod()">mdi-printer</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Print Options</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn @click="isSettingsOpened = true" icon class="btn-hover mr-1" v-on="on">
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Table Settings</span>
            </v-tooltip>
          </div>
        </div>
        <div v-if="multipleSelection.length" class="selection-row">
          <v-checkbox
            @click.native="toggleAll()"
            v-model="selectionCheckbox"
            class="selection-all-check"
            color="white"
          ></v-checkbox>
          <span class="selection-span">{{ multipleSelection.length }} Selected</span>
          <div class="action-icons">
            <v-tooltip v-if="selectEvent && selectEvent.clipboard" bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="handleCopy(multipleSelection)"
                  icon
                  class="btn-selected-hover mr-1"
                  v-on="on"
                >
                  <v-icon color="white" class="selection-icons">mdi-clipboard-text</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Clipboard</span>
            </v-tooltip>
            <v-tooltip v-if="selectEvent && selectEvent.edit" bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="handleEdit(multipleSelection)"
                  icon
                  class="btn-selected-hover mr-1"
                  v-on="on"
                >
                  <v-icon color="white" class="selection-icons">mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Edit selected rows</span>
            </v-tooltip>
            <v-tooltip v-if="selectEvent && selectEvent.delete" bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="handleDelete(multipleSelection)"
                  icon
                  class="btn-selected-hover mr-1"
                  v-on="on"
                >
                  <v-icon color="white" class="selection-icons">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Delete selected rows</span>
            </v-tooltip>
            <v-tooltip
              v-if="selectEvent && selectEvent.download"
              bottom
              opacity="1"
              z-index="99999999"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="handleDownload(multipleSelection)"
                  icon
                  class="btn-selected-hover mr-1"
                  v-on="on"
                >
                  <v-icon color="white" class="selection-icons">mdi-download</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Download selected rows</span>
            </v-tooltip>
            <v-tooltip v-if="selectEvent && selectEvent.warning" bottom opacity="1">
              <template v-slot:activator="{on}">
                <v-btn @click="handleWarning(multipleSelection)" icon
                       class="btn-selected-hover mr-1" v-on="on">
                  <v-icon color="white" class="selection-icons">mdi-alert</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Send users a warning message</span>
            </v-tooltip>
            <v-tooltip v-if="selectEvent && selectEvent.deleteAndNotify" bottom opacity="1">
              <template v-slot:activator="{on}">
                <v-btn @click="handleDeleteAndNotify(multipleSelection)" icon
                       class="btn-selected-hover mr-1" v-on="on">
                  <v-icon color="white" class="selection-icons">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Delete And Notify Users</span>
            </v-tooltip>
          </div>
        </div>
        <div
          id="table-container"
          class="table-container"
          ref="tableContainer"
          v-if="tableData && tableData.length"
        >
          <el-table
            ref="elTableRef"
            :data="tableData"
            :highlight-current-row="false"
            :row-class-name="tableRowClassName"
            :default-sort="{ prop: defaultSort || '', order: defaultSort || '' }"
            row-key="id"
            @selection-change="handleSelectionChange"
            lazy
            id="data-table-container"
            v-if="!allHidden"
            default-expand-all
            :border="border"
          >
            <el-table-column v-if="selectable" type="selection" width="60"
                             align="center"></el-table-column>
            <el-table-column
              v-for="(col, ind) of columns"
              :key="'company' + ind"
              v-if="col.type === 'text' && col.show"
              :class-name="[
                col.property === 'startDate' ||
                col.property === 'endDate' ||
                col.property === 'expireDate'
                  ? 'date-format'
                  : ''
              ]"
              :sortable="col.sortable"
              :prop="col.property"
              :fixed="col.fixed"
              :label="col.label"
              :align="col.align"
              :width="col.width || ''"
              :minWidth="col.minWidth || ''"
              :maxWidth="col.maxWidth || ''"
            >
              <template slot-scope="scope">
                <span v-if="scope.row && scope.row[col.property]">
                  {{
                  scope.row[col.property]
                  }}
                </span>
                <span v-else>Empty</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(col, ind) of columns"
              :key="'company' + ind"
              v-if="col.type === 'array' && col.show"
              :class-name="[
                col.property === 'startDate' ||
                col.property === 'endDate' ||
                col.property === 'expireDate'
                  ? 'date-format'
                  : ''
              ]"
              :sortable="col.sortable"
              :prop="col.property"
              :fixed="col.fixed"
              :label="col.label"
              :align="col.align"
              :width="col.width || ''"
              :minWidth="col.minWidth || ''"
              :maxWidth="col.maxWidth || ''"
            >
              <template slot-scope="scope">
                <span v-if="scope.row && scope.row[col.property]">
                  <span class="mr-2">
                    {{
                    scope.row[col.property][0]
                    }}
                  </span>
                  <v-tooltip
                    v-if="scope.row[col.property].length > 1"
                    bottom
                    opacity="1"
                    max-width="230"
                  >
                    <template v-slot:activator="{ on }">
                      <div v-on="on"
                           class="external-data">+{{scope.row[col.property].length-1}}</div>
                    </template>
                    <p
                      class="tooltip-line"
                      v-for="(item,index) in scope.row[col.property]"
                      :key="index"
                    >
                      <span>{{item}}</span>
                    </p>
                  </v-tooltip>
                </span>
                <span v-else>Empty</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(col, ind) of columns"
              :key="'company' + ind"
              v-if="col.type === 'attachment' && col.show"
              :class-name="[
                col.property === 'startDate' ||
                col.property === 'endDate' ||
                col.property === 'expireDate'
                  ? 'date-format'
                  : ''
              ]"
              :sortable="col.sortable"
              :prop="col.property"
              :fixed="col.fixed"
              :label="col.label"
              :align="col.align"
              :width="col.width || ''"
              :minWidth="col.minWidth || ''"
              :maxWidth="col.maxWidth || ''"
            >
              <template slot-scope="scope">
                <span v-if="scope.row && scope.row[col.property]>0">
                  <v-icon color="#757575">mdi-paperclip</v-icon>
                </span>
                <span v-else></span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(col, ind) of columns"
              :key="col.property + ind"
              v-if="col.type === 'chart' && col.show"
              :sortable="col.sortable"
              :prop="col.property"
              :fixed="col.fixed"
              :label="col.label"
              :align="col.align"
              :width="col.width || ''"
              :minWidth="col.minWidth || ''"
            >
              <template slot-scope="scope">
                <v-tooltip
                  v-if="scope.row && scope.row[col.property] && scope.row[col.property].filter(item=>(item===0)).length !== scope.row[col.property].length"
                  bottom opacity="1">
                  <template v-slot:activator="{ on }">
                    <div v-on="on">
                      <apexchart
                        :width="chartOptions.chart.width"
                        :options="chartOptions"
                        :series="scope.row[col.property]"
                      ></apexchart>
                    </div>
                    <div class="chart__summary-text"
                         v-if="chartOptions.summary && chartOptions.summary.show">{{
                      getChartSummary(scope.row[col.property],chartOptions.summary.seperator) }}
                    </div>
                  </template>
                  <template v-if="chartOptions.showTooltipLine"
                            v-for="(item,index) in scope.row[col.property]">
                    <p class="tooltip-line"> {{chartOptions.labels[index]}} : {{ item }}</p>
                  </template>

                </v-tooltip>
                <span v-else>Empty</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(col, ind) of columns"
              :key="col.property + ind"
              v-if="col.type === 'detected' && col.show"
              :sortable="col.sortable"
              :prop="col.property"
              :fixed="col.fixed"
              :label="col.label"
              :align="col.align"
              :width="col.width || ''"
              :minWidth="col.minWidth || ''"
            >
              <template slot-scope="scope">
                <v-btn
                  :class="[
                    'btn-status',
                    scope.row.detected === 'Pending' ? 'btn-pending' : '',
                    scope.row.detected === 'Clean' ? 'btn-pending' : '',
                    scope.row.detected === 'Active' ? 'btn-active' : '',
                    scope.row.detected === 'Inactive' ? 'btn-inactive' : '',
                    scope.row.detected === 'Warning' ? 'btn-warning' : '',
                    scope.row.detected === 'Malicious' ? 'btn-warning' : '',
                    scope.row.detected === 'Cancelled' ? 'btn-cancelled' : '',
                    scope.row.detected === 'Phishing' ? 'btn-cancelled' : '',
                    scope.row.detected === 'Idle' ? 'btn-cancelled' : '',
                    scope.row.detected === 'None' ? 'btn-none' : '',
                    scope.row.detected === 'Quedued' ? 'btn-none' : '',
                    scope.row.detected === 'Running' ? 'btn-primary' : '',
                    scope.row.detected === 'Expired' ? 'btn-warning' : '',
                    scope.row.detected === 'Completed' ? 'btn-success' : '',
                    scope.row.detected === 'Cancelled' ? 'btn-cancelled' : '',
                    scope.row.detected === 'No Match' ? 'btn-no_match' : '',
                    scope.row.detected === 'Finished' ? 'btn-success' : '',
                    scope.row.detected === 'N/A' ? 'btn-none' : '',
                    scope.row.detected === 'Offline' ? 'btn-warning' : '',
                    scope.row.detected === 'Online' ? 'btn-success' : '',
                    scope.row.detected === 'Disabled' ? 'btn-cancelled' : '',
                    scope.row.detected === 'Network Error' ? 'btn-cancelled' : '',
                    scope.row.detected === 'Deactivated' ? 'btn-no_match ' : '',
                    scope.row.detected === 'User Unavailable' ? 'btn-no_match ' : '',
                    scope.row.detected === 'Not Installed' ? 'btn-no_match ' : '',
                  ]"
                  block
                  rounded
                  v-if="scope.row && scope.row[col.property]"
                >{{ scope.row.detected }}
                </v-btn>
                <span v-else>Empty</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(col, ind) of columns"
              :key="col.property + ind"
              v-if="col.type === 'userStatus' && col.show"
              :sortable="col.sortable"
              :prop="col.property"
              :fixed="col.fixed"
              :label="col.label"
              :align="col.align"
              :width="col.width || ''"
              :minWidth="col.minWidth || ''"
            >
              <template slot-scope="scope">
                <v-btn
                  :class="[
                    'btn-status',
                    scope.row.userStatus === 'Online' ? 'btn-online' : '',
                    scope.row.userStatus === 'Offline' ? 'btn-offline' : '',
                  ]"
                  block
                  rounded
                  v-if="scope.row && scope.row[col.property]"
                >{{ scope.row.userStatus }}
                </v-btn>
                <span v-else>Empty</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(col, ind) of columns"
              :key="col.property + ind"
              v-if="col.type === 'progress' && col.show"
              :sortable="col.sortable"
              :prop="col.property"
              :fixed="col.fixed"
              :label="col.label"
              :align="col.align"
              :width="col.width || ''"
              :minWidth="col.minWidth || ''"
            >
              <template slot-scope="scope">
                <div v-if="scope.row" style="max-width: 80px; margin: 0 auto;">
                  <span
                    class="progress-per"
                  >{{ scope.row.progress == '100' ? 'Completed' : scope.row.progress+"%"}}</span>
                  <v-progress-linear
                    background-color="#b3d4fc"
                    color="#2196f3"
                    reactive
                    rounded
                    height="4"
                    :value="scope.row.progress"
                  ></v-progress-linear>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(col, ind) of columns"
              :key="col.property + ind"
              v-if="col.type === 'service' && col.show"
              :sortable="col.sortable"
              :prop="col.property"
              :fixed="col.fixed"
              :label="col.label"
              :align="col.align"
              :width="col.width || ''"
              :minWidth="col.minWidth || ''"
            >
              <template slot-scope="scope">
                <span v-if="scope.row && scope.row[col.property]" class="service-icon-content">
                  <img
                    src="../assets/img/Office.png"
                    alt="outlook"
                    v-if="scope.row[col.property] == 'Outlook'"
                  />
                  <img
                    src="../assets/img/Word.png"
                    alt="outlook"
                    v-if="scope.row[col.property] == 'O365'"
                  />
                  <img
                    src="../assets/img/Google.png"
                    alt="outlook"
                    v-if="scope.row[col.property] == 'GSuite'"
                  />
                  <img
                    src="../assets/img/Exchange.png"
                    alt="outlook"
                    v-if="scope.row[col.property] == 'Exchange'"
                  />
                  <span class="ml-2">{{scope.row[col.property]}}</span>
                </span>
                <span v-else></span>
              </template>
            </el-table-column>

            <el-table-column
              v-for="(col, ind) of columns"
              :key="col.property + ind"
              v-if="col.type === 'status' && col.show"
              :sortable="col.sortable"
              :prop="col.property"
              :fixed="col.fixed"
              :label="col.label"
              :align="col.align"
              :width="col.width || ''"
              :minWidth="col.minWidth || ''"
            >
              <template slot-scope="scope">
                <template v-if="col.hasTooltip">
                  <v-tooltip bottom opacity="1">
                    <template v-slot:activator="{on}">
                      <v-btn
                        v-on="on"
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
                  ]"
                        block
                        rounded
                        v-if="scope.row && scope.row[col.property]"
                      >{{ scope.row.status }}
                      </v-btn>
                      <span v-else>Empty</span>
                    </template>
                    <span class="tooltip-span">{{scope.row.status}}</span>
                  </v-tooltip>
                </template>
                <template v-else>
                  <v-btn
                    v-on="on"
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
                  ]"
                    block
                    rounded
                    v-if="scope.row && scope.row[col.property]"
                  >{{ scope.row.status }}
                  </v-btn>
                  <span v-else>Empty</span>
                </template>

              </template>
            </el-table-column>
            <el-table-column
              v-if="rowActions && rowActions.length > 2"
              :fixed="actionFixed"
              label="Actions"
              align="right"
              width="120"
              min-width="30"
            >
              <template slot-scope="scope">
                <v-btn
                  icon
                  class="btn-hover"
                  @click="handleEdit(scope.row)"
                  v-if="rowActions[0].action === 'edit'"
                >
                  <v-icon>{{ rowActions[0].icon }}</v-icon>
                </v-btn>
                <v-btn
                  icon
                  class="btn-hover"
                  @click="rowAct(rowActions[0].action, scope.row)"
                  v-else
                >
                  <v-icon>{{ rowActions[0].icon }}</v-icon>
                </v-btn>
                <v-menu offset-y transition="scale-transition">
                  <template v-slot:activator="{ on }">
                    <v-btn icon class="btn-hover" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list class="v-cart-dropdown-list">
                    <v-list-item
                      v-for="(act, ind) of rowActions"
                      :key="ind"
                      v-if="!act.subElements"
                      class="sub-menu-el"
                    >
                      <v-list-item-title @click="rowAct(act.action, scope.row)">
                        <v-icon class="pr-3">{{ act.icon }}</v-icon>
                        <span>{{ act.name }}</span>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-for="(act, ind) of rowActions"
                      :key="ind + 'sub-item'"
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
                          <v-list-item v-for="(item, ind) of act.subElements" :key="ind">
                            {{
                            item
                            }}
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </el-table-column>
            <el-table-column
              v-if="rowActions && rowActions.length === 1"
              :fixed="actionFixed"
              label="Actions"
              align="center"
              width="120"
              min-width="30"

            >
              <template slot-scope="scope">
                <v-btn
                  @click.native="rowAct(rowActions[0].action, scope.row)"
                  icon
                  class="btn-hover"
                >
                  <v-icon>{{ rowActions[0].icon }}</v-icon>
                </v-btn>
              </template>
            </el-table-column>
            <el-table-column
              v-if="rowActions && rowActions.length === 2"
              :fixed="actionFixed"
              label="Actions"
              align="right"
              width="120"
              min-width="30"

            >
              <template slot-scope="scope">
                <v-btn
                  @click.native="rowAct(rowActions[0].action, scope.row)"
                  icon
                  class="btn-hover"
                >
                  <v-icon>{{ rowActions[0].icon }}</v-icon>
                </v-btn>
                <v-btn
                  :disabled="scope.row.status == 'Cancelled' || scope.row.status == 'Expired' || scope.row.status == 'Finished' || scope.row.status == 'NoMatch'"
                  @click.native="rowAct(rowActions[1].action, scope.row)"
                  icon
                  class="btn-hover"
                >
                  <v-icon>{{ rowActions[1].icon }}</v-icon>
                </v-btn>
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
        <div v-else class="empty-table">
          <div class="empty-inline">
            <h2>{{ empty.message }}</h2>
            <p>{{ empty.subMes }}</p>
            <v-btn class="empty-btn" v-if="empty.btn" @click="onEmptyBtnClicked">
              <!-- empty action -->
              <v-icon class="mr-2">{{ empty.icon }}</v-icon>
              {{ empty.btn }}
            </v-btn>
          </div>
        </div>
      </div>
      <div class="pagination block" v-if="pageSizes.length">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="pageSizes || [5, 10, 20, 50, 100]"
          :page-size="countRow || rowCount"
          layout="total, sizes, prev, pager, next"
          :total="initialData.length"
          style="font-family: 'Open Sans', sans-serif !important;"
        ></el-pagination>
      </div>
    </v-card>
  </div>
</template>
<script>
  import Vue from "vue";

  window.Vue = Vue;
  import ElementUI from "element-ui";
  import "element-ui/lib/theme-chalk/index.css";
  import locale from "element-ui/lib/locale/lang/en";
  import VueApexCharts from "vue-apexcharts";

  Vue.use(ElementUI, {locale});
  import printJS from "print-js";

  export default {
    components: {
      apexchart: VueApexCharts
    },
    props: {
      columns: {
        type: Array,
        required: true
      },
      rowActionsMinWidth: {
        type: Number,
        default: 60,
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
        required: false,
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
        default: true,

      }
    },
    data() {
      return {
        initialData: [],
        tableData: [],
        rowCount: 10,
        totalCount: 100,
        currentPage: 1,
        multipleSelection: [],
        selectionCheckbox: false,
        selectionAll: false,
        series: [44, 55, 13, 43],
        search: "",
        isSettingsOpened: false,
        isWantToDownload: false,
        isWantToAddUsers: false,
        isWantToEditRow: false,
        editMode: false,
        firstColFixed: true,
        lastColFixed: true,
        download: {
          xls: false,
          csv: false,
          pdf: false
        },
        downloadType: "PDF",
        actionFixed: "right",
        allHidden: false,
        printObj: {
          id: "table-container",
          popTitle: "Datatable Print",
          extraCss:
            "https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css",
          extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
        },
        clusterChevron: false
      };
    },
    watch: {
      tableData(data) {
        if (!this.tableData || this.tableData.length === 0) return [];
        else return data;
      },
      firstColFixed(val) {
        if (!val) {
          const fixedCol = this.columns.filter(c => c.fixed === "left");
          if (fixedCol && fixedCol.length) {
            fixedCol[0].fixed = false;
            this.firstColFixed = false;
          }
        } else {
          const disabledCol = this.columns.filter(c => c.fixed === false);
          disabledCol[0].fixed = "left";
          this.firstColFixed = true;
        }
      },
      lastColFixed(val) {
        if (!val) {
          this.actionFixed = false;
        } else {
          this.actionFixed = "right";
        }
      },
      multipleSelection(selecteds) {
        if (this.countRow && this.countRow == selecteds.length) {
          this.selectionCheckbox = true;
        } else if (this.rowCount && this.rowCount == selecteds.length) {
          this.selectionCheckbox = true;
        } else {
          this.selectionCheckbox = false;
        }
      },
      columns: {
        deep: true,
        handler(val) {
          if (!val.some(col => col.show)) this.allHidden = true;
          else this.allHidden = false;
        }
      }
    },
    created() {
      if (this.table && this.table.length) {
        this.initialData = this.table;
        this.tableData = this.table;
      }
      this.tableData = this.tableData.slice(0, this.countRow || this.rowCount);
      if (this.countRow) this.rowCount = this.countRow;
    },
    mounted() {
      if (window.outerWidth < 1023) {
        this.actionFixed = false;
        const leftFixed = this.columns.filter(col => col.fixed === "left");
        if (leftFixed && leftFixed.length) {
          leftFixed[0].fixed = false;
          this.firstColFixed = false;
        }
        const rightFixed = this.columns.filter(col => col.fixed === "right");
        if (rightFixed && rightFixed.length) {
          rightFixed[0].fixed = false;
        }
        this.lastColFixed = false;
        this.actionFixed = false;
      }
    },

    methods: {
      addUsersAction(actionName, row) {
        switch (actionName) {
          case "createCommunityFromMobileInfo":
            this.$emit("createCommunityFromMobileInfo", true);
            break;
          case "stopInvestigationFunc":
            this.$emit("stopInvestigationFunc", row);
            break;
          case "investigationDetails":
            this.$emit("investigationDetails", row);
            break;
          case "deleteInvestigationDetails":
            this.$emit("deleteInvestigationDetailsFunction", row);
            break;
          case "deleteAndNotifyInvestigationDetails":
            this.$emit("deleteAndNotifyInvestigationDetailsFunction", row);
            break;
          case "sendWarningMessage":
            this.$emit("sendInvestigationdetailsWarningMessage", row);
            break;
          default:
            break;
        }
      },
      addButtonFunction(action, row) {
        this.$emit(action, row)
      },
      tableRowClassName(row) {
        if (this.multipleSelection.some(r => r.id === row.row.id)) {
          return "selected-row";
        }
        return ""
      },
      handleSelectionChange(val) {
        if (this.currentPage === 1) {
          this.multipleSelection = val;
        } else {
          this.multipleSelection.push(val);
        }
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      handleSizeChange(rows) {
        this.rowCount = rows;
        if (this.currentPage === 1) {
          this.tableData = this.initialData.slice(0, rows);
        } else {
          this.tableData = this.initialData.slice(
            (this.currentPage - 1) * rows,
            this.currentPage * rows
          );
        }
      },
      handleCurrentChange(pageNum) {
        this.currentPage = pageNum;
        if (pageNum === 1) {
          this.tableData = this.initialData.slice(0, this.rowCount);
        } else {
          this.tableData = this.initialData.slice(
            (pageNum - 1) * this.rowCount,
            pageNum * this.rowCount
          );
        }
      },
      onEmptyBtnClicked(e) {
        this.$emit('onEmptyBtnClicked', e)
      },
      downloadEvent(e) {
        this.$emit("downloadEvent", this.downloadType)
      },
      toggleAll() {
        this.$refs.elTableRef.toggleAllSelection();
      },
      rowAct(action, row, multiSelection, tableData) {
        switch (action) {
          case "details":
            this.$router.push("/analysis-details");
            break;
          case "stopInvestigationFunc":
            this.$emit("stopInvestigationFunc", {row});
            break;
          case "investigationDetails":
            this.$emit("investigationDetails", {row});
            break;
          case "deleteInvestigationDetails":
            this.$emit(
              "deleteInvestigationDetailsFunction",
              this.multipleSelection.length > 0 ? this.multipleSelection : row
            );
            break;
          case "deleteAndNotifyInvestigationDetails":
            this.$emit(
              "deleteAndNotifyInvestigationDetailsFunction",
              this.multipleSelection.length > 0 ? this.multipleSelection : row
            );
            break;
          case "sendWarningMessage":
            this.$emit(
              "sendInvestigationdetailsWarningMessage",
              this.multipleSelection.length > 0 ? this.multipleSelection : row
            );
            break;
          default:
            this.$emit(action, this.multipleSelection.length > 0 ? this.multipleSelection : row)
            return false;
        }
      },
      printMethod() {
        printJS("table-container", "html");
      },
      addRow() {
        // Do something
      },
      clusterSelected(name, ind) {
        this.clusterItems[ind].selected = !this.clusterItems[ind].selected;
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
        let text = ""
        selections.forEach((item, index) => {
          headerKeys.forEach((a, i) => {
            if (!item[a]) item[a] = "Empty";
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
          text += "\n"
        })

        const getHeader = headerText.reduce((acc, item, index) => {
          acc += item
          for (let i = 0; i < columnsLength[index]; i++) {
            acc += "\xa0"
          }
          return acc
        }, "")

        navigator.clipboard.writeText(text)
      },
      handleEdit(selections) {
        if (typeof selections === "object" && !this.multipleSelection.length) {
          this.multipleSelection.push(selections);
        }
        // Edit actions should handle here.
        // selections property is an array and has the selected row object data
        if (selections) {
          this.isWantToEditRow = true;
        } else {
          // Nothing selected
        }
      },
      handleDelete(selections) {
        switch (this.refName) {
          case "investigationDetailsListTable":
            this.$emit(
              "deleteInvestigationDetailsFunction",
              selections
            );
            break;

          default:
            break;
        }
        // You should handle the Delete row action in here
      },
      handleWarning(selections) {
        this.rowAct("sendWarningMessage", selections)
      },
      handleDeleteAndNotify(selections) {
        this.rowAct("deleteAndNotifyInvestigationDetails", selections)
      },
      handleDownload(selections) {
        // You should handle the Download row action in here
      },
      multipleValues(key, val) {
        // This method controls whether selected items has same value or not
        if (this.multipleSelection && this.multipleSelection.length > 1) {
          const refThis = this;
          for (let a = 0; a < this.multipleSelection.length - 1; a++) {
            let el = this.multipleSelection[a];
            if (el[key] === refThis.multipleSelection[a + 1][key]) {
              return false;
            } else {
              return true;
            }
          }
        }
      },
      closeEditPopup() {
        this.editMode = false;
        this.isWantToEditRow = false;
        this.multipleSelection = [];
      },
      saveEditedOnes() {
        // After user edited the row and pressed SAVE button
        this.editMode = false;
        this.isWantToEditRow = false;
        this.multipleSelection = [];
      },
      loadWithDataArray(data) {
        this.initialData = data
        this.tableData = data.slice(0, this.countRow || this.rowCount)
      },
      getChartSummary(property, seperator = "/") {
        return property.join(seperator)
      }
    }
  };
</script>
<style lang="scss" scoped>
  .external-data {
    position: absolute;
    right: 0px;
    top: 10px;
    border-radius: 4px;
    background-color: #2196f3;
    color: #ffffff;
    width: 26px;
    height: 25px;
    justify-content: center;
    align-items: center;
    display: flex;
    cursor: default;
    z-index: 10;
  }

  .service-icon-content {
    img {
      max-width: 16px;
      max-height: 16px;
    }
  }

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
        font-family: "Open Sans", sans-serif !important;
        border-radius: 12px;
        box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2),
        0 1px 1px 0 rgba(243, 243, 243, 0.14),
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
          box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2),
          0 1px 1px 0 rgba(243, 243, 243, 0.14),
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
              font-family: "Open Sans", sans-serif !important;
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
                padding-bottom: 6px;

                ::v-deep .v-input__slot {
                  box-shadow: unset !important;
                  border: 1px solid rgba(205, 205, 205, 0.5);
                  border-radius: 8px !important;
                }

                ::v-deep
                .v-text-field.v-text-field--solo.v-input--dense
                > .v-input__control {
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
                font-family: "Open Sans", sans-serif !important;
                font-size: 12px;
                font-weight: 600;
              }

              span {
                max-width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: block;
                overflow: hidden;
                font-family: "Open Sans", sans-serif !important;
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
                  font-family: "Open Sans", sans-serif !important;
                  font-size: 12px;
                  font-weight: 600;
                  font-stretch: normal;
                  font-style: normal;
                  line-height: normal;
                  letter-spacing: normal;
                  color: rgba(0, 0, 0, 0.87);
                }

                span {
                  font-family: "Open Sans", sans-serif !important;
                  font-size: 14px;
                  color: rgba(0, 0, 0, 0.87);
                }
              }
            }
          }

          .sub-header {
            display: block;
            font-family: "Open Sans", sans-serif !important;
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
          border-bottom: 1px solid #b3d4fc;
          border-top: 1px solid transparent;
          padding: 2px 0 !important;
          height: 45px !important;

          border: none !important;
          /* &.date-format {
            text-align: left !important;
          }*/
        }

        ::v-deep .el-table th {
          border-bottom: 1px solid #9e9e9e;
          padding: 5px 0 !important;

          .el-checkbox {
            z-index: 99999;
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
          font-family: "Open Sans", sans-serif !important;
          font-size: 14px;
          white-space: nowrap !important;
          width: 100%;
        }

        ::v-deep .el-table th > .cell {
          font-family: "Open Sans", sans-serif !important;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.3rem;
          color: #000000;
          min-height: 21px;

          .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: #2196f3;
            border-color: #2196f3 !important;
          }

          .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: #2196f3;
            border-color: #2196f3 !important;
          }

          .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
            content: "";
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

        ::v-deep .v-progress-linear {
          margin-bottom: 7px !important;
          margin-top: 5px !important;
        }

        .progress-per {
          font-family: "Open Sans", sans-serif !important;
          font-size: 10px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.9;
          letter-spacing: normal;
          text-align: center;
          color: rgba(0, 0, 0, 0.87);
        }

        .btn-status {
          border-radius: 18px !important;
          box-shadow: unset !important;
          color: #fff;
          font-family: "Open Sans", sans-serif !important;
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
          background-color: #757575;
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
          z-index: 9;

          .selection-span {
            font-family: "Open Sans", sans-serif;
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
            width: 60%;

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
            font-family: "Open Sans", sans-serif;
            font-size: 13px !important;
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
        font-family: "Open Sans", sans-serif;
        font-size: 12px;
        min-width: 13px;
      }
    }
  }

  .v-tooltip__content {
    background: #6d6d6d !important;
  }

  ::v-deep .tooltip-line {
    font-size: 12px !important;
    font-family: "Open Sans", sans-serif !important;
    margin-bottom: 3px !important;
  }

  ::v-deep .k-grid td.k-state-selected,
  ::v-deep .k-grid tr.k-state-selected > td {
    background-color: rgba(0, 188, 212, 0.05) !important;
  }

  .v-list-item__subtitle {
    font-family: "Open Sans", sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2 !important;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
    margin-left: 2px;
  }

  .v-sheet {
    border-radius: 20px !important;
  }

  .v-card-headline {
    font-family: "Open Sans", sans-serif !important;
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
    font-family: "Open Sans", sans-serif !important;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: rgba(255, 255, 255, 0.87);
  }

  ::v-deep .v-sheet {
    border-radius: unset !important;
  }

  .chart__summary-text {
    margin-top: -18px;
    margin-left: 2px;
    font-family: OpenSans;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.9;
    letter-spacing: normal;
    text-align: center;
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
        font-family: "Open Sans", sans-serif !important;
        font-size: 24px;
        line-height: 1.29;
        font-weight: 400 !important;
        color: rgba(0, 0, 0, 0.87);
        padding-bottom: 16px;
        margin-bottom: 0 !important;
      }

      p {
        font-family: "Open Sans", sans-serif !important;
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

  ::v-deep .el-table [class*="el-table__row--level"] .el-table__expand-icon {
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

  ::v-deep .cluster-label {
    font-family: "Open Sans", sans-serif !important;
    font-size: 12px;
    font-weight: 600;
  }

  .cluster-span {
    padding-right: 8px;
  }

  /*.date-format {
    text-align: left !important;
    span {
      text-overflow: ellipsis;
      white-space: normal;
    }
  }*/
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
