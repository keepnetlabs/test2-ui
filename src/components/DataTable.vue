<template>
  <div class="k-table__wrapper" :id="id">
    <DatatableLoading :loading="loading" />
    <download-modal
      :isShow="isWantToDownload"
      @downloadEvent="downloadEvent"
      @changeDownloadModalStatus="changeDownloadModalStatus"
      v-if="options && isDownloadable && isWantToDownload"
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

    <v-card v-show="!loading" class="card">
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
        <div class="settings-popup" v-show="isSettingsOpened" :style="settingsPopupStyle">
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
            <v-switch v-model="col.show" color="#2196f3" @change="$forceUpdate()" />
          </div>
          <slot name="settings-popup-body"></slot>
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
          v-if="isWantToEditRow || isExtendedViewCreateMode"
          :value="extendedViewValue"
          :create-mode="isExtendedViewCreateMode"
          @closeCreateMode="$emit('closeCreateMode')"
          :options="extendedViewOptions"
          :container-style="extendedViewStyle"
          @handleEdit="$emit('handleEdit', $event)"
          :disable-transition="disableExtendedViewTransition"
          @closeEditPopup="closeEditPopup"
        >
          <template v-slot:body>
            <slot name="extended-view-slot" :scope="multipleSelection"></slot>
          </template>
          <template v-slot:footer>
            <slot name="extended-view-footer" :scope="multipleSelection"></slot>
          </template>
        </extended-view>
        <slot name="extended-custom-view-slot"></slot>
        <div class="table-header" v-if="options" :class="getTableHeaderClass">
          <div class="table-search" v-if="filterable">
            <v-text-field
              class="filter-field"
              placeholder="Search"
              outlined
              prepend-inner-icon="mdi-magnify"
              v-model="search"
              ref="searchInput"
              @keyup="searchChangedEvent"
            />
          </div>
          <div class="table-settings" v-if="options">
            <v-btn
              class="clust-btn btn-hover mr-1"
              :color="!selectedCluster ? '#2196f3' : '#757575'"
              icon
              outlined
              style="border-radius: 6px !important; order: 1; width: 42px;"
              v-if="groupable"
              @click="handleListBulletedClick"
            >
              <img
                :src="
                  !selectedCluster
                    ? require(`../assets/img/selected-bulletin-list.svg`)
                    : require(`../assets/img/bulletin-list.svg`)
                "
                alt="icon"
              />
            </v-btn>
            <div
              v-if="groupable"
              class="cluster__left"
              :style="!selectedCluster && { borderColor: '#757575' }"
            >
              <img
                :src="
                  !selectedCluster
                    ? require('../assets/img/unselected-bulletin.svg')
                    : require('../assets/img/ic-grouped-list.svg')
                "
                alt="icon"
              />
            </div>
            <div
              v-if="groupable"
              class="cluster__right"
              :style="[!selectedCluster && { backgroundColor: '#757575', borderColor: '#757575' }]"
            >
              <v-menu
                bottom
                offset-y
                transition="scale-transition"
                v-model="clusterChevron"
                min-width="180"
                content-class="cluster-view"
              >
                <template v-slot:activator="{ on }">
                  <div @click="clusterChevron = !clusterChevron" v-on="on">
                    <v-icon color="white" style="margin-top: -2px; margin-left: 1px;"
                      >mdi-menu-down</v-icon
                    >
                  </div>
                </template>
                <v-list class="pt-0">
                  <v-list-item>
                    <v-list-item-title>
                      <label class="cluster-label">Cluster By</label>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    :key="item.name + key"
                    @click="clusterSelected(item.name, key)"
                    v-for="(item, key) of clusterItems"
                    :class="[isEqualCluster(item.name) && 'cluster-view--selected']"
                  >
                    <v-list-item-title>
                      <span
                        :class="[
                          'cluster-view__item',
                          isEqualCluster(item.name) && 'cluster-view__item--selected'
                        ]"
                        >{{ item.name }}</span
                      >
                      <v-icon class="ml-4 mt-n1" color="#2196f3" v-if="isEqualCluster(item.name)"
                        >mdi-check
                      </v-icon>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
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
                  <v-icon @click="addUsersAction(addUsers.action)">mdi-plus</v-icon>
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

            <v-tooltip bottom opacity="1" v-if="false">
              <template v-slot:activator="{ on }">
                <v-btn class="btn-hover mr-1" icon v-on="on" style="order: 5;">
                  <v-icon @click="printMethod()">mdi-printer</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Print Options</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1" v-once>
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="isSettingsOpened = true"
                  class="btn-hover mr-1"
                  icon
                  v-on="on"
                  style="order: 5;"
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
            @click.native="toggleAll(multipleSelection)"
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
          v-if="(tableData && tableData.length) || isColumnFilterActive"
        >
          <el-table
            :border="border"
            :cell-class-name="setCellClass"
            :data="showfilteredData ? filteredData : tableData"
            :default-sort="{ prop: defaultSort || '', order: defaultSort || '' }"
            :highlight-current-row="false"
            :row-class-name="tableRowClassName"
            :show-header="showHeader"
            :header-row-class-name="'k-table-header'"
            @cell-mouse-enter="cellEnter"
            @cell-mouse-leave="cellLeave"
            @selection-change="handleSelectionChange"
            @select="handleSelect"
            @sort-change="sortChangedEvent"
            :empty-text="empty.message"
            @select-all="handleSelectAll"
            @cell-click="cellClick"
            id="data-table-container"
            :indent="32"
            lazy
            ref="elTableRef"
            :row-key="rowKey"
            style="width: 100%;"
            v-if="!allHidden"
          >
            <el-table-column align="center" type="selection" v-if="selectable" width="48" />
            <el-table-column
              v-for="(col, ind) of columns"
              v-if="col.show"
              :key="col.property + ind"
              :align="col.align"
              :fixed="col.fixed"
              :label="col.label"
              :maxWidth="col.maxWidth || ''"
              :minWidth="col.minWidth || ''"
              :prop="col.property"
              :resizable="resizable"
              :sortable="col.hideSort ? false : 'custom'"
              :width="col.width || ''"
              reserve-selection
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
                  <badge
                    :color="getBtnStatusColor(scope.row[col.property])"
                    :full-width="col.fullWidth"
                    v-bind="col.props"
                    :col="col"
                    :text="getDataTableFieldLabel(scope.row[col.property])"
                    v-if="scope.row && scope.row[col.property]"
                  />
                  <span v-else>
                    {{ col.emptyText || '' }}
                  </span>
                </div>
                <div v-if="col.type === 'smallBadge'">
                  <data-table-small-badge :scope="scope" :col="col" />
                </div>
                <div v-if="col.type === 'status'">
                  <badge
                    :color="getBtnStatusColor(scope.row[col.property])"
                    :full-width="col.fullWidth"
                    v-bind="col.props"
                    v-if="scope.row && scope.row['status']"
                    :text="getDataTableFieldLabel(scope.row.status)"
                  />
                  <span v-else>
                    {{ col.emptyText || '' }}
                  </span>
                </div>
                <div v-if="col.type === 'priority'">
                  <badge
                    :color="getBtnPriorityColor(scope.row[col.property])"
                    :full-width="col.fullWidth"
                    :text="getDataTableFieldLabel(scope.row.priority)"
                    v-if="scope.row && scope.row['priority']"
                  />
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
                  <span>{{ col['headerTooltip'] }}</span>
                </v-tooltip>
                <template v-else>
                  {{ column.label }}
                </template>

                <data-table-filter
                  :column="column"
                  :filterableType="col.filterableType"
                  :filterableItems="col.filterableItems"
                  :filterableCustomFieldName="col.filterableCustomFieldName"
                  :index="$index"
                  @handleFilterColumn="handleFilterColumn"
                  @handleClearColumnFilter="handleClearColumnFilter"
                />
              </template>
            </el-table-column>

            <el-table-column
              :fixed="actionFixed"
              :min-width="109"
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
                      <v-btn class="btn-hover ml-1" icon v-on="on">
                        <v-icon @click.native="selectedMenuIndex = scope.$index"
                          >mdi-dots-vertical
                        </v-icon>
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
              :min-width="110"
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
              :min-width="110"
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
                      @click.native="
                        rowActions[0].action === 'edit'
                          ? handleEdit(scope.row, scope.$index)
                          : rowAct(rowActions[0].action, scope.row)
                      "
                      class="btn-hover mr-1"
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
            <slot name="empty-table-inline">
              <h2>{{ empty.message }}</h2>
              <p>{{ empty.subMes }}</p>
              <v-btn @click="onEmptyBtnClicked" class="empty-btn" v-if="empty.btn">
                <!-- empty action -->
                <v-icon class="mr-2">{{ empty.icon }}</v-icon>
                {{ empty.btn }}
              </v-btn>
            </slot>
          </div>
        </div>
      </div>
      <div
        class="pagination block"
        v-if="pageSizes.length && tableData.length > 0 && !showfilteredData"
      >
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="countRow || rowCount"
          :page-sizes="pageSizes || [5, 10, 25]"
          :total="dataLength || initialData.length"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="sizes, prev, pager, next,slot"
        >
          <template>
            <span class="el-pagination__text el-pagination__text--1">Rows per page: </span>
            <span class="el-pagination__text el-pagination__text--2">
              {{ this.currentPage === 1 ? 1 : (this.currentPage - 1) * this.rowCount + 1 }}-{{
                this.currentPage * this.rowCount > initialData.length
                  ? initialData.length
                  : this.currentPage * this.rowCount
              }}
              of
              {{ dataLength || initialData.length }}
            </span>
          </template>
        </el-pagination>
      </div>
      <div class="pagination block" v-if="showfilteredData">
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="countRow || rowCount"
          :page-sizes="pageSizes || [5, 10, 25]"
          :total="filteredDataLength"
          @current-change="handleFilteredCurrentChange"
          @size-change="handleFilteredSizeChange"
          layout="sizes, prev, pager, next,slot"
        >
          <template>
            <span class="el-pagination__text el-pagination__text--1">Rows per page: </span>
            <span class="el-pagination__text el-pagination__text--2">
              {{
                filteredDataLength === 0
                  ? '0'
                  : this.currentPage === 1
                  ? 1
                  : (this.currentPage - 1) * this.rowCount + 1
              }}-{{
                filteredDataLength === 0
                  ? '0'
                  : this.currentPage * this.rowCount > filteredDataLength
                  ? filteredDataLength
                  : this.currentPage * this.rowCount
              }}
              of
              {{ filteredDataLength }}
            </span>
          </template>
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
import { getBtnPriorityColor, getBtnStatusColor, getDataTableFieldLabel } from '@/utils/functions'
import { columnStandards } from '@/model/constants/commonConstants'
import DataTableColorfulText from './DataTableComponents/DataTableColorfulText'
import DatatableLoading from './SkeletonLoading/DatatableLoading'
import { COMMON_CONSTANTS } from '../model/constants/commonConstants'
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
    DatatableTextWithBadge,
    DatatableLoading
  },
  props: {
    columns: {
      type: Array,
      required: true
    },
    showClusterItemsRowAction: {
      type: Boolean,
      default: true
    },
    extendedViewOptions: {
      type: Object,
      default() {
        return {}
      }
    },
    disableExtendedViewTransition: {
      type: Boolean,
      default: false
    },
    resizable: {
      type: Boolean,
      default: true
    },
    rowKey: {
      type: String,
      default: 'resourceId'
    },
    isExtendedViewCreateMode: {
      type: Boolean,
      default: false
    },
    extendedViewValue: {
      type: Array,
      default() {
        return []
      }
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
      required: false,
      default: () => [5, 10, 25]
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
    },
    settingsPopupStyle: {
      type: Object
    },
    isColumnFilterActive: {
      type: Boolean,
      default: false
    },
    id: {
      type: String
    },
    loading: {
      type: Boolean,
      default: false
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
      filteredDataLength: 0,
      showfilteredData: false,
      sortProps: null,
      initialData: [],
      dataLength: 0,
      selectedCluster: '',
      tableData: [],
      rowCount: 10,
      totalCount: 100,
      extendedViewStyle: null,
      currentPage: 1,
      multipleSelection: [],
      unRenderedFilterData: [],
      timeout: null,
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
      clusteredItems: [],
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
        extraHead: '<meta http-equiv="Content-Language" content="zh-cn"/>'
      },
      clusterChevron: false,
      actionsWidth: 0,
      init: true,
      downloadButtonOptions: ['Download Current Page', 'Download All'],
      selectionRowCheckboxDeterminate: false,
      totalLength: 0
    }
  },
  watch: {
    table(table) {
      this.columnStandardisation(this.columns)
      this.initialData = [...table]
      this.tableData = [...table]
      if (!this.showClusterItemsRowAction) {
        this.hideChildRowActions()
      }
      this.tableData = this.tableData.slice(0, this.countRow || this.rowCount)
    },
    tableData(data) {
      if (data && this.groupable) {
        this.totalLength = this.getTotalLength(data)
      }
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
      //this.$emit('onEditClick', { selected: selecteds, isEditPopupOpen: this.isWantToEditRow })
      if (this.groupable) {
        if (selecteds.length === this.totalLength) {
          this.selectionCheckbox = true
          this.selectionRowCheckboxDeterminate = false
        } else if (selecteds.length > 0) {
          this.selectionRowCheckboxDeterminate = true
        } else {
          this.selectionCheckbox = false
        }
      } else {
        if (selecteds.length === this.tableData.length) {
          this.selectionCheckbox = true
          this.selectionRowCheckboxDeterminate = false
        } else if (selecteds.length > 0) {
          this.selectionRowCheckboxDeterminate = true
        } else {
          this.selectionCheckbox = false
        }
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
    //Init column standardisation
    this.columnStandardisation(this.columns)

    if (this.table && this.table.length) {
      this.initialData = [...this.table]
      this.tableData = [...this.table]
    }
    if (!this.showClusterItemsRowAction) {
      this.hideChildRowActions()
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
    /*
    setTimeout(function () {
      _this.setDatatableUI = true
    }, 1)
     */
  },
  methods: {
    /**
     * Override column props with standards
     *
     * @param {array} columns Datatable column props.
     */
    columnStandardisation(columns) {
      columnStandards.forEach((x) => {
        let index = columns.findIndex((col) => col.property === x.property)
        columns[index] = { ...columns[index], ...x }
      })
    },
    handleDownloadButtonClick(item) {
      this.downloadModalTitle = item
      this.changeDownloadModalStatus(true)
    },
    handleListBulletedClick() {
      this.selectedCluster = ''
      this.$emit('handleListBulleted')
    },
    isEqualCluster(name) {
      return name === this.selectedCluster
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
    hideChildRowActions() {
      const objStyle = document.createElement('style')
      objStyle.innerHTML =
        '.el-table__row.el-table__row--level-1 .actions-container button {visibility:hidden}'
      const ref = document.querySelector('script')
      ref.parentNode.insertBefore(objStyle, ref)
    },
    handleSelectAll(selection) {
      if (this.groupable) {
        if (this.clusteredItems.length) {
          for (let item of this.clusteredItems) {
            this.$refs.elTableRef.toggleRowSelection(item, false)
          }
          this.selection = []
          this.clusteredItems = []
        }

        for (let item of selection) {
          this.selectChildren(item, selection)
        }

        this.multipleSelection = selection
        if (this.multipleSelection.length === 0) {
          this.isWantToEditRow = false
        }
        this.$emit('handleSelectionChange', selection)
      }
    },
    selectChildren(item, selection) {
      if (item.children) {
        for (let child of item.children) {
          if (child.children) {
            this.selectChildren(child, selection)
          }
          this.$refs.elTableRef.toggleRowSelection(child, true)
          this.clusteredItems.push(child)
          if (!selection.some((item) => JSON.stringify(item) === JSON.stringify(child))) {
            selection.push(child)
          }
        }
      }
    },
    calculateLength(children) {
      return children.reduce((acc, item) => {
        if (item.children) {
          return acc + 1 + this.calculateLength(item.children)
        } else {
          return acc + 1
        }
      }, 0)
    },
    getTotalLength(data) {
      return this.calculateLength(data)
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
    cellEnter(row, column, cell) {
      this.hasOverflowTooltip(row, column, cell)
    },
    cellClick(row, column, event) {
      this.$emit('cellClick', { row, column, event })
    },
    cellLeave() {
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
      let spanWidth = span.getBoundingClientRect().width + 20 + this.cellPadding
      const padding = getComputedStyle(cell).paddingLeft.slice(0, -2)
      if (![...cell.classList].some((item) => item === 'el-table-column--selection')) {
        if (padding) {
          spanWidth += Number(padding)
        }
      }

      if (spanWidth > widthOfParent) {
        this.showOverFlowTooltip = true
        const typeOfProp = typeof row[column.property]
        let text
        switch (typeOfProp) {
          case 'object':
            text = row[column.property] && row[column.property].join(',')
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
          left: `${parentRect.left + this.cellPadding + Number(padding)}px`
        }
      }
    },
    sortChangedEvent(sortProps) {
      this.sortProps = sortProps
      if (this.isServerSide) {
        this.$emit('sortChangedEvent', sortProps)
      } else {
        if (this.showfilteredData && this.filteredData && this.filteredData.length) {
          this.filteredData = this.sortFunction(this.unRenderedFilterData, sortProps).slice(
            (this.currentPage - 1) * this.rowCount,
            this.currentPage * this.rowCount
          )
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
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
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
        this.debounce(() => {
          const searchValue = this.search
          this.showfilteredData = !!searchValue.length
          if (!this.showfilteredData) {
            if (this.sortProps && this.sortProps.order) {
              this.sortChangedEvent(this.sortProps)
            } else {
              this.tableData = this.initialData.slice(
                (this.currentPage - 1) * this.rowCount,
                this.currentPage * this.rowCount
              )
            }
          }
          const filteredData = this.initialData.reduce((acc, item) => {
            const data = Object.values(item).find((i) => {
              if (
                typeof i === 'string' &&
                i.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
              )
                return acc.push(item)
            })
            return acc
          }, [])
          this.filteredData = filteredData.slice(
            (this.currentPage - 1) * this.rowCount,
            this.currentPage * this.rowCount
          )
          this.unRenderedFilterData = filteredData
          this.filteredDataLength = filteredData.length
          if (!this.showfilteredData) this.filteredData = []
        }, 500)
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
    getColumnLabel(key) {
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
    selectChildrenByRowCheckbox(rows = [], selection = []) {
      for (let row of rows) {
        if (row.children) {
          this.selectChildrenByRowCheckbox(row.children, selection)
        }
        this.$refs.elTableRef.toggleRowSelection(row, true)
        if (!selection.some((item) => JSON.stringify(item) === JSON.stringify(row))) {
          this.clusteredItems.push(row)
          selection.push(row)
        }
      }
    },
    unSelectChildrenByRowCheckbox(rows = [], selection = []) {
      for (let row of rows) {
        if (row.children) {
          this.unSelectChildrenByRowCheckbox(row.children, selection)
        }
        this.$refs.elTableRef.toggleRowSelection(row, false)
        const ind = selection.findIndex((item) => JSON.stringify(item) === JSON.stringify(row))
        if (ind > -1) {
          selection.splice(ind, 1)
        }
      }
    },
    handleSelect(selection, row) {
      if (this.groupable) {
        if (row.children) {
          if (selection.some((item) => JSON.stringify(item) === JSON.stringify(row))) {
            for (let child of row.children) {
              if (child.children) {
                this.selectChildrenByRowCheckbox(child.children, selection)
              }
              this.$refs.elTableRef.toggleRowSelection(child, true)
              if (!selection.some((item) => JSON.stringify(item) === JSON.stringify(child))) {
                this.clusteredItems.push(child)
                selection.push(child)
              }
            }
          } else {
            for (let child of row.children) {
              if (child.children) {
                this.unSelectChildrenByRowCheckbox(child.children, selection)
              }
              this.$refs.elTableRef.toggleRowSelection(child, false)
              const ind = selection.findIndex(
                (item) => JSON.stringify(item) === JSON.stringify(child)
              )
              if (ind > -1) {
                selection.splice(ind, 1)
              }
            }
          }
        }
        this.multipleSelection = selection
        if (this.multipleSelection.length === 0) {
          this.isWantToEditRow = false
        }
        this.$emit('handleSelectionChange', selection)
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
          const temp =
            this.initialData.slice((this.currentPage - 1) * rows, this.currentPage * rows) || []
          this.tableData = temp.length === 0 ? [{}] : temp
        }
      }
    },
    handleClientSideSizeChange(rows) {
      if (this.currentPage === 1) {
        this.tableData = this.initialData.slice(0, rows)
      } else {
        const temp =
          this.initialData.slice((this.currentPage - 1) * rows, this.currentPage * rows) || []
        this.tableData = temp.length === 0 ? [{}] : temp
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
    handleFilteredCurrentChange(pageNum) {
      this.currentPage = pageNum
      if (pageNum === 1) {
        this.filteredData = this.unRenderedFilterData.slice(0, this.rowCount)
      } else {
        this.filteredData = this.unRenderedFilterData.slice(
          (pageNum - 1) * this.rowCount,
          pageNum * this.rowCount
        )
      }
    },
    handleFilteredSizeChange(rows) {
      this.rowCount = rows
      if (this.currentPage === 1) {
        this.filteredData = this.unRenderedFilterData.slice(0, rows)
      } else {
        const temp =
          this.unRenderedFilterData.slice((this.currentPage - 1) * rows, this.currentPage * rows) ||
          []
        this.filteredData = temp.length === 0 ? [{}] : temp
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
    toggleAll(selections) {
      if (this.totalLength === selections.length) {
        this.$refs.elTableRef.toggleAllSelection()
      } else {
        this.$refs.elTableRef.clearSelection()
      }
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
          this.$emit(action, row)
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
      this.selectedCluster = name
      this.$emit('clusterChanged', name)
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

      navigator.clipboard.writeText(text).then(() => {
        this.$store.dispatch('common/createSnackBar', {
          message: 'COPIED TO CLIPBOARD',
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
          icon: 'mdi-check-circle-outline'
        })
      })
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
          this.$emit('handleMultipleDelete', this.multipleSelection)
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
