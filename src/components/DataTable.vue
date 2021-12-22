<template>
  <div
    class="k-table__wrapper"
    :class="['k-table__wrapper', noPaddingBottom && 'k-table__wrapper--no-padding']"
    :id="id"
  >
    <DatatableLoading :loading="loading" />
    <download-modal
      :isShow="isWantToDownload"
      @downloadEvent="downloadEvent"
      @changeDownloadModalStatus="changeDownloadModalStatus"
      v-if="options && downloadButton.show && isWantToDownload && isShowDownloadModal"
      :download="download"
      :title="downloadModalTitle"
    />
    <data-table-tooltip
      v-if="showOverFlowTooltip"
      :tooltipStyle="overFlowTooltipStyle"
      :content="overFlowTooltipContent"
    />

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
        <div
          v-click-outside="handleSettingsPopupClickOutside"
          class="settings-popup"
          v-show="isSettingsOpened"
          :style="settingsPopupStyle"
        >
          <div class="settings-header">
            <span class="settings-span">Table Settings</span>
            <v-icon @click="toggleIsSettingsOpened" class="close-icon">mdi-close</v-icon>
          </div>
          <div class="sub-header">Show / Hide Columns</div>
          <div
            :key="ind"
            class="popup-row"
            v-for="(col, ind) of columns"
            v-if="ind !== 0 && !col.hideOnSettingsPopup"
          >
            {{ col.label }}
            <v-switch
              v-model="col.show"
              color="#2196f3"
              @change="handleChangeVisibilityOfColumn(ind)"
            />
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
          :is-multiple="isSelectedAllEver"
          :total-item-count="serverSideSelectionCount"
          :value="extendedViewValue"
          :create-mode="isExtendedViewCreateMode"
          :options="extendedViewOptions"
          :container-style="extendedViewStyle"
          :disable-transition="disableExtendedViewTransition"
          :changeFooterPosition="changeFooterPosition"
          :extendedViewDisableChanger="extendedViewDisableChanger"
          :loading="extendedViewLoading"
          @closeCreateMode="$emit('closeCreateMode')"
          @closeEditPopup="closeEditPopup"
          @handleEdit="handleExtendedViewEdit"
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
            <slot name="table-search-left-side"> </slot>
            <v-text-field
              :id="`input--table-search-${Math.random().toString().substring(2)}`"
              class="filter-field"
              placeholder="Search"
              outlined
              prepend-inner-icon="mdi-magnify"
              v-model.trim="search"
              ref="searchInput"
              @keyup="searchChangedEvent"
            />
            <data-table-filter-options
              v-if="showFilterOptions"
              :is-active="isFiltered"
              @set-default-search="$emit('set-default-search', search, filterValues)"
              @restore-default-search="$emit('restore-default-search')"
              @clear-filters="$emit('clear-filters')"
              :hideActionOptions="hideActionOptions"
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
              :style="[
                !selectedCluster && {
                  backgroundColor: '#757575',
                  borderColor: '#757575'
                }
              ]"
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

            <slot name="addUsers">
              <v-tooltip bottom opacity="1">
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-if="addButton && addButton.show && addButton.action"
                    v-on="on"
                    :id="addButton.id"
                    :class="['button-new', addButton && addButton.disabled && 'btn-add--disabled']"
                    rounded
                    color="#2196f3"
                    style="order: 3; margin-right: 10px;"
                    :disabled="addButton && addButton['disabled']"
                    @click="addButtonFunction(addButton.action)"
                  >
                    <v-icon style="font-size: 20px; margin-top: 1px;">mdi-plus</v-icon>
                    <span class="button-new__text">NEW</span>
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
                  v-on="on"
                  :id="`btn-refresh--table-${Math.random().toString().substring(2)}`"
                  icon
                  style="order: 4;"
                  :disabled="refreshButtonDisabled"
                >
                  <v-icon @click="handleRefresh">mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">{{ 'Refresh' }}</span>
            </v-tooltip>
            <v-menu
              v-model="isDownloadMenuOpen"
              bottom
              left
              :attach="isTesting && testProps.menuAttach"
              offset-y
              v-if="downloadButton && downloadButton.show"
            >
              <template v-slot:activator="{ on: menu, attrs }">
                <v-tooltip bottom opacity="1">
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                      v-on="{ ...tooltip, ...menu }"
                      :id="`btn-download--table-${Math.random().toString().substring(2)}`"
                      class="btn-hover mr-1"
                      icon
                      style="order: 5;"
                      v-bind="attrs"
                      :disabled="downloadButton.disabled"
                    >
                      <v-icon>mdi-download</v-icon>
                    </v-btn>
                  </template>
                  <span class="tooltip-span">Download Options</span>
                </v-tooltip>
              </template>
              <v-list-item
                v-for="(item, index) in downloadButtonOptions"
                :id="`item--download-option-${index}`"
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
            <v-tooltip v-if="isSettingsPopup" v-once bottom opacity="1">
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  :id="`btn-settings--table-${Math.random().toString().substring(2)}`"
                  class="btn-hover mr-1"
                  icon
                  style="order: 5;"
                  @click="toggleIsSettingsOpened"
                >
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Table Settings</span>
            </v-tooltip>
          </div>
        </div>
        <slot name="table-all-records">
          <data-table-load-all-records
            v-if="isShowAllRecords"
            :total-number-of-records="totalNumberOfRecords"
            @on-all-records-button-click="$emit('on-all-records-button-click')"
          />
        </slot>
        <slot name="table-notification"></slot>
        <div class="selection-row" v-if="getTableHeaderRender">
          <v-checkbox
            :indeterminate="selectionRowCheckboxDeterminate"
            @click.native="toggleAll(multipleSelection)"
            class="selection-all-check"
            color="white"
            v-model="selectionCheckbox"
            :disabled="getSelectionCheckboxDisabledValue"
          />
          <span class="selection-span">{{ getSelectionText }}</span>
          <v-btn
            v-if="isServerSideSelection || !isServerSide"
            :ripple="false"
            class="btn-all-selection"
            rounded
            color="white"
            style="box-shadow: none;"
            @click="handleSelectButtonClick"
          >
            {{ getSelectionButtonText }}
          </v-btn>
          <div class="action-icons">
            <v-tooltip bottom opacity="1" v-if="selectEvent && selectEvent.clipboard">
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  id="btn-copy-to-clipboard-all--table-header"
                  class="btn-selected-hover mr-1"
                  icon
                  @click="handleCopy(multipleSelection)"
                >
                  <v-icon class="selection-icons" color="white">mdi-clipboard-text</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Clipboard</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1" v-if="selectEvent && selectEvent.edit">
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  id="btn-edit-all--table-header"
                  class="btn-selected-hover mr-1"
                  icon
                  @click="handleMultipleSelectedEdits"
                >
                  <v-icon class="selection-icons" color="white">mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Edit Selected Rows</span>
            </v-tooltip>
            <v-tooltip bottom opacity="1" v-if="selectEvent && selectEvent.delete">
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  id="btn-delete-all--table-header"
                  class="btn-selected-hover mr-1"
                  icon
                  @click="handleDelete(multipleSelection)"
                >
                  <v-icon class="selection-icons" color="white">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Delete</span>
            </v-tooltip>
            <slot name="selection-all-slot" />
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
            <v-tooltip bottom opacity="1" v-if="selectEvent && selectEvent.resend">
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  class="btn-selected-hover mr-1"
                  icon
                  @click="handleResend(multipleSelection)"
                >
                  <v-icon class="selection-icons" color="white">mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span class="tooltip-span">Resend</span>
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
          :class="['table-container', { 'hide-parent-row-actions': hideParentRowActions }]"
          id="table-container"
          ref="tableContainer"
          v-if="(tableData && tableData.length) || isColumnFilterActive"
        >
          <el-table
            v-row-color-handler
            v-if="!allHidden"
            :border="border"
            :cell-class-name="setCellClass"
            :data="showfilteredData ? filteredData : tableData"
            :default-sort="{
              prop: defaultSort || '',
              order: defaultSort || ''
            }"
            :highlight-current-row="false"
            :row-class-name="tableRowClassName"
            :show-header="showHeader"
            :header-row-class-name="'k-table-header'"
            @cell-mouse-enter="cellEnter"
            @cell-mouse-leave="cellLeave"
            @selection-change="handleSelectionChange"
            @select="handleSelect"
            @expand-change="handleExpandedRowChange"
            @sort-change="sortChangedEvent"
            :empty-text="empty.message"
            @select-all="handleSelectAll"
            @cell-click="cellClick"
            id="data-table-container"
            :load="handleLoad"
            :indent="32"
            :lazy="lazy"
            ref="elTableRef"
            :row-key="rowKey"
            style="width: 100%;"
            @row-click="handleRowClick"
          >
            <el-table-column
              align="center"
              type="selection"
              :reserve-selection="true"
              v-if="selectable"
              width="48"
            />
            <el-table-column
              v-for="(col, ind) of columns"
              v-if="col.show"
              :key="col.property + ind + columnKey"
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
                <data-table-date :col="col" :scope="scope" v-if="col.type === 'date'" />
                <data-table-text-array :col="col" :scope="scope" v-if="col.type === 'textArray'" />
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
                    :isErrorState="col.errorStateFor"
                    :errorStateValue="scope.row['scanResultMessage']"
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
                    v-if="
                      scope.row &&
                      (scope.row['status'] ||
                        scope.row['difficultyName'] ||
                        scope.row['difficulty'])
                    "
                    :text="
                      getDataTableFieldLabel(
                        scope.row.status || scope.row['difficultyName'] || scope.row['difficulty']
                      )
                    "
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
                <div v-if="col.type === 'number'">
                  <span>{{ scope.row[col.property] || col.emptyText }}</span>
                </div>
                <div v-if="col.type === 'popup'">
                  <slot name="datatable-column-popup" :col="col" :scope="scope"></slot>
                </div>
                <div
                  v-if="col.type === 'slot' || col.type === 'analysisSource'"
                  class="data-table__custom-column"
                >
                  <slot name="datatable-custom-column" :scope="scope" :col="col"></slot>
                </div>
              </template>

              <template v-slot:header="{ column, $index }">
                <v-tooltip bottom v-if="col['showHeaderTooltip']">
                  <template v-slot:activator="{ on }">
                    <span v-on="on">{{ column.label }}</span>
                  </template>
                  <span>{{ col['headerTooltip'] }}</span>
                </v-tooltip>
                <template v-else>
                  {{ column.label }}
                </template>

                <data-table-filter
                  v-if="col.filterableType"
                  v-model="filterValues[col.filterableCustomFieldName || col.property]"
                  :column="column"
                  :filter-props="col.filterProps"
                  :filterableType="col.filterableType"
                  :filterableItems="col.filterableItems"
                  :filterableOptions="col.filterableOptions"
                  :showSelect:="col.showSelect"
                  :filterOptionProps="col.filterOptionProps"
                  :defaultDate="col.defaultDate"
                  :filterableCustomFieldName="col.filterableCustomFieldName"
                  :index="$index"
                  :sortable="!col.hideSort"
                  :is-settings-opened.sync="isSettingsOpened"
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
                          v-on="on"
                          class="btn-hover"
                          icon
                          :disabled="rowActions[0].disabled"
                          :id="`${rowActions[0].id}-${
                            scope.$index
                          }-${Math.random().toString().substring(2)}`"
                          @click="handleEdit(scope.row, scope.$index)"
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
                          v-on="on"
                          class="btn-hover"
                          icon
                          :disabled="rowActions[0].disabled"
                          :id="`${rowActions[0].id}-${
                            scope.$index
                          }-${Math.random().toString().substring(2)}`"
                          @click="rowAct(rowActions[0].action, scope.row, scope)"
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
                      <v-btn
                        v-on="on"
                        :id="`btn-dots--row-actions-list-${Math.random().toString().substring(2)}`"
                        class="btn-hover ml-1"
                        icon
                        :disabled="rowActions[1].disabled"
                      >
                        <v-icon @click.native="selectedMenuIndex = scope.$index"
                          >mdi-dots-vertical
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-list class="v-cart-dropdown-list el-table__action-buttons">
                      <v-list-item
                        v-if="!act.subElements && !act.isNotShow"
                        v-for="(act, ind) of rowActions"
                        :disabled="
                          act.disabled && act.disabled.constructor.name === 'Function'
                            ? act.disabled(scope.row)
                            : act.disabled
                        "
                        :key="ind"
                        :id="`${rowActions[ind].id}-${
                          scope.$index
                        }-${ind}-${Math.random().toString().substring(2)}`"
                        class="sub-menu-el datatable-row-action-list"
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
                      v-on="on"
                      @click.native="rowAct(rowActions[0].action, scope.row, scope)"
                      :id="`${rowActions[0].id}-${
                        scope.$index
                      }-${Math.random().toString().substring(2)}`"
                      class="btn-hover"
                      icon
                      :disabled="rowActions[0].disabled"
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
                <slot name="datatable-row-actions" :scope="scope">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        @click.native="
                          rowActions[0].action === 'edit'
                            ? handleEdit(scope.row, scope.$index)
                            : rowAct(rowActions[0].action, scope.row)
                        "
                        :id="`${rowActions[0].id}-${
                          scope.$index
                        }-${Math.random().toString().substring(2)}`"
                        :disabled="rowActions[0]['disabled']"
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
                        :disabled="rowActions[1]['disabled']"
                        :id="`${rowActions[1].id}-${
                          scope.$index
                        }-${Math.random().toString().substring(2)}`"
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
                </slot>
              </template>
            </el-table-column>
            <template v-slot:empty>
              <div class="empty-table">
                <div class="empty-inline">
                  <slot name="empty-table-inline-sort">
                    <h2>
                      Sorry, that search and filter criteria has no results.
                    </h2>
                    <p>Please try adjusting your search or filter</p>
                  </slot>
                </div>
              </div>
            </template>
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
              <h2 :id="`text--empty-message-${Math.random().toString().substring(2)}`">
                {{ empty.message }}
              </h2>
              <p :id="`text--empty-sub-message-${Math.random().toString().substring(2)}`">
                {{ empty.subMes }}
              </p>
              <v-btn
                v-if="empty.btn"
                :id="empty['id']"
                :class="['empty-btn', empty['disabled'] && 'empty-btn--disabled']"
                :disabled="empty['disabled']"
                @click="onEmptyBtnClicked"
              >
                <!-- empty action -->
                <v-icon class="mr-1" style="margin-top: -1px;">{{ empty.icon }}</v-icon>
                <span>{{ empty.btn }} </span>
              </v-btn>
            </slot>
          </div>
        </div>
      </div>
      <div
        class="pagination block"
        v-if="
          pageSizes.length &&
          (tableData.length > 0 || isColumnFilterActive || search) &&
          isServerSide
        "
      >
        <el-pagination
          v-if="showPagination"
          :current-page="serverSideProps.pageNumber"
          :page-size="serverSideProps.pageSize"
          :page-sizes="pageSizes || [5, 10, 25]"
          :total="serverSideProps.totalNumberOfRecords"
          @current-change="handleServerSideCurrentChange"
          @size-change="handleServerSideSizeChange"
          :layout="showPageSize ? 'sizes, prev, pager, next,slot' : 'prev, pager, next,slot'"
        >
          <template>
            <span class="el-pagination__text el-pagination__text--1" v-if="showPageSize"
              >Rows per page:
            </span>
            <span class="el-pagination__text el-pagination__text--2">
              {{
                serverSideProps.pageNumber === 1
                  ? 1
                  : (serverSideProps.pageNumber - 1) * serverSideProps.pageSize + 1 > 0
                  ? (serverSideProps.pageNumber - 1) * serverSideProps.pageSize + 1
                  : 0
              }}-{{
                serverSideProps.pageNumber * serverSideProps.pageSize >
                serverSideProps.totalNumberOfRecords
                  ? serverSideProps.totalNumberOfRecords
                  : serverSideProps.pageNumber * serverSideProps.pageSize
              }}
              of
              {{ serverSideProps.totalNumberOfRecords }}
            </span>
          </template>
        </el-pagination>
      </div>
      <div
        class="pagination block"
        v-if="pageSizes.length && tableData.length > 0 && !showfilteredData && !isServerSide"
      >
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="rowCount"
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
      <div class="pagination block" v-if="showfilteredData && !isServerSide">
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="rowCount"
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
import DataTableDate from './DataTableComponents/DataTableDate'
import DataTableTextArray from './DataTableComponents/DataTableTextArray'
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
import RowColorHandler from '@/directives/datatable-row-color-handler'
window.Vue = Vue
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import { mapGetters } from 'vuex'

Vue.use(ElementUI, { locale })
import { getBtnPriorityColor, getBtnStatusColor, getDataTableFieldLabel } from '@/utils/functions'
import { columnStandards } from '@/model/constants/commonConstants'
import DataTableColorfulText from './DataTableComponents/DataTableColorfulText'
import DatatableLoading from './SkeletonLoading/DatatableLoading'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import ServerSideProps from '@/helper-classes/server-side-table-props'
import DataTableFilterOptions from '@/components/DataTableComponents/DataTableFilterOptions'
import DataTableLoadAllRecords from '@/components/DataTableComponents/DataTableLoadAllRecords'
export default {
  components: {
    DataTableLoadAllRecords,
    DataTableFilterOptions,
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
    DatatableLoading,
    DataTableTextArray,
    DataTableDate
  },
  directives: {
    'row-color-handler': RowColorHandler
  },
  props: {
    isShowDownloadModal: {
      default: false
    },
    noPaddingBottom: {
      type: Boolean,
      default: false
    },
    addRowClassName: {
      type: Function
    },
    justCompareRowKey: {
      type: Boolean,
      default: false
    },
    showPageSize: {
      type: Boolean,
      required: false,
      default: true
    },
    showFilterOptions: {
      type: Boolean,
      required: false,
      default: true
    },
    showPagination: {
      type: Boolean,
      required: false,
      default: true
    },
    isServerSideSelection: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      required: true
    },
    showAllRecords: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Boolean,
      default: false
    },
    totalNumberOfRecords: {
      type: Number,
      default: 0
    },
    hideParentRowActions: {
      type: Boolean,
      default: false
    },
    toggleAllRowExpansion: {
      type: Boolean
    },
    activeCluster: {
      type: String
    },
    extendedViewLoading: {
      type: Boolean
    },
    serverSideEvents: {
      type: Object,
      default: () => ({ search: false, sort: false, pagination: false })
    },
    handleSetCellClass: {
      type: Function
    },
    changeFooterPosition: {
      type: Boolean,
      default: false
    },
    extendedViewDisableChanger: {
      type: Function
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
    isSettingsPopup: {
      type: Boolean,
      default: true
    },
    serverSideProps: {
      type: ServerSideProps,
      default: () => new ServerSideProps()
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
    storedTableSettings: {
      type: Object,
      default: null
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
    isCustomOverflowedColumn: {
      type: Boolean,
      default: false
    },
    customOverflowProp: {
      type: String,
      default: ''
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
    refreshButtonDisabled: {
      type: Boolean,
      default: false
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
    hideActionOptions: {
      type: Boolean,
      default: false
    },
    persistentState: {
      type: Object,
      default() {
        return {
          currentPage: 1,
          expandedRows: [],
          firstColFixed: true,
          filteredDataLength: 0,
          search: '',
          showfilteredData: false,
          tableData: [],
          initialData: [],
          serverSideSelectionCount: 0,
          filteredData: [],
          filterValues: {},
          lastColFixed: true,
          rowCount: this.countRow || 10,
          isSelectedAll: false,
          excludedResourceIdList: [],
          selectedCluster: '',
          sortProps: null,
          unRenderedFilterData: [],
          totalLength: 0,
          renderedColumns: [],
          isSelectedAllEver: false,
          selectionRowCheckboxDeterminate: false,
          multipleSelection: []
        }
      }
    },
    downloadButton: {
      type: Object,
      default: () => ({
        show: true,
        disabled: false
      })
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
    },
    download: {
      default: () => ({ xls: true, csv: true, pdf: true })
    },
    isTesting: {
      type: Boolean,
      default: false
    },
    testProps: {
      type: Object,
      default: () => {
        return { menuAttach: '.k-table__wrapper' }
      }
    }
  },
  computed: {
    ...mapGetters({
      isWantToDownload: 'common/getDownloadModalStatus' // for using getters
    }),
    isFiltered() {
      return Object.keys(this.filterValues).length > 0
    },
    isShowAllRecords() {
      return !this.isServerSide && this.showAllRecords
    },
    getTableHeaderRender() {
      const compareVal =
        this.isServerSide && this.isServerSideSelection
          ? this.serverSideSelectionCount
          : this.multipleSelection.length
      return compareVal && this.tableData && this.tableData.length
    },
    getSelectionText() {
      const selectionCount =
        this.isServerSide && this.isServerSideSelection
          ? this.serverSideSelectionCount
          : this.multipleSelection.length
      return this.isSelectedAll ? 'All selected' : `${selectionCount} item(s) selected`
    },
    getSelectionButtonText() {
      const text = this.isSelectedAll ? 'Unselect' : 'Select'
      if (this.isServerSide) {
        return `${text} all ${this.serverSideProps.totalNumberOfRecords} item(s)`
      }
      return `${text} all ${this.groupable ? this.totalLength : this.initialData.length} item(s)`
    },
    getTableHeaderClass() {
      if (this.serverSideEvents.search) {
        return (
          this.tableData.length === 0 &&
          !this.search &&
          !this.isColumnFilterActive &&
          'table-header-disable'
        )
      } else {
        return this.tableData.length === 0 && !this.isColumnFilterActive
          ? 'table-header-disable'
          : ''
      }
    },
    getSelectionCheckboxDisabledValue() {
      return this.showfilteredData ? !this.filteredData.length : false
    }
  },
  data() {
    const {
      currentPage,
      filteredDataLength,
      showfilteredData,
      firstColFixed,
      filteredData,
      search,
      tableData,
      initialData,
      sortProps,
      lastColFixed,
      filterValues,
      selectedCluster = this.activeCluster,
      totalLength,
      rowCount,
      isSelectedAll,
      unRenderedFilterData,
      excludedResourceIdList,
      renderedColumns,
      multipleSelection,
      expandedRows,
      selectionRowCheckboxDeterminate,
      serverSideSelectionCount,
      isSelectedAllEver
    } = this.persistentState
    return {
      columnKey: 'column-key',
      cacheChecks: false,
      filteredData,
      renderedColumns,
      filteredDataLength,
      showfilteredData,
      excludedResourceIdList,
      selectCheckboxesLazy: false,
      sortProps,
      initialData,
      dataLength: 0,
      isSelectedAll,
      selectedCluster,
      tableData,
      rowCount,
      extendedViewStyle: null,
      currentPage,
      multipleSelection,
      unRenderedFilterData,
      timeout: null,
      selectionCheckbox: false,
      dynamicStyleRef: null,
      search,
      expandedRows,
      downloadModalTitle: '',
      isSettingsOpened: false,
      isWantToEditRow: false,
      selectedMenuIndex: null,
      firstColFixed,
      overFlowTooltipContent: '',
      overFlowTooltipStyle: {},
      lastColFixed,
      clusteredItems: [],
      serverSideSelectionCount,
      isRowActionsMenuOpen: [],
      isSelectedAllEver,
      filterValues,
      showOverFlowTooltip: false,
      actionFixed: 'right',
      allHidden: false,
      clusterChevron: false,
      downloadButtonOptions: ['Download Current Page', 'Download All'],
      selectionRowCheckboxDeterminate,
      renderedTotalLength: 0,
      totalLength,
      isFirstOpenSettings: false,
      isDownloadMenuOpen: false,
      isMultipleEdit: false
    }
  },
  watch: {
    table(table, oldTable) {
      this.columnStandardisation(this.columns)
      this.initialData = [...table]
      //This is for refresh button when clicked caching refresh
      if ((!this.cacheChecks && !this.isServerSide) || (this.lazy && this.selectedCluster)) {
        this.multipleSelection = []
        if (this.$refs && this.$refs.elTableRef && this.$refs.elTableRef.clearSelection) {
          this.$refs.elTableRef.clearSelection()
        }
      } else {
        //If there is clustered items selected table has reselect bug. It solves it
      }
      this.cacheChecks = false

      //totalTable length
      this.totalLength = this.getTotalLength(table)
      if (!table.length && this.showOverFlowTooltip) {
        this.showOverFlowTooltip = false
      }
      //if there is filtered data and search go to search function
      if (this.showfilteredData && this.search) {
        this.searchChangedEvent(0)
      }
      //if there is just sorting go to the sorting
      else if (this.sortProps && !this.isServerSide) {
        this.sortChangedEvent(this.sortProps)
      } else {
        const pageSize = this.isServerSide ? this.serverSideProps.pageSize : this.rowCount
        let maxPage = Math.ceil(table.length / pageSize)
        if (maxPage > this.currentPage) {
          maxPage = this.currentPage
        }

        this.tableData = table.slice((maxPage - 1) * pageSize, maxPage * pageSize)
        if (table.length && !this.tableData.length && this.currentPage !== 1) {
          this.currentPage -= 1
          this.tableData = [...table].slice(
            (this.currentPage - 1) * pageSize,
            this.currentPage * pageSize
          )
        }

        setTimeout(() => {
          this.renderFixedItems()
        }, 500)

        if (!this.showClusterItemsRowAction) {
          this.hideChildRowActions()
        }
      }

      if (
        this.isServerSide &&
        !!oldTable &&
        !oldTable.length &&
        this.multipleSelection.length &&
        !this.clusteredItems.length
      ) {
        this.$nextTick(() => {
          this.getSelectedObjectAndSelectRows()
        })
      }
      if (this.isServerSide && this.isSelectedAllEver) {
        this.$nextTick(() => {
          this.$nextTick(() => {
            this.tableData.forEach((item) => {
              if (!this.excludedResourceIdList.find((id) => id === item[this.rowKey])) {
                this.$refs.elTableRef.toggleRowSelection(item, true)
              }
            })
          })
        })
      }

      if (this.groupable && this.clusteredItems.length && this.isServerSide) {
        this.$nextTick(() => {
          const selections = JSON.parse(JSON.stringify(this.multipleSelection))
          this.multipleSelection = []
          this.$refs.elTableRef.clearSelection()
          const allItems = this.getAllItems(this.tableData, [], false, false)
          selections.forEach((selectedItem, index) => {
            const thisTableItem = allItems.find((item) => {
              return item[this.rowKey] === selectedItem[this.rowKey]
            })

            if (thisTableItem) {
              this.$refs.elTableRef.toggleRowSelection(thisTableItem, true)
            } else {
              this.$refs.elTableRef.toggleRowSelection(selectedItem, true)
            }
          })
        })
      }

      if (this.groupable && this.lazy && this.selectedCluster) {
        if (this.$refs && this.$refs.elTableRef && this.$refs.elTableRef) {
          this.$refs.elTableRef.store.states.expandRows = []
          this.$refs.elTableRef.store.states.treeData = []
        }
      }
      if (this.toggleAllRowExpansion) {
        this.$nextTick(() => {
          for (const row of this.tableData) {
            this.handleToggleOrLazyWhenCheckboxSelected(row)
          }
        })
      }
    },
    isWantToEditRow(val) {
      this.$emit('on-extended-view-status-change', val)
    },
    tableData(data) {
      this.calculateAllSelected()
      if (this.groupable && !this.lazy) {
        this.calculateExpandedRows()
      }
      if (!this.tableData || this.tableData.length === 0) return []
      else return data
    },
    filteredData() {
      this.calculateAllSelected()
      if (this.groupable && !this.lazy) {
        this.calculateExpandedRows()
      }
    },
    firstColFixed(val) {
      if (!val) {
        const fixedCol = this.columns.filter((c) => c.fixed === 'left')
        if (fixedCol && fixedCol.length) {
          fixedCol[0].fixed = false
          this.firstColFixed = false
          if (this.$refs && this.$refs.elTableRef && this.$refs.elTableRef.columns.length) {
            this.$refs.elTableRef.columns[0].fixed = false
          }
        }
      } else {
        const disabledCol = this.columns.filter((c) => c.fixed === false)
        disabledCol[0].fixed = 'left'
        this.firstColFixed = true
        if (this.$refs && this.$refs.elTableRef && this.$refs.elTableRef.columns.length) {
          this.$refs.elTableRef.columns[0].fixed = true
        }
      }
    },
    lastColFixed(val) {
      if (!val) {
        this.actionFixed = false
      } else {
        this.actionFixed = 'right'
      }
    },
    multipleSelection() {
      this.calculateAllSelected()
    },
    isSelectedAll(val = false) {
      if (val && !this.search) {
        //this.isSelectedAllEver = true
      }
    },
    columns: {
      deep: true,
      handler(val) {
        this.setRenderedColumns()
        this.allHidden = !val.some((col) => col.show)
      }
    }
  },
  created() {
    //Init column standardisation
    if (this.persistentState) this.setPersistentStateToDataValues()

    this.columnStandardisation(this.columns)

    if (this.table && this.table.length) {
      this.initialData = [...this.table]
      this.tableData = [...this.table]
      this.totalLength = this.getTotalLength(this.table)
    }
    if (!this.showClusterItemsRowAction) {
      this.hideChildRowActions()
    }

    this.tableData = this.tableData.slice(0, this.rowCount)
  },
  mounted() {
    //persistent state sorting
    if (this.persistentState && this.persistentState.sortProps) {
      const { prop, order } = this.persistentState.sortProps
      this.$refs.elTableRef.sort(prop, order)
    }
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

    window.addEventListener('resize', this.renderFixedItems)
  },
  beforeDestroy() {
    if (this.dynamicStyleRef && this.dynamicStyleRef.remove) {
      this.dynamicStyleRef.remove()
    }
  },
  methods: {
    handleRowClick(row, column, event) {
      this.$emit('row-click', row)
    },
    getState() {
      return {
        firstColFixed: this.firstColFixed,
        lastColFixed: this.lastColFixed,
        expandedRows: this.expandedRows,
        search: this.search,
        currentPage: this.currentPage,
        filteredDataLength: this.filteredDataLength,
        showfilteredData: this.showfilteredData,
        tableData: this.tableData,
        initialData: this.initialData,
        sortProps: this.sortProps,
        filteredData: this.filteredData,
        filterValues: this.filterValues,
        selectedCluster: this.selectedCluster,
        rowCount: this.isServerSide ? this.serverSideProps.pageSize : this.rowCount,
        isSelectedAll: this.isSelectedAll,
        unRenderedFilterData: this.unRenderedFilterData,
        totalLength: this.totalLength,
        renderedColumns: this.renderedColumns,
        multipleSelection: this.multipleSelection,
        serverSideSelectionCount: this.serverSideSelectionCount,
        isSelectedAllEver: this.isSelectedAllEver,
        excludedResourceIdList: this.excludedResourceIdList,
        selectionRowCheckboxDeterminate: this.selectionRowCheckboxDeterminate
      }
    },
    //This is a element ui bug it doesnt cache it added to making caching
    getSelectedObjectAndSelectRows(
      selections = JSON.parse(JSON.stringify(this.multipleSelection))
    ) {
      this.$nextTick(() => {
        this.multipleSelection = []
        this.$refs.elTableRef.clearSelection()
        selections.forEach((selectedItem) => {
          const thisTableItem = this.tableData.find((item) => {
            return JSON.stringify(item) === JSON.stringify(selectedItem)
          })
          if (thisTableItem) {
            this.$refs.elTableRef.toggleRowSelection(thisTableItem, true)
          } else {
            this.$refs.elTableRef.toggleRowSelection(selectedItem, true)
          }
        })
      })
    },
    getSelectedObjectAndSelectRowsByRowKey(
      selections = JSON.parse(JSON.stringify(this.multipleSelection))
    ) {
      this.$nextTick(() => {
        this.multipleSelection = []
        this.$refs.elTableRef.clearSelection()
        selections.forEach((selectedItem) => {
          const thisTableItem = this.tableData.find((item) => {
            return item[this.rowKey] === selectedItem[this.rowKey]
          })
          if (thisTableItem) {
            this.$refs.elTableRef.toggleRowSelection(thisTableItem, true)
          } else {
            this.$refs.elTableRef.toggleRowSelection(selectedItem, true)
          }
        })
      })
    },
    setPersistentStateToDataValues() {
      const {
        renderedColumns = [],
        multipleSelection = [],
        firstColFixed,
        lastColFixed
      } = this.persistentState

      if (this.storedTableSettings) {
        this.setStoredTableSettings()
      } else {
        if (!firstColFixed) this.columns[0].fixed = false
        if (!lastColFixed) this.actionFixed = false
        //setting rendered columns
        if (!renderedColumns.length) {
          this.setRenderedColumns()
        } else {
          this.columns.forEach((col) => {
            if (!renderedColumns.find((property) => property === col.property)) col.show = false
          })
        }
      }

      // setting selections
      if (multipleSelection.length) {
        for (const row of multipleSelection) {
          this.$nextTick(() => {
            this.$refs.elTableRef.toggleRowSelection(row, true)
          })
        }
      }
    },
    getSelectedMultipleValues() {
      return this.multipleSelection
    },
    handleExtendedViewEdit(val) {
      this.$emit('handleEdit', val, this.excludedResourceIdList, this.isSelectedAllEver)
      this.resetSelectableParams()
    },
    resetSelectableParams() {
      this.multipleSelection = []
      this.isSelectedAllEver = false
      this.excludedResourceIdList = []
      this.serverSideSelectionCount = 0
      this.$refs.elTableRef.clearSelection()
      this.clusteredItems = []
    },
    handleExpandedRowChange(row, isExpanded) {
      let expandedRow = this.expandedRows.find(
        (item) => JSON.stringify(item.data) === JSON.stringify(row)
      )
      if (expandedRow) {
        expandedRow.isExpanded = isExpanded
      } else {
        this.expandedRows.push({ data: row, isExpanded })
      }
    },
    calculateExpandedRows() {
      this.$nextTick(() => {
        for (const item of this.expandedRows) {
          if (this.$refs && this.$refs.elTableRef) {
            this.$refs.elTableRef.toggleRowExpansion(item.data, item.isExpanded)
          }
        }
      })
    },
    calculateAllSelected() {
      let dataRef = this.showfilteredData ? this.filteredData : this.tableData
      const renderedTotalLength = this.getTotalLength(dataRef)
      this.renderedTotalLength = renderedTotalLength
      const comparedValueLength = this.groupable ? renderedTotalLength : dataRef.length
      if (
        this.groupable &&
        comparedValueLength >= this.getAllItems(dataRef, [], false, false).length
      ) {
        dataRef = this.getAllItems(dataRef, [], false, false)
      }
      const selectedItems = dataRef.filter((item) => {
        return this.multipleSelection.find((selectedItem) => {
          return this.justCompareRowKey
            ? selectedItem[this.rowKey] === item[this.rowKey]
            : JSON.stringify(item) === JSON.stringify(selectedItem)
        })
      })
      const comparedSelectionObj = this.isServerSide ? selectedItems : this.multipleSelection
      if (this.isSelectedAll && comparedSelectionObj.length === this.totalLength) {
        this.selectionCheckbox = true
        this.selectionRowCheckboxDeterminate = false
      } else if (selectedItems.length) {
        if (selectedItems.length === comparedValueLength) {
          this.selectionCheckbox = true
          this.selectionRowCheckboxDeterminate = false
        } else {
          this.selectionRowCheckboxDeterminate = true
        }
      } else {
        this.selectionCheckbox = false
        this.selectionRowCheckboxDeterminate = false
      }
      const length = this.groupable
        ? this.getTotalLength(this.initialData)
        : this.initialData.length

      this.isSelectedAll =
        this.isServerSide && this.isServerSideSelection
          ? !!this.serverSideSelectionCount &&
            this.serverSideSelectionCount === this.serverSideProps.totalNumberOfRecords
          : this.isServerSide
          ? !!this.multipleSelection.length &&
            this.multipleSelection.length === this.serverSideProps.totalNumberOfRecords
          : this.multipleSelection.length === length
    },
    /**
     * This event comes from el-table for lazy-loading children
     * @param tree --> object
     * @param treeNode --> object
     * @param resolve --> function
     * @param callback --> function
     */
    handleLoad(tree, treeNode, resolve) {
      this.$emit('handleClusterLazyLoad', {
        tree,
        treeNode,
        resolve,
        callback: this.callbackOfLazyLoad
      })
    },
    /**
     *This function must use calls when lazy load used
     */
    callbackOfLazyLoad(rows = []) {
      for (let row of rows) {
        this.addItemToClusteredItems(row)
        if (this.selectCheckboxesLazy || this.selectionCheckbox) {
          this.$refs.elTableRef.toggleRowSelection(row, true)
        }
        //
      }
      this.selectCheckboxesLazy = false
      this.totalLength = this.getTotalLength(this.initialData)
      this.calculateAllSelected()
    },
    /**
     * Override column props with standards
     *
     * @param {array} columns Datatable column props.
     */
    columnStandardisation(columns) {
      columnStandards.forEach((x) => {
        let index = columns.findIndex((col) => col.property === x.property)
        if (index > -1) {
          if (!columns[index].overrideWidth) {
            columns[index] = { ...columns[index], ...x }
          }
        }
      })
    },
    handleSettingsPopupClickOutside() {
      if (!this.isSettingsOpened || this.isFirstOpenSettings) return
      this.isSettingsOpened = false
    },
    /**
     *
     * This event is throwed when All select button clicked
     * No param
     */
    handleSelectButtonClick() {
      if (this.isServerSide) {
        if (this.isSelectedAll) {
          this.serverSideSelectionCount = 0
          this.excludedResourceIdList = []
          this.multipleSelection = []
          this.clusteredItems = []
          this.isSelectedAllEver = false
          this.isSelectedAll = false
          this.$refs.elTableRef.clearSelection()
          this.$emit('on-selected-all-click', false)
        } else {
          if (this.serverSideProps.totalNumberOfRecords > this.rowCount) {
            this.isSelectedAllEver = true
          }
          this.selectAllItems()
          this.isSelectedAll = true
          this.excludedResourceIdList = []
          this.serverSideSelectionCount = this.serverSideProps.totalNumberOfRecords
        }
      } else {
        if (this.isSelectedAll) {
          this.multipleSelection = []
          this.isSelectedAll = false
          this.clusteredItems = []
          this.$refs.elTableRef.clearSelection()
        } else {
          this.selectAllItems()
          this.isSelectedAll = true
        }
      }
    },
    /**
     * This function returns all items on the table.
     * @param arr --> for example tableData
     * @param retArr --> returned value
     */
    getAllItems(arr = [], retArr = [], addToClusterItems = true, deleteFromClusteredItems = false) {
      for (let item of arr) {
        if (item.children) {
          this.getAllItems(item.children, retArr, addToClusterItems, deleteFromClusteredItems)
        }

        if (item.isChild && addToClusterItems) {
          this.addItemToClusteredItems(item)
        }
        if (deleteFromClusteredItems) {
          this.deleteItemFromClusteredItems(item)
        }
        retArr.push(item)
      }
      return retArr
    },
    /**
     * This function selects all items on the table.
     */
    selectAllItems() {
      this.multipleSelection = this.getAllItems(this.initialData, [])
      for (let item of this.multipleSelection) {
        this.$refs.elTableRef.toggleRowSelection(item, true)
      }
    },
    handleRefresh() {
      this.cacheChecks = true
      this.$emit('refreshAction')
    },
    /**
     * This function for rendering overflowed actions bug. This is element io bug and solved with this function
     */
    renderFixedItems() {
      const table = this.$el
      if (table) {
        const tableFixedItem = table.querySelector('.el-table__fixed')
        const tableFixedRightItem = table.querySelector('.el-table__fixed-right')
        if (tableFixedItem && tableFixedItem.style.height) {
          const bodyWrapperHeight = Number(
            getComputedStyle(
              tableFixedItem.querySelector('.el-table__fixed-body-wrapper')
            ).height.slice(0, -2)
          )
          const fixedItemHeight = Number(tableFixedItem.style.height.slice(0, -2))
          if (fixedItemHeight - bodyWrapperHeight < 45) {
            const aggregate = window.innerWidth > 1300 ? 15 : 5
            tableFixedItem.style.height = `${
              Number(tableFixedItem.style.height.slice(0, -2)) + aggregate
            }px`
          }
        }
        if (tableFixedRightItem && tableFixedRightItem.style.height) {
          const bodyWrapperHeight = Number(
            getComputedStyle(
              tableFixedRightItem.querySelector('.el-table__fixed-body-wrapper')
            ).height.slice(0, -2)
          )

          const fixedItemHeight = Number(tableFixedRightItem.style.height.slice(0, -2))
          if (fixedItemHeight - bodyWrapperHeight < 45) {
            const aggregate = window.innerWidth > 1300 ? 15 : 5
            tableFixedRightItem.style.height = `${
              Number(tableFixedRightItem.style.height.slice(0, -2)) + aggregate
            }px`
          }
        }
      }
    },
    handleChangeVisibilityOfColumn() {
      this.setRenderedColumns()
      this.$forceUpdate()
      this.$emit('on-table-settings-change', {
        renderedColumns: this.renderedColumns,
        firstColFixed: this.firstColFixed,
        lastColFixed: this.lastColFixed
      })
    },
    /**
     * This function sets rendered columns on table
     */
    setRenderedColumns() {
      this.renderedColumns = this.columns.filter((item) => item.show).map((i) => i.property)
    },
    /**
     * This function fires when someone click download button on table and make selection
     *
     * @param item --> String
     */
    handleDownloadButtonClick(item = '') {
      this.$emit('handleDownloadButtonClick')
      this.isShowDownloadModal = true
      this.downloadModalTitle = item
      this.changeDownloadModalStatus(true)
    },
    /**
     * This function fires when someone click list bulleted. Main purpose is deleting all clusters and make normal list view
     */
    handleListBulletedClick() {
      this.selectedCluster = ''
      /*
      this.firstColFixed = true
      this.lastColFixed = true

       */
      this.$emit('handleListBulleted')
      this.multipleSelection = []
      this.$refs.elTableRef.clearSelection()
    },
    /**
     * This function returns which cluster is selected
     * @param name --> String
     */
    isEqualCluster(name = '') {
      return name === this.selectedCluster
    },
    handleMultipleSelectedEdits() {
      this.isMultipleEdit = true
      this.extendedViewStyle = {
        top: `${48}px`
      }
      const selections = this.multipleSelection.filter((item) => !item.isParent)
      if (selections.length) {
        //temporary
        if (this.isSelectedAllEver && selections.length === 1) {
          this.multipleSelection.push(selections[0])
          selections.push(selections[0])
        }

        this.$emit('onEditClick', {
          selected: selections,
          isEditPopupOpen: true,
          excludedResourceIdList: this.excludedResourceIdList,
          isSelectedAllEver: this.isSelectedAllEver,
          isMultiple: true
        })
        this.isWantToEditRow = true
        this.isSettingsOpened = false
      } else {
        if (this.isSelectedAllEver) {
          const selections = [this.tableData[0], this.tableData[1]]
          this.$emit('onEditClick', {
            selected: selections,
            isEditPopupOpen: true,
            excludedResourceIdList: this.excludedResourceIdList,
            isSelectedAllEver: this.isSelectedAllEver
          })
          this.isWantToEditRow = true
          this.isSettingsOpened = false
        }
      }
    },
    /**
     * This functions removes visibility of the right actions columns.
     */
    hideChildRowActions() {
      const objStyle = document.createElement('style')
      objStyle.innerHTML =
        '.el-table__row.el-table__row--level-1 .actions-container button {visibility:hidden}'
      const ref = document.querySelector('script')
      ref.parentNode.insertBefore(objStyle, ref)
    },
    handleSelectAll(selection) {
      if (this.isServerSide && this.isServerSideSelection) {
        this.serverSideSelectionCount += this.tableData.length
        if (this.isSelectedAllEver) {
          for (const item of this.tableData) {
            //TODO burada kaldım
            this.findAndDeleteFromExcludedResourceIdList(item[this.rowKey])
          }
        }
      }
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
          if (this.groupable) {
            this.handleToggleOrLazyWhenCheckboxSelected(item)
          }
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
          this.handleToggleOrLazyWhenCheckboxSelected(child)
          this.addItemToClusteredItems(child)
          if (!selection.some((item) => JSON.stringify(item) === JSON.stringify(child))) {
            selection.push(child)
          }
        }
      }
    },
    setStoredTableSettings() {
      const { firstColFixed, lastColFixed, renderedColumns } = this.storedTableSettings
      if (!firstColFixed) this.columns[0].fixed = false
      if (!lastColFixed) this.actionFixed = false

      if (!renderedColumns.length) {
        this.setRenderedColumns()
      } else {
        this.columns.forEach((col) => {
          col.show = renderedColumns.find((property) => property === col.property)
          this.renderedColumns = renderedColumns
        })
      }
    },
    addItemToClusteredItems(item = {}) {
      const index = this.clusteredItems.findIndex(
        (clusteredItem) => JSON.stringify(clusteredItem) === JSON.stringify(item)
      )
      if (index === -1) {
        this.clusteredItems.push(item)
      }
    },
    deleteItemFromClusteredItems(item = {}) {
      const index = this.clusteredItems.findIndex(
        (clusteredItem) => JSON.stringify(clusteredItem) === JSON.stringify(item)
      )
      if (index > -1) {
        this.clusteredItems.splice(index, 1)
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
      if (this.handleSetCellClass) {
        return this.handleSetCellClass(obj)
      }
      /*
      const classNames = this.setClassName(obj)
      return classNames
      */
    },
    closeEditPopup() {
      this.isWantToEditRow = false
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
    /**
     * This event fires when clicked in the cell
     */
    cellEnter(row, column, cell) {
      this.hasOverflowTooltip(row, column, cell)
    },
    /**
     * This event fires when clicked in the cell
     */
    cellClick(row, column, event) {
      this.$emit('cellClick', { row, column, event })
    },
    /**
     * This event fires when mouse leave on cell
     */
    cellLeave() {
      this.showOverFlowTooltip = false
    },
    /**
     * This function calculates if there is an overflow on the cell
     * @param row
     * @param column
     * @param cell
     */
    hasOverflowTooltip(row, column, cell) {
      const [firstColumn] = this.columns
      const parentRect =
        this.isCustomOverflowedColumn &&
        firstColumn.isCustomOverflowedColumn &&
        firstColumn.property === column.property
          ? cell.querySelector(`.${this.columns[0].parentRect}`).getBoundingClientRect()
          : cell.getBoundingClientRect()

      const widthOfParent = parentRect.width
      let span =
        cell.querySelector('span:last-child') ||
        cell.querySelector('.datatable-chart__empty') ||
        cell.querySelector('.datatable-progress') ||
        cell.querySelector('div')
      if ([...span.classList].some((item) => item === 'cell')) {
        span = span.querySelector('div')
      }
      let aggregation = this.isCustomOverflowedColumn ? 0 : 20
      if (window.safari || navigator.vendor.match(/apple/i)) {
        if ([...cell.parentNode.classList].some((item) => item === 'el-table__row--level-1')) {
          aggregation = 0
        }
      }
      let spanWidth = span.getBoundingClientRect().width + aggregation + this.cellPadding
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
          top: `${parentRect.top + (this.isCustomOverflowedColumn ? 50 : 60)}px`,
          left: `${parentRect.left + this.cellPadding + Number(padding)}px`
        }
      }
    },
    sortChangedEvent(sortProps) {
      this.sortProps = sortProps
      if (this.isServerSide && this.serverSideEvents.sort) {
        this.$emit('sortChangedEvent', sortProps)
      } else {
        if (this.showfilteredData && this.filteredData && this.filteredData.length) {
          const filteredData = this.sortFunction(this.unRenderedFilterData, sortProps)

          let maxPage = Math.ceil(filteredData.length / this.rowCount)
          if (maxPage > this.currentPage) {
            maxPage = this.currentPage
          }
          this.filteredData = filteredData.slice(
            (maxPage - 1) * this.rowCount,
            maxPage * this.rowCount
          )
          return this.filteredData
        } else {
          const data = this.sortFunction(this.initialData, sortProps)
          let maxPage = Math.ceil(data.length / this.rowCount)
          if (maxPage > this.currentPage) {
            maxPage = this.currentPage
          }
          this.tableData = data.slice((maxPage - 1) * this.rowCount, maxPage * this.rowCount)
          return this.tableData
        }
      }
    },
    sortFunction(data, sortProps) {
      if (this.isServerSide) return
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
        const collator = new Intl.Collator('tr')
        sortData = data.sort(function (a, b) {
          if (typeof a[sortProps.prop] === 'string' || typeof b[sortProps.prop] === 'string') {
            let aProp = String(a[sortProps.prop])
            let bProp = String(b[sortProps.prop])
            if (aProp === 'null') {
              aProp = ''
            }
            if (bProp === 'null') {
              bProp = ''
            }
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
                collator.compare(aProp.charAt(0), bProp.charAt(0).toUpperCase()) === 0
              ) {
                return -1
              } else if (
                aProp.charAt(0) !== bProp.charAt(0) &&
                collator.compare(bProp.charAt(0), aProp.charAt(0).toUpperCase()) === 0
              ) {
                return 1
              }
              return collator.compare(aProp.toLowerCase(), bProp.toLowerCase())
            }
            // if descending, highest sorts first
            else {
              if (
                aProp.charAt(0) !== bProp.charAt(0) &&
                collator.compare(aProp.charAt(0), bProp.charAt(0).toUpperCase()) === 0
              ) {
                return 1
              } else if (
                aProp.charAt(0) !== bProp.charAt(0) &&
                collator.compare(bProp.charAt(0), aProp.charAt(0).toUpperCase()) === 0
              ) {
                return -1
              }
              //aProp.toLowerCase() < bProp.toLowerCase() ? 1 : -1
              return collator.compare(bProp.toLowerCase(), aProp.toLowerCase())
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
      if (this.isServerSide && this.serverSideEvents.pagination)
        this.$emit('paginationChangedEvent', paginationProps)
    },
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    },
    getSearchFilterItems() {
      return this.columns.reduce((acc, filterItem) => {
        if (
          this.renderedColumns.find((property) => property === filterItem.property) &&
          !filterItem['isCustomField']
        ) {
          acc.push({
            FieldName: filterItem.property.charAt(0).toUpperCase() + filterItem.property.slice(1),
            Operator: 'Contains',
            Value: this.search
          })
        }
        return acc
      }, [])
    },
    searchChangedEvent() {
      const debounceTime = 750
      let _this = this
      if (_this.isServerSide && this.serverSideEvents.search) {
        this.debounce(() => {
          const filterItems = _this.columns.reduce((acc, filterItem) => {
            if (
              this.renderedColumns.find((property) => property === filterItem.property) &&
              !filterItem['isCustomField']
            ) {
              const obj = {
                FieldName:
                  filterItem.property.charAt(0).toUpperCase() + filterItem.property.slice(1),
                Operator: 'Contains',
                Value: this.search
              }
              acc.push(obj)
            }
            return acc
          }, [])
          const bodyDataFilter = {
            filter: {
              Condition: 'AND',
              FilterGroups: [
                {
                  Condition: 'AND',
                  FilterItems: filterItems
                }
              ]
            }
          }
          this.$emit('searchChangedEvent', bodyDataFilter, !!this.search)
          if (this.isServerSideSelection) {
            this.resetSelectableParams()
          }
        }, debounceTime)
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
            const row = this.renderedColumns.reduce((acc, key) => {
              if (
                this.columns.find((column) => column.property === key && column['unSearchable'])
              ) {
                return acc
              }
              acc[key] = item[key]
              return acc
            }, {})
            const data = Object.values(row).find((i) => {
              if (
                typeof i === 'string' &&
                i.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
              )
                return acc.push(item)
            })
            return acc
          }, [])
          if (!filteredData.length && this.showOverFlowTooltip) {
            this.showOverFlowTooltip = false
          }
          let maxPage = Math.ceil(filteredData.length / this.rowCount)
          if (maxPage > this.currentPage) {
            maxPage = this.currentPage
          }
          this.filteredData = filteredData.slice(
            (maxPage - 1) * this.rowCount,
            maxPage * this.rowCount
          )
          this.unRenderedFilterData = filteredData
          this.filteredDataLength = filteredData.length
          if (!this.showfilteredData) this.filteredData = []
        }, debounceTime)
      }
    },
    getColumnLabelClass(key) {
      if (key === 'priority' || key === 'status' || key === 'detected') {
        return 'popup__badge'
      }
    },
    toggleIsSettingsOpened() {
      if (this.isWantToEditRow) {
        this.isWantToEditRow = false
      }
      this.$emit('handleChangeIsSettingsOpen', !this.isSettingsOpened)
      this.isSettingsOpened = !this.isSettingsOpened
      this.isFirstOpenSettings = true
      setTimeout(() => {
        this.isFirstOpenSettings = false
      }, 200)
    },
    addButtonFunction(action, row) {
      this.$emit(action, row)
    },
    tableRowClassName(row) {
      const ans = this.multipleSelection.some((r) => JSON.stringify(r) === JSON.stringify(row.row))
      let className = ''

      if (ans) className += 'selected-row'

      if (this.addRowClassName) className += this.addRowClassName(row)
      return className
    },
    getServerSideSelectionParams() {
      const serverSideSelectionParams = {}
      if (this.isServerSideSelection) {
        serverSideSelectionParams.excludedResourceIdList = this.excludedResourceIdList
        serverSideSelectionParams.isSelectedAllEver = this.isSelectedAllEver
      }
      return serverSideSelectionParams
    },
    handleSelectionChange(val) {
      //setting selections
      this.multipleSelection = val
      //is no selection close edit modal
      if (this.multipleSelection.length === 0) {
        this.isWantToEditRow = false
      }
      //emitting event
      this.$emit(
        'handleSelectionChange',
        val,
        ...Object.values(this.getServerSideSelectionParams())
      )
      //is there multipleEdit check that
      if (this.isWantToEditRow && this.isMultipleEdit) {
        this.handleMultipleSelectedEdits()
      }
    },
    selectChildrenByRowCheckbox(rows = [], selection = []) {
      for (let row of rows) {
        if (row.children) {
          this.selectChildrenByRowCheckbox(row.children, selection)
        }
        this.$refs.elTableRef.toggleRowSelection(row, true)
        if (!selection.some((item) => JSON.stringify(item) === JSON.stringify(row))) {
          this.addItemToClusteredItems(row)
          selection.push(row)
        }
      }
    },
    unSelectChildrenByRowCheckbox(rows = [], selection = []) {
      for (let row of rows) {
        if (row.children) {
          this.unSelectChildrenByRowCheckbox(row.children, selection)
        }

        const clusteredIndex = this.clusteredItems.findIndex(
          (clusteredItem) => JSON.stringify(clusteredItem) === JSON.stringify(row)
        )
        if (clusteredIndex > -1) {
          this.clusteredItems.splice(clusteredIndex, 1)
        }
        this.$refs.elTableRef.toggleRowSelection(row, false)
        const ind = selection.findIndex((item) => JSON.stringify(item) === JSON.stringify(row))
        if (ind > -1) {
          selection.splice(ind, 1)
        }
      }
    },
    toggleToTheClusterIfChild(row = {}) {
      if (row.isChild) {
        const index = this.clusteredItems.findIndex(
          (item) => JSON.stringify(item) === JSON.stringify(row)
        )
        if (index > -1) {
          this.clusteredItems.splice(index, 1)
        } else {
          this.clusteredItems.push(row)
        }
      }
    },
    handleSelect(selection, row) {
      if (this.isServerSide && this.isServerSideSelection) {
        if (selection.find((item) => item[this.rowKey] === row[this.rowKey])) {
          this.serverSideSelectionCount++
          this.findAndDeleteFromExcludedResourceIdList(row[this.rowKey])
        } else {
          this.serverSideSelectionCount--
          if (this.isSelectedAllEver) {
            this.excludedResourceIdList.push(row[this.rowKey])
          }
        }
      }
      if (this.groupable) {
        this.handleToggleOrLazyWhenCheckboxSelected(
          row,
          !!selection.find((item) => JSON.stringify(item) === JSON.stringify(row))
        )

        if (row.children) {
          if (selection.some((item) => JSON.stringify(item) === JSON.stringify(row))) {
            this.toggleToTheClusterIfChild(row)
            for (let child of row.children) {
              if (child.children) {
                this.selectChildrenByRowCheckbox(child.children, selection)
              }
              this.$refs.elTableRef.toggleRowSelection(child, true)
              this.handleToggleOrLazyWhenCheckboxSelected(child)
              if (!selection.some((item) => JSON.stringify(item) === JSON.stringify(child))) {
                this.addItemToClusteredItems(child)
                selection.push(child)
              }
            }
          } else {
            this.toggleToTheClusterIfChild(row)
            for (let child of row.children) {
              if (child.children) {
                this.unSelectChildrenByRowCheckbox(child.children, selection)
              }
              this.$refs.elTableRef.toggleRowSelection(child, false)
              const ind = selection.findIndex(
                (item) => JSON.stringify(item) === JSON.stringify(child)
              )
              const clusteredIndex = this.clusteredItems.findIndex(
                (clusteredItem) => JSON.stringify(clusteredItem) === JSON.stringify(child)
              )
              if (clusteredIndex > -1) {
                this.clusteredItems.splice(clusteredIndex, 1)
              }
              if (ind > -1) {
                selection.splice(ind, 1)
              }
            }
          }
        } else {
          this.toggleToTheClusterIfChild(row)
        }
        this.multipleSelection = selection
        if (this.multipleSelection.length === 0) {
          this.isWantToEditRow = false
        }
        this.$emit('handleSelectionChange', selection)
      }
    },
    findAndDeleteFromExcludedResourceIdList(rowKey = '') {
      const indexOfExcluded = this.excludedResourceIdList.indexOf(rowKey)
      if (indexOfExcluded === -1) {
        return
      }
      this.excludedResourceIdList.splice(indexOfExcluded, 1)
    },
    handleToggleOrLazyWhenCheckboxSelected(row = {}, selection = true) {
      const { hasChildren, children = [] } = row
      if (hasChildren && !children.length) {
        this.$refs.elTableRef.store.loadOrToggle(row)
        this.selectCheckboxesLazy = true
      } else if (children && children.length) {
        this.$refs.elTableRef.toggleRowExpansion(row, selection)
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
      if (this.currentPage === 1) {
        this.tableData = this.initialData.slice(0, rows)
      } else {
        const temp =
          this.initialData.slice((this.currentPage - 1) * rows, this.currentPage * rows) || []
        this.tableData = temp.length === 0 ? [{}] : temp
      }
      this.$emit('onSizeChanged')
      this.calculateAllSelected()
    },
    handleServerSideCurrentChange(pageNumber = 1) {
      this.$emit('server-side-page-number-changed', pageNumber)
    },
    handleServerSideSizeChange(pageSize = 10) {
      this.$emit('server-side-size-changed', pageSize)
    },
    handleCurrentChange(pageNum) {
      this.currentPage = pageNum
      this.tableData = this.initialData.slice(
        (pageNum - 1) * this.rowCount,
        pageNum * this.rowCount
      )

      this.$emit('onPageChanged')
      this.calculateAllSelected()
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
      this.calculateAllSelected()
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
      this.calculateAllSelected()
    },
    onEmptyBtnClicked(e) {
      this.$emit('onEmptyBtnClicked', e)
    },
    downloadEvent(downloadTypes) {
      this.$emit('downloadEvent', {
        exportTypes: downloadTypes,
        pageNumber: this.serverSideEvents.pagination
          ? this.serverSideProps.pageNumber
          : this.currentPage,
        pageSize: this.serverSideEvents.pagination ? this.serverSideProps.pageSize : this.rowCount,
        reportAllPages: this.downloadModalTitle === this.downloadButtonOptions[1]
      })
    },
    handleSubMenuItemClick(item) {
      this.$emit('submenuItemClick', item)
    },
    toggleAll(selections) {
      if (this.selectionCheckbox) {
        if (this.selectionRowCheckboxDeterminate) {
          const dataRef = this.showfilteredData ? this.filteredData : this.tableData
          const allItems = this.getAllItems(dataRef, [], false, true)
          for (let item of allItems) {
            if (
              this.multipleSelection.find(
                (selection) => selection[this.rowKey] === item[[this.rowKey]]
              )
            ) {
              this.$refs.elTableRef.toggleRowSelection(item, false)
              if (this.isServerSide && this.isServerSideSelection) {
                if (this.isSelectedAllEver) {
                  this.excludedResourceIdList.push(item[this.rowKey])
                }
                this.serverSideSelectionCount--
              }
            }
          }
          this.selectionRowCheckboxDeterminate = false
          this.selectionCheckbox = false
        } else {
          this.$refs.elTableRef.toggleAllSelection()
        }
      } else {
        const selectedItems = this.getAllItems(
          this.multipleSelection.filter((item) => {
            const dataRef = this.showfilteredData ? this.filteredData : this.tableData
            return dataRef.find(
              (selectedItem) => JSON.stringify(item) === JSON.stringify(selectedItem)
            )
          }),
          [],
          false,
          true
        )

        if (selectedItems.length) {
          for (let selectedItem of selectedItems) {
            const thisTableItem = this.isServerSide
              ? this.tableData.find((item) => {
                  return JSON.stringify(item) === JSON.stringify(selectedItem)
                })
              : selectedItem
            this.$refs.elTableRef.toggleRowSelection(thisTableItem)
            if (this.isServerSide && this.isServerSideSelection) {
              this.serverSideSelectionCount--
            }
            if (this.isSelectedAllEver) {
              this.excludedResourceIdList.push(selectedItem[this.rowKey])
            }
          }
        } else {
          this.$refs.elTableRef.clearSelection()
          if (this.isServerSide && this.isServerSideSelection) {
            this.serverSideSelectionCount -= this.tableData.length
            if (this.isSelectedAllEver) {
              for (const item of this.tableData) {
                this.excludedResourceIdList.push(item[this.rowKey])
              }
            }
          }
        }
      }
    },
    rowAct(action, row, scope) {
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
        case 'deleteAndNotifyInvestigationDetails':
          this.$emit(
            'deleteAndNotifyInvestigationDetailsFunction',
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
    clusterSelected(name) {
      this.selectedCluster = name
      /*
      this.firstColFixed = false
      this.lastColFixed = false
       */
      this.$emit('clusterChanged', name)
      this.multipleSelection = []
      this.$refs.elTableRef.clearSelection()
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
      selectionsCopy.forEach((item) => {
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
          icon: 'mdi-check-circle'
        })
      })
    },
    unSelectRow(row) {
      this.$refs.elTableRef.toggleRowSelection(row, false)
    },
    handleEdit(selections, index) {
      this.isMultipleEdit = false
      if (index > -1) {
        this.extendedViewStyle = {
          top: `${index * 48}px`
        }
      }

      if (this.isServerSide && this.isServerSideSelection) {
        if (!this.multipleSelection.find((item) => item[this.rowKey] === selections[this.rowKey])) {
          this.findAndDeleteFromExcludedResourceIdList(selections[this.rowKey])
          this.serverSideSelectionCount++
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
        this.isSettingsOpened = false
      } else {
        // Nothing selected
      }
    },
    handleDelete(selections) {
      switch (this.refName) {
        case 'investigationDetailsListTable':
          this.$emit(
            'deleteInvestigationDetails',
            selections,
            ...Object.values(this.getServerSideSelectionParams())
          )
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
      this.$emit(
        'sendInvestigationDetailsWarningMessage',
        selections,
        ...Object.values(this.getServerSideSelectionParams())
      )
    },
    handleResend(selections) {
      this.$emit('on-resend', selections, ...Object.values(this.getServerSideSelectionParams()))
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
      this.isSelectedAllEver = false
      this.$emit('columnFilterChanged', filterObj)
    },
    handleClearColumnFilter(fieldName) {
      this.isSelectedAllEver = false
      this.$delete(this.filterValues, fieldName)
      this.$emit('columnFilterCleared', fieldName)
    },
    reRenderColumns(filterValues = {}) {
      this.$nextTick(() => {
        this.filterValues = filterValues
        this.columnKey = `column-key${Math.random().toString().substring(0, 5)}`
      })
    }
  }
}
</script>

<style lang="scss">
.datatable-row-action-list {
  padding: 0 !important;
  line-height: inherit !important;
  min-height: 24px !important;
  .v-list-item__title {
    padding: 0 16px;
    display: flex;
    align-items: center;
    min-height: 40px;
  }
}
.dataTableText-validation-error {
  font-size: 9px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #f56c6c;
  position: absolute;
  top: 4px;
}
.dataTableText-main-error {
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #f56c6c;
}
.v-menu__content.theme--light.menuable__content__active.data-table-filter__date-picker {
  &-select {
    &-menu {
      z-index: 9999999999 !important;
    }
  }
}
.k-table__wrapper--no-padding {
  padding-bottom: 0 !important;
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
