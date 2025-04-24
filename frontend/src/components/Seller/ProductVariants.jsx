import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'


const ProductVariants = ({variants, setVariants}) => {
  let [isOpen, setIsOpen] = useState(false)

  const [type, setType] = useState("")
  const [variantData, setVariantData] = useState({
    type: "",
    name: "",
    color: "#000000",
    originalPrice: "",
    salePrice: "",
    qty: "",
    sku: "",
    status: true
  })

  function closeModal() {
    setType("")
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const handleType = (e) => {
    setType(e.target.value)
    setVariantData({
      ...variantData,
      type: e.target.value
    })
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    setVariantData({
      ...variantData,
      [name]: value,
    })
  }

  const handleVariantStatus = (e) => {
    setVariantData({
      ...variantData,
      status: !variantData.status
    })
  }

  const handleAddVariant = (e) => {
    setVariants([
      ...variants,
      variantData
    ])
    setVariantData({
      type: "",
      name: "",
      color: "#000000",
      originalPrice: "",
      salePrice: "",
      qty: "",
      sku: "",
      status: true
    })
    setType("")
    closeModal()
  }

  //Edit Variant
  const handleInputChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };


  return (
    <>
      <div className="lg:p-6 bg-white rounded-lg">
        <h2 className="text-xl text-left font-bold">Variants</h2>
        <p className="text-gray-600 text-sm font-semibold mb-4 text-left">Customize variants for size, color, and more to cater to all your customers’ preferences.</p>
        <div className="flex flex-wrap space-x-2 mb-4">
          {variants.map((variant, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full ${index === 0 ? 'bg-gray-200' : 'bg-white border'
                }`}
            >
              {variant.name}
            </button>
          ))}
        </div>
        <button onClick={openModal} className="mb-4 px-4 py-2 bg-orange-500 text-white rounded">Edit or add variants</button>
        {variants.length !== 0 ?
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Variant</th>
                  <th className="px-4 py-2 border">Original Price</th>
                  <th className="px-4 py-2 border">Selling price</th>
                  <th className="px-4 py-2 border">SKU ID</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">
                      <span>{variant.name}</span>
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="text"
                        value={variant.originalPrice}
                        onChange={(e) => handleInputChange(index, 'originalPrice', e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-transparent"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="text"
                        value={variant.salePrice}
                        onChange={(e) => handleInputChange(index, 'salePrice', e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-transparent"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <span>{variant.sku}</span>
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="text"
                        value={variant.qty}
                        onChange={(e) => handleInputChange(index, 'qty', e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-transparent"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        data-theme='light'
                        id='status'
                        name='status'
                        type="checkbox"
                        className="toggle toggle-success text-red-600"
                        onChange={(e) => handleInputChange(index, 'status', !variant.status)}
                        checked={variant.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          : ""
        }
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900"
                  >
                    Add Product Variant
                  </Dialog.Title>
                  <div className="mt-5">
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">Select Variant Type<span className='text-red-700'>*</span></label>
                      <select
                        onChange={handleType}
                        value={type}
                        id="type"
                        name="type"
                        className="w-full px-3 py-2 mt-1 text-gray-900 bg-transparent border border-gray-300 rounded-md"
                      >
                        <option value="">Select type</option>
                        <option value="color">color</option>
                        <option value="size">size</option>
                        <option value="other">other</option>
                      </select>
                    </div>
                    <div className='mt-3'>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Label Name<span className='text-red-700'>*</span></label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full px-3 py-2 mt-1 text-gray-900 bg-transparent border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        value={variantData.name}
                        onChange={handleInput}
                      />
                    </div>
                    {type === "color" ?
                      <div className='mt-3'>
                        <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color<span className='text-red-700'>*</span></label>
                        <input
                          id="color"
                          name="color"
                          type="color"
                          className="text-gray-900 bg-transparent border border-gray-300 rounded-md"
                          value={variantData.color}
                          onChange={handleInput}
                        />
                      </div>
                      : ""}
                    <div className='mt-3'>
                      <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">MRP<span className='text-red-700'>*</span></label>
                      <input
                        id="originalPrice"
                        name="originalPrice"
                        type="number"
                        required
                        className="w-full px-3 py-2 mt-1 text-gray-900 bg-transparent border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        value={variantData.originalPrice}
                        onChange={handleInput}
                      />
                    </div>
                    <div className='mt-3'>
                      <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">Selling Price</label>
                      <input
                        id="salePrice"
                        name="salePrice"
                        type="number"
                        className="grow w-full px-3 py-2 mt-1 text-gray-900 bg-transparent border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        value={variantData.salePrice}
                        onChange={handleInput}
                      />
                    </div>
                    <div className='mt-3'>
                      <label htmlFor="qty" className="block text-sm font-medium text-gray-700">Quantity<span className='text-red-700'>*</span></label>
                      <input
                        id="qty"
                        name="qty"
                        type="number"
                        required
                        className="w-full px-3 py-2 mt-1 text-gray-900 bg-transparent border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        value={variantData.qty}
                        onChange={handleInput}
                      />
                    </div>
                    <div className='mt-3'>
                      <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU<span className='text-red-700'>*</span></label>
                      <input
                        id="sku"
                        name="sku"
                        type="text"
                        required
                        className="w-full px-3 py-2 mt-1 text-gray-900 bg-transparent border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        value={variantData.sku}
                        onChange={handleInput}
                      />
                    </div>
                    <div className='mt-3'>
                      <label htmlFor="sku" className="block text-sm font-medium text-gray-700">Status<span className='text-red-700'>*</span></label>
                      <input
                        data-theme='light'
                        id='status'
                        name='status'
                        type="checkbox"
                        className="toggle toggle-success text-red-600"
                        onChange={handleVariantStatus}
                        checked={variantData.status}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex float-end space-x-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bggraye-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleAddVariant}
                    >
                      Add
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ProductVariants;
