const { default: orderAction } = require("../../../enum/order-action");
const { default: orderStatus } = require("../../../enum/order-status");
const { getDataSet } = require("../../../utils/utils");

const behavior = Behavior({
  properties: {
    order: Object,
  },
  data: {
    orderStatus: orderStatus,
    orderAction: orderAction,
  },
  methods: {
    handleUpdateOrderStatus: function (event) {
      const action = getDataSet(event, "action");
      this.triggerEvent("update-status", { action });
    },
  },
});

export default behavior;
