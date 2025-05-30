'use strict';

class CheckoutSolution {
    // skus is expected to be a string
    checkout(skus) {
        const prices = {
            A: 50,
            B: 30,
            C: 20,
            D: 15,
            E: 40,
        };

        const offers = {
            A: [
                { qty: 5, value: 200 },
                { qty: 3, value: 130 },
            ],
            B: { qty: 2, value: 45},
        };

        const complexOffers = [
            { trigger: 'E', requiredQty: 2, freeItem: 'B', freeQty: 1 },
        ];

        // Validate the skus first
        for (let sku of skus) {
            if(!prices.hasOwnProperty(sku)) {
                return -1;
            }
        };

        // Count the totals of each product type
        let summedProducts = {};
        for (let sku of skus) {
            // Check if the sku is already there, if not initialise it as one
            summedProducts[sku] = (summedProducts[sku] || 0) + 1;
        };

        // Apply cross promotions first
        for (let offer of complexOffers) {
            const triggerCount = summedProducts[offer.trigger] || 0;
            const freeItems = Math.floor(triggerCount / offer.requiredQty) * offer.freeQty;

            if(summedProducts[offer.freeItem]) {
                summedProducts[offer.freeItem] = Math.max(0, summedProducts[offer.freeItem] - freeItems);
            }
        }

        // Calculate total
        let total = 0;
        for (let product in summedProducts) {
            // extract number of items per sku
            let productCount = summedProducts[product];
            
            if (offers[product]) {
                for (let offer of offers[product]) {
                    // find the most that apply to the best offer
                    const offerCount = Math.floor(productCount / offer.qty);
                    total += offerCount * offer.value;
                    // set product count to the remainder to loop for next offer or to calculate individual price
                    productCount %= offer.qty;
                }
            }

            total += productCount * prices[product];
        }

        return total;

    }
}

module.exports = CheckoutSolution;



