'use strict';

class CheckoutSolution {
    // skus is expected to be a string
    checkout(skus) {
        const prices = {
            A: 50, B: 30, C: 20, D: 15, E: 40, F: 10, G: 20, H: 10, I: 35, J: 60,
            K: 70, L: 90, M: 15, N: 40, O: 10, P: 50, Q: 30, R: 50, S: 20, T: 20,
            U: 40, V: 50, W: 20, X: 17, Y: 20, Z: 21
        };

        const offers = {
            A: [{ qty: 5, value: 200 }, { qty: 3, value: 130 }],
            B: [{ qty: 2, value: 45 }],
            H: [{ qty: 10, value: 80 }, { qty: 5, value: 45 }],
            K: [{ qty: 2, value: 120 }],
            P: [{ qty: 5, value: 200 }],
            Q: [{ qty: 3, value: 80 }],
            V: [{ qty: 3, value: 130 }, { qty: 2, value: 90 }]
        };

        // Sort offers once by descending qty for each SKU
        for (const sku in offers) {
            offers[sku].sort((a, b) => b.qty - a.qty);
        }

        const complexOffers = [
            { trigger: 'E', requiredQty: 2, freeItem: 'B', freeQty: 1 },
            { trigger: 'N', requiredQty: 3, freeItem: 'M', freeQty: 1 },
            { trigger: 'R', requiredQty: 3, freeItem: 'Q', freeQty: 1 },
        ];

        const selfFreeOffers = [
            { sku: 'F', requiredQty: 3, payQty: 2 },  // buy 2 get 1 free (3 total, pay for 2)
            { sku: 'U', requiredQty: 4, payQty: 3 },  // buy 3 get 1 free (4 total, pay for 3)
        ];

        const groupDiscountSKUs = ['S', 'T', 'X', 'Y', 'Z'];
        const groupDiscountQuantity = 3;
        const groupDiscountPrice = 45;

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

        // Handle Special Promotions
        for (const offer of selfFreeOffers) {
            if (summedProducts[offer.sku]) {
                const totalCount = summedProducts[offer.sku];
                const groups = Math.floor(totalCount / offer.requiredQty);
                const payableCount = groups * offer.payQty + (totalCount % offer.requiredQty);
                summedProducts[offer.sku] = payableCount;
            }
        }

        //Apply group discounts
        let groupItems = [];
        for (const sku of groupDiscountSKUs) {
            const count = summedProducts[sku] || 0;
            for (let i = 0; i < count; i++) {
                groupItems.push(sku);
            }
            // reset summedProducts as they'll be processed separately
            summedProducts[sku] = 0;
        }

        // sort by descending value
        groupItems.sort((a,b) => prices[b] - prices[a]);

        // Calculate total
        let total = 0;

        // Calculate group items prices
        while(groupItems.length >= groupDiscountQuantity) {
            // Remove 3 items from group items
            groupItems.splice(0, groupDiscountQuantity);
            total += groupDiscountPrice;
        }

        // Add price for remaining group items
        for (const sku of groupItems) {
            total += prices[sku];
        }

        for (let product in summedProducts) {
            // extract number of items per sku
            let productCount = summedProducts[product];
            
            if (offers[product]) {
                for (let offer of offers[product]) {
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

