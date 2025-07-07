import serviceAction from "../../../../enum/service-action";
import serviceStatus from "../../../../enum/service-status";
import { getDataSet } from "../../../../utils/utils";
import behavior from "../behavior";

Component({
  behaviors: [behavior],
  properties: {},
  data: {
    serviceStatusEnum: serviceStatus,
    serviceActionEnum: serviceAction,
  },
  methods: {
    handleUpdateStatus(e) {
      const action = getDataSet(e, "action");
     this.triggerEvent('update',{action})
    },

    handleEditService(e) {
        this.triggerEvent('edit')
    },
  },
});
