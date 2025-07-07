import FileUpload from "../../utils/file-upload";
import { getDataSet } from "../../utils/utils";

Component({
  properties: {
    // 默认展示的图片文件
    files: {
      type: Array,
      value: [],
    },
    // 最大上传图片数量
    maxCount: {
      type: Number,
      value: 1,
    },
    // 单个图片文件大小限制，单位 M
    size: {
      type: Number,
      value: 2,
    },
    // 可选图片大小类型，original：原图，compressed：压缩图
    // 默认都可以
    sizeType: {
      type: Array,
      value: ["original", "compressed"],
    },
    // 可选图片来源，album: 从相册选图, camera：使用相机
    // 默认都可以
    sourceType: {
      type: Array,
      value: ["album", "camera"],
    },
  },

  // 数据监听器
  observers: {
    files(newVal) {
      // 数组长度为0中断执行
      if (!newVal.length) {
        return;
      }

      const _files = [];
      newVal.forEach((item, index) => {
        const file = {
          id: item.id,
          key: index + "",
          path: item.path,
          status: this.data.uploadStatusEnum.SUCCESS,
          error: "",
        };
        _files.push(file);
      });
      this.setData({
        _files,
      });
    },
  },

  data: {
    _files: [],
    uploadStatusEnum: {
      ERROR: 0,
      UPLOADING: 1,
      SUCCESS: 2,
    },
  },
  methods: {
    // 预览图片
    handlePreview(e) {
        this.triggerEvent('hidePage')
      const index = getDataSet(e, "index");
      const urls = this.data._files.map((item) => item.path);
      wx.previewImage({
        urls: urls,
        current: urls[index],
      });
    },

    // 删除图片
    handleDelete(e) {
      const index = getDataSet(e, "index");
      const deleted = this.data._files.splice(index, 1);
      this.setData({
        _files: this.data._files,
      });
      this.triggerEvent("delete", { index, item: deleted[0] });
    },

    // 点击选择图片
    async handleChooseImage(e) {
        this.triggerEvent('hidePage')
      // 让用户选择图片
      const res = await wx.chooseImage({
        count: this.data.maxCount,
        sizeType: this.data.sizeType,
        sourceType: this.data.sourceType,
      });

      this.triggerEvent("choose", { files: res.tempFiles });

      const _files = this._filesFilter(res.tempFiles);
      this.setData({
        _files,
      });

      const uploadTask = _files.filter(
        (item) => item.status === this.data.uploadStatusEnum.UPLOADING
      );

      // 图片上传
      this._executeUpload(uploadTask);
    },
    _filesFilter(tempFiles) {
      const res = [];
      tempFiles.forEach((item, index) => {
        let error = "";
        if (item.size > 1024 * 1024 * this.data.size) {
          error = `图片大小不能超过${this.data.size}`;
          this.triggerEvent("validatefail", { item, error });
        }

        const length = this.data._files.length;
        res.push({
          id: null,
          key: index + length + "",
          path: item.path,
          status: error
            ? this.data.uploadStatusEnum.ERROR
            : this.data.uploadStatusEnum.UPLOADING,
          error: error,
        });
      });
      return this.data._files.concat(res);
    },

    // 图片上传
    async _executeUpload(uploadTask) {
      const success = [];
      for (const file of uploadTask) {
        try {
          const res = await FileUpload.upload(file.path, file.key);
          file.id = res[0].id;
          file.url = res[0].path
          file.status = this.data.uploadStatusEnum.SUCCESS;
          this.data._files[file.key] = file;
          success.push(file);
        } catch (e) {
          file.status = this.data.uploadStatusEnum.ERROR;
          file.error = e;
          this.triggerEvent("uploadfail", { file, error: e });
        }
      }
      this.setData({
        _files: this.data._files,
      });
      if (success.length) {
        this.triggerEvent("uploadsuccess", { files: success });
      }
    },
  },
});
