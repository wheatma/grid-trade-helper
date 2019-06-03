<template>
  <el-table
    class="grid-table"
    :data="data"
    show-summary
    :summary-method="getSummaries"
    :row-class-name="tableRowClassName"
  >
    <el-table-column
      v-if="!config.trap"
      type="index"
      label="序号"
      width="80"
    ></el-table-column>
    <el-table-column
      :key="column.prop"
      v-for="column in columns"
      v-bind="column"
    ></el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  computed: {
    columns() {
      const { trap = false, retain = false } = this.config;

      let columns = [
        {
          prop: 'buyPrice',
          label: '买入价格'
        },
        {
          prop: 'sellPrice',
          label: '卖出价格'
        },

        {
          prop: 'buyMoney',
          label: '买入金额'
        },
        {
          prop: 'buyAmount',
          label: '买入数量'
        },

        {
          prop: 'sellMoney',
          label: '卖出金额'
        },
        {
          prop: 'sellAmount',
          label: '卖出数量'
        }
      ];

      const types = {
        small: '小网',
        middle: '中网',
        large: '大网'
      };

      const trapColumn = trap
        ? [
            {
              prop: 'type',
              label: '种类',
              width: 80,
              formatter(row, column, cellValue) {
                return types[cellValue] || '';
              }
            }
          ]
        : [];

      const retainColumns = retain
        ? [
            {
              prop: 'retainAmount',
              label: '本期留存数量'
            },
            {
              prop: 'retainProfit',
              label: '本期留存利润'
            }
          ]
        : [
            {
              prop: 'profit',
              label: '盈利金额'
            },
            {
              prop: 'profitRate',
              label: '盈利比例',
              formatter(row, cellValue, value) {
                return `${value}%`;
              }
            }
          ];

      columns = [...trapColumn, ...columns, ...retainColumns];

      return columns;
    }
  },
  methods: {
    tableRowClassName({ row }) {
      if (row.type === 'middle') {
        return 'middle-grid';
      } else if (row.type === 'large') {
        return 'large-grid';
      }
      return '';
    },
    getSummaries(param) {
      const { columns, data } = param;
      return columns.map((column, index) => {
        if (index === 0) {
          return '压力测试';
        }
        if (column.property === 'buyMoney') {
          const values = data.map(item => Number(item[column.property]));
          return values.reduce((sum, value) => {
            sum += value;
            return sum;
          }, 0);
        }
        return '';
      });
    }
  }
};
</script>

<style lang="less">
.grid-table {
  .middle-grid {
    background: #b3d8ff;
  }

  .large-grid {
    background: #409eff;
    color: #ffffff;
    &:hover {
      color: #606266;
    }
  }
}
</style>
