Component({
  // 组件间关系定义
  relations: {
    "../grid/grid": {
      type: "parent",
    },
  },
  properties: {
    icon: String,
    iconSize: {
      type: String,
      value: 50,
    },
    text: String,
    showBadge: Boolean,
    badgeCount: Number,
    cell: Object,
  },
  data: {},
  methods: {
    handleSelect() {
      this.triggerEvent(
        "select",
        { cell: this.data.cell },
        // 事件冒泡和穿越组件边界
        { bubbles: true, composed: true }
      );
    },
  },
});
