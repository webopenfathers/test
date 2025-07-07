const { default: roleType } = require("../../enum/role-type");

Component({
    properties:{
        order:Object,
        role:Number,
        hideTop:{
            type:Boolean,
            value:false
        }
    },
    data:{
        roleType:roleType
    },
    methods:{}
})