sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], (Controller, JSONModel, MessageToast) => {
    "use strict";

    return Controller.extend("mrpscan.mrpscanning.controller.View1", {
        onInit() {
            this.getView().setModel(new JSONModel(), "delvDetails");
        },

        onGoPress() {
            const sDeliveryValue = this.getView().byId("inpvbeln").getValue();
            const sUrl = `http://wd01.dxcpaas4sap.zf-world.com:8004/am_deliv_serv/deliv?delivery=${sDeliveryValue}`;

            jQuery.ajax({
                url: sUrl,
                method: "GET",
                success: (oData) => {
                    const oModel = this.getView().getModel("delvDetails");
                    oModel.setData(oData);
                    MessageToast.show("Delivery details retrieved successfully.");
                },
                error: () => {
                    MessageToast.show("Failed to retrieve delivery details.");
                }
            });
        }
    });
});