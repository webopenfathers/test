import { getEventParams } from "../../utils/utils";

Component({
  options: {
    multipleSlots: true,
  },
  // 组件间关系定义
  relations: {
    "../grid-item/grid-item": {
      type: "child",
    },
  },
  properties: {
    // 配置每一行显示个数
    rowNum: {
      type: Number,
      value: 3,
    },
    // 配置标题
    title: String,
    // 扩展字段
    extend: String,
    extendCell: Object,
  },
  data: {},
  lifetimes: {
    ready() {
      this.getGridItems();
    },
  },
  methods: {
    getGridItems() {
      // 获取指定子组件的数量
      const items = this.getRelationNodes("../grid-item/grid-item");
      const gridItems = items.map((item, index) => {
        return {
          index,
        };
      });

      this.setData({
        gridItems,
      });
    },

    // 扩展字段事件监听
    handleExtend() {
      this.triggerEvent("extendtap", { cell: this.data.extendCell });
    },

    // 接收宫格元素传过来的事件
    handleSelect(event) {
      const cell = getEventParams(event, "cell");
      this.triggerEvent("itemtap", { cell });
    },
  },
});
