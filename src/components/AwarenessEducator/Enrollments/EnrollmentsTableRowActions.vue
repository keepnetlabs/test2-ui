<template>
  <div>
    <DefaultButtonRowAction
      :icon="getFirstActionIcon"
      :text="rowActions[0].name"
      :scope="scope"
      :disabled="rowActions[0].disabled"
      :checkIsOwnerProperty="false"
      @on-click="handleAction(scope.row)"
    />
    <RowActionsMenu>
      <DefaultMenuRowAction
        :scope="scope"
        :disabled="rowActions[1].disabled"
        :icon="rowActions[1].icon"
        :text="rowActions[1].name"
        @on-click="handleAction(scope.row)"
      />
      <DefaultMenuRowAction
        :scope="scope"
        :check-is-owner-property="false"
        :disabled="rowActions[2].disabled"
        :icon="rowActions[2].icon"
        :text="rowActions[2].name"
        :checkIsOwnerProperty="false"
        @on-click="handleAction(scope.row)"
      />
      <DefaultMenuRowAction
        :scope="scope"
        :disabled="rowActions[4].disabled"
        :icon="rowActions[4].icon"
        :text="rowActions[4].name"
        @on-click="handleAction(scope.row)"
      />
    </RowActionsMenu>
  </div>
</template>

<script>
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu'
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction'
export default {
  name: 'EnrollmentsTableRowActions',
  components: {
    DefaultMenuRowAction,
    DefaultButtonRowAction,
    RowActionsMenu
  },
  props: {
    rowActions: {
      type: Array
    },
    scope: {
      type: Object
    }
  },
  computed: {
    getFirstActionIcon() {
      return ''
    }
  },
  methods: {
    handleAction() {}
  }
}
</script>
