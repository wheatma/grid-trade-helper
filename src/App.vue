<template>
  <div id="app">
    <el-container>
      <el-header>
        <span class="site-name">网格交易助手V2.0</span>
        <img class="site-slogan" src="../public/img/slogan.png" />
      </el-header>
      <el-main>
        <el-card shadow="hover">
          <grid-form :onSubmit="onSubmit"></grid-form>
        </el-card>
        <grid-table
          style="marginTop: 40px"
          :config="config"
          :data="data"
        ></grid-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import GridForm from './components/GridForm';
import GridTable from './components/GridTable';
import GridData from './libs/GridData';

export default {
  name: 'app',
  components: {
    'grid-form': GridForm,
    'grid-table': GridTable
  },
  data() {
    return {
      data: [],
      config: {}
    };
  },
  methods: {
    onSubmit(formValues) {
      const { trap, retain } = formValues;
      this.config = {
        trap,
        retain
      };

      const gridData = new GridData(formValues);
      this.data = gridData.getData();
    }
  }
};
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  overflow-x: hidden;
}
.site-name {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 60px;
}
.site-slogan {
  width: 400px;
  transform: rotate(-3deg);
  -webkit-transform: rotate(-3deg);
  -moz-transform: rotate(-3deg);
}
</style>
