<template>
  <div class="target-users">
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
      :groupable="true"
      :clusterItems="clusterItems"
      :rowActions="rowActions"
      :addUsers="addUsers"
      :empty="iEmpty"
      :selectEvent="selectEvent"
      :chartOptions="chartOptions"
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
        name: 'Tom Ricardo',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 93, Grove St, Los Angeles / California',
        zip: 'CA 90036',
        date: '2016-05-03',
        chart: [44, 55, 13, 43],
        progress: 80,
        status: 'Pending',
        children: [
          {
            // This defines collapse data on the row, cluster should change the api call and backend should implement this one with 'children' name
            id: 889,
            name: 'Tom Ricardo',
            state: 'California',
            city: 'Los Angeles',
            address: 'No. 93, Grove St, Los Angeles / California',
            zip: 'CA 90036',
            date: '2016-05-03',
            chart: [10, 55, 15, 20],
            progress: 100,
            status: 'Active'
          },
          {
            id: 890,
            name: 'Tom Ricardo',
            state: 'California',
            city: 'Los Angeles',
            address: 'A different address',
            zip: 'CA 90036',
            date: '2016-05-03',
            chart: [44, 55, 13, 43],
            progress: 40,
            status: 'Pending'
          }
        ]
      },
      {
        id: 2,
        name: 'John Bill',
        state: 'Washington',
        city: 'Vancouver',
        address: 'No. 12, Baker St, Vancouver / Washington',
        zip: 'CA 89124',
        date: '2016-05-02',
        chart: [13, 75, 5, 7],
        progress: 100,
        status: 'Active'
      },
      {
        id: 3,
        name: 'Hermann Rorschach',
        state: 'California',
        city: 'Beverly Hills',
        address: 'No. 77, Down St, Beverly Hills / California',
        zip: 'CA 12153',
        date: '2016-05-07',
        chart: [87, 3, 5, 5],
        progress: 100,
        status: 'Active'
      },
      {
        id: 4,
        name: 'Brad Gabriel Thurmann',
        state: 'Washington',
        city: 'Seattle',
        address: 'No. 121, Left St, Seattle / Washington',
        zip: 'CA 23478',
        date: '2016-05-04',
        chart: [1, 2, 90, 7],
        progress: 20,
        status: 'Cancelled'
      },
      {
        id: 5,
        name: 'Philip John',
        state: 'California',
        city: 'Malibu',
        address: 'No. 189, Right St, Malibu / California',
        zip: 'CA 34586',
        date: '2016-05-01',
        chart: [25, 25, 25, 25],
        progress: 50,
        status: 'Warning'
      },
      {
        id: 6,
        name: 'Cannon Ball',
        state: 'California',
        city: 'Riverside',
        address: 'No. 216, Main St, Riverside / California',
        zip: 'CA 51238',
        date: '2016-05-08',
        progress: 70,
        chart: [10, 40, 49, 1],
        status: 'Pending'
      },
      {
        id: 7,
        name: 'Michael Smith',
        state: 'California',
        city: 'Sacramento',
        address: 'No. 13, Up St, Sacramento / California',
        zip: 'CA 30093',
        date: '2016-05-06',
        chart: [25, 25, 25, 25],
        progress: 30,
        status: 'Inactive'
      },
      {
        id: 8,
        name: 'Hermann Rorschach',
        state: 'California',
        city: 'Beverly Hills',
        address: 'No. 77, Down St, Beverly Hills / California',
        zip: 'CA 12153',
        date: '2016-05-07',
        chart: [87, 3, 5, 5],
        progress: 100,
        status: 'Active'
      },
      {
        id: 9,
        name: 'Tom Ricardo',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 93, Grove St, Los Angeles / California',
        zip: 'CA 90036',
        date: '2016-05-03',
        chart: [12, 35, 45, 8],
        progress: 80,
        status: 'Pending'
      },
      {
        id: 10,
        name: 'John Bill',
        state: 'Washington',
        city: 'Vancouver',
        address: 'No. 12, Baker St, Vancouver / Washington',
        zip: 'CA 89124',
        date: '2016-05-02',
        chart: [56, 12, 2, 30],
        progress: 100,
        status: 'Active'
      },
      {
        id: 11,
        name: 'Brad Gabriel Thurmann',
        state: 'Washington',
        city: 'Seattle',
        address: 'No. 121, Left St, Seattle / Washington',
        zip: 'CA 23478',
        date: '2016-05-04',
        chart: [87, 3, 5, 5],
        progress: 20,
        status: 'Cancelled'
      },
      {
        id: 12,
        name: 'Philip John',
        state: 'California',
        city: 'Malibu',
        address: 'No. 189, Right St, Malibu / California',
        zip: 'CA 34586',
        date: '2016-05-01',
        chart: [1, 2, 90, 7],
        progress: 50,
        status: 'Warning'
      },
      {
        id: 13,
        name: 'Cannon Ball',
        state: 'California',
        city: 'Riverside',
        address: 'No. 216, Main St, Riverside / California',
        zip: 'CA 51238',
        date: '2016-05-08',
        chart: [44, 55, 13, 43],
        progress: 70,
        status: 'Pending'
      },
      {
        id: 14,
        name: 'Michael Smith',
        state: 'California',
        city: 'Sacramento',
        address: 'No. 13, Up St, Sacramento / California',
        zip: 'CA 30093',
        date: '2016-05-06',
        chart: [12, 55, 25, 8],
        progress: 30,
        status: 'Inactive'
      },
      {
        id: 15,
        name: 'Hermann Rorschach',
        state: 'California',
        city: 'Beverly Hills',
        address: 'No. 77, Down St, Beverly Hills / California',
        zip: 'CA 12153',
        date: '2016-05-07',
        chart: [56, 12, 2, 30],
        progress: 100,
        status: 'Active'
      },
      {
        id: 16,
        name: 'Tom Ricardo',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 93, Grove St, Los Angeles / California',
        zip: 'CA 90036',
        date: '2016-05-03',
        chart: [56, 12, 2, 30],
        progress: 80,
        status: 'Pending'
      },
      {
        id: 17,
        name: 'John Bill',
        state: 'Washington',
        city: 'Vancouver',
        address: 'No. 12, Baker St, Vancouver / Washington',
        zip: 'CA 89124',
        date: '2016-05-02',
        chart: [56, 12, 2, 30],
        progress: 100,
        status: 'Active'
      },
      {
        id: 18,
        name: 'Brad Gabriel Thurmann',
        state: 'Washington',
        city: 'Seattle',
        address: 'No. 121, Left St, Seattle / Washington',
        zip: 'CA 23478',
        date: '2016-05-04',
        chart: [56, 12, 2, 30],
        progress: 20,
        status: 'Cancelled'
      },
      {
        id: 19,
        name: 'Philip John',
        state: 'California',
        city: 'Malibu',
        address: 'No. 189, Right St, Malibu / California',
        zip: 'CA 34586',
        date: '2016-05-01',
        chart: [56, 12, 2, 30],
        progress: 50,
        status: 'Warning'
      },
      {
        id: 20,
        name: 'Cannon Ball',
        state: 'California',
        city: 'Riverside',
        address: 'No. 216, Main St, Riverside / California',
        zip: 'CA 51238',
        date: '2016-05-08',
        chart: [1, 12, 70, 17],
        progress: 70,
        status: 'Pending'
      },
      {
        id: 21,
        name: 'Michael Smith',
        state: 'California',
        city: 'Sacramento',
        address: 'No. 13, Up St, Sacramento / California',
        zip: 'CA 30093',
        date: '2016-05-06',
        chart: [12, 12, 50, 26],
        progress: 30,
        status: 'Inactive'
      },
      {
        id: 22,
        name: 'Hermann Rorschach',
        state: 'California',
        city: 'Beverly Hills',
        address: 'No. 77, Down St, Beverly Hills / California',
        zip: 'CA 12153',
        date: '2016-05-07',
        chart: [56, 12, 2, 30],
        progress: 100,
        status: 'Active'
      }
    ],
    columns: [
      // Should be defined to show the table
      {
        property: 'name',
        align: 'left',
        editable: false,
        label: 'Name',
        fixed: 'left',
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
        property: 'date',
        align: 'left',
        editable: false,
        label: 'Date',
        fixed: false,
        sortable: true,
        show: true,
        type: 'text',
        width: 110
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
    title: {
      icon: 'mdi-tab-unselected',
      title: 'Target Users',
      subTitle: ''
    },
    pageSizes: [6, 13, 25, 50, 100],
    rowActions: [
      {
        name: 'Edit this row',
        icon: 'mdi-pencil',
        action: 'edit'
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
    addUsers: {
      show: true,
      popUp: true
    },
    iEmpty: {
      message: 'You do not have any users added, yet',
      subMes: 'Start now',
      btn: 'Add Users',
      icon: 'mdi-account-plus'
    },
    selectEvent: {
      clipboard: true,
      edit: true,
      delete: true,
      download: true
    },
    chartOptions: {
      chart: {
        type: 'pie',
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D'],
      colors: ['#67c23a', '#409eff', '#f56c6c', '#ffcc33'],
      legend: {
        show: false
      },
      tooltip: {
        enabled: false
      },
      dataLabels: {
        enabled: false
      }
    },
    clusterItems: [
      {
        name: 'Name',
        action: 'nameCluster',
        seledted: false
      },
      {
        name: 'City',
        action: 'cityCluster',
        seledted: false
      },
      {
        name: 'Address',
        action: 'addressCluster',
        seledted: false
      }
    ]
  })
}
</script>
<style lang="scss" scoped>
.target-users {
  padding: 16px;
}
</style>
