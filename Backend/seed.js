var mongoose = require("mongoose");
var seedSchema = require('./api/models/machine');

var machineData = [
    {
        machine_name: 'guillotine_cutting_machine',
        machine_type: 'guillotine_cutting',
        machine_man_name: 'machine man name',

        machine_cost: 0.05,
        // max_size: {
        //     length: 28,
        //     width: 40,
        // },
        // min_size: {
        //     length: 12,
        //     width: 20,
        // },

    },
    {
        machine_name: 'big_die_cutting_machine',
        machine_type: 'die_cutting',
        machine_man_name: 'machine man name',

        machine_cost: 0.250,
        // max_size: {
        //     length: 28,
        //     width: 40,
        // },
        // min_size: {
        //     length: 12,
        //     width: 20,
        // },

    },
    {
        machine_name: 'small_die_cutting_machine',
        machine_type: 'die_cutting',
        machine_man_name: 'machine man name',

        machine_cost: 0.15,
        // max_size: {
        //     length: 28,
        //     width: 40,
        // },
        // min_size: {
        //     length: 12,
        //     width: 20,
        // },

    },
    {
        machine_name: 'speed master 102',
        machine_type: 'printing',
        machine_man_name: 'machine man name',
        no_of_colors: 5,
        machine_cost: 0.5,
        max_size: {
            length: 28,
            width: 40,
        },
        min_size: {
            length: 12,
            width: 20,
        },
        plate: {
            length: 1030,
            width: 770,
            price: 1200
        }

    }, {
        machine_name: 'speed master 74',
        machine_type: 'printing',
        machine_man_name: '',
        no_of_colors: 5,
        machine_cost: 0.5,
        max_size: {
            length: 20,
            width: 29,
        },
        min_size: {
            length: 12,
            width: 16,
        },
        plate: {
            length: 745,
            width: 605,
            price: 700
        }

    },
    {
        machine_name: 'speed master 74',
        machine_type: 'printing',
        machine_man_name: '',
        no_of_colors: 2,
        machine_cost: 0.5,
        max_size: {
            length: 20,
            width: 29,
        },
        min_size: {
            length: 10,
            width: 16,
        },
        plate: {
            length: 745,
            width: 605,
            price: 700
        }

    },
    {
        machine_name: 'heiderberge sormz',
        machine_type: 'printing',
        machine_man_name: '',
        no_of_colors: 2,
        machine_cost: 0.5,
        max_size: {
            length: 20,
            width: 28,
        },
        min_size: {
            length: 12,
            width: 17,
        },
        plate: {
            length: 745,
            width: 605,
            price: 700
        }

    },
    {
        machine_name: 'Heidelberge sock',
        machine_type: 'printing',
        machine_man_name: '',
        no_of_colors: 2,
        machine_cost: 0.250,
        max_size: {
            length: 19,
            width: 25,
        },
        min_size: {
            length: 11,
            width: 15,
        },
        plate: {
            length: 650,
            width: 550,
            price: 650
        }

    },
    {
        machine_name: 'heidelberge sock',
        machine_type: 'printing',
        machine_man_name: '',
        no_of_colors: 2,
        machine_cost: 0.250,
        max_size: {
            length: 19,
            width: 25,
        },
        min_size: {
            length: 11,
            width: 15,
        },
        plate: {
            length: 650,
            width: 550,
            price: 650
        }

    },
    {
        machine_name: 'heidelberg kora',
        machine_type: 'printing',
        machine_man_name: '',
        no_of_colors: 1,
        machine_cost: 0.350,
        max_size: {
            length: 15,
            width: 20,
        },
        min_size: {
            length: 10,
            width: 7,
        },
        plate: {
            length: 570,
            width: 508,
            price: 350
        }

    },
    {
        machine_name: 'heidelberg kora',
        machine_type: 'printing',
        machine_man_name: '',
        no_of_colors: 1,
        machine_cost: 0.350,
        max_size: {
            length: 15,
            width: 20,
        },
        min_size: {
            length: 10,
            width: 7,
        },
        plate: {
            length: 570,
            width: 508,
            price: 350
        }

    },
    {
        machine_name: 'heidelberg gtoz',
        machine_type: 'printing',
        machine_man_name: '',
        no_of_colors: 1,
        machine_cost: 0.2,
        max_size: {
            length: 14,
            width: 20,
        },
        min_size: {
            length: 8,
            width: 8,
        },
        plate: {
            length: 510,
            width: 400,
            price: 350
        }

    },
    {
        machine_name: 'heidelberg gtoz',
        machine_type: 'printing',
        machine_man_name: '',
        no_of_colors: 2,
        machine_cost: 0.2,
        max_size: {
            length: 14,
            width: 20,
        },
        min_size: {
            length: 8,
            width: 8,
        },
        plate: {
            length: 510,
            width: 400,
            price: 350
        }

    },
    {
        machine_name: 'heidelberg sormz',
        machine_type: 'printing',
        machine_man_name: '',
        no_of_colors: 2,
        machine_cost: 0.5,
        max_size: {
            length: 20,
            width: 28,
        },
        min_size: {
            length: 12,
            width: 17,
        },
        plate: {
            length: 745,
            width: 605,
            price: 700
        }

    }
]
var barCodesData = [
    { type: 'none', price: 0 },
    { type: 'upc', price: 20 },
    { type: 'ean', price: 20 }
]

var CoatingData = [
    {
        type: 'none',
        price: 0,
    },
    {
        type: 'full varnish gloss',
        price: 0.002,
    },
    {
        type: 'spot varnish gloss',
        price: 0.002,
    },
    {
        type: 'window varnish gloss',
        price: 0.002,
    },
    {
        type: 'full varnish matt',
        price: 0.003,
    },
    {
        type: 'spot varnish matt',
        price: 0.003,
    },
    {
        type: 'window varnish matt',
        price: 0.003,
    },
    {
        type: 'full varnish softTouch',
        price: 0.0416,
    },
    {
        type: 'spot varnish softTouch',
        price: 0.0416,
    },
    {
        type: 'window varnish softTouch',
        price: 0.0416,
    },
    {
        type: 'full UV gloss',
        price: 0.006,
    },
    {
        type: 'spot UV gloss',
        price: 0.006,
    },
    {
        type: 'window UV gloss',
        price: 0.006,
    },
    {
        type: 'full UV matt',
        price: 0.006,
    },
    {
        type: 'spot UV matt',
        price: 0.006,
    },
    {
        type: 'window UV matt',
        price: 0.006,
    },
    {
        type: 'full UV softTouch',
        price: 0.0416,
    },
    {
        type: 'spot UV softTouch',
        price: 0.0416,
    },
    {
        type: 'window UV softTouch',
        price: 0.0416,
    },
    {
        type: 'full lamination gloss',
        price: 0.003,
    },
    {
        type: 'spot lamination gloss',
        price: 0.003,
    },
    {
        type: 'window lamination gloss',
        price: 0.003,
    },
    {
        type: 'full lamination matt',
        price: 0.006,
    },
    {
        type: 'spot lamination matt',
        price: 0.006,
    },
    {
        type: 'window lamination matt',
        price: 0.006,
    },
    {
        type: 'full lamination softTouch',
        price: 0.055,
    },
    {
        type: 'spot lamination softTouch',
        price: 0.055,
    },
    {
        type: 'window lamination softTouch',
        price: 0.055,
    },


]


var PackageFormatData = [
    { type: 'none', price: 0 },
    { type: 'Hang Tag', price: 20 },
    { type: 'Inlay Cards', price: 20 }
]
var cutData = [
    { type: 'none', price: 0 },
    { type: 'full die', price: 5 },
    { type: 'half die', price: 5 },
    { type: 'straight', price: 0 },
]
var threadData = [
    { type: 'none', price: 0 },
    { type: 'thread type one', price: 0.20 },
    { type: 'thread type two', price: 0.20 },
]
var pastingData = [
    { type: 'none', price: 0 },
    { type: 'tray', price: 0.01 },
    { type: 'zay', price: 0.01 },
    { type: 'clutch botton', price: 0.01 },
]
var SpecialRequirementData = [
    { type: 'none', price: 0 },
    { type: 'tape', price: 0.15 },
    { type: 'eyelet', price: 0.15 },
    { type: 'tray', price: 0.13 },
]
var foldingData = [
    { value: 'yes', price: 0.25, no_of_folds: 1 },
    { value: 'no', price: 0, no_of_folds: 0 },
]
var perforationData = [
    { value: 'yes', price: 0.25 },
    { value: 'no', price: 0 },

]

var descriptionData = [
    { type: 'none' },
    { type: 'ivory card' },
    { type: 'art card' },
    { type: 'bleach card' },

    // { type: 'none', stock_rate: 0, stock_rate_unit: 'rs_per_pkt' },
    // { type: 'ivory card', stock_rate: 100, stock_rate_unit: 'rs_per_kg' },
    // { type: 'art card', stock_rate: 200, stock_rate_unit: 'rs_per_pkt' },
    // { type: 'bleach card', stock_rate: 2.85, stock_rate_unit: 'rs_per_pkt' },
]
var coatedSidesData = [
    { type: 'none', price: 0 },
    { type: 'c1s', price: 10 },
    { type: 'c2s', price: 10 },
    { type: 'ccnb', price: 10 },
    { type: 'uc', price: 10 },
]

var primaryPackingData = [

    { type: 'none', price: 0 },
    { type: 'poly bag', price: 0.01 },
    { type: 'paper wrap', price: 0.01 },
    { type: 'carton', price: 0.01 },
    { type: 'pallet', price: 0.01 },
]
var cartonData = [
    { value: true, price: 0.25 },
    { value: false, price: 0 },
]
var palletData = [
    { value: true, price: 0.25 },
    { value: false, price: 0 },
]

var deliverByData = [
    { type: 'none', price: 0 },
    { type: 'land', price: 20 },
    { type: 'sea', price: 200 },
    { type: 'air', price: 300 }
]

function seedDB() {

    seedSchema.Machine.remove({}, (err) => {
        if (err) {
            console.log(err)
        } else {
            machineData.forEach((eachMachine) => {
                seedSchema.Machine.create(eachMachine, (err, createdMachine) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(createdMachine);
                    }
                })
            })
        }
    });
    seedSchema.barCode.remove({}, function (error) {
        if (error) {
            console.log(error);
        }

        barCodesData.forEach(function (seed) {
            // add few campgrounds
            seedSchema.barCode.create(seed, function (error, coating) {
                if (error) {
                    console.log(error);
                } else {


                }
            });
        });

    });
    seedSchema.Coating.remove({}, function (err) {
        if (err) {
            console.log(err)
        }
        CoatingData.forEach(function (seed) {
            seedSchema.Coating.create(seed, function (err, coating) {
                if (err) {
                    console.log(err);
                } else {

                }
            })
        })
    })


    seedSchema.PackageFormat.remove({}, function (error) {
        if (error) {
            console.log(error)
        }
        PackageFormatData.forEach((seed) => {
            seedSchema.PackageFormat.create(seed, (err, created) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(created);
                }
            })
        })
    });
    seedSchema.Cut.remove({}, function (error) {
        if (error) {
            console.log(error)
        }
        cutData.forEach((seed) => {
            seedSchema.Cut.create(seed, (err, created) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(created);
                }
            })
        })
    });
    secondryPrintData = [
        { type: 'none', price: 0 },
        { type: 'foiling', price: 0.02 },
        { type: 'embossing', price: 0.15 }

    ]
    seedSchema.SecondaryPrint.remove({}, function (error) {
        if (error) {
            console.log(error)
        }
        secondryPrintData.forEach((seed) => {
            seedSchema.SecondaryPrint.create(seed, (err, created) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(created);
                }
            })
        })
    });

    seedSchema.Thread.remove({}, function (error) {
        if (error) {
            console.log(error)
        }
        threadData.forEach((seed) => {
            seedSchema.Thread.create(seed, (error, created) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log(created);
                }
            })
        })
    });

    seedSchema.Pasting.remove({}, function (error) {
        if (error) {
            console.log(error);
        }

        pastingData.forEach(function (seed) {
            // add few campgrounds
            seedSchema.Pasting.create(seed, function (error, coating) {
                if (error) {
                    console.log(error);
                } else {


                }
            });
        });
    });

    seedSchema.SpecialRequirement.remove({}, function (error) {
        if (error) {
            console.log(error)
        }
        SpecialRequirementData.forEach((seed) => {
            seedSchema.SpecialRequirement.create(seed, (err, created) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(created);
                }
            })
        })
    });

    seedSchema.Folding.remove({}, function (error) {
        if (error) {
            console.log(error)
        }
        foldingData.forEach((seed) => {
            seedSchema.Folding.create(seed, (err, created) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(created);
                }
            })
        })
    });


    seedSchema.Perforation.remove({}, function (error) {
        if (error) {
            console.log(error)
        }
        perforationData.forEach((seed) => {
            seedSchema.Perforation.create(seed, (err, created) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(created);
                }
            })
        })
    });

    seedSchema.Description.remove({}, function (error) {
        if (error) {
            console.log(error)
        }
        descriptionData.forEach((seed) => {
            seedSchema.Description.create(seed, (err, created) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(created);
                }
            })
        })
    });

    seedSchema.CoatedSides.remove({}, function (error) {
        if (error) {
            console.log(error)
        }
        coatedSidesData.forEach((seed) => {
            seedSchema.CoatedSides.create(seed, (err, created) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(created);
                }
            })
        })
    });

    seedSchema.PrimaryPacking.remove({}, function (error) {
        if (error) {
            console.log(error)
        }
        primaryPackingData.forEach((seed) => {
            seedSchema.PrimaryPacking.create(seed, (err, created) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(created);
                }
            })
        })
    });

    // seedSchema.Carton.remove({}, function (error) {
    //     if (error) {
    //         console.log(error)
    //     }
    //     cartonData.forEach((seed) => {
    //         seedSchema.Carton.create(seed, (err, created) => {
    //             if (err) {
    //                 console.log(err)
    //             } else {
    //                 console.log(created);
    //             }
    //         })
    //     })
    // });

    // seedSchema.Pallet.remove({}, function (error) {
    //     if (error) {
    //         console.log(error)
    //     }
    //     palletData.forEach((seed) => {
    //         seedSchema.Pallet.create(seed, (err, created) => {
    //             if (err) {
    //                 console.log(err)
    //             } else {
    //                 console.log(created);
    //             }
    //         })
    //     })
    // });
    seedSchema.DeliverBy.remove({}, function (error) {
        if (error) {
            console.log(error)
        }
        deliverByData.forEach((seed) => {
            seedSchema.DeliverBy.create(seed, (err, created) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(created);
                }
            })
        })
    });



}





module.exports = seedDB;

