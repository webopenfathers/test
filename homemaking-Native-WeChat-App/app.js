const { createStoreBindings } = require("mobx-miniprogram-bindings");
const { default: Token } = require("./model/token");
const { timStore } = require("./store/tim");

// app.js
App({
  async onLaunch() {
    const res = await Token.verifyToken();
    if (res.valid) {
      this.storeBindings = createStoreBindings(this, {
        store: timStore,
        actions: ["login"],
      });
      await this.login();
      this.storeBindings.destroyStoreBindings()
    }
  },
});
