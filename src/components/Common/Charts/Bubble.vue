<script>
import { Bubble } from 'vue-chartjs'

export default {
  name: 'Bubble',
  extends: Bubble,
  props: ['chartdata', 'options'],
  mounted() {
    this.renderChart(
      {
        datasets: [
          {
            label: 'John',
            data: [
              {
                x: 3,
                y: 7,
                r: 25
              }
            ],
            backgroundColor: '#ff6384',
            hoverBackgroundColor: '#ff6384'
          },
          {
            label: 'Paul',
            data: [
              {
                x: 6,
                y: 2,
                r: 10
              }
            ],
            backgroundColor: '#ff6384',
            hoverBackgroundColor: '#ff6384'
          },
          {
            label: 'George',
            data: [
              {
                x: 2,
                y: 6,
                r: 10
              }
            ],
            backgroundColor: '#ff6384',
            hoverBackgroundColor: '#ff6384'
          },
          {
            label: 'Ringo',
            data: [
              {
                x: 5,
                y: 3,
                r: 10
              }
            ],
            backgroundColor: '#ff6384',
            hoverBackgroundColor: '#ff6384'
          },
          {
            label: 'John',
            data: [
              {
                x: 2,
                y: 1,
                r: 10
              }
            ],
            backgroundColor: '#ff6384',
            hoverBackgroundColor: '#ff6384'
          },
          {
            label: 'George',
            data: [
              {
                x: 1,
                y: 3,
                r: 10
              }
            ],
            backgroundColor: '#ff6384',
            hoverBackgroundColor: '#ff6384'
          },
          {
            label: 'Ringo',
            data: [
              {
                x: 1,
                y: 1,
                r: 10
              }
            ],
            backgroundColor: '#ff6384',
            hoverBackgroundColor: '#ff6384'
          },
          {
            label: 'George',
            data: [
              {
                x: 1,
                y: 2,
                r: 10
              }
            ],
            backgroundColor: '#ff6384',
            hoverBackgroundColor: '#ff6384'
          }
        ]
      },
      { responsive: true, height: 350 }
    )
  }
}
</script>

<style lang="scss"></style>
