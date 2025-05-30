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

        // Validate the skus first
        for (let sku of skus) {
            if(!prices.hasOwnProperty(sku)) {
                return -1;
            }
        }

    }
}

module.exports = CheckoutSolution;

