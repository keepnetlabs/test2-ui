<template>
  <div :class="{ 'k-table__wrapper': setDatatableUI }">
    <download-modal
      :isShow="isWantToDownload"
      @downloadEvent="downloadEvent"
      @changeDownloadModalStatus="changeDownloadModalStatus"
      v-if="options"
      :title="downloadModalTitle"
    />
    <data-table-tooltip
      v-if="showOverFlowTooltip"
      :tooltipStyle="overFlowTooltipStyle"
      :content="overFlowTooltipContent"
    />
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
            <span class="settings-span">Table Settings</span>
            <v-icon @click="isSettingsOpened = false" class="close-icon">mdi-close</v-icon>
          </div>
          <div class="sub-header">Show / Hide Columns</div>
          <div
            :key="ind"
            class="popup-row"
            v-for="(col, ind) of columns"
            v-if="ind !== 0 && !col.hideOnSettingsPopup"
          >
            {{ col.label }}
            <v-switch v-model="col.show" color="#2196f3" />
          </div>
          <slot name="settings-popup-body"> </slot>
          <div class="sub-header" style="margin-top: 10px;">Freeze Columns</div>
          <div class="popup-row">
            First Column
            <v-switch v-model="firstColFixed" color="#2196f3" />
          </div>
          <div class="popup-row">
            Last Column
            <v-switch v-model="lastColFixed" color="#2196f3" />
          </div>
        </div>
        <extended-view
          v-if="isWantToEditRow"
          :value="extendedViewValue"
          :options="extendedViewOptions"
          :titleKey="titleKey"
          :container-style="extendedViewStyle"
          @handleEdit="$emit('handleEdit', $event)"
          @closeEditPopup="closeEditPopup"
        >
          <template v-slot:body>
            <slot name="extended-view-slot" :scope="multipleSelection"> </slot>
          </template>
          <template v-slot:footer>
            <slot name="extended-view-footer" :scope="multipleSelection"> </slot>
          </template>
        </extended-view>
        <slot name="extended-custom-view-slot"> </slot>
        <div class="table-header" v-if="options" :class="getTableHeaderClass">
          <div class="table-search" v-if="filterable">
            <v-text-field
              @mouseover.native="hover = true"
              class="filter-field"
              placeholder="Search"
              outlined
              prepend-inner-icon="mdi-magnify"
              v-model="search"
              ref="searchInput"
              @keyup="searchChangedEvent"
            />
          </div>
          <div class="table-settings" v-if="options" v-once>
            <v-btn
              class="clust-btn btn-hover mr-2"
              color="#2196f3"
              icon
              outlined
              style="border-radius: 6px !important; order: 1;"
              v-if="groupable"
            >
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-btn>
            <v-btn
              class="clust-btn cluster-btn btn-hover mr-4"
              color="white"
              icon
              style="border-radius: 6px !important; order: 2;"
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
              <span class="tooltip-span">{{ (addUsers && addUsers.tooltip) || 'Add' }}</span>
            </v-tooltip>

            <slot name="addUsers">
              <v-tooltip bottom opacity="1">
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="btn-add mr-1"
                    icon
                    style="order: 3;"
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
            <v-menu bottom left offset-y v-if="isDownloadable">
              <template v-slot:activator="{ on: menu, attrs }">
                <v-tooltip bottom opacity="1">
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                      class="btn-hover mr-1"
                      icon
                      style="order: 4;"
                      v-bind="attrs"
                      v-on="{ ...tooltip, ...menu }"
                    >
                      <v-icon>mdi-download</v-icon>
                    </v-btn>
                  </template>
                  <span class="tooltip-span">Download Options</span>
                </v-tooltip>
              </template>
              <v-list-item
                v-for="(item, index) in downloadButtonOptions"
                :key="index"
                @click="handleDownloadButtonClick(item)"
              >
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item>
            </v-menu>

            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn class="btn-hover mr-1" icon v-on="on" style="order: 5;">
                  <v-icon @click="printMethod()">mdi-printer</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Print Options</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="isSettingsOpened = true"
                  class="btn-hover mr-1"
                  icon
                  v-on="on"
                  style="order: 6;"
                >
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
                  @click="handleMultipleSelectedEdits"
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
            :cell-class-name="setCellClass"
            :data="showfilteredData ? filteredData : tableData"
            :default-sort="{ prop: defaultSort || '', order: defaultSort || '' }"
            :highlight-current-row="false"
            :row-class-name="tableRowClassName"
            :show-header="showHeader"
            @cell-mouse-enter="cellEnter"
            @cell-mouse-leave="cellLeave"
            @selection-change="handleSelectionChange"
            @sort-change="sortChangedEvent"
            @cell-click="cellClick"
            default-expand-all
            id="data-table-container"
            lazy
            ref="elTableRef"
            row-key="id"
            style="width: 100%;"
            v-if="!allHidden"
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
              :sortable="col.hideSort ? false : 'custom'"
              :width="col.width || ''"
              v-for="(col, ind) of columns"
              v-if="col.show"
            >
              <template slot-scope="scope">
                <data-table-text :col="col" :scope="scope" v-if="col.type === 'text'" />
                <data-table-colorful-text
                  :col="col"
                  :scope="scope"
                  v-if="col.type === 'colorfulText'"
                  :text="getDataTableFieldLabel(scope.row[col.property])"
                />
                <div v-if="col.type === 'textWithBadge'">
                  <datatable-text-with-badge :scope="scope" :col="col" />
                </div>

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
                <data-table-link :col="col" :scope="scope" v-if="col.type === 'link'" />
                <div v-if="col.type === 'badge'">
                  <v-tooltip bottom v-if="scope.row && scope.row[col.property]">
                    <template v-slot:activator="{ on }">
                      <badge
                        :color="getBtnStatusColor(scope.row[col.property])"
                        :listeners="on"
                        :full-width="col.fullWidth"
                        v-bind="col.props"
                        :text="getDataTableFieldLabel(scope.row[col.property])"
                      />
                    </template>
                    <span class="tooltip-span">
                      <slot name="status-tooltip-text" :scope="scope" :col="col">
                        {{ scope.row[col.property] }}
                      </slot>
                    </span>
                  </v-tooltip>
                  <span v-else>
                    {{ col.emptyText || '' }}
                  </span>
                </div>
                <div v-if="col.type === 'smallBadge'">
                  <data-table-small-badge :scope="scope" :col="col" />
                </div>
                <div v-if="col.type === 'status'">
                  <v-tooltip bottom v-if="scope.row && scope.row['status']">
                    <template v-slot:activator="{ on }">
                      <badge
                        :color="getBtnStatusColor(scope.row[col.property])"
                        :listeners="on"
                        :full-width="col.fullWidth"
                        v-bind="col.props"
                        :text="getDataTableFieldLabel(scope.row.status)"
                      />
                    </template>
                    <span class="tooltip-span">
                      <slot name="status-tooltip-text" :scope="scope" :col="col">
                        {{ scope.row.status }}
                      </slot>
                    </span>
                  </v-tooltip>
                  <span v-else>
                    {{ col.emptyText || '' }}
                  </span>
                </div>
                <div v-if="col.type === 'priority'">
                  <v-tooltip bottom opacity="1" v-if="scope.row && scope.row['priority']">
                    <template v-slot:activator="{ on }">
                      <badge
                        :color="getBtnPriorityColor(scope.row[col.property])"
                        :listeners="on"
                        :full-width="col.fullWidth"
                        :text="getDataTableFieldLabel(scope.row.priority)"
                      />
                    </template>
                    <span class="tooltip-span">{{ scope.row.priority }}</span>
                  </v-tooltip>
                  <span v-else>
                    {{ col.emptyText || '' }}
                  </span>
                </div>
                <div v-if="col.type === 'popup'">
                  <slot name="datatable-column-popup" :col="col" :scope="scope"></slot>
                </div>
                <div v-if="col.type === 'slot' || col.type === 'analysisSource'">
                  <slot name="datatable-custom-column" :scope="scope" :col="col"></slot>
                </div>
              </template>

              <template v-slot:header="{ column, $index }">
                <v-tooltip bottom v-if="col.showHeaderTooltip">
                  <template v-slot:activator="{ on }">
                    <span v-on="on">{{ column.label }}</span>
                  </template>
                  <span>{{ col.headerTooltip }}</span>
                </v-tooltip>
                <template v-else>
                  {{ column.label }}
                </template>

                <data-table-filter
                  :column="column"
                  :filterableType="col.filterableType"
                  :filterableItems="col.filterableItems"
                  :index="$index"
                  @handleFilterColumn="handleFilterColumn"
                  @handleClearColumnFilter="handleClearColumnFilter"
                />
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
                <slot name="datatable-row-actions" :scope="scope">
                  <template v-if="rowActions[0].action === 'edit'">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          @click="handleEdit(scope.row, scope.$index)"
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
                  <template v-else>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          @click="rowAct(rowActions[0].action, scope.row, scope)"
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
                  <v-menu
                    bottom
                    left
                    offset-y
                    transition="scale-transition"
                    :value="isRowActionsMenuOpen[scope.$index]"
                    :return-value="isRowActionsMenuOpen[scope.$index]"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn class="btn-hover" icon v-on="on">
                        <v-icon @click.native="selectedMenuIndex = scope.$index"
                          >mdi-dots-vertical</v-icon
                        >
                      </v-btn>
                    </template>
                    <v-list class="v-cart-dropdown-list el-table__action-buttons">
                      <v-list-item
                        :key="ind"
                        class="sub-menu-el"
                        v-for="(act, ind) of rowActions"
                        v-if="!act.subElements && !act.isNotShow"
                      >
                        <v-list-item-title @click="rowAct(act.action, scope.row, scope)">
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
                </slot>
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
                      @click.native="rowAct(rowActions[0].action, scope.row, scope)"
                      class="btn-hover"
                      icon
                      v-on="on"
                    >
                      <v-icon :class="rowActions[0].className">{{ rowActions[0].icon }}</v-icon>
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
      <div
        class="pagination block"
        v-if="pageSizes.length && tableData.length > 0 && !filteredData.length"
      >
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="countRow || rowCount"
          :page-sizes="pageSizes || [5, 10, 20, 50, 100]"
          :total="dataLength || initialData.length"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next"
        >
        </el-pagination>
      </div>
      <div class="pagination block" v-if="!!filteredData.length">
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="filteredData.length"
          :page-sizes="pageSizes || [5, 10, 20, 50, 100]"
          :total="filteredData.length"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next"
        >
        </el-pagination>
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
import DataTableLink from './DataTableComponents/DataTableLink'
import DataTableTooltip from './DataTableComponents/DataTableTooltip'
import DownloadModal from './DataTableComponents/DownloadModal'
import Badge from './Badge'
import ExtendedView from './ExtendedView'
import DataTableSmallBadge from './DataTableComponents/DataTableSmallBadge'
import DatatableTextWithBadge from './DataTableComponents/DatatableTextWithBadge'
import DataTableFilter from './DataTableComponents/DataTableFilter'
window.Vue = Vue
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import { mapGetters } from 'vuex'

Vue.use(ElementUI, { locale })
import printJS from 'print-js'
import { getBtnPriorityColor, getBtnStatusColor, getDataTableFieldLabel } from '../utils/functions'
import DataTableColorfulText from './DataTableComponents/DataTableColorfulText'
export default {
  components: {
    DataTableFilter,
    DataTableColorfulText,
    Badge,
    DataTableText,
    DataTableAttachment,
    DataTableChart,
    DataTableArray,
    DataTableDetected,
    DataTableUserStatus,
    DataTableFiber,
    DataTableProgress,
    DataTableService,
    DataTableLink,
    DataTableTooltip,
    DownloadModal,
    ExtendedView,
    DataTableSmallBadge,
    DatatableTextWithBadge
  },
  props: {
    columns: {
      type: Array,
      required: true
    },
    extendedViewOptions: {
      type: Array,
      default() {
        return []
      }
    },
    extendedViewValue: {
      type: Array,
      default() {
        return []
      }
    },
    titleKey: {
      type: String,
      default: 'name'
    },
    cellPadding: {
      type: Number,
      default: 0
    },
    isEditableRuntime: {
      type: Boolean,
      default: false
    },
    setClassName: {
      type: Function,
      default: () => {}
    },
    editableStatusItems: {
      type: Array,
      default: () => {
        return ['Active', 'Inactive', 'N/A']
      }
    },
    isPopupDateEditable: {
      type: Boolean,
      default: true
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
    },

    showHeader: {
      type: Boolean,
      default: true
    },
    isDownloadable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters({
      isWantToDownload: 'common/getDownloadModalStatus' // for using getters
    }),
    getTableHeaderClass() {
      return this.tableData.length === 0 && 'table-header-disable'
    }
  },
  data() {
    return {
      setDatatableUI: false,
      filteredData: [],
      showfilteredData: false,
      initialData: [],
      dataLength: 0,
      tableData: [],
      rowCount: 10,
      totalCount: 100,
      extendedViewStyle: null,
      currentPage: 1,
      multipleSelection: [],
      selectionCheckbox: false,
      selectionAll: false,
      series: [44, 55, 13, 43],
      search: '',
      downloadModalTitle: '',
      isSettingsOpened: false,
      isWantToAddUsers: false,
      isWantToEditRow: false,
      selectedMenuIndex: null,
      firstColFixed: true,
      overFlowTooltipContent: '',
      overFlowTooltipStyle: {},
      lastColFixed: true,
      isRowActionsMenuOpen: [],
      download: {
        xls: false,
        csv: false,
        pdf: false
      },
      showOverFlowTooltip: false,
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
      downloadButtonOptions: ['Download Current Page', 'Download All'],
      selectionRowCheckboxDeterminate: false
    }
  },
  watch: {
    tableData(data) {
      if (!this.tableData || this.tableData.length === 0) return []
      else return data
    },
    isRowActionsMenuOpen(val) {},
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
      this.$emit('onEditClick', { selected: selecteds, isEditPopupOpen: this.isWantToEditRow })
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
    //this.extendedViewOptions = this.columns

    this.tableData = this.tableData.slice(0, this.countRow || this.rowCount)
    if (this.countRow) this.rowCount = this.countRow
    const browser = navigator.userAgent.toLowerCase()
    if (browser.indexOf('safari') != -1) {
      if (browser.indexOf('chrome') > -1) {
        this.setDatatableUI = true
      }
    }
  },
  updated() {
    if (this.init) {
      this.init = false
    }
  },
  mounted() {
    this.init = true
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
    const _this = this
    setTimeout(function () {
      _this.setDatatableUI = true
    }, 1)
  },

  methods: {
    handleDownloadButtonClick(item) {
      this.downloadModalTitle = item
      this.changeDownloadModalStatus(true)
    },
    handleMultipleSelectedEdits() {
      this.extendedViewStyle = {
        top: `${48}px`
      }
      this.$emit('onEditClick', {
        selected: this.multipleSelection,
        isEditPopupOpen: true
      })
      this.isWantToEditRow = true
    },
    setCellClass(obj) {
      /*
      const classNames = this.setClassName(obj)
      return classNames
      */
    },
    closeEditPopup() {
      this.isWantToEditRow = false
      this.$refs.elTableRef.clearSelection()
      this.multipleSelection = []
    },

    getBtnStatusColor(type) {
      return getBtnStatusColor(type)
    },
    getBtnPriorityColor(type) {
      return getBtnPriorityColor(type)
    },
    getDataTableFieldLabel(field) {
      return getDataTableFieldLabel(field)
    },
    cellEnter(row, column, cell, event) {
      this.hasOverflowTooltip(row, column, cell)
    },
    cellClick(row, column, event) {
      this.$emit('cellClick', { row, column, event })
    },
    cellLeave(row, column, cell, event) {
      this.showOverFlowTooltip = false
    },
    hasOverflowTooltip(row, column, cell) {
      const parentRect = cell.getBoundingClientRect()
      const widthOfParent = parentRect.width
      const span =
        cell.querySelector('span') ||
        cell.querySelector('.datatable-chart__empty') ||
        cell.querySelector('.datatable-progress') ||
        cell.querySelector('div')
      const spanWidth = span.getBoundingClientRect().width + 15 + this.cellPadding
      if (spanWidth > widthOfParent) {
        this.showOverFlowTooltip = true
        const typeOfProp = typeof row[column.property]
        let text
        switch (typeOfProp) {
          case 'object':
            text = row[column.property].join(',')
            break
          case 'string':
            text = row[column.property]
            break
          default:
            break
        }
        this.overFlowTooltipContent = text
        this.overFlowTooltipStyle = {
          top: `${parentRect.top + 60}px`,
          left: `${parentRect.left + this.cellPadding}px`
        }
      }
    },
    sortChangedEvent(sortProps) {
      if (this.isServerSide) {
        this.$emit('sortChangedEvent', sortProps)
      } else {
        if (this.filteredData.length) {
          this.filteredData = this.sortFunction(this.filteredData, sortProps)
          return this.filteredData
        } else {
          const data = this.sortFunction(this.initialData, sortProps)
          this.tableData = data.slice(
            (this.currentPage - 1) * this.rowCount,
            this.currentPage * this.rowCount
          )
          return this.tableData
        }
      }
    },

    sortFunction(data, sortProps) {
      const isDate = function () {
        const isDate = data.reduce((acc, item) => {
          acc.push(
            new Date(item[sortProps.prop]) !== 'Invalid Date' &&
              !isNaN(new Date(item[sortProps.prop]))
          )
          return acc
        }, [])
        return isDate.includes(false)
      }
      let sortData = []
      if (!isDate()) {
        sortData = data.sort(function (a, b) {
          if (sortProps.order === 'descending' && sortProps.prop) {
            return new Date(b[sortProps.prop]) - new Date(a[sortProps.prop])
          } else {
            return new Date(a[sortProps.prop]) - new Date(b[sortProps.prop])
          }
        })
      } else {
        sortData = data.sort(function (a, b) {
          if (typeof a[sortProps.prop] === 'string' || typeof b[sortProps.prop] === 'string') {
            const aProp = String(a[sortProps.prop])
            const bProp = String(b[sortProps.prop])
            if (aProp === bProp) {
              return 0
            }
            // nulls sort after anything else
            else if (aProp === 'null') {
              return 1
            } else if (bProp === 'null') {
              return -1
            }

            // otherwise, if we're ascending, lowest sorts first
            else if (sortProps.order === 'ascending') {
              if (
                aProp.charAt(0) !== bProp.charAt(0) &&
                aProp.charAt(0) === bProp.charAt(0).toUpperCase()
              ) {
                return -1
              } else if (
                aProp.charAt(0) !== bProp.charAt(0) &&
                bProp.charAt(0) === aProp.charAt(0).toUpperCase()
              ) {
                return 1
              }
              return aProp.toLowerCase() < bProp.toLowerCase() ? -1 : 1
            }
            // if descending, highest sorts first
            else {
              if (
                aProp.charAt(0) !== bProp.charAt(0) &&
                aProp.charAt(0) === bProp.charAt(0).toUpperCase()
              ) {
                return 1
              } else if (
                aProp.charAt(0) !== bProp.charAt(0) &&
                bProp.charAt(0) === aProp.charAt(0).toUpperCase()
              ) {
                return -1
              }
              return aProp.toLowerCase() < bProp.toLowerCase() ? 1 : -1
            }
          } else {
            if (a[sortProps.prop] === b[sortProps.prop]) {
              return 0
            }
            // nulls sort after anything else
            else if (a[sortProps.prop] === null) {
              return 1
            } else if (b[sortProps.prop] === null) {
              return -1
            }
            // otherwise, if we're ascending, lowest sorts first
            else if (sortProps.order === 'ascending') {
              return a[sortProps.prop] < b[sortProps.prop] ? -1 : 1
            }
            // if descending, highest sorts first
            else {
              return a[sortProps.prop] < b[sortProps.prop] ? 1 : -1
            }
          }
        })
      }

      return sortData
    },

    paginationChangedEvent(paginationProps) {
      if (this.isServerSide) this.$emit('paginationChangedEvent', paginationProps)
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
        this.filteredData = this.initialData.reduce((acc, item) => {
          const data = Object.values(item).find((i) => {
            if (
              typeof i === 'string' &&
              i.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
            )
              return acc.push(item)
          })
          return acc
        }, [])
        if (!this.showfilteredData) this.filteredData = []
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
      this.multipleSelection = val
      if (this.multipleSelection.length === 0) {
        this.isWantToEditRow = false
      }
      this.$emit('handleSelectionChange', val)
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
          const temp =
            this.initialData.slice((this.currentPage - 1) * rows, this.currentPage * rows) || []
          this.tableData = temp.length === 0 ? [{}] : temp
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
    downloadEvent(downloadTypes) {
      this.$emit('downloadEvent', {
        exportTypes: downloadTypes,
        pageNumber: this.currentPage,
        pageSize: this.rowCount || this.countRow,
        reportAllPages: this.downloadModalTitle === this.downloadButtonOptions[1] ? true : false
      })
    },
    handleSubMenuItemClick(item) {
      this.$emit('submenuItemClick', item)
    },
    toggleAll() {
      this.$refs.elTableRef.toggleAllSelection()
    },
    rowAct(action, row, scope, tableData) {
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
        case 'syncUser':
          this.$emit('syncUser', scope)
          break
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

      let columnsLength = []
      let text = ''
      let selectionsCopy = JSON.parse(JSON.stringify(selections))
      selectionsCopy.forEach((item, index) => {
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
    handleEdit(selections, index) {
      if (index > -1) {
        this.extendedViewStyle = {
          top: `${index * 48}px`
        }
      }
      if (typeof selections === 'object' && !this.multipleSelection.length) {
        this.multipleSelection.push(selections)
      }

      // Edit actions should handle here.
      // selections property is an array and has the selected row object data
      if (selections) {
        this.$refs.elTableRef.toggleRowSelection(selections, true)
        let tempArray = []
        if (selections.constructor.name !== 'Array') {
          tempArray.push(selections)
        } else {
          tempArray = selections
        }
        this.$emit('onEditClick', {
          selected: tempArray,
          isEditPopupOpen: true
        })
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
        case 'rulesListTable':
          this.$emit('deleteFunction', selections)
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
    handleDownload(downloadTypes) {
      // You should handle the Download row action in here
    },
    loadWithDataArray(data, responseParams) {
      this.initialData = data
      this.dataLength = responseParams && responseParams.totalNumberOfRecords
      this.tableData =
        (data &&
          data.slice((this.currentPage - 1) * this.rowCount, this.currentPage * this.rowCount)) ||
        []
    },
    handleFilterColumn(filterObj) {
      const { column, filterValue, filteredSelectValue } = filterObj
      this.$emit('columnFilterChanged', filterObj)
    },
    handleClearColumnFilter(fieldName) {
      this.$emit('columnFilterCleared', fieldName)
    }
  }
}
</script>

<style lang="scss"></style>
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
