import { getDataSet, getEventParams } from "../../utils/utils";
import serviceType from "../../enum/service-type";
import Category from "../../model/category";
const moment = require("../../lib/moment");

Component({
  properties: {
    form: Object,
  },

  data: {
    typeList: [
      {
        id: serviceType.PROVIDE,
        name: "提供服务",
      },
      {
        id: serviceType.SEEK,
        name: "找服务",
      },
    ],
    typePickerIndex: null,
    categoryList: [],
    categoryPickerIndex: null,
    formData: {
      type: null,
      title: "",
      category_id: null,
      cover_image_id: null,
      description: "",
      designated_place: false,
      begin_date: "",
      end_date: "",
      price: "",
    },
    // 校验规则
    rules: [
      {
        name: "type",
        rules: { required: true, message: "请指定服务类型" },
      },
      {
        name: "title",
        rules: [
          { required: true, message: "服务标题内容不能为空" },
          { minlength: 5, message: "服务描述内容不能少于 5 个字" },
        ],
      },
      {
        name: "category_id",
        rules: { required: true, message: "未指定服务所属分类" },
      },
      {
        name: "cover_image_id",
        rules: { required: true, message: "请上传封面图" },
      },
      {
        name: "description",
        rules: [
          { required: true, message: "服务描述不能为空" },
          { minlength: 20, message: "服务描述内容不能少于 20 个字" },
        ],
      },
      {
        name: "begin_date",
        rules: [{ required: true, message: "请指定服务有效日期开始时间" }],
      },
      {
        name: "end_date",
        rules: [
          { required: true, message: "请指定服务有效日期结束时间" },
          {
            validator: function (rule, value, param, models) {
              if (
                moment(value).isSame(models.begin_date) ||
                moment(value).isAfter(models.begin_date)
              ) {
                return null;
              }
              return "结束时间必须大于开始时间";
            },
          },
        ],
      },
      {
        name: "price",
        rules: [
          { required: true, message: "请指定服务价格" },
          {
            validator: function (rule, value) {
              // 正则表达式
              const pattern = /(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{2}$)/;
              const isNum = pattern.test(value);

              if (isNum) {
                return null;
              }
              return "价格必须是数字";
            },
          },
          { min: 1, message: "天下没有免费的午餐" },
        ],
      },
    ],
    error: null,
    resetForm: true,
    serviceTypeEnum: serviceType,
  },
  pageLifetimes: {
    show() {
      if (this.data.resetForm) {
        this._init(this.data.form);
      }
      this.data.resetForm = true;
    },
    hide() {
      if (this.data.resetForm) {
        this.setData({
          showForm: false,
        });
      }
    },
  },

  // 生命周期
  //   lifetimes: {
  //     attached() {},
  //   },
  methods: {
    async _init() {
      // ES6
      // 找不到的时候，返回-1
      const typePickerIndex = this.data.typeList.findIndex((item) => {
        return this.data.form.type === item.id;
      });
      const categoryList = await Category.getCategoryList();

      const categoryPickerIndex = categoryList.findIndex((item) => {
        return this.data.form.category_id === item.id;
      });
      this.setData({
        showForm: true,
        typePickerIndex: typePickerIndex !== -1 ? typePickerIndex : null,
        categoryPickerIndex:
          categoryPickerIndex !== -1 ? categoryPickerIndex : null,
        categoryList,
        files: this.data.form.cover_image ? [this.data.form.cover_image] : [],
        // 深拷贝、浅拷贝
        formData: {
          type: this.data.form.type,
          title: this.data.form.title,
          category_id: this.data.form.category_id,
          cover_image_id: this.data.form.cover_image
            ? this.data.form.cover_image.id
            : null,
          description: this.data.form.description,
          designated_place: this.data.form.designated_place,
          begin_date: this.data.form.begin_date,
          end_date: this.data.form.end_date,
          price: this.data.form.price,
        },
      });
    },

    // 提交按钮
    submit() {
      this.selectComponent("#form").validate((valid, errors) => {
        if (!valid) {
          const errMsg = errors.map((error) => error.message);
          this.setData({
            error: errMsg.join(";"),
          });
          return;
        }
        this.triggerEvent("submit", { formData: this.data.formData });
      });
    },

    handleTypeChange(e) {
      console.log(e);
      const index = getEventParams(e, "value");
      this.setData({
        typePickerIndex: index,
        ["formData.type"]: this.data.typeList[index].id,
      });
    },

    // 标题等input事件
    handleInput(e) {
      // 获取input框输入值的方法
      const value = getEventParams(e, "value");
      // 获取自定传递过来的参数
      const field = getDataSet(e, "field");

      this.setData({
        // 实现多个表单项复用同一个事件回调函数，同时又支持灵活的数据绑定
        [`formData.${field}`]: value,
      });
    },

    // 所属分类
    handleCategoryChange(e) {
      const index = getEventParams(e, "value");
      this.setData({
        categoryPickerIndex: index,
        ["formData.category_id"]: this.data.categoryList[index].id,
      });
    },

    // 服务地点
    handleSwitchChange(e) {
      const res = getEventParams(e, "value");
      this.setData({
        ["formData.designated_place"]: res,
      });
    },

    // 日期选择器
    // 开始
    handleBeginDateChange(e) {
      const beginDate = getEventParams(e, "value");
      this.setData({
        ["formData.begin_date"]: beginDate,
      });
    },
    // 结束
    handleEndDateChange(e) {
      const endDate = getEventParams(e, "value");
      this.setData({
        ["formData.end_date"]: endDate,
      });
    },

    handleUploadSuccess(e) {
      console.log(e);
      const id = e.detail.files[0].id;
      this.setData({
        ["formData.cover_image_id"]: id,
      });
    },

    handleHidePage() {
      this.data.resetForm = false;
    },
  },
});
