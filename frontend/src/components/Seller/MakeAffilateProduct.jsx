import React, { useState } from 'react';

const MakeAffilateProduct = ({ product, handleChange, enableAffiliate, setEnableAffiliate }) => {

    return (
        <div className="lg:py-1 bg-white rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Affiliate Product</h2>
            <p className="text-gray-600 mb-4">List an External Product with Your Affiliate Link.</p>
            <div className="mb-4">
                <div className="relative">
                    <div className="flex items-center">
                        <label htmlFor="status" className="block text-base font-medium text-gray-900 mr-3">Affiliate Product</label>
                        <input
                            data-theme='light'
                            id='status'
                            name='status'
                            type="checkbox"
                            className="toggle toggle-success text-red-600"
                            onChange={() => setEnableAffiliate(!enableAffiliate)}
                            checked={enableAffiliate}
                        />
                    </div>
                    {enableAffiliate &&
                        <div>
                            <label className="block text-gray-700 mb-2 mt-4" htmlFor="affiliatePlatformName">
                                Affiliate Provider
                            </label>
                            <input
                                type="text"
                                id="affiliatePlatformName"
                                name="affiliatePlatformName"
                                value={product.affiliatePlatformName}
                                onChange={handleChange}
                                placeholder="Ex. Amazon, Flipkart, Myntra, and more"
                                className="w-full px-3 py-2 bg-transparent border border-gray-300 rounded"
                            />
                            <label className="block text-gray-700 mb-2 mt-5" htmlFor="affiliateLink">
                                External Link
                            </label>
                            <input
                                type="text"
                                id="affiliateLink"
                                name="affiliateLink"
                                value={product.affiliateLink}
                                onChange={handleChange}
                                placeholder="Enter Affiliate Link to redirect customers"
                                className="w-full px-3 py-2 bg-transparent border border-gray-300 rounded"
                            />
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default MakeAffilateProduct;
