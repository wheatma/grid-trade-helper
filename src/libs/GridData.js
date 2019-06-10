import { formatAmount, formatPrice } from './format';

const BASIC_TRADE_AMOUNT = 100;

export default class GridData {
  constructor(conditions) {
    this.conditions = conditions;
    const {
      startPrice,
      amount,
      rate,
      retain,
      retainTimes,
      raise,
      raiseRate,
      trap,
      trapTimes
    } = conditions;
    this.priceStep = (startPrice * rate) / 100;
    this.moneyStep = raise ? (amount * raiseRate) / 100 : 0;
    this.retainTimes = retain ? retainTimes : 0;
    this.trapTimes = trap && trapTimes > 1 ? trapTimes : 0;
  }

  getData() {
    const { rate, stress } = this.conditions;
    let row = 0;
    const len = Math.floor(stress / rate);
    let data = [];
    while (row <= len) {
      data.push(this.getRowData(row));
      if (this.trapTimes && row) {
        if (!(row % this.trapTimes)) {
          data.push(this.getRowData(row, 'middle'));
        }
        if (!(row % (this.trapTimes * 2))) {
          data.push(this.getRowData(row, 'large'));
        }
      }
      row++;
    }
    return data;
  }

  getRowBuyPrice(index) {
    const { startPrice } = this.conditions;
    return Number(formatPrice(startPrice - index * this.priceStep));
  }

  getRowPriceStep(type) {
    let priceStep = this.priceStep;
    switch (type) {
      case 'middle':
        priceStep *= this.trapTimes;
        break;
      case 'large':
        priceStep *= 2 * this.trapTimes;
        break;
      default:
        break;
    }
    return priceStep;
  }

  getRowSellPrice(index, type) {
    const rowBuyPrice = this.getRowBuyPrice(index);
    return Number(formatPrice(rowBuyPrice + this.getRowPriceStep(type)));
  }

  getRowBuyMoney(index) {
    const { amount } = this.conditions;
    return Number(formatAmount(amount + index * this.moneyStep));
  }

  getRowData(index, type = 'small') {
    const { mode } = this.conditions;

    const buyPrice = this.getRowBuyPrice(index);
    const buyMoney = this.getRowBuyMoney(index);
    const sellPrice = this.getRowSellPrice(index, type);
    const rowData = new RowData({
      type,
      buyPrice,
      buyMoney,
      sellPrice,
      retainTimes: this.retainTimes
    });
    return mode ? rowData.getTradeData() : rowData.getData();
  }
}

class RowData {
  constructor(conditions) {
    const {
      buyPrice,
      sellPrice,
      buyMoney,
      retainTimes,
      type = 'small'
    } = conditions;
    this.buyPrice = buyPrice;
    this.sellPrice = sellPrice;
    this.buyMoney = buyMoney;
    this.retainTimes = retainTimes;
    this.type = type;
  }

  getBuyAmount() {
    if (!this.buyAmount) {
      this.buyAmount = this.buyMoney / this.buyPrice;
    }
    return this.buyAmount;
  }

  getSellMoney() {
    if (!this.sellMoney) {
      const planSellMoney = this.getBuyAmount() * this.sellPrice;
      const profit = planSellMoney - this.buyMoney;
      const retainProfit = profit * this.retainTimes;
      this.sellMoney =
        planSellMoney > retainProfit ? planSellMoney - retainProfit : 0;
    }
    return this.sellMoney;
  }

  getSellAmount() {
    if (!this.sellAmount) {
      this.sellAmount = this.getSellMoney() / this.sellPrice;
    }
    return this.sellAmount;
  }

  getRetainProfit() {
    return this.sellPrice * this.getRetainAmount();
  }

  getRetainAmount() {
    return this.getBuyAmount() - this.getSellAmount();
  }

  getProfit() {
    return this.getSellMoney() - this.buyMoney;
  }

  getProfitRate() {
    return this.buyMoney > 0 ? (this.getProfit() * 100) / this.buyMoney : '-';
  }

  getData() {
    const data = {
      buyPrice: formatPrice(this.buyPrice),
      sellPrice: formatPrice(this.sellPrice),
      buyMoney: formatAmount(this.buyMoney),
      buyAmount: formatAmount(this.getBuyAmount()),
      sellAmount: formatAmount(this.getSellAmount()),
      sellMoney: formatAmount(this.getSellMoney())
    };
    const indexs = this.retainTimes
      ? {
          retainProfit: formatAmount(this.getRetainProfit()),
          retainAmount: formatAmount(this.getRetainAmount())
        }
      : {
          profit: formatAmount(this.getProfit()),
          profitRate: formatPrice(this.getProfitRate())
        };

    return {
      type: this.type,
      ...data,
      ...indexs
    };
  }

  getTradeBuyAmount() {
    if (!this.tradeBuyAmount) {
      const buyAmount = this.getBuyAmount();
      this.tradeBuyAmount =
        Math.round(buyAmount / BASIC_TRADE_AMOUNT) * BASIC_TRADE_AMOUNT;
    }
    return this.tradeBuyAmount;
  }

  getTradeBuyMoney() {
    if (!this.tradeBuyMoney) {
      this.tradeBuyMoney = this.buyPrice * this.getTradeBuyAmount();
    }
    return this.tradeBuyMoney;
  }

  getTradeSellAmount() {
    if (!this.tradeSellAmount) {
      const tradeBuyAmount = this.getTradeBuyAmount();
      const planTradeSellMoney = tradeBuyAmount * this.sellPrice;
      const profit = planTradeSellMoney - this.getTradeBuyMoney();
      const retainProfit = profit * this.retainTimes;
      const tradeRetainAmount =
        Math.round(retainProfit / this.sellPrice / BASIC_TRADE_AMOUNT) *
        BASIC_TRADE_AMOUNT;
      this.tradeSellAmount =
        tradeBuyAmount > tradeRetainAmount
          ? tradeBuyAmount - tradeRetainAmount
          : tradeBuyAmount;
    }
    return this.tradeSellAmount;
  }

  getTradeSellMoney() {
    if (!this.tradeSellMoney) {
      return this.getTradeSellAmount() * this.sellPrice;
    }
    return this.tradeSellMoney;
  }

  getTradeRetainProfit() {
    return this.sellPrice * this.getTradeRetainAmount();
  }

  getTradeRetainAmount() {
    return this.getTradeBuyAmount() - this.getTradeSellAmount();
  }

  getTradeProfit() {
    return this.getTradeSellMoney() - this.getTradeBuyMoney();
  }

  getTradeProfitRate() {
    const tradeBuyMoney = this.getTradeBuyMoney();
    return tradeBuyMoney > 0
      ? (this.getTradeProfit() * 100) / this.getTradeBuyMoney()
      : '-';
  }

  getTradeData() {
    const data = {
      buyPrice: formatPrice(this.buyPrice),
      sellPrice: formatPrice(this.sellPrice),
      buyMoney: formatPrice(this.getTradeBuyMoney()),
      buyAmount: formatAmount(this.getTradeBuyAmount()),
      sellAmount: formatAmount(this.getTradeSellAmount()),
      sellMoney: formatPrice(this.getTradeSellMoney())
    };
    const indexs = this.retainTimes
      ? {
          retainProfit: formatPrice(this.getTradeRetainProfit()),
          retainAmount: formatAmount(this.getTradeRetainAmount())
        }
      : {
          profit: formatPrice(this.getTradeProfit()),
          profitRate: formatPrice(this.getTradeProfitRate())
        };

    return {
      type: this.type,
      ...data,
      ...indexs
    };
  }
}
