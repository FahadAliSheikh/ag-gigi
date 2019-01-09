export class SearchBar {

    getDeliveryBy() {
        return ['Land', 'Sea', 'Air'];
    }
    getPrimaryPacking() {
        return ['Poly Bag', 'Paper Wrap'];
    }
    getStockInfo() {
        return [{
            millName: ['Hard Code'],
            grainDirection: ['SG', 'LG'],
            description: ['Ivory Card', 'Art Card', 'Bleach Card'],
            coatedSides: ['C1S', 'C2S', 'CCNB', 'UC'],
            weight: ['hard coded'],
            thickness: ['hard coded'],
            thicknessUnit: ['pt', 'micro'],
            stockLength: ['hard Coded'],
            stockWidth: ['hard coded']
        }];
    }
    getThreadTypes() {
        return ['hardcode1', 'hardcode2'];
    }
    getCutTypes() {
        return ['Die', 'Straight'];
    }
    getPasting() {
        return [{
            common: ['Zay', 'Clutch Bottom', 'Zay And Clutch Bottom'],
            special: ['Tape', 'Eyelet', 'Tray']
        }];
    }
    getCoatingTypes() {
        return [{
            type: [
                'Varnish Gloss', 'Varnish Matt', 'Varnish SoftTouch',
                'UV Gloss', 'UV Matt', 'UV SoftTouch',
                'Lamination Gloss', 'Lamination Matt', 'Lamination SoftTouch'
            ],
            value: [
                'Full', 'Spot', 'Window'
            ]
        }];
    }
    getBarCodes() {
        return ['UPC', 'EAN'];
    }
    getPackageFormat(){
        return ['Hang Tag', 'Inlay Cards'];
    }
}