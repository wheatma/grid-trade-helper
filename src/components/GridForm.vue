<template>
  <el-form
    class="grid-form"
    :model="form"
    :rules="rules"
    ref="gridForm"
    label-width="100px"
  >
    <el-row :gutter="20">
      <el-col :span="12" :xs="24">
        <el-form-item prop="startPrice">
          <template v-slot:label
            >开网价格
            <el-tooltip
              effect="dark"
              content="网格第一次买入的价格"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <el-input-number
            v-model="form.startPrice"
            :min="0"
            :step="0.01"
            :controls="false"
            placeholder="请输入开网价格"
          ></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12" :xs="24">
        <el-form-item label="每网金额" prop="amount">
          <el-input-number
            v-model="form.amount"
            :min="0"
            :step="100"
            :controls="false"
            placeholder="请输入每网金额"
          ></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12" :xs="24">
        <el-form-item label="网格幅度" required>
          <el-slider
            v-model.number="form.rate"
            :marks="marks.rate"
            :step="1"
            :min="1"
            :max="15"
            :format-tooltip="formatTooltip"
          ></el-slider>
        </el-form-item>
      </el-col>
      <el-col :span="12" :xs="24">
        <el-form-item required>
          <template v-slot:label
            >压力测试
            <el-tooltip
              effect="dark"
              content="相比开网价格可承受的最大跌幅"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <el-slider
            v-model.number="form.stress"
            :marks="marks.stress"
            :step="5"
            :min="15"
            :max="95"
            :format-tooltip="formatTooltip"
          ></el-slider>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12" :xs="24">
        <el-form-item prop="mode">
          <template v-slot:label
            >模式
            <el-tooltip
              effect="dark"
              content="券商模式买入/卖出数量以100为单位"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <el-switch
            v-model="form.mode"
            active-text="券商模式"
            inactive-text="理论模式"
          ></el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="12" :xs="24">
        <el-form-item label="策略" prop="strategy">
          <el-checkbox v-model="form.retain">留利润</el-checkbox>
          <el-checkbox v-model="form.raise">逐格加码</el-checkbox>
          <el-checkbox v-model="form.trap">一网打尽</el-checkbox>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.retain" :gutter="20">
      <el-col :span="12" :xs="24">
        <el-form-item label="利润倍数">
          <el-input-number
            v-model="form.retainTimes"
            :step="1"
            :min="1"
            placeholder="请输入利润倍数"
            step-strictly
          ></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.raise" :gutter="20">
      <el-col :span="12" :xs="24">
        <el-form-item label="加码幅度">
          <el-slider
            v-model.number="form.raiseRate"
            :marks="marks.rate"
            :step="5"
            :max="30"
            :format-tooltip="formatTooltip"
          ></el-slider>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.trap" :gutter="20">
      <el-col :span="12" :xs="24">
        <el-form-item label="张网系数">
          <el-input-number
            v-model="form.trapTimes"
            :step="1"
            :min="2"
            :max="Math.floor(50 / form.rate)"
            placeholder="请输入张网系数"
            step-strictly
          ></el-input-number>
          （中网{{ form.trapTimes * form.rate }}%， 大网{{
            form.trapTimes * form.rate * 2
          }}%）
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-form-item class="form-opt">
        <el-button type="primary" @click="submitForm('gridForm')"
          >生成网格</el-button
        >
        <el-button @click="resetForm('gridForm')">重置</el-button>
      </el-form-item>
    </el-row>
  </el-form>
</template>

<script>
const DEFULT_FORM_MODAL = {
  startPrice: 0.5,
  amount: 1000,
  rate: 5,
  stress: 60,
  mode: false,
  retain: false,
  retainTimes: 1,
  raise: false,
  raiseRate: 5,
  trap: false,
  trapTimes: 3
};
export default {
  props: {
    onSubmit: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    const getMarksConfig = text => {
      return {
        style: {
          color: '#1989FA'
        },
        label: this.$createElement('strong', text)
      };
    };
    return {
      form: {
        ...DEFULT_FORM_MODAL
      },
      marks: {
        rate: {
          5: getMarksConfig('5%'),
          10: getMarksConfig('10%')
        },
        stress: {
          60: getMarksConfig('60%'),
          80: getMarksConfig('80%')
        }
      },
      rules: {
        startPrice: [
          {
            required: true,
            message: '请输入开网价格',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '请输入数字',
            trigger: 'blur'
          }
        ],
        amount: [
          {
            required: true,
            message: '请输入每网金额',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '请输入数字',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    formatTooltip(val) {
      return `${val}%`;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        }
        this.onSubmit({ ...this.form });
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.form = {
        ...DEFULT_FORM_MODAL
      };
    }
  }
};
</script>

<style lang="less">
.grid-form {
  .el-form-item {
    margin-bottom: 30px;
  }
  .form-opt {
    margin-bottom: 0;
  }
}
</style>
