const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const middlewareObj = require('../middleware/check-auth');
const Package = require('../models/package_specification1');
const Machine = require('../models/machine');

router.get('/:packageId', (req, res, next) => {
    var printing_machine = req.body.printin_machine_id;
    var die_machine = req.body.die_machine_id;
    var guillotine_machine = req.body.guillotine_machine_id;
    //rs per kg or stock rate will alose be coming in req.body


    // console.log(foundPackage[0]);
    var stock_length = foundPackage[0].stock.stock_length;
    var stock_width = foundPackage[0].stock.stock_width;
    var gsm = foundPackage[0].stock.weight;
    var press_sheet_length = stock_length;
    var press_sheet_width = stock_width;
    var product_length = foundPackage[0].product.flat.flat_length;
    var product_width = foundPackage[0].product.flat.flat_width;
    var quantity = foundPackage[0].product.quantity;
    console.log(stock_length);
    console.log(stock_width);
    console.log(gsm);

    /////////////////////////////variables///////////////////////////////////////
    var kgs = 0;
    var weightOfAllStock = 0;
    var weightOfOneSheet = 0;
    var stockRate = 0;
    var rsPerKg = 160.40;
    var row_ups = 0;
    var column_ups = 0;
    var no_of_ups = 0;
    var noOfStockSheets = 0;
    var wastageSheets = 0;
    var totalStrockSheets = 0;
    var percentWastage = 120;
    var noOfPrintingSheets = 0;
    // colors
    var frontProcessColors = foundPackage[0].product.color.front.process_colors.length;
    var frontSpotColors = foundPackage[0].product.color.front.spot_colors.length;
    var backProcessColors = foundPackage[0].product.color.back.process_colors.length;
    var backSpotColors = foundPackage[0].product.color.back.spot_colors.length;
    var variableColors = foundPackage[0].product.color.variable.variable_colors.length;

    var frontVarnish = 0;
    var backVarnish = 0;
    var totalColors = 0;
    var noOfPlates = 0;

    if (foundPackage[0].product.coating.front.coating_value == 'Varnish Matt' || foundPackage[0].product.coating.front.coating_value == 'Varnish Gloss') {
        frontVarnish = 1;
    }

    if (foundPackage[0].product.coating.back.coating_value == 'Varnish Matt' || foundPackage[0].product.coating.back.coating_value == 'Varnish Gloss') {
        backVarnish = 1;
    }

    /////////////prices ////////////////////////////
    var platePrice = 350;
    var printingPrice = 200;
    var diePrice = 100;
    var dieCuttingPrice = 100;
    var straightCuttingPrice = 100;
    var binderyPrice = 0;
    var finishingPrice = 0;
    var packingPrice = 10;

    //////////////costs ///////////////////////////
    var materialCost = 0;
    var plateCost = 0;
    var printingCost = 0;
    var dieCost = 0;
    var dieCuttingCost = 0;
    var binderyCost = 0;
    var finishingCost = 0;
    var packingCost = 0;
    var totalCost = 0;
    var perPieceCost = 0;
    var sellingPrice = 0;
    var perPienceSelling = 0;
    var percentProfit = 50;
    /////////////////////////////functions/////////////////////////////////////////

    //calculate kgs for 100 sheets
    function calculateKGS(sl, sw, gsm, callback) {
        kgs = (sl * sw * gsm) / 15500;
        console.log('kgs is' + kgs);
        callback();

    }
    //calculate weight of one sheet
    function calculateWeightOfOneSheet(kgs, callback) {
        console.log(kgs);
        weightOfOneSheet = kgs / 100;
        console.log('weight of one sheet is' + weightOfOneSheet);
        callback();
    }

    //calculate stock rate
    function calculateStockRate(weightOfOneSheet, rsPerKg, callback) {
        console.log(weightOfOneSheet);
        console.log(rsPerKg);


        stockRate = weightOfOneSheet * rsPerKg;
        console.log('stock rate is' + stockRate);
        callback();
    }
    ///////////////ignoring the press sheet calculations///////////////////////

    //calculate no of press sheets
    function calculatePressSheets(callback) {
        pressSheetRows = 1;
        pressSheetColumns = 1;
        noOfPressSheets = pressSheetRows * pressSheetColumns;
        callback();
    }

    //calculate no of ups
    function calculateUps(press_sheet_length, press_sheet_width, callback) {
        //assuming product will be printed in only one direction
        column_ups = Math.floor(press_sheet_length / product_length);
        row_ups = Math.floor(press_sheet_width / product_width);

        no_of_ups = row_ups * column_ups;
        console.log("no of ups are " + no_of_ups);
        callback();
    }

    //calculate no of stock sheets
    function calculateSheets(percentWastage, callback) {
        noOfStockSheets = Math.ceil((quantity / no_of_ups) / noOfPressSheets);
        wastageSheets = Math.ceil(noOfStockSheets * (percentWastage / 100));
        totalStrockSheets = Math.ceil(noOfStockSheets + wastageSheets);

        weightOfAllStock = totalStrockSheets * weightOfOneSheet;
        console.log("total no of sheets are " + totalStrockSheets);
        console.log('total kgs is ' + weightOfAllStock);
        callback();
    }

    function calculateMaterialCost(callback) {
        materialCost = totalStrockSheets * stockRate;
        console.log("material cost is: " + materialCost);
        callback();
    }

    // calculate no of colors
    function calculateNoColorss(callback) {
        totalColors = frontProcessColors + frontSpotColors + backProcessColors + backSpotColors + variableColors + frontVarnish + backVarnish;
        noOfPlates = totalColors;
        console.log("total no of colors " + totalColors);
        console.log("total no of plates " + noOfPlates);

        callback();
    }

    //calculate number of printing sheets
    function calculateNoOfPrintingSheets(callback) {
        noOfPrintingSheets = noOfPressSheets * totalStrockSheets;
        console.log('no of printing sheets is ' + noOfPrintingSheets);
        callback();
    }

    function calculateAllCosts(callback) {
        plateCost = platePrice * noOfPlates;
        printingCost = ((noOfPrintingSheets * totalColors) / 1000) * printingPrice;
        dieCost = no_of_ups * diePrice;
        dieCuttingCost = (noOfPrintingSheets / 1000) * dieCuttingPrice;
        binderyCost = (quantity / 1000) * binderyPrice;
        //press sheet
        var areaOfPressSheet = press_sheet_length * press_sheet_width;
        var someVariable = finishingPrice / 144;
        var anotherVariable = areaOfPressSheet = someVariable;
        finishingCost = anotherVariable * noOfPressSheets;
        //finishing ends here

        packingCost = (quantity / 1000) * packingPrice;

        console.log('printing cost is :' + printingCost);
        console.log("plate cost is: " + plateCost);
        console.log("die cost is:" + dieCost);
        console.log('die cutting cost is:' + dieCuttingCost);
        console.log('bindery cost is:' + binderyCost);
        console.log('packing cost is:' + packingCost);
        console.log('finishing cost is:' + finishingCost);

        callback();
    }


    //calculate total cost
    function calculateTotalCost(callback) {
        totalCost = materialCost + plateCost + printingCost + dieCost + dieCuttingCost + binderyCost + finishingCost + packingCost;
        perPieceCost = totalCost / quantity;
        console.log('total cost is: ' + totalCost);
        console.log("per piece cost is : " + perPieceCost);
        callback();
    }

    //calculate selling price
    function calculateSellingPrice(percentProfit, callback) {
        sellingPrice = (totalCost * (percentProfit / 100)) + totalCost;
        perPienceSelling = sellingPrice / quantity;
        console.log('selling amount is:' + sellingPrice);
        console.log('per pience selling amount is:' + perPienceSelling);
        callback();
    }
    ////last function
    function working() {
        res.status(200).json({
            message: "working",
        })
    }


    //////////////////////////run functions in sequence ///////////////////////////
    calculateKGS(stock_length, stock_width, gsm, function () {
        calculateWeightOfOneSheet(kgs, function () {
            calculateStockRate(weightOfOneSheet, rsPerKg, function () {
                calculatePressSheets(function () {
                    calculateUps(press_sheet_length, press_sheet_width, function () {
                        calculateSheets(percentWastage, function () {
                            calculateMaterialCost(function () {
                                calculateNoColorss(function () {
                                    calculateNoOfPrintingSheets(function () {
                                        calculateAllCosts(function () {
                                            calculateTotalCost(function () {
                                                calculateSellingPrice(percentProfit, function () {
                                                    working();

                                                })

                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
})
    .catch(err => {
        console.log(err);
        res.status(200).json({
            message: "something went wrong"
        })
    })












