const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const middlewareObj = require('../middleware/check-auth');
const Package = require('../models/package_specification1');
const Machine = require('../models/machine');
const Costing = require('../models/costing');

router.get('/', (req, res, next) => {
    var object = req.query;
    mainFunction(object, res, () => {

    })
})


function mainFunction(
    object,
    res,
    callback
) {
    var packageId = object.packageId;

    Package.find({
        _id: packageId
    })
        .populate([
            'product.package_format',
            'product.barcode',
            'product.coating.front',
            'product.coating.front',
            'product.coating.back',
            'product.coating.back',
            'product.finishing.cut_type',
            'product.finishing.thread_type',
            'product.finishing.secondary_print',
            'product.finishing.pasting',
            'product.finishing.special_requirements',
            'product.finishing.folding',
            'product.finishing.perforation',
            'packing.primary_pack',

        ])
        .populate({
            path: 'stock',
            populate: [{
                path: 'description'
            },
            {
                path: 'coated_sides'
            }
            ]
        })
        .exec()
        .then(foundPackage => {

            Machine.Machine.find({ 'machine_type': 'printing' })
                .exec()
                .then(printingMachines => {
                    Machine.Machine.find({ 'machine_type': 'die_cutting' })
                        .exec()
                        .then(dieCuttingMachines => {
                            Machine.Machine.find({ 'machine_type': 'guillotine_cutting' })
                                .exec()
                                .then(guillotineCuttingMachines => {
                                    // console.log(guillotineCuttingMachines);
                                    if (foundPackage[0].product.carton.carton_length <= 0) {
                                        flatSizeCosting(
                                            object,
                                            foundPackage,
                                            printingMachines,
                                            dieCuttingMachines,
                                            guillotineCuttingMachines,
                                            res
                                        );
                                    } else {
                                        // cartonSizeCosting(
                                        //     foundPackage,
                                        //     printing_machine,
                                        //     die_machine,
                                        //     guillotine_machine,
                                        //     res
                                        // )
                                    }

                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        //error: err,
                                        message: 'something went wrong'
                                    })
                                })

                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                //error: err,
                                message: 'something went wrong'
                            })
                        })

                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        //error: err,
                        message: 'something went wrong'
                    })
                })




        })
        .catch(err => {
            console.log(err);
            console.log(err);
            res.status(500).json({
                message: "package not found"
            })
        })

}

function flatSizeCosting(
    object,
    foundPackage,
    printingMachines,
    dieCuttingMachines,
    guillotineCuttingMachines,
    res
) {
    //product
    var trim = foundPackage[0].product.flat.flat_trim;
    var productLength = foundPackage[0].product.flat.flat_length;
    var productWidth = foundPackage[0].product.flat.flat_width;
    var quantity = object.quantity;
    quantity = +quantity;

    var frontProcessColors = foundPackage[0].product.color.front.process_colors.length;
    var frontSpotColors = foundPackage[0].product.color.front.spot_colors.length;
    var backProcessColors = foundPackage[0].product.color.back.process_colors.length;
    var backSpotColors = foundPackage[0].product.color.back.spot_colors.length;
    var variableColors = foundPackage[0].product.color.variable.variable_colors.length;

    var packageFormatPrice = foundPackage[0].product.package_format.price;
    var barCodePrice = foundPackage[0].product.barcode.price;
    // var frontCoatingPrice = foundPackage[0].product.coating.front.coating_value.price;
    var frontCoatings = foundPackage[0].product.coating.front;
    // var backCoatingPrice = foundPackage[0].product.coating.back.coating_value.price;
    var backCoatings = foundPackage[0].product.coating.back;


    //these are price per 1000
    var cutTypes = foundPackage[0].product.finishing.cut_type;
    var secondaryPrints = foundPackage[0].product.finishing.secondary_print;
    var threadPrice = foundPackage[0].product.finishing.thread_type.price;
    // var pastingPrice = foundPackage[0].product.finishing.pasting.price;
    var pastings = foundPackage[0].product.finishing.pasting;

    //var specialReqPrice = foundPackage[0].product.finishing.special_requirements.price;
    var specialReqs = foundPackage[0].product.finishing.special_requirements;

    var foldingPrice = foundPackage[0].product.finishing.folding.price;
    var perforationPrice = foundPackage[0].product.finishing.perforation.price;


    //stock
    var stock_rate = object.stock_rate;
    stock_rate = +stock_rate;

    var stock_rate_unit = object.stock_rate_unit;
    var coatedSidesPrice = foundPackage[0].stock.coated_sides.price;
    var stockLength = foundPackage[0].stock.stock_length;
    var stockWidth = foundPackage[0].stock.stock_width;
    var gsm = foundPackage[0].stock.weight;


    //packing
    var bundleSize = foundPackage[0].packing.bundle;
    //var primaryPackPrice = foundPackage[0].packing.primary_pack.price;
    var primaryPacks = foundPackage[0].packing.primary_pack;

    var carton = foundPackage[0].packing.carton;
    var pallet = foundPackage[0].packing.pallet;

    var deliveryPrice = object.delivery_charges;
    deliveryPrice = +deliveryPrice;

    var allSolutions = [];
    stocks =
        [
            {
                stockLength: 31,
                stockWidth: 43
            }
            // ,
            // {
            //     stockLength: 25,
            //     stockWidth: 36
            // },
            // {
            //     stockLength: 23,
            //     stockWidth: 36
            // },
        ]



    // machines loop
    printingMachines.forEach((printingMachine) => {
        //Machine Prices
        printingPrice = printingMachine.machine_cost;
        platePrice = printingMachine.plate.price;
        machineMaxLength = printingMachine.max_size.length;
        machineMaxWidth = printingMachine.max_size.width;
        machineMinLength = printingMachine.min_size.length;
        machineMinWidth = printingMachine.min_size.width;

        // here calculations if non standard size is being used
        // textileForNonStandardStock(
        //     object,
        //     foundPackage,
        //     printingMachine,
        //     dieCuttingMachines,
        //     guillotineCuttingMachines,
        // )


        //stock loop
        stocks.forEach((stock) => {
            stockLength = stock.stockLength;
            stockWidth = stock.stockWidth;

            var kgs = calculateKGS(stockLength, stockWidth, gsm);
            var weightOfOneSheet = calculateWeightOfOneSheet(kgs);
            var StockrateorRsPerKg = calculateStockrateorRsPerKg(stock_rate, stock_rate_unit, weightOfOneSheet);
            var stockRate = StockrateorRsPerKg.stockRate;
            var rsPerKg = StockrateorRsPerKg.rsPerKg;
            var totalColors = calculateNoOfColors(frontProcessColors, frontSpotColors, backProcessColors, backSpotColors, variableColors);
            var noOfPlates = totalColors;
            var combinations = cutStock(stockLength, stockWidth, machineMaxLength, machineMaxWidth, machineMinLength, machineMinWidth);

            combinations.forEach(printingSheet => {

                var runner = 0.50;
                var gripper = 0.75;
                var pLength = productLength;
                var pWidth = productWidth;



                var len = printingSheet.length;
                var wid = printingSheet.width;
                var sheetLengthUps = printingSheet.lengthUps;
                var sheetWidthUps = printingSheet.widthUps;
                var no_of_sheets_on_stock = Math.floor(sheetLengthUps) * Math.floor(sheetWidthUps);

                if (
                    (machineMinLength <= len && len <= machineMaxLength) &&
                    (machineMinWidth <= wid && wid <= machineMaxWidth)

                ) {
                    len = len - gripper;
                    wid = wid - runner;

                    var differentDirection = true;
                    var sameDirection = true;



                    if (sameDirection) {

                        if (pLength <= len && pWidth <= wid) {

                            //var sheetArea = len * wid;
                            var sheetArea = (len + gripper) * (wid + runner);

                            var lengthUps = (len / pLength);
                            var lengthUpsFloor = Math.floor(lengthUps);
                            var lengthProductsWithOutTrim = lengthUpsFloor * pLength;
                            var trimOnLength = (lengthUpsFloor - 1) * trim;
                            var lengthProductsWithTrim = lengthProductsWithOutTrim + trimOnLength;

                            if (lengthProductsWithTrim <= len) {
                                lengthUps = lengthUps;
                            } else {
                                lengthUps -= lengthUps;
                            }


                            var widthUps = (wid / pWidth);
                            var widthUpsFloor = Math.floor(widthUps);
                            var widthProductsWithOutTrim = widthUpsFloor * pWidth;
                            var trimOnWidth = (widthUpsFloor - 1) * trim;
                            var widthProductsWithTrim = widthProductsWithOutTrim + trimOnWidth;
                            if (widthProductsWithTrim <= wid) {
                                widthUps = widthUps;
                            } else {
                                widthUps -= widthUps;
                            }

                            var no_of_products_on_sheet = Math.floor(lengthUps) * Math.floor(widthUps);

                            var usedArea = no_of_products_on_sheet * pLength * pWidth;


                            wastageSheetAreaSame = (sheetArea - usedArea) * (sheetLengthUps * sheetWidthUps);
                            //    wastageSheetAreaSame = sheetArea - usedArea;

                            //////////////////////////////////////////COSTING//////////////////////////
                            var overageQuantity = quantity * 0.10;

                            if (overageQuantity <= (totalColors * 100)) {
                                overageQuantity = totalColors * 100;
                            }

                            var overageSheets = Math.floor(overageQuantity / (no_of_products_on_sheet * no_of_sheets_on_stock));
                            noOfStockSheets = Math.floor(quantity / no_of_products_on_sheet / no_of_sheets_on_stock);
                            totalStockSheets = noOfStockSheets + overageSheets;
                            // totalStockSheets = noOfStockSheets + 1000;

                            weightOfAllStock = totalStockSheets * weightOfOneSheet;
                            noOfPrintingSheets = no_of_sheets_on_stock * totalStockSheets;

                            // (1-cost)
                            printingMachineCost = noOfPrintingSheets * totalColors * printingPrice;


                            ////////////////---PRODUCT---/////////////////////////////


                            // dieMachineCost = noOfPrintingSheets * dieCuttingPrice;
                            // guillotineMachineCost = noOfPrintingSheets * straightCuttingPrice


                            // (2-cost)
                            plateCost = platePrice * noOfPlates;

                            var areaOfPrintingSheet = printingSheet.length * printingSheet.width;

                            // if (dieMachineCost > 0) {
                            //     dieCost = (areaOfPrintingSheet * diePrice);
                            // }


                            // (3-cost)
                            frontCoatingCost = 0;
                            frontCoatings.forEach(frontCoating => {
                                frontCoatingCost += areaOfPrintingSheet * noOfPrintingSheets * frontCoating.price;
                            });
                            // (4-cost)
                            backCoatingCost = 0;
                            backCoatings.forEach(backCoating => {
                                backCoatingCost += areaOfPrintingSheet * noOfPrintingSheets * backCoating.price;

                            })

                            // (5-cost)
                            // handle cut type costs here
                            var dieMachineCost = 0;
                            var dieCost = 0;
                            var guillotineMachineCost = 0;


                            cutTypes.forEach(cutType => {
                                press_length = len + gripper;
                                press_width = wid + runner;
                                if (cutType.type == 'full die' || cutType.type == 'half die') {
                                    dieCost += (areaOfPrintingSheet * cutType.price);

                                    // there two options for small and big die machines
                                    if (press_length < 18 && press_width < 25) {
                                        const index = dieCuttingMachines.findIndex(dieCuttingMachine => dieCuttingMachine.machine_name === 'small_die_cutting_machine')
                                        dieMachineCost += noOfPrintingSheets * dieCuttingMachines[index].machine_cost;
                                    } else {
                                        const index = dieCuttingMachines.findIndex(dieCuttingMachine => dieCuttingMachine.machine_name === 'big_die_cutting_machine')
                                        dieMachineCost += noOfPrintingSheets * dieCuttingMachines[index].machine_cost;
                                    }
                                }
                                else if (cutType.type == 'straight') {
                                    guillotineMachineCost += noOfPrintingSheets + guillotineCuttingMachines[0].machine_cost;

                                }

                            })


                            // (6-cost)
                            var foilingCost = 0;
                            var embossingCost = 0;
                            var secondaryPrintCost = 0;
                            secondaryPrints.forEach(secondaryPrint => {
                                if (secondaryPrint.type == 'foiling') {
                                    foilingCost += areaOfPrintingSheet * noOfPrintingSheets * secondaryPrint.price;
                                }
                                else if (secondaryPrint.type == 'embossing') {
                                    embossingCost += areaOfPrintingSheet * secondaryPrint.price;
                                }

                            })

                            // (7-cost)
                            threadCost = threadPrice * quantity;

                            // (8-cost)
                            var pastingCost = 0;
                            pastings.forEach(pasting => {
                                pastingCost += pasting.price * quantity;
                            })

                            // (9-cost)
                            specialReqCost = 0;
                            specialReqs.forEach(specialReq => {
                                specialReqCost += specialReq.price * quantity;
                            })

                            // (10-cost)
                            foldingCost = foldingPrice * quantity;
                            // primaryPackCost = primaryPackPrice * quantity;

                            ////////////////---STOCK---/////////////////////////////
                            // (11-cost)
                            materialCost = totalStockSheets * stockRate;

                            ////////////////---PACKING---/////////////////////////////

                            // (12-cost)
                            primaryPackCost = 0;
                            primaryPacks.forEach(primaryPack => {
                                primaryPackCost += quantity * primaryPack.price;
                            })

                            // Carton and pallet cost needs to be improved

                            // (13-cost)
                            cartonCost = 0;
                            if (carton == 'true') {
                                cartonCost = 100
                            }

                            // (14-cost)
                            palletCost = 0;
                            if (pallet == 'true') {
                                palletCost = 100
                            }

                            ////////////////---DELIVERY---/////////////////////////////
                            //delivery cost needs to be improved later with respect to km's
                            // (15-cost)
                            deliveryCost = deliveryPrice;

                            totalCost = Math.floor(printingMachineCost +
                                plateCost +
                                frontCoatingCost +
                                backCoatingCost +
                                dieMachineCost +
                                dieCost +
                                guillotineMachineCost +
                                secondaryPrintCost +
                                threadCost +
                                pastingCost +
                                specialReqCost +
                                foldingCost +
                                materialCost +
                                primaryPackCost +
                                cartonCost +
                                palletCost +
                                deliveryCost);

                            ///////////////////////////////////////
                            allSolutions.push({
                                "MACHINE": printingMachine.machine_man_name,
                                'stock_sheet': {
                                    'stock_length': stockLength,
                                    'stock_width': stockWidth,
                                    'stock_sheets_without_wastage': noOfStockSheets,
                                    'wastage_sheets': overageSheets,
                                    'total_stock_sheets': totalStockSheets,
                                    'kgs': kgs,
                                    'stockRate': stockRate,
                                    'rsPerKg': rsPerKg,
                                    'weightOfOneSheet': weightOfOneSheet,
                                    'weight_of_all_stock': weightOfAllStock,
                                },
                                'press_sheet': {
                                    'press_length': len + gripper,
                                    'press_width': wid + runner,
                                    'press_sheets_from_length': sheetLengthUps,
                                    'press_sheets_from_width': sheetWidthUps,
                                    'press_sheets_from_one_stock': sheetLengthUps * sheetWidthUps,
                                    'total_printing_sheets': noOfPrintingSheets,
                                    'total_wastage_area': wastageSheetAreaSame,
                                },
                                'product': {
                                    'products_from_length': lengthUps,
                                    'products_from_width': widthUps,
                                    'products_from_one_sheet': no_of_products_on_sheet,
                                    'quantity': quantity,
                                    'print_direction': 'same',
                                },
                                'costs': {
                                    'printingMachineCost': printingMachineCost,
                                    'plateCost': plateCost,
                                    'frontCoatingCost': frontCoatingCost,
                                    'backCoatingCost': backCoatingCost,
                                    'dieMachineCost': dieMachineCost,
                                    'dieCost': dieCost,
                                    'guillotineMachineCost': guillotineMachineCost,
                                    'secondaryPrintCost': secondaryPrintCost,
                                    'threadCost': threadCost,
                                    'pastingCost': pastingCost,
                                    'specialReqCost': specialReqCost,
                                    'foldingCost': foldingCost,
                                    'materialCost': materialCost,
                                    'primaryPackCost': primaryPackCost,
                                    'cartonCost': cartonCost,
                                    'palletCost': palletCost,
                                    'deliveryCost': deliveryCost,
                                    'total_cost': totalCost,
                                }
                            })
                        }
                    }

                    if (differentDirection) {
                        if (pWidth <= len && pLength <= wid) {

                            var sheetArea = (len + gripper) * (wid + runner);

                            //var sheetArea = len * wid;

                            var lengthUps = (len / pWidth);

                            var lengthUpsFloor = Math.floor(lengthUps);
                            var widthProductsWithOutTrim = lengthUpsFloor * pWidth;
                            var trimOnLength = (lengthUpsFloor - 1) * trim;
                            var widthProductsWithTrim = widthProductsWithOutTrim + trimOnLength;
                            if (widthProductsWithTrim <= len) {
                                lengthUps = lengthUps;
                            } else {
                                lengthUps -= lengthUps;
                            }

                            var widthUps = (wid / pLength);
                            var widthUpsFloor = Math.floor(widthUps);
                            var lengthProductsWithOutTrim = widthUpsFloor * pLength;
                            var trimOnWidth = (widthUpsFloor - 1) * trim;
                            var lengthProductsWithTrim = lengthProductsWithOutTrim + trimOnWidth;
                            if (lengthProductsWithTrim <= wid) {
                                widthUps = widthUps;
                            } else {
                                widthUps -= widthUps;
                            }

                            var no_of_products_on_sheet = Math.floor(lengthUps) * Math.floor(widthUps);

                            var usedArea = no_of_products_on_sheet * pLength * pWidth;
                            wastageSheetAreaSame = (sheetArea - usedArea) * (sheetLengthUps * sheetWidthUps);

                            //  wastageSheetAreaSame = sheetArea - usedArea;

                            //////////////////////////////////////////COSTING//////////////////////////
                            var overageQuantity = quantity * 0.10;
                            if (overageQuantity <= (totalColors * 100)) {
                                overageQuantity = totalColors * 100;
                            }

                            var overageSheets = Math.floor(overageQuantity / (no_of_products_on_sheet * no_of_sheets_on_stock));
                            //                            var overageSheets = overageQuantity / no_of_products_on_sheet / no_of_sheets_on_stock;
                            noOfStockSheets = Math.floor(quantity / no_of_products_on_sheet / no_of_sheets_on_stock);
                            totalStockSheets = noOfStockSheets + overageSheets;
                            //totalStockSheets = noOfStockSheets + 1000;

                            weightOfAllStock = totalStockSheets * weightOfOneSheet;
                            noOfPrintingSheets = no_of_sheets_on_stock * totalStockSheets;

                            // (1-cost)
                            printingMachineCost = noOfPrintingSheets * totalColors * printingPrice;


                            ////////////////---PRODUCT---/////////////////////////////


                            // dieMachineCost = noOfPrintingSheets * dieCuttingPrice;
                            // guillotineMachineCost = noOfPrintingSheets * straightCuttingPrice


                            // (2-cost)
                            plateCost = platePrice * noOfPlates;

                            var areaOfPrintingSheet = printingSheet.length * printingSheet.width;

                            // if (dieMachineCost > 0) {
                            //     dieCost = (areaOfPrintingSheet * diePrice);
                            // }


                            // (3-cost)
                            frontCoatingCost = 0;
                            frontCoatings.forEach(frontCoating => {
                                frontCoatingCost += areaOfPrintingSheet * noOfPrintingSheets * frontCoating.price;
                            });
                            // (4-cost)
                            backCoatingCost = 0;
                            backCoatings.forEach(backCoating => {
                                backCoatingCost += areaOfPrintingSheet * noOfPrintingSheets * backCoating.price;

                            })

                            // (5-cost)
                            // handle cut type costs here
                            var dieMachineCost = 0;
                            var dieCost = 0;
                            var guillotineMachineCost = 0;


                            cutTypes.forEach(cutType => {
                                press_length = len + gripper;
                                press_width = wid + runner;
                                if (cutType.type == 'full die' || cutType.type == 'half die') {
                                    dieCost += (areaOfPrintingSheet * cutType.price);

                                    // there two options for small and big die machines
                                    if (press_length < 18 && press_width < 25) {
                                        const index = dieCuttingMachines.findIndex(dieCuttingMachine => dieCuttingMachine.machine_name === 'small_die_cutting_machine')
                                        dieMachineCost += noOfPrintingSheets * dieCuttingMachines[index].machine_cost;
                                    } else {
                                        const index = dieCuttingMachines.findIndex(dieCuttingMachine => dieCuttingMachine.machine_name === 'big_die_cutting_machine')
                                        dieMachineCost += noOfPrintingSheets * dieCuttingMachines[index].machine_cost;
                                    }
                                }
                                else if (cutType.type == 'straight') {
                                    guillotineMachineCost += noOfPrintingSheets + guillotineCuttingMachines[0].machine_cost;

                                }

                            })


                            // (6-cost)
                            var foilingCost = 0;
                            var embossingCost = 0;
                            var secondaryPrintCost = 0;
                            secondaryPrints.forEach(secondaryPrint => {
                                if (secondaryPrint.type == 'foiling') {
                                    foilingCost += areaOfPrintingSheet * noOfPrintingSheets * secondaryPrint.price;
                                }
                                else if (secondaryPrint.type == 'embossing') {
                                    embossingCost += areaOfPrintingSheet * secondaryPrint.price;
                                }

                            })

                            // (7-cost)
                            threadCost = threadPrice * quantity;

                            // (8-cost)
                            var pastingCost = 0;
                            pastings.forEach(pasting => {
                                pastingCost += pasting.price * quantity;
                            })

                            // (9-cost)
                            specialReqCost = 0;
                            specialReqs.forEach(specialReq => {
                                specialReqCost += specialReq.price * quantity;
                            })

                            // (10-cost)
                            foldingCost = foldingPrice * quantity;
                            // primaryPackCost = primaryPackPrice * quantity;

                            ////////////////---STOCK---/////////////////////////////
                            // (11-cost)
                            materialCost = totalStockSheets * stockRate;

                            ////////////////---PACKING---/////////////////////////////

                            // (12-cost)z
                            primaryPackCost = 0;
                            primaryPacks.forEach(primaryPack => {
                                primaryPackCost += quantity * primaryPack.price;
                            })

                            // Carton and pallet cost needs to be improved

                            // (13-cost)
                            cartonCost = 0;
                            if (carton == 'true') {
                                cartonCost = 100
                            }

                            // (14-cost)
                            palletCost = 0;
                            if (pallet == 'true') {
                                palletCost = 100
                            }

                            ////////////////---DELIVERY---/////////////////////////////
                            //delivery cost needs to be improved later with respect to km's
                            // (15-cost)
                            deliveryCost = deliveryPrice

                            totalCost = Math.floor(printingMachineCost +
                                plateCost +
                                frontCoatingCost +
                                backCoatingCost +
                                dieMachineCost +
                                dieCost +
                                guillotineMachineCost +
                                secondaryPrintCost +
                                threadCost +
                                pastingCost +
                                specialReqCost +
                                foldingCost +
                                materialCost +
                                primaryPackCost +
                                cartonCost +
                                palletCost +
                                deliveryCost);


                            ///////////////////////////////////////

                            allSolutions.push({
                                "MACHINE": printingMachine.machine_man_name,
                                'stock_sheet': {
                                    'stock_length': stockLength,
                                    'stock_width': stockWidth,
                                    'stock_sheets_without_wastage': noOfStockSheets,
                                    'wastage_sheets': overageSheets,
                                    'total_stock_sheets': totalStockSheets,
                                    'kgs': kgs,
                                    'stockRate': stockRate,
                                    'rsPerKg': rsPerKg,
                                    'weightOfOneSheet': weightOfOneSheet,
                                    'weight_of_all_stock': weightOfAllStock,
                                },
                                'press_sheet': {
                                    'press_length': len + gripper,
                                    'press_width': wid + runner,
                                    'press_sheets_from_length': sheetLengthUps,
                                    'press_sheets_from_width': sheetWidthUps,
                                    'press_sheets_from_one_stock': sheetLengthUps * sheetWidthUps,
                                    'total_printing_sheets': noOfPrintingSheets,
                                    'total_wastage_area': wastageSheetAreaSame,
                                },
                                'product': {
                                    'products_from_length': lengthUps,
                                    'products_from_width': widthUps,
                                    'products_from_one_sheet': no_of_products_on_sheet,
                                    'quantity': quantity,
                                    'print_direction': 'different',
                                },
                                'costs': {
                                    'printingMachineCost': printingMachineCost,
                                    'plateCost': plateCost,
                                    'frontCoatingCost': frontCoatingCost,
                                    'backCoatingCost': backCoatingCost,
                                    'dieMachineCost': dieMachineCost,
                                    'dieCost': dieCost,
                                    'guillotineMachineCost': guillotineMachineCost,
                                    'secondaryPrintCost': secondaryPrintCost,
                                    'threadCost': threadCost,
                                    'pastingCost': pastingCost,
                                    'specialReqCost': specialReqCost,
                                    'foldingCost': foldingCost,
                                    'materialCost': materialCost,
                                    'primaryPackCost': primaryPackCost,
                                    'cartonCost': cartonCost,
                                    'palletCost': palletCost,
                                    'deliveryCost': deliveryCost,
                                    'total_cost': totalCost,
                                }
                            })
                        }
                    }
                    // for different direction ends here











                }
            })
        })
    })


    console.log('---------------------------------------------');
    findMinCostSolution(allSolutions);
    //console.log(minCost);
    // console.log(allSolutions.length);


}

//find machine
function findMachine(id, callback) {
    Machine.Machine.find({
        _id: id
    })
        .exec()
        .then(foundMachine => {
            callback(foundMachine);
        })
        .catch(err => {
            callback(err);
        })
}



//calculate kgs for 100 sheets
function calculateKGS(stockLength, stockWidth, gsm) {
    kgs = (stockLength * stockWidth * gsm) / 15500;
    return kgs;
}

//calculate weight of one sheet
function calculateWeightOfOneSheet(kgs) {
    weightOfOneSheet = kgs / 100;
    return weightOfOneSheet;
}

function calculateStockrateorRsPerKg(stock_rate, stock_rate_unit, weightOfOneSheet) {

    //now find stock rate or rsPerKg give that which one is provided

    if (stock_rate_unit == 'rs_per_pkt') {
        //find rsPerKg
        stockRate = stock_rate;
        rsPerKg = stockRate / weightOfOneSheet;
        return {
            stockRate: stockRate,
            rsPerKg: rsPerKg
        };
        //  callback(stockRate, rsPerKg);
    } else if (stock_rate_unit == 'rs_per_kg') {
        //find stockRate
        rsPerKg = stock_rate;
        stockRate = rsPerKg * weightOfOneSheet;
        // callback(stockRate, rsPerKg);
        return {
            stockRate: stockRate,
            rsPerKg: rsPerKg
        };
    }
}
// calculate no of colors
function calculateNoOfColors(frontProcessColors, frontSpotColors, backProcessColors, backSpotColors, variableColors) {
    totalColors = frontProcessColors + frontSpotColors + backProcessColors + backSpotColors + variableColors;
    noOfPlates = totalColors;
    // callback(totalColors, noOfPlates);
    return totalColors;
}




function cutStock(
    stockLength,
    stockWidth,
    machineMaxLength,
    machineMaxWidth,
    machineMinLength,
    machineMinWidth
) {

    var lengthofStock = stockLength;
    var widthofStock = stockWidth;

    var machineMaxLength = machineMaxLength;
    var machineMaxWidth = machineMaxWidth;
    var machineMinLength = machineMinLength;
    var machineMinWidth = machineMinWidth;

    possibleSheetLength = [];
    possibleSheetWidth = [];
    combinations = [];

    if (machineMinLength <= lengthofStock && lengthofStock <= machineMaxWidth) {
        possibleSheetLength.push({
            'length': lengthofStock,
            'lengthUps': 1
        });
    }

    if (machineMinLength <= widthofStock && widthofStock <= machineMaxWidth) {
        possibleSheetWidth.push({
            'width': widthofStock,
            'widthUps': 1
        });
    }

    var i = 2;
    var length = lengthofStock;
    var wid = widthofStock;

    while ((lengthofStock >= machineMinLength) || widthofStock >= machineMinLength) {

        if (lengthofStock >= machineMinLength) {
            var len = length / i;
            lengthofStock = len;
            if (machineMinLength <= lengthofStock && lengthofStock <= machineMaxWidth) {
                possibleSheetLength.push({
                    'length': len,
                    'lengthUps': i,
                })
            }
        }
        if (widthofStock >= machineMinLength) {
            var width = wid / i;
            widthofStock = width;
            if (machineMinLength <= widthofStock && widthofStock <= machineMaxWidth) {
                possibleSheetWidth.push({
                    'width': width,
                    'widthUps': i,
                })
            }
        }
        i++;
    }

    possibleSheetLength.forEach((length) => {
        possibleSheetWidth.forEach((width) => {
            if (length.length <= width.width) {

                var combo = {
                    length: length.length,
                    width: width.width,
                    lengthUps: length.lengthUps,
                    widthUps: width.widthUps
                }
                combinations.push(combo)
            } else {
                var combo = (width.width, length.length);
                var combo = {
                    length: width.width,
                    width: length.length,
                    lengthUps: length.lengthUps,
                    widthUps: width.widthUps
                }
                combinations.push(combo)
            }
        })
    })

    return combinations;
}

function findMinCostSolution(solutionsWithCosts) {
    console.log(solutionsWithCosts);
    var result = solutionsWithCosts.reduce(function (res, obj) {
        return (obj.costs.total_cost <= res.costs.total_cost) ? obj : res;
    });
    console.log(result);
}


///////////////////////////////////////////////////////////////////////////////
//return function


//get all printing machines
router.get('/get_printing_machines', (req, res, next) => {

    Machine.Machine.find({
        'machine_type': 'printing'
    })
        .exec()
        .then(foundMachines => {
            res.status(200).json({
                printingMachines: foundMachines
            });
        })
        .catch(err => {
            res.status(500).json({
                //error: err,
                message: 'something went wrong'
            })
        })
});

//get all die cutting machines
router.get('/get_diecutting_machines', (req, res, next) => {

    Machine.Machine.find({
        'machine_type': 'die cutting'
    })
        .exec()
        .then(foundMachines => {

            res.status(200).json({
                cuttingMachines: foundMachines
            });
        })
        .catch(err => {
            res.status(500).json({
                //error: err,
                message: 'something went wrong'
            })
        })
});

//get all guillotine cutting machines
router.get('/get_guillotinecutting_machines', (req, res, next) => {

    Machine.Machine.find({
        'machine_type': 'guillotine cutting'
    })
        .exec()
        .then(foundMachines => {

            res.status(200).json({
                cuttingMachines: foundMachines
            });
        })
        .catch(err => {
            res.status(500).json({
                //error: err,
                message: 'something went wrong'
            })
        })
});

module.exports = router;


function textileForNonStandardStock(
    object,
    foundPackage,
    printingMachine,
    dieCuttingMachines,
    guillotineCuttingMachines,
) {
    runner = 0.50;
    gripper = 0.75;
    //product
    var trim = foundPackage[0].product.flat.flat_trim;
    var productLength = foundPackage[0].product.flat.flat_length;
    var productWidth = foundPackage[0].product.flat.flat_width;
    var quantity = object.quantity;
    quantity = +quantity;

    var frontProcessColors = foundPackage[0].product.color.front.process_colors.length;
    var frontSpotColors = foundPackage[0].product.color.front.spot_colors.length;
    var backProcessColors = foundPackage[0].product.color.back.process_colors.length;
    var backSpotColors = foundPackage[0].product.color.back.spot_colors.length;
    var variableColors = foundPackage[0].product.color.variable.variable_colors.length;

    var packageFormatPrice = foundPackage[0].product.package_format.price;
    var barCodePrice = foundPackage[0].product.barcode.price;
    var frontCoatingPrice = foundPackage[0].product.coating.front.coating_value.price;
    var backCoatingPrice = foundPackage[0].product.coating.back.coating_value.price;
    //var diePrice = foundPackage[0].product.finishing.cut_type.price;

    //these are price per 1000
    var threadPrice = foundPackage[0].product.finishing.thread_type.price;
    var pastingPrice = foundPackage[0].product.finishing.pasting.price;
    var specialReqPrice = foundPackage[0].product.finishing.special_requirements.price;
    var foldingPrice = foundPackage[0].product.finishing.folding.price;
    var perforationPrice = foundPackage[0].product.finishing.perforation.price;


    //stock
    var stock_rate = object.stock_rate;
    var stock_rate_unit = object.stock_rate_unit;
    var coatedSidesPrice = foundPackage[0].stock.coated_sides.price;
    // var stockLength = foundPackage[0].stock.stock_length;
    // var stockWidth = foundPackage[0].stock.stock_width;
    var gsm = foundPackage[0].stock.weight;


    //packing
    var bundleSize = foundPackage[0].packing.bundle;
    var primaryPacks = foundPackage[0].packing.primary_pack;
    var carton = foundPackage[0].packing.carton;
    var pallet = foundPackage[0].packing.pallet;

    var deliveryPrice = object.delivery_charges;

    // machine data
    printingPrice = printingMachine.machine_cost;
    platePrice = printingMachine.plate.price;
    machineMaxLength = printingMachine.max_size.length;
    machineMaxWidth = printingMachine.max_size.width;
    machineMinLength = printingMachine.min_size.length;
    machineMinWidth = printingMachine.min_size.width;

    // sheet data
    var possibleSheetLength = (machineMaxLength - machineMinLength) - gripper;
    var possibleSheetWidth = (machineMaxWidth - machineMinWidth) - runner;

    //length 
    var sameDirection = True;
    var differentDirection = True;
    var pLength = productLength;
    var pWidth = productWidth;
    if (sameDirection) {
        var lengthUps = (possibleSheetLength / pLength);
        var lengthUpsFloor = Math.floor(lengthUps);
        var lengthProductsWithOutTrim = lengthUpsFloor * pLength;
        var trimOnLength = (lengthUpsFloor - 1) * trim;
        var lengthProductsWithTrim = lengthProductsWithOutTrim + trimOnLength;

        if (lengthProductsWithTrim <= len) {
            lengthUps = lengthUps;
        } else {
            lengthUps -= lengthUps;

        }

    }

}
