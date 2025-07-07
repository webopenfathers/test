import { throttle } from "../../utils/utils";

Component({
  options: {
    multipleSlots: true,
  },
  //定义接收属性
  properties: {
    tabs: {
      type: Array,
      value: [],
    },
    active: {
      type: Number,
      value: 0,
    },
  },
  observers: {
    active: function (active) {
      this.setData({
        currentTabIndex: active,
      });
    },
  },
  // 定义组件自身数据
  data: {
    currentTabIndex: 0,
  },
  // 定义方法
  methods: {
    // 1传入一个数组，按数组元素内容渲染我们的标签页选项
    // 2.能够监听点击事件，并且通知使用组件或者父组件，通过事件通知我们选择了什么
    // 通用组件
    // 点击item切换效果

    // 父组件（页面）通过属性给自定义组件传递参数
    // 自定义组件通过自定义事件给父组件（页面）传递参数
    handleTabChange: throttle(function (e) {
      const index = e.currentTarget.dataset.index;
      if (index === this.data.currentTabIndex) {
        return;
      }
      this.setData({
        currentTabIndex: index,
      });
      // 通知父向父通信的事件---自定义事件
      // 参数  事件的名称  传递的参数
      this.triggerEvent("change", { index });
    }),

    handleTouchMove(e) {
      // 0,-1,1
      const direction = e.direction;
      const currentTabIndex = this.data.currentTabIndex;
      const targetTabIndex = currentTabIndex + direction;
      if (targetTabIndex < 0 || targetTabIndex > this.data.tabs.length - 1) {
        return;
      }

      const customEvent = {
        currentTarget: {
          dataset: {
            index: targetTabIndex,
          },
        },
      };

      this.handleTabChange(customEvent);
    },
  },
});
