Component({
  properties: {
    rating: Object,
  },
  methods: {
    handlePreview(e) {
      console.log(e);

      const index = e.currentTarget.dataset.index;
      // 图片预览API
      wx.previewImage({
        urls: this.data.rating.illustration,
        current:this.data.rating.illustration[index]
      });
    },
  },
});
