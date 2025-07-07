const { default: behavior } = require("../behavior");

Component({
  behaviors: [behavior],
  properties: {},
  methods: {
    handlePay: function () {
      this.triggerEvent("pay");
    },

    handleRefund() {
      this.triggerEvent("refund");
    },

    handleRating() {
      this.triggerEvent("rating");
    },
  },
});
