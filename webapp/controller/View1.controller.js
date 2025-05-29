sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], (Controller, JSONModel, MessageToast, Fragment) => {
    "use strict";

    return Controller.extend("mrpscan.mrpscanning.controller.View1", {
        onInit() {
            this.getView().setModel(new JSONModel(), "delvDetails");
            this.getView().setModel(new JSONModel(), "mrpscanned");
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
        },

        onMRPLabelInput() {
            const sMRPLabelValue = this.getView().byId("inpmrplabel").getValue();
            const sUrl = `http://wd01.dxcpaas4sap.zf-world.com:8004/am_deliv_serv/mrplabel?mrplabel=${sMRPLabelValue}`;

            jQuery.ajax({
                url: sUrl,
                method: "GET",
                success: (oData) => {
                    const oMRPScannedModel = this.getView().getModel("mrpscanned");
                    oMRPScannedModel.setData(oData);

                    const oDelvDetailsModel = this.getView().getModel("delvDetails");
                    const aDelvData = oDelvDetailsModel.getData();
                    const aMRPScannedData = oMRPScannedModel.getData();

                    aDelvData.forEach((oDelvItem) => {
                        const oMatchedMRPItem = aMRPScannedData.find(oMRPItem => oMRPItem.MATNR === oDelvItem.MATNR);
                        if (oMatchedMRPItem) {
                            oDelvItem.DIFF_QTY = oDelvItem.LFIMG;

                            if (oDelvItem.DIFF_QTY > oMatchedMRPItem.quantity) {
                                oDelvItem.SCAN_QTY += oMatchedMRPItem.quantity;
                                oDelvItem.DIFF_QTY -= oMatchedMRPItem.quantity;
                            } else {
                                MessageToast.show("MRP Sticker Qty is greater than delivery Qty");
                            }
                        }
                    });

                    oDelvDetailsModel.setData(aDelvData);
                },
                error: () => {
                    MessageToast.show("Failed to retrieve MRP label details.");
                }
            });
        }
    });
});