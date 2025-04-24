import React from 'react'

function LazyLoadingPage() {
    return (<>
        <div data-theme='light' className="skeleton rounded-none h-96 w-full"></div>
        <div className='mx-auto px-4 py-5 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-4'>

            <h2 className='text-2xl font-bold tracking-tight text-gray-900'>Categories</h2>
            <div className="mt-6 flex overflow-x-auto space-x-5">
                {[1, 2, 3, 4, 5, 6].map((category, index) => (
                    <div data-theme='light' key={index} className="flex-shrink-0 group relative overflow-hidden border-[1px] border-gray-200 bg-white rounded-full lg:rounded-lg">
                        <div className="w-28 h-28 skeleton flex justify-center items-center lg:rounded-lg bg-gray-200 group-hover:opacity-75 lg:w-56 lg:h-52">
                        </div>
                    </div>
                ))}
            </div>

        </div>
        <div className="bg-white">
            <div className="mx-auto px-4 py-5 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-4">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">New Arrivals</h2>

                <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((product, index) => (
                        <div data-theme="light" key={index} className="relative w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-md">
                            <div className="skeleton h-72 w-auto rounded-t-lg object-cover"></div>

                            <div className="lg:rounded-lg mt-4 px-3 lg:px-5 pb-5">
                                <div className="skeleton w-full h-4">
                                </div>
                                <div className="mt-2.5 lg:mb-5 flex items-center skeleton">
                                </div>
                                <div className="lg:flex items-center justify-between">
                                    <div className='skeleton mb-4 lg:mb-0'>
                                    </div>
                                    <div className="skeleton flex items-center w-full lg:w-auto justify-center rounded-md px-5 py-2.5 text-center text-sm font-medium hover:opacity-75 focus:outline-none"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
    )
}

export default LazyLoadingPage