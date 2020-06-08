<template>
  <div>
    <datatable
      :refName="'testTable'"
      :columns="columns"
      :table="tableData"
      :title="title"
      :countRow="6"
      :pageSizes="pageSizes"
      :defaultSort="'date'"
      :selectable="true"
      :filterable="true"
      :options="true"
      :rowActions="rowActions"
      :addUsers="false"
      :empty="iEmpty"
    />
  </div>
</template>
<script>
import Datatable from '../components/DataTable'
export default {
  components: {
    Datatable
  },
  data: () => ({
    tableData: [
      {
        id: 1,
        date: '2016-05-03',
        name: 'Tom Ricardo',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 93, Grove St, Los Angeles / California',
        zip: 'CA 90036',
        series: [44, 55, 13, 43],
        progress: 80,
        status: 'Pending'
      },
      {
        id: 2,
        date: '2016-05-02',
        name: 'John Bill',
        state: 'Washington',
        city: 'Vancouver',
        address: 'No. 12, Baker St, Vancouver / Washington',
        zip: 'CA 89124',
        series: [13, 75, 5, 7],
        progress: 100,
        status: 'Active'
      },
      {
        id: 3,
        date: '2016-05-07',
        name: 'Hermann Rorschach',
        state: 'California',
        city: 'Beverly Hills',
        address: 'No. 77, Down St, Beverly Hills / California',
        zip: 'CA 12153',
        series: [87, 3, 5, 5],
        progress: 100,
        status: 'Active'
      },
      {
        id: 4,
        date: '2016-05-04',
        name: 'Brad Gabriel Thurmann',
        state: 'Washington',
        city: 'Seattle',
        address: 'No. 121, Left St, Seattle / Washington',
        zip: 'CA 23478',
        series: [1, 2, 90, 7],
        progress: 20,
        status: 'Cancelled'
      },
      {
        id: 5,
        date: '2016-05-01',
        name: 'Philip John',
        state: 'California',
        city: 'Malibu',
        address: 'No. 189, Right St, Malibu / California',
        zip: 'CA 34586',
        series: [25, 25, 25, 25],
        progress: 50,
        status: 'Warning'
      },
      {
        id: 6,
        date: '2016-05-08',
        name: 'Cannon Ball',
        state: 'California',
        city: 'Riverside',
        address: 'No. 216, Main St, Riverside / California',
        zip: 'CA 51238',
        progress: 70,
        series: [10, 40, 49, 1],
        status: 'Pending'
      },
      {
        id: 7,
        date: '2016-05-06',
        name: 'Michael Smith',
        state: 'California',
        city: 'Sacramento',
        address: 'No. 13, Up St, Sacramento / California',
        zip: 'CA 30093',
        series: [25, 25, 25, 25],
        progress: 30,
        status: 'Inactive'
      },
      {
        id: 8,
        date: '2016-05-07',
        name: 'Hermann Rorschach',
        state: 'California',
        city: 'Beverly Hills',
        address: 'No. 77, Down St, Beverly Hills / California',
        zip: 'CA 12153',
        series: [87, 3, 5, 5],
        progress: 100,
        status: 'Active'
      },
      {
        id: 9,
        date: '2016-05-03',
        name: 'Tom Ricardo',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 93, Grove St, Los Angeles / California',
        zip: 'CA 90036',
        series: [12, 35, 45, 8],
        progress: 80,
        status: 'Pending'
      },
      {
        id: 10,
        date: '2016-05-02',
        name: 'John Bill',
        state: 'Washington',
        city: 'Vancouver',
        address: 'No. 12, Baker St, Vancouver / Washington',
        zip: 'CA 89124',
        series: [56, 12, 2, 30],
        progress: 100,
        status: 'Active'
      },
      {
        id: 11,
        date: '2016-05-04',
        name: 'Brad Gabriel Thurmann',
        state: 'Washington',
        city: 'Seattle',
        address: 'No. 121, Left St, Seattle / Washington',
        zip: 'CA 23478',
        series: [87, 3, 5, 5],
        progress: 20,
        status: 'Cancelled'
      },
      {
        id: 12,
        date: '2016-05-01',
        name: 'Philip John',
        state: 'California',
        city: 'Malibu',
        address: 'No. 189, Right St, Malibu / California',
        zip: 'CA 34586',
        series: [1, 2, 90, 7],
        progress: 50,
        status: 'Warning'
      },
      {
        id: 13,
        date: '2016-05-08',
        name: 'Cannon Ball',
        state: 'California',
        city: 'Riverside',
        address: 'No. 216, Main St, Riverside / California',
        zip: 'CA 51238',
        series: [44, 55, 13, 43],
        progress: 70,
        status: 'Pending'
      },
      {
        id: 14,
        date: '2016-05-06',
        name: 'Michael Smith',
        state: 'California',
        city: 'Sacramento',
        address: 'No. 13, Up St, Sacramento / California',
        zip: 'CA 30093',
        series: [12, 55, 25, 8],
        progress: 30,
        status: 'Inactive'
      },
      {
        id: 15,
        date: '2016-05-07',
        name: 'Hermann Rorschach',
        state: 'California',
        city: 'Beverly Hills',
        address: 'No. 77, Down St, Beverly Hills / California',
        zip: 'CA 12153',
        series: [56, 12, 2, 30],
        progress: 100,
        status: 'Active'
      },
      {
        id: 16,
        date: '2016-05-03',
        name: 'Tom Ricardo',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 93, Grove St, Los Angeles / California',
        zip: 'CA 90036',
        series: [56, 12, 2, 30],
        progress: 80,
        status: 'Pending'
      },
      {
        id: 17,
        date: '2016-05-02',
        name: 'John Bill',
        state: 'Washington',
        city: 'Vancouver',
        address: 'No. 12, Baker St, Vancouver / Washington',
        zip: 'CA 89124',
        series: [56, 12, 2, 30],
        progress: 100,
        status: 'Active'
      },
      {
        id: 18,
        date: '2016-05-04',
        name: 'Brad Gabriel Thurmann',
        state: 'Washington',
        city: 'Seattle',
        address: 'No. 121, Left St, Seattle / Washington',
        zip: 'CA 23478',
        series: [56, 12, 2, 30],
        progress: 20,
        status: 'Cancelled'
      },
      {
        id: 19,
        date: '2016-05-01',
        name: 'Philip John',
        state: 'California',
        city: 'Malibu',
        address: 'No. 189, Right St, Malibu / California',
        zip: 'CA 34586',
        series: [56, 12, 2, 30],
        progress: 50,
        status: 'Warning'
      },
      {
        id: 20,
        date: '2016-05-08',
        name: 'Cannon Ball',
        state: 'California',
        city: 'Riverside',
        address: 'No. 216, Main St, Riverside / California',
        zip: 'CA 51238',
        series: [1, 12, 70, 17],
        progress: 70,
        status: 'Pending'
      },
      {
        id: 21,
        date: '2016-05-06',
        name: 'Michael Smith',
        state: 'California',
        city: 'Sacramento',
        address: 'No. 13, Up St, Sacramento / California',
        zip: 'CA 30093',
        series: [12, 12, 50, 26],
        progress: 30,
        status: 'Inactive'
      },
      {
        id: 22,
        date: '2016-05-07',
        name: 'Hermann Rorschach',
        state: 'California',
        city: 'Beverly Hills',
        address: 'No. 77, Down St, Beverly Hills / California',
        zip: 'CA 12153',
        series: [56, 12, 2, 30],
        progress: 100,
        status: 'Active'
      }
    ],
    columns: [
      // Should be defined to show the table
      {
        property: 'date',
        align: 'left',
        editable: false,
        label: 'Date',
        fixed: 'left',
        sortable: true,
        show: true,
        type: 'text',
        width: 110
      },
      {
        property: 'name',
        align: 'left',
        editable: false,
        label: 'Name',
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        width: 200
      },
      {
        property: 'city',
        align: 'left',
        editable: false,
        label: 'City',
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        width: 120
      },
      {
        property: 'address',
        align: 'left',
        editable: false,
        label: 'Address',
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        width: 300
      },
      {
        property: 'zip',
        align: 'center',
        editable: false,
        label: 'Zip',
        fixed: false,
        sortable: false,
        show: true,
        type: 'text',
        width: 120
      },
      {
        property: 'chart',
        align: 'center',
        editable: false,
        label: 'Chart',
        fixed: false,
        sortable: false,
        show: true,
        type: 'chart',
        width: 70
      },
      {
        property: 'progress',
        align: 'center',
        editable: false,
        label: 'Progress',
        fixed: false,
        sortable: false,
        show: true,
        type: 'progress',
        width: 85
      },
      {
        property: 'status',
        align: 'center',
        editable: false,
        label: 'Status',
        fixed: 'right',
        sortable: true,
        show: true,
        type: 'status',
        width: 120
      }
    ],
    pageSizes: [6, 13, 25, 50, 100],
    rowActions: [
      {
        name: 'Add to a group',
        icon: 'mdi-account-multiple-plus',
        action: 'addToGroup'
      },
      {
        name: 'Create a group with user',
        icon: 'mdi-account-multiple',
        action: 'createGroupWithUser'
      },
      {
        name: 'Sync User',
        icon: 'mdi-sync',
        action: 'syncUser'
      },
      {
        name: 'Download',
        icon: 'mdi-download',
        action: 'downloadRow',
        subElements: ['PDF', 'CSV', 'XLS']
      },
      {
        name: 'Delete',
        icon: 'mdi-delete',
        action: 'deleteRow'
      }
    ],
    iEmpty: {
      message: 'You do not have any users added, yet',
      subMes: 'Start now',
      btn: 'Add Users',
      icon: 'mdi-account-plus'
    },
    title: {
      icon: 'mdi-tab-unselected',
      title: 'Target Users',
      subTitle: ''
    }
  })
}
</script>
