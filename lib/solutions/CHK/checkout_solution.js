'use strict';

class CheckoutSolution {
    // skus is expected to be a string
    checkout(skus) {
        const prices = {
            A: 50,
            B: 30,
            C: 20,
            D: 15,
        };

        const offers = {
            A: { qty: 3, value: 130},
            B: { qty: 2, value: 45},
        };

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

        // Calculate total
        let total = 0;
        for (let product in summedProducts) {
            
        }

    }
}

module.exports = CheckoutSolution;



