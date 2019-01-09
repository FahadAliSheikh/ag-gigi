const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const middlewareObj = require('../middleware/check-auth');
const Package = require('../models/package_specification1');
const Machine = require('../models/machine');

router.get('/', (req, res, next) => {

    var packageId = req.query.packageId;
    var printing_machine = req.query.printingMachineId;
    var die_machine = req.query.dieCuttingMachineId;
    var guillotine_machine = req.query.guillotineCuttingMachineId;

    mainFunction(packageId, printing_machine, die_machine, guillotine_machine, res, () => {

    })

})
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

//calculate kgs for 100 sheets
function calculateKGS(stockLength, stockWidth, gsm, callback) {
    kgs = (stockLength * stockWidth * gsm) / 15500;
    callback(kgs);
}

//calculate weight of one sheet
function calculateWeightOfOneSheet(kgs, callback) {
    weightOfOneSheet = kgs / 100;
    callback(weightOfOneSheet);
}

function calculateStockrateorRsPerKg(stock_rate, stock_rate_unit, weightOfOneSheet, callback) {

    //now find stock rate or rsPerKg give that which one is provided

    if (stock_rate_unit == 'rs_per_pkt') {
        //find rsPerKg
        stockRate = stock_rate;
        rsPerKg = stockRate / weightOfOneSheet;
        callback(stockRate, rsPerKg);
    } else if (stock_rate_unit == 'rs_per_kg') {
        //find stockRate
        rsPerKg = stock_rate;
        stockRate = rsPerKg * weightOfOneSheet;
        callback(stockRate, rsPerKg);
    }
}
// calculate no of colors
function calculateNoOfColors(frontProcessColors, frontSpotColors, backProcessColors, backSpotColors, variableColors, callback) {
    totalColors = frontProcessColors + frontSpotColors + backProcessColors + backSpotColors + variableColors;
    noOfPlates = totalColors;
    callback(totalColors, noOfPlates);
}


function cutStock(
    stockLength,
    stockWidth,
    machineMaxLength,
    machineMaxWidth,
    machineMinLength,
    machineMinWidth,
    callback
) {

    var lengthofStock = stockLength;
    var widthofStock = stockWidth;

    var machineMaxLength = machineMaxLength;
    var machineMaxWidth = machineMaxWidth;
    var machineMinLength = machineMinLength;
    var machineMinWidth = machineMinWidth;

    possibleSheetLength = [];
    possibleSheetWidth = [];

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

    // //callback();
    callback(possibleSheetLength, possibleSheetWidth);
}

function calculateCostsOfSolutions(
    stockRate,
    printingPrice,
    dieCuttingPrice,
    straightCuttingPrice,
    weightOfOneSheet,
    quantity,
    totalColors,
    solutions,
    platePrice,
    noOfPlates,
    diePrice,
    frontCoatingPrice,
    backCoatingPrice,
    threadPrice,
    pastingPrice,
    specialReqPrice,
    foldingPrice,
    perforationPrice,
    primaryPackPrice,
    carton,
    pallet,
    deliveryPrice,
    callback) {
    console.log('=================all solutions ==========================');
    // console.log(solutions);
    var solutionsWithCosts = [];
    var overageQuantity = quantity * 0.10;
    if (overageQuantity <= (totalColors * 100)) {
        overageQuantity = totalColors * 100;
    }

    solutions.forEach(solution => {
        var overageSheets = overageQuantity / solution.press_sheet_size.total_ups_on_sheet / solution.stock_sheet_size.no_0f_ups;
        console.log("overageQuantity: " + overageQuantity)
        console.log("overageSheets: " + overageSheets)
        noOfStockSheets = (quantity / solution.press_sheet_size.total_ups_on_sheet) / solution.stock_sheet_size.no_0f_ups;
        totalStockSheets = noOfStockSheets + overageSheets;
        weightOfAllStock = totalStockSheets * weightOfOneSheet;
        noOfPrintingSheets = solution.stock_sheet_size.no_0f_ups * totalStockSheets;

        printingMachineCost = noOfPrintingSheets * totalColors * printingPrice
        dieMachineCost = noOfPrintingSheets * dieCuttingPrice;
        guillotineMachineCost = noOfPrintingSheets * straightCuttingPrice

        materialCost = totalStockSheets * stockRate

        plateCost = platePrice * noOfPlates;

        var areaOfPressSheet = solution.press_sheet_size.press_length * solution.press_sheet_size.press_width;
        dieCost = (areaOfPressSheet * diePrice);

        frontCoatingCost = (areaOfPressSheet * frontCoatingPrice) * noOfPrintingSheets;
        backCoatingCost = (areaOfPressSheet * backCoatingPrice) * noOfPrintingSheets;

        threadCost = threadPrice * quantity;
        pastingCost = pastingPrice * quantity;
        specialReqCost = specialReqPrice * quantity;
        foldingCost = foldingPrice * quantity;
        primaryPackCost = primaryPackPrice * quantity;


        // Carton and pallet cost needs to be improved 
        if (carton) {
            cartonCost = 100
        } else cartonCost = 0;
        if (pallet) {
            palletCost = 500
        } else palletCost = 0;
        //delivery cost needs to be improved later with respect to km's
        deliveryCost = deliveryPrice

        totalCost = printingMachineCost + dieMachineCost + guillotineMachineCost + materialCost + plateCost + dieCost + frontCoatingCost
            + backCoatingCost + threadCost + pastingCost + specialReqCost + foldingCost + primaryPackCost + cartonCost + palletCost
            + deliveryCost;

        data = {
            "solution": solution,
            "press_sheet": solution.press_sheet_size,
            "total_stock_sheets": totalStockSheets,
            "costs": {
                "stockRate": stockRate,
                "noOfStockSheets": noOfStockSheets,
                "noOfPrintingSheets": noOfPrintingSheets,
                "printing_machine_cost": printingMachineCost,
                "die_machine_cost": dieMachineCost,
                "guillotine_machine_cost": guillotineMachineCost,
                "material_cost": materialCost,
                "plate_cost": plateCost,
                "die_cost": dieCost,
                "front_coating_cost": frontCoatingCost,
                "back_coating_cost": backCoatingCost,
                "thread_cost": threadCost,
                "pasting_cost": pastingCost,
                "special_reqCost": specialReqCost,
                "folding_cost": foldingCost,
                "primary_packCost": primaryPackCost,
                "carton_cost": cartonCost,
                "pallet_cost": palletCost,
                "delivery_cost": deliveryCost,
                "total_cost": totalCost
            }
        }
        solutionsWithCosts.push(data);
    })

    let minCostSolution = solutionsWithCosts[0];
    let min = solutionsWithCosts[0].costs.total_cost;
    for (i = 1; i < solutionsWithCosts.length; i++) {
        let w = solutionsWithCosts[i];
        let v = solutionsWithCosts[i].costs.total_cost;
        min = (v < min) ? v : min;
        minCostSolution = (w.costs.total_cost < minCostSolution.costs.total_cost) ? w : minCostSolution;
    }
    console.log(solutionsWithCosts);
    callback(minCostSolution);
}

//find grain direction
function grainDirection(
    minCostSolution,
    callback
) {

    var press_sheets_from_length = minCostSolution.solution.stock_sheet_size.press_sheets_from_length;
    var press_sheets_from_width = minCostSolution.solution.stock_sheet_size.press_sheets_from_width;
    var print_direction = minCostSolution.solution.print_direction;
    var grain_direction = 'none';
    if (press_sheets_from_length >= press_sheets_from_width) {
        if (print_direction == 'same') {
            grain_direction = 'short grain'
        } else if (print_direction == 'different') {
            grain_direction = 'long grain'
        }
    } else if (press_sheets_from_width > press_sheets_from_length) {
        if (print_direction == 'same') {
            grain_direction = 'long grain'
        } else if (print_direction == 'different') {
            grain_direction = 'short grain'
        }
    }
    callback(grain_direction);
}

function working(res) {
    res.status(200).json({
        message: 'working'
    })
    //console.log('working')
}

function mainFunction(
    packageId,
    printing_machine,
    die_machine,
    guillotine_machine,
    res,
    callback
) {
    var packageId = packageId;
    var printing_machine = printing_machine;
    var die_machine = die_machine;
    var guillotine_machine = guillotine_machine;

    Package.find({
        _id: packageId
    })
        .populate([
            'product.package_format',
            'product.barcode',
            'product.coating.front.coating_value',
            'product.coating.front.coating_type',
            'product.coating.back.coating_value',
            'product.coating.back.coating_type',
            'product.finishing.cut_type ',
            'product.finishing.thread_type ',
            'product.finishing.pasting',
            'product.finishing.special_requirements ',
            'product.finishing.folding ',
            'product.finishing.perforation ',
            'packing.primary_pack',
            'delivery.delivered_by',
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
            if (foundPackage[0].product.carton.carton_length <= 0) {
                flatSizeCosting(
                    foundPackage,
                    printing_machine,
                    die_machine,
                    guillotine_machine,
                    res
                );
            } else {
                cartonSizeCosting(
                    foundPackage,
                    printing_machine,
                    die_machine,
                    guillotine_machine,
                    res
                )
            }

        })
        .catch(err => {
            console.log(err);
            res.status(200).json({
                message: "package not found"
            })
        })

}

function selectFlatCombinations(
    possibleSheetLength,
    possibleSheetWidth,
    machineMaxLength,
    machineMaxWidth,
    machineMinLength,
    machineMinWidth,
    stockLength,
    stockWidth,
    productLength,
    productWidth,
    callback
) {

    var solutions = [];
    var runner = 0.50;
    var gripper = 0.75;
    var pLength = productLength;
    var pWidth = productWidth;
    if (possibleSheetLength.length > 0 && possibleSheetWidth.length > 0) {
        possibleSheetLength.forEach((pressLength) => {
            possibleSheetWidth.forEach((pressWidth) => {


                if (pressLength.length <= pressWidth.width) {
                    var len = pressLength.length;
                    var wid = pressWidth.width;
                    var sheetLengthUps = pressLength.lengthUps;
                    var sheetWidthUps = pressWidth.widthUps;


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
                                var lengthUps = len / pLength;
                                var widthUps = wid / pWidth;

                                var totalUpsOnSheet = Math.floor(lengthUps) * Math.floor(widthUps);

                                var usedArea = totalUpsOnSheet * pLength * pWidth;


                                wastageSheetAreaSame = (sheetArea - usedArea) * (sheetLengthUps * sheetWidthUps);
                                //  wastageSheetAreaSame = sheetArea - usedArea;

                                solutions.push({
                                    'stock_sheet_size': {
                                        'stock_length': stockLength,
                                        'stock_width': stockWidth,
                                        'press_sheets_from_length': sheetLengthUps,
                                        'press_sheets_from_width': sheetWidthUps,
                                        'no_0f_ups': sheetLengthUps * sheetWidthUps,
                                    },
                                    'press_sheet_size': {
                                        'press_length': len + gripper,
                                        'press_width': wid + runner,
                                        'ups_from_length': lengthUps,
                                        'ups_from_width': widthUps,
                                        "total_ups_on_sheet": totalUpsOnSheet,
                                    },
                                    'print_direction': 'same',
                                    'wastage': wastageSheetAreaSame,

                                })
                            }
                        }
                        if (differentDirection) {
                            if (pWidth <= len && pLength <= wid) {

                                var sheetArea = (len + gripper) * (wid + runner);

                                //var sheetArea = len * wid;
                                var lengthUps = len / pWidth;
                                var widthUps = wid / pLength;

                                var totalUpsOnSheet = Math.floor(lengthUps) * Math.floor(widthUps);

                                var usedArea = totalUpsOnSheet * pLength * pWidth;
                                wastageSheetAreaSame = (sheetArea - usedArea) * (sheetLengthUps * sheetWidthUps);

                                //  wastageSheetAreaSame = sheetArea - usedArea;

                                solutions.push({
                                    'stock_sheet_size': {
                                        'stock_length': stockLength,
                                        'stock_width': stockWidth,
                                        'press_sheets_from_length': sheetLengthUps,
                                        'press_sheets_from_width': sheetWidthUps,
                                        'no_0f_ups': sheetLengthUps * sheetWidthUps,
                                    },
                                    'press_sheet_size': {
                                        'press_length': len + gripper,
                                        'press_width': wid + runner,
                                        'ups_from_length': lengthUps,
                                        'ups_from_width': widthUps,
                                        "total_ups_on_sheet": totalUpsOnSheet,
                                    },
                                    'print_direction': 'different',
                                    'wastage': wastageSheetAreaSame,
                                })
                            }
                        }
                    }

                } else if (pressLength.length > pressWidth.width) {

                    var wid = pressLength.length;
                    var len = pressWidth.width;


                    var sheetLengthUps = pressLength.lengthUps;
                    var sheetWidthUps = pressWidth.widthUps;


                    if (
                        (machineMinLength <= len && len <= machineMaxLength) &&
                        (machineMinWidth <= wid && wid <= machineMaxWidth)) {

                        len = len - gripper;
                        wid = wid - runner;

                        var differentDirection = true;
                        var sameDirection = true;

                        if (sameDirection) {
                            if (pLength <= len && pWidth <= wid) {

                                var sheetArea = (len + gripper) * (wid + runner);
                                // var sheetArea = len * wid;
                                var lengthUps = len / pLength;
                                var widthUps = wid / pWidth;


                                var totalUpsOnSheet = Math.floor(lengthUps) * Math.floor(widthUps);

                                var usedArea = totalUpsOnSheet * pLength * pWidth;
                                wastageSheetAreaSame = (sheetArea - usedArea) * (sheetLengthUps * sheetWidthUps);

                                // wastageSheetAreaSame = sheetArea - usedArea;

                                solutions.push({
                                    'stock_sheet_size': {
                                        'stock_length': stockLength,
                                        'stock_width': stockWidth,
                                        'press_sheets_from_length': sheetLengthUps,
                                        'press_sheets_from_width': sheetWidthUps,
                                        'no_0f_ups': sheetLengthUps * sheetWidthUps,
                                    },
                                    'press_sheet_size': {
                                        'press_length': len + gripper,
                                        'press_width': wid + runner,
                                        'ups_from_length': lengthUps,
                                        'ups_from_width': widthUps,
                                        "total_ups_on_sheet": totalUpsOnSheet,
                                    },
                                    'print_direction': 'same',
                                    'wastage': wastageSheetAreaSame,

                                })
                            }
                        }
                        if (differentDirection) {

                            if (pWidth <= len && pLength <= wid) {

                                var sheetArea = (len + gripper) * (wid + runner);
                                //var sheetArea = len * wid;
                                var lengthUps = len / pWidth;
                                var widthUps = wid / pLength;

                                var totalUpsOnSheet = Math.floor(lengthUps) * Math.floor(widthUps);

                                var usedArea = totalUpsOnSheet * pLength * pWidth;
                                wastageSheetAreaSame = (sheetArea - usedArea) * (sheetLengthUps * sheetWidthUps);

                                //  wastageSheetAreaSame = sheetArea - usedArea;


                                solutions.push({
                                    'stock_sheet_size': {
                                        'stock_length': stockLength,
                                        'stock_width': stockWidth,
                                        'press_sheets_from_length': sheetLengthUps,
                                        'press_sheets_from_width': sheetWidthUps,
                                        'no_0f_ups': sheetLengthUps * sheetWidthUps,
                                    },
                                    'press_sheet_size': {
                                        'press_length': len + gripper,
                                        'press_width': wid + runner,
                                        'ups_from_length': lengthUps,
                                        'ups_from_width': widthUps,
                                        "total_ups_on_sheet": totalUpsOnSheet,

                                    },
                                    'print_direction': 'different',
                                    'wastage': wastageSheetAreaSame,
                                })
                            }
                        }
                    }

                }
            })
        })
    }
    callback(solutions);
}

function flatSizeCosting(
    foundPackage,
    printing_machine,
    die_machine,
    guillotine_machine,
    res
) {
    //product
    var trim = foundPackage[0].product.flat.flat_trim;
    var productLength = foundPackage[0].product.flat.flat_length + trim;
    var productWidth = foundPackage[0].product.flat.flat_width + trim;
    var quantity = foundPackage[0].product.quantity;


    var frontProcessColors = foundPackage[0].product.color.front.process_colors.length;
    var frontSpotColors = foundPackage[0].product.color.front.spot_colors.length;
    var backProcessColors = foundPackage[0].product.color.back.process_colors.length;
    var backSpotColors = foundPackage[0].product.color.back.spot_colors.length;
    var variableColors = foundPackage[0].product.color.variable.variable_colors.length;

    var packageFormatPrice = foundPackage[0].product.package_format.price;
    var barCodePrice = foundPackage[0].product.barcode.price;
    var frontCoatingPrice = foundPackage[0].product.coating.front.coating_value.price;
    var backCoatingPrice = foundPackage[0].product.coating.back.coating_value.price;
    var diePrice = foundPackage[0].product.finishing.cut_type.price;

    //these are price per 1000
    var threadPrice = foundPackage[0].product.finishing.thread_type.price;
    var pastingPrice = foundPackage[0].product.finishing.pasting.price;
    var specialReqPrice = foundPackage[0].product.finishing.special_requirements.price;
    var foldingPrice = foundPackage[0].product.finishing.folding.price;
    var perforationPrice = foundPackage[0].product.finishing.perforation.price;


    //stock
    var stock_rate = foundPackage[0].stock.description.stock_rate;
    var stock_rate_unit = foundPackage[0].stock.description.stock_rate_unit;
    var coatedSidesPrice = foundPackage[0].stock.coated_sides.price;
    var stockLength = foundPackage[0].stock.stock_length;
    var stockWidth = foundPackage[0].stock.stock_width;
    var gsm = foundPackage[0].stock.weight;

    //we have to calculate this smartly 
    // var pressSheetLength = 0;
    // var pressSheetWidth = 0;

    //packing
    var bundleSize = foundPackage[0].packing.bundle;
    var primaryPackPrice = foundPackage[0].packing.primary_pack.price;
    var carton = foundPackage[0].packing.carton;
    var pallet = foundPackage[0].packing.pallet;

    var deliveryPrice = foundPackage[0].delivery.delivered_by.price;

    //all product info


    findMachine(printing_machine, (printingMachine) => {
        console.log(printingMachine);
        findMachine(die_machine, (dieMachine) => {
            console.log(dieMachine);
            findMachine(guillotine_machine, (guillotineMachine) => {
                console.log(guillotineMachine);
                //Machine Prices
                printingPrice = printingMachine[0].machine_cost;
                platePrice = printingMachine[0].plate.price;
                dieCuttingPrice = dieMachine[0].machine_cost;
                straightCuttingPrice = guillotineMachine[0].machine_cost;
                machineMaxLength = printingMachine[0].max_size.length;
                machineMaxWidth = printingMachine[0].max_size.width;
                machineMinLength = printingMachine[0].min_size.length;
                machineMinWidth = printingMachine[0].min_size.width;


                console.log('---------------------working======================')
                calculateKGS(stockLength, stockWidth, gsm, (kgs) => {
                    console.log('kgs is' + kgs);
                    calculateWeightOfOneSheet(kgs, (weightOfOneSheet) => {
                        console.log('weight of one sheet is' + weightOfOneSheet);
                        calculateStockrateorRsPerKg(stock_rate, stock_rate_unit, weightOfOneSheet, (stockRate, rsPerKg) => {
                            console.log('stockRate is' + stockRate);
                            console.log('rsPerKg is' + rsPerKg);
                            calculateNoOfColors(frontProcessColors, frontSpotColors, backProcessColors, backSpotColors, variableColors, (totalColors, noOfPlates) => {
                                console.log("total no of colors " + totalColors);
                                console.log("total no of plates " + noOfPlates);
                                /// here loop will run later on, but now we have just one stock

                                cutStock(
                                    stockLength,
                                    stockWidth,
                                    machineMaxLength,
                                    machineMaxWidth,
                                    machineMinLength,
                                    machineMinWidth,
                                    (possibleSheetLength, possibleSheetWidth) => {
                                        selectFlatCombinations(
                                            possibleSheetLength,
                                            possibleSheetWidth,
                                            machineMaxLength,
                                            machineMaxWidth,
                                            machineMinLength,
                                            machineMinWidth,
                                            stockLength,
                                            stockWidth,
                                            productLength,
                                            productWidth,
                                            (solutions) => {
                                                console.log(solutions);
                                                calculateCostsOfSolutions(
                                                    stockRate,
                                                    printingPrice,
                                                    dieCuttingPrice,
                                                    straightCuttingPrice,
                                                    weightOfOneSheet,
                                                    quantity,
                                                    totalColors,
                                                    solutions,
                                                    platePrice,
                                                    noOfPlates,
                                                    diePrice,
                                                    frontCoatingPrice,
                                                    backCoatingPrice,
                                                    threadPrice,
                                                    pastingPrice,
                                                    specialReqPrice,
                                                    foldingPrice,
                                                    perforationPrice,
                                                    primaryPackPrice,
                                                    carton,
                                                    pallet,
                                                    deliveryPrice,
                                                    (minCostSolution) => {
                                                        console.log("================ min Cost Solution =================");
                                                        console.log(minCostSolution);
                                                        grainDirection(
                                                            minCostSolution,
                                                            (grain_direction) => {
                                                                console.log('===============grain directions is ======================')
                                                                console.log(grain_direction);
                                                                working(res);
                                                            });
                                                    });
                                            })
                                    });
                            })
                        })
                    })
                });
            })
        });
    })
}

//carton combinations 
function selectCartonCombinations(
    possibleSheetLength,
    possibleSheetWidth,
    machineMaxLength,
    machineMaxWidth,
    machineMinLength,
    machineMinWidth,
    stockLength,
    stockWidth,
    productLength,
    productWidth,
    productHeight,
    productFlap,
    productZay,
    callback
) {
    var solutions = [];
    var runner = 0.50;
    var gripper = 0.75;
    var first_up_length = productLength + (productHeight * 2) + (productFlap * 2);
    var second_up_length = productLength + productHeight + productFlap;
    var pWidth = (productWidth * 2) + (productHeight * 2) + productZay;

    if (possibleSheetLength.length > 0 && possibleSheetWidth.length > 0) {
        possibleSheetLength.forEach((pressLength) => {
            possibleSheetWidth.forEach((pressWidth) => {

                if (pressLength.length <= pressWidth.width) {
                    var len = pressLength.length;
                    var wid = pressWidth.width;
                    var sheetLengthUps = pressLength.lengthUps;
                    var sheetWidthUps = pressWidth.widthUps;
                    if (
                        (machineMinLength <= len && len <= machineMaxLength)
                        &&
                        (machineMinWidth <= wid && wid <= machineMaxWidth)
                    ) {
                        len = len - gripper;
                        wid = wid - runner;

                        var differentDirection = true;
                        var sameDirection = true;

                        if (sameDirection) {
                            if (first_up_length <= len && pWidth <= wid) {

                                var press_sheet_length_minus_first_up_length = len - first_up_length;
                                var lengthUps = (press_sheet_length_minus_first_up_length / (second_up_length)) + 1;
                                var widthUps = wid / pWidth;
                                var totalUpsOnSheet = Math.floor(lengthUps) * Math.floor(widthUps);
                                var sheetArea = len * wid;
                                var a = (productWidth * (productLength + productHeight + productFlap)) * 2;
                                var b = (productHeight * (productLength + (productHeight * 2))) * 2;
                                var c = (productZay * productLength);
                                var Area = a + b + c;
                                var usedArea = (a + b + c) * totalUpsOnSheet;
                                wastageSheetAreaSame = sheetArea - usedArea;
                                solutions.push({
                                    'stock_sheet_size': {
                                        'stock_length': stockLength,
                                        'stock_width': stockWidth,
                                        'press_sheets_from_length': sheetLengthUps,
                                        'press_sheets_from_width': sheetWidthUps,
                                        'no_0f_ups': sheetLengthUps * sheetWidthUps,
                                    },
                                    'press_sheet_size': {
                                        'press_length': len + gripper,
                                        'press_width': wid + runner,
                                        'ups_from_length': lengthUps,
                                        'ups_from_width': widthUps,
                                        "total_ups_on_sheet": totalUpsOnSheet,

                                    },
                                    'print_direction': 'same',
                                    'wastage': wastageSheetAreaSame,
                                })
                            }
                        }
                        if (differentDirection) {
                            if (pWidth <= len && first_up_length <= wid) {

                                var sheetArea = len * wid;
                                var lengthUps = len / pWidth;
                                var press_sheet_width_minus_first_up_length = wid - first_up_length;
                                var widthUps = (press_sheet_width_minus_first_up_length / second_up_length) + 1;

                                var totalUpsOnSheet = Math.floor(lengthUps) * Math.floor(widthUps);

                                var a = (productWidth * (productLength + productHeight + productFlap)) * 2;
                                var b = (productHeight * (productLength + (productHeight * 2))) * 2;
                                var c = (productZay * productLength);
                                var usedArea = (a + b + c) * totalUpsOnSheet;
                                var Area = a + b + c;

                                wastageSheetAreaSame = sheetArea - usedArea;
                                solutions.push({
                                    'stock_sheet_size': {
                                        'stock_length': stockLength,
                                        'stock_width': stockWidth,
                                        'press_sheets_from_length': sheetLengthUps,
                                        'press_sheets_from_width': sheetWidthUps,
                                        'no_0f_ups': sheetLengthUps * sheetWidthUps,
                                    },
                                    'press_sheet_size': {
                                        'press_length': len + gripper,
                                        'press_width': wid + runner,
                                        'ups_from_length': lengthUps,
                                        'ups_from_width': widthUps,
                                        "total_ups_on_sheet": totalUpsOnSheet,

                                    },
                                    'print_direction': 'different',
                                    'wastage': wastageSheetAreaSame,
                                })
                            }
                        }
                    }
                }
                else if (pressLength.length > pressWidth.width) {

                    var wid = pressLength.length;
                    var len = pressWidth.width;


                    var sheetLengthUps = pressLength.lengthUps;
                    var sheetWidthUps = pressWidth.widthUps;


                    if (
                        (machineMinLength <= len && len <= machineMaxLength)
                        &&
                        (machineMinWidth <= wid && wid <= machineMaxWidth)) {
                        len = len - gripper;
                        wid = wid - runner;

                        var differentDirection = true;
                        var sameDirection = true;

                        if (sameDirection) {
                            if (first_up_length <= len && pWidth <= wid) {

                                var press_sheet_length_minus_first_up_length = len - first_up_length;
                                var lengthUps = (press_sheet_length_minus_first_up_length / (second_up_length)) + 1;
                                var widthUps = wid / pWidth;
                                var totalUpsOnSheet = Math.floor(lengthUps) * Math.floor(widthUps);
                                var sheetArea = len * wid;
                                var a = (productWidth * (productLength + productHeight + productFlap)) * 2;
                                var b = (productHeight * (productLength + (productHeight * 2))) * 2;
                                var c = (productZay * productLength);
                                var usedArea = (a + b + c) * totalUpsOnSheet;
                                wastageSheetAreaSame = sheetArea - usedArea;
                                solutions.push({
                                    'stock_sheet_size': {
                                        'stock_length': stockLength,
                                        'stock_width': stockWidth,
                                        'press_sheets_from_length': sheetLengthUps,
                                        'press_sheets_from_width': sheetWidthUps,
                                        'no_0f_ups': sheetLengthUps * sheetWidthUps,
                                    },
                                    'press_sheet_size': {
                                        'press_length': len + gripper,
                                        'press_width': wid + runner,
                                        'ups_from_length': lengthUps,
                                        'ups_from_width': widthUps,
                                        "total_ups_on_sheet": totalUpsOnSheet,

                                    },
                                    'print_direction': 'same',
                                    'wastage': wastageSheetAreaSame,
                                })
                            }
                        }
                        if (differentDirection) {
                            if (pWidth <= len && first_up_length <= wid) {

                                var sheetArea = len * wid;
                                var lengthUps = len / pWidth;
                                var press_sheet_width_minus_first_up_length = wid - first_up_length;
                                var widthUps = (press_sheet_width_minus_first_up_length / second_up_length) + 1;

                                var totalUpsOnSheet = Math.floor(lengthUps) * Math.floor(widthUps);
                                var a = (productWidth * (productLength + productHeight + productFlap)) * 2;
                                var b = (productHeight * (productLength + (productHeight * 2))) * 2;
                                var c = (productZay * productLength);
                                var usedArea = (a + b + c) * totalUpsOnSheet;


                                wastageSheetAreaSame = sheetArea - usedArea;
                                solutions.push({
                                    'stock_sheet_size': {
                                        'stock_length': stockLength,
                                        'stock_width': stockWidth,
                                        'press_sheets_from_length': sheetLengthUps,
                                        'press_sheets_from_width': sheetWidthUps,
                                        'no_0f_ups': sheetLengthUps * sheetWidthUps,
                                    },
                                    'press_sheet_size': {
                                        'press_length': len + gripper,
                                        'press_width': wid + runner,
                                        'ups_from_length': lengthUps,
                                        'ups_from_width': widthUps,
                                        "total_ups_on_sheet": totalUpsOnSheet,

                                    },
                                    'print_direction': 'different',
                                    'wastage': wastageSheetAreaSame,
                                })
                            }
                        }
                    }

                }

            })
        })
    }
    callback(solutions);
}

function cartonSizeCosting(
    foundPackage,
    printing_machine,
    die_machine,
    guillotine_machine,
    res
) {
    //product
    var trim = 0.157;  //constant trim size between two ups
    var productLength = foundPackage[0].product.carton.carton_length + trim;
    var productWidth = foundPackage[0].product.carton.carton_width;
    var productHeight = foundPackage[0].product.carton.carton_height;
    var productFlap = foundPackage[0].product.carton.carton_flap;
    var productZay = foundPackage[0].product.carton.carton_zay;
    var quantity = foundPackage[0].product.quantity;

    var frontProcessColors = foundPackage[0].product.color.front.process_colors.length;
    var frontSpotColors = foundPackage[0].product.color.front.spot_colors.length;
    var backProcessColors = foundPackage[0].product.color.back.process_colors.length;
    var backSpotColors = foundPackage[0].product.color.back.spot_colors.length;
    var variableColors = foundPackage[0].product.color.variable.variable_colors.length;

    var packageFormatPrice = foundPackage[0].product.package_format.price;
    var barCodePrice = foundPackage[0].product.barcode.price;
    var frontCoatingPrice = foundPackage[0].product.coating.front.coating_value.price;
    var backCoatingPrice = foundPackage[0].product.coating.back.coating_value.price;
    var diePrice = foundPackage[0].product.finishing.cut_type.price;

    //these are price per 1000
    var threadPrice = foundPackage[0].product.finishing.thread_type.price;
    var pastingPrice = foundPackage[0].product.finishing.pasting.price;
    var specialReqPrice = foundPackage[0].product.finishing.special_requirements.price;
    var foldingPrice = foundPackage[0].product.finishing.folding.price;
    var perforationPrice = foundPackage[0].product.finishing.perforation.price;


    //stock
    var stock_rate = foundPackage[0].stock.description.stock_rate;
    var stock_rate_unit = foundPackage[0].stock.description.stock_rate_unit;
    var coatedSidesPrice = foundPackage[0].stock.coated_sides.price;
    var stockLength = foundPackage[0].stock.stock_length;
    var stockWidth = foundPackage[0].stock.stock_width;
    var gsm = foundPackage[0].stock.weight;

    //we have to calculate this smartly 
    // var pressSheetLength = 0;
    // var pressSheetWidth = 0;

    //packing
    var bundleSize = foundPackage[0].packing.bundle;
    var primaryPackPrice = foundPackage[0].packing.primary_pack.price;
    var carton = foundPackage[0].packing.carton;
    var pallet = foundPackage[0].packing.pallet;

    var deliveryPrice = foundPackage[0].delivery.delivered_by.price;

    findMachine(printing_machine, (printingMachine) => {
        var printingPrice = printingMachine[0].machine_cost;
        var platePrice = printingMachine[0].plate.price;
        var machineMaxLength = printingMachine[0].max_size.length;
        var machineMaxWidth = printingMachine[0].max_size.width;
        var machineMinLength = printingMachine[0].min_size.length;
        var machineMinWidth = printingMachine[0].min_size.width;
        findMachine(die_machine, (dieMachine) => {
            var dieCuttingPrice = dieMachine[0].machine_cost;
            findMachine(guillotine_machine, (guillotineMachine) => {
                try {
                    var straightCuttingPrice = guillotineMachine[0].machine_cost;

                console.log('---------------------working======================')
                calculateKGS(stockLength, stockWidth, gsm, (kgs) => {
                    console.log('kgs is' + kgs);
                    calculateWeightOfOneSheet(kgs, (weightOfOneSheet) => {
                        console.log('weight of one sheet is' + weightOfOneSheet);
                        calculateStockrateorRsPerKg(stock_rate, stock_rate_unit, weightOfOneSheet, (stockRate, rsPerKg) => {
                            console.log('stockRate is' + stockRate);
                            console.log('rsPerKg is' + rsPerKg);
                            calculateNoOfColors(frontProcessColors, frontSpotColors, backProcessColors, backSpotColors, variableColors, (totalColors, noOfPlates) => {
                                console.log("total no of colors " + totalColors);
                                console.log("total no of plates " + noOfPlates);
                                /// here loop will run later on, but now we have just one stock

                                cutStock(
                                    stockLength,
                                    stockWidth,
                                    machineMaxLength,
                                    machineMaxWidth,
                                    machineMinLength,
                                    machineMinWidth,
                                    (possibleSheetLength, possibleSheetWidth) => {
                                        console.log(possibleSheetLength);
                                        console.log(possibleSheetWidth);
                                        selectCartonCombinations(
                                            possibleSheetLength,
                                            possibleSheetWidth,
                                            machineMaxLength,
                                            machineMaxWidth,
                                            machineMinLength,
                                            machineMinWidth,
                                            stockLength,
                                            stockWidth,
                                            productLength,
                                            productWidth,
                                            productHeight,
                                            productFlap,
                                            productZay,
                                            (solutions) => {
                                                console.log(solutions);
                                                calculateCostsOfSolutions(
                                                    stockRate,
                                                    printingPrice,
                                                    dieCuttingPrice,
                                                    straightCuttingPrice,
                                                    weightOfOneSheet,
                                                    quantity,
                                                    totalColors,
                                                    solutions,
                                                    platePrice,
                                                    noOfPlates,
                                                    diePrice,
                                                    frontCoatingPrice,
                                                    backCoatingPrice,
                                                    threadPrice,
                                                    pastingPrice,
                                                    specialReqPrice,
                                                    foldingPrice,
                                                    perforationPrice,
                                                    primaryPackPrice,
                                                    carton,
                                                    pallet,
                                                    deliveryPrice,
                                                    (minCostSolution) => {
                                                        console.log("================ min Cost Solution =================");
                                                        console.log(minCostSolution);
                                                        grainDirection(
                                                            minCostSolution,
                                                            (grain_direction) => {
                                                                console.log('===============grain directions is ======================')
                                                                console.log(grain_direction);
                                                                working(res);
                                                            });
                                                    });
                                            })
                                    })
                            })
                        });
                    });
                });
            
             } catch(err){
                console.log(err);
                }
            })
        })
    })
}