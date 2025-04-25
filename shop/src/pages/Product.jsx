import React, { Fragment, useEffect, useState } from 'react';
import { useCart } from "../store/CartContext";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { Helmet } from 'react-helmet';
import ProductImageScroller from '../components/ProductImageScroller';

function Product() {
  const { id } = useParams();
  const navigate = useNavigate()
  const { addToCart, addQuickCheckoutProduct } = useCart();
  const [store, setStore] = useState({})
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [defaultImage, setDefaultImage] = useState("");
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [sizeChartImage, setSizeChartImage] = useState("")

  //variants type
  const [typeSize, setTypeSize] = useState(false);
  const [typeColor, setTypeColor] = useState(false);
  const [typeOther, setTypeOther] = useState(false);

  //default selected variants
  const [selectSize, setSelectSize] = useState("");
  const [selectColor, setSelectColor] = useState("");
  const [selectOther, setSelectOther] = useState("");

  const [selectedOriginalPrice, setSelectedOriginalPrice] = useState({});
  const [selectedPrice, setSelectedPrice] = useState({});

  const subdomain = window.location.hostname;

  async function getProductData() {
    try {
      setIsLoading(true);
      const store = await fetch(`${import.meta.env.VITE_API_URL}/api/store/subdomain/${subdomain}`);
      const storeData = await store.json();
      if (store.ok) {
        setStore(storeData.data)
        setColor1(storeData.data.themeColorOne);
        setColor2(storeData.data.themeColorTwo);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product/data/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        setProduct({ ...responseData.data, quantity: 1 });
        setDefaultImage(responseData.data.images.featuredImage);
        setSizeChartImage(responseData.data.sizeChartImage)

        // Check variants and set state accordingly
        responseData.data.variants.forEach((variant) => {
          if (variant.type === "size") {
            setTypeSize(true);
          } else if (variant.type === "color") {
            setTypeColor(true);
          } else if (variant.type === "other") {
            setTypeOther(true)
          }
        });

        setSelectedOriginalPrice(responseData.data.originalPrice)
        setSelectedPrice(responseData.data.salePrice);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    getProductData();
  }, []);

  useEffect(() => {
    updatePrice();
  }, [selectSize, selectColor, selectOther]);
  const updatePrice = () => {
    let variantPrice = product?.salePrice;

    product.variants?.forEach((variant) => {
      if (variant.type === "color" && variant.name === selectColor) {
        variantPrice = variant.salePrice;
      }
      if (variant.type === "size" && variant.name === selectSize) {
        variantPrice = variant.salePrice;
      }
      if (variant.type === "other" && variant.name === selectOther) {
        variantPrice = variant.salePrice;
      }
    });

    setSelectedPrice(variantPrice);
  };

  if (isLoading) {
    return <div className='flex h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>;
  }

  const handleImage = (image) => {
    setDefaultImage(image);
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleAddToCart = () => {
    const selectedProduct = {
      ...product,
      selectSize,
      selectColor,
      selectOther,
      salePrice: Number(selectedPrice),
    };
    addToCart(selectedProduct);
  };


  const quickCheckout = async (e) => {
    e.preventDefault();
    try {
      addQuickCheckoutProduct({
        ...product,
        selectSize,
        selectColor,
        selectOther,
        salePrice: Number(selectedPrice),
      })
      navigate("/quick-checkout")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Helmet>
        <title>{product?.metaTitle}</title>
        <meta name="description" content={product?.metaDescription} />
      </Helmet>
      <div className='lg:mx-14 flex flex-wrap justify-between items-center h-full mb-10'>
        <div className="text-sm ml-4 lg:ml-10 breadcrumbs py-5 text-gray-600">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">product</Link></li>
            <li className='truncate'>{product?.name.split(' ').join('-')}</li>
          </ul>
        </div>
        <div className='grid grid-flow-row lg:grid-cols-2 h-full w-full'>
          <div className='w-full md:block lg:pb-9 pl-10 hidden'>
            <div className='w-full flex justify-center'>
              <img className='md:h-[500px] lg:h-[600px] w-full' src={defaultImage} alt={product?.name} />
            </div>
            <div className='md:flex mt-5 justify-center'>
              {Object.values(product?.images).map((image, idx) => (
                image ? <img key={idx} onClick={() => handleImage(image)} className={`h-24 w-auto ml-3 ${defaultImage === image ? 'border-2 border-black' : ''}`} src={image} alt={product.name} loading='lazy' /> : null
              ))}
            </div>
          </div>

          {/* <div className="md:hidden carousel carousel-center max-w-fit p-2 gap-2 bg-white rounded-box">
            {Object.values(product?.images).map((image, idx) => (
              image ? <div key={idx} className="carousel-item"><img src={image} className="h-[420px] sm:h-[550px] rounded-box" alt={product?.name} /></div> : null
            ))}
          </div> */}

          {/* Image scroller for mobile */}

          <ProductImageScroller product={product} />

          {/* Mobile image scroller end */}

          <div className='py-2 px-4 md:px-4 md:py-4 lg:pr-10'>
            <h2 className='text-xl font-semibold tracking-tighter'>{product?.name}</h2>
            <h4 className='font-semibold text-gray-600 mt-1'>{product?.category?.name}</h4>
            <div className="rating w-20">
              {[...Array(5)].map((_, i) => (
                <input key={i} type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
              ))}
            </div>
            <p>{product?.shortDescription}</p>
            <h2 className='mt-4 text-2xl font-bold'>&#8377;{selectedPrice}&nbsp;
              <span className='text-base line-through font-thin tracking-wider'>&#8377;{selectedOriginalPrice}</span></h2>

            <div className="mt-10">
              <div>
                {typeSize ?
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm lg:text-lg font-medium text-gray-900">Size</h3>
                      <button
                        type='button'
                        onClick={openModal}
                        className="text-sm lg:text-lg font-bold hover:opacity-90"
                        style={{ color: color1 }}
                      >
                        Size guide
                      </button>
                    </div>

                    <div className='flex gap-2'>
                      {product?.variants.filter(variant => variant.type === "size").map((variant, index) => {
                        return (
                          <>
                            {variant?.status === true ?
                              <div
                                key={index}
                                className={`border px-5 py-1 ${selectSize === variant.name ? 'bg-black text-white' : 'border-gray-400'}`}
                                onClick={() => {
                                  setSelectSize(variant.name)
                                  setSelectColor("")
                                  setSelectOther("")
                                }}
                              >
                                {variant.name}
                              </div> : null
                            }
                          </>
                        )
                      })}
                    </div>
                  </>
                  :
                  <></>
                }
              </div>
              <div className='mt-3'>
                {typeColor ?
                  <>
                    <h3 className="text-base lg:text-lg font-medium text-gray-900">Color</h3>

                    <div className='flex gap-2'>
                      {product?.variants.filter(variant => variant.type === "color").map((variant, index) => {
                        return (
                          <>
                            {variant?.status === true ?
                              <div
                                key={index}
                                className={`h-10 w-10 rounded-full cursor-pointer ${selectColor === variant.name ? 'border-2 border-yellow-600' : ''}`}
                                style={{ backgroundColor: variant.color }}
                                onClick={() => {
                                  setSelectColor(variant.name)
                                  setSelectSize("")
                                  setSelectOther("")
                                }}
                              ></div>
                              : null
                            }
                          </>
                        )
                      })}
                    </div>
                  </>
                  :
                  <></>
                }
              </div>

              <div className='mt-3'>
                {typeOther ?
                  <>
                    <h3 className="text-sm lg:text-lg font-medium text-gray-900">Other</h3>

                    <div className='flex gap-2'>
                      {product?.variants.filter(variant => variant.type === "other").map((variant, index) => {
                        return (
                          <>
                            {variant?.status === true ? <div
                              key={index}
                              className={`border px-5 py-1 ${selectOther === variant.name ? 'bg-black text-white' : 'border-gray-400'}`}
                              onClick={() => {
                                setSelectOther(variant.name)
                                setSelectColor("")
                                setSelectSize("")
                              }}
                            >
                              {variant.name} </div>
                              : null
                            }
                          </>
                        )
                      })}
                    </div>
                  </>
                  :
                  <></>
                }
              </div>

              {product?.affiliateProduct ?
                <Link to={product?.affiliateLink}>
                  <button
                    type="button"
                    className="flex items-center w-full lg:w-auto justify-center rounded-md px-5 py-3 text-center text-sm font-medium hover:opacity-75 focus:outline-none"
                    style={{
                      color: color2,
                      backgroundColor: color1,
                    }}
                  >
                    <span className='font-bold'>Buy from {product?.affiliatePlatformName}</span>
                  </button>
                </Link>
                :
                <div>
                  {/* <button
                    type="submit"
                    className="mt-4 lg:flex w-full items-center justify-center shadow-sm rounded-md px-8 py-3 text-xl font-medium text-white"
                    style={{ color: color2, backgroundColor: color1 }}
                    onClick={quickCheckout}
                  >
                    Order Now - Cash on Delivery
                  </button> */}
                  <button
                    type="submit"
                    className="mt-5 lg:flex w-full items-center justify-center shadow-sm rounded-md px-8 py-3 text-xl font-medium text-white"
                    style={{ backgroundColor: color1, color: color2 }}
                    onClick={() => handleAddToCart()}
                  >
                    Add to bag
                  </button>
                </div>
              }
            </div>

            <div className="hidden lg:collapse collapse-plus bg-white mt-8">
              <input type="radio" name="my-accordion-3" defaultChecked />
              <div className="collapse-title uppercase tracking-tight text-lg font-bold">
                PRODUCT DESCRIPTION
              </div>
              <div className="collapse-content">
                <p dangerouslySetInnerHTML={{ __html: product?.description }} />
              </div>
            </div>
            <div className="hidden lg:collapse collapse-plus bg-white">
              <input type="radio" name="my-accordion-3" defaultChecked />
              <div className="collapse-title uppercase tracking-tight text-lg font-bold">
                DELIVERY
              </div>
              <div className="collapse-content">
                <p className='text-justify'>{product?.deliveryDetails}</p>
              </div>
            </div>
            <div className="hidden lg:collapse collapse-plus bg-white">
              <input type="radio" name="my-accordion-3" defaultChecked />
              <div className="collapse-title uppercase tracking-tight text-lg font-bold">
                RETURNS
              </div>
              <div className="collapse-content">
                <p className='text-justify'>{product?.returnDetails}</p>
              </div>
            </div>

            <div className="lg:hidden mt-8">
              <div tabIndex={0} className="collapse collapse-plus border-b border-gray-200">
                <div className="collapse-title text-lg font-bold text-black">Product description</div>
                <div className="collapse-content">
                  <p dangerouslySetInnerHTML={{ __html: product?.description }} />
                </div>
              </div>
              <div tabIndex={1} className="collapse collapse-plus border-b border-gray-200">
                <div className="collapse-title text-lg font-bold text-black">Delivery</div>
                <div className="collapse-content">
                  <p className='text-justify'>{product?.deliveryDetails}</p>
                </div>
              </div>
              <div tabIndex={2} className="collapse collapse-plus border-b border-gray-200">
                <div className="collapse-title text-lg font-bold text-black">Returns</div>
                <div className="collapse-content">
                  <p className='text-justify'>{product?.returnDetails}</p>
                </div>
              </div>
            </div>

          </div>
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white px-3 py-6 text-left align-middle shadow-xl transition-all">
                    <div className='flex justify-between px-3 py-3'>
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-medium leading-6 text-gray-900"
                      >
                        Size Chart
                      </Dialog.Title>
                      <div>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium hover:opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                          onClick={closeModal}
                          style={{ color: color1, backgroundColor: color2 }}
                        >
                          X
                        </button>
                      </div>
                    </div>
                    <div className="pb-3">
                      {/* <table className='w-full'>
                        <thead className='bg-gray-200'>
                          <tr>
                            <th className='py-4 px-3'>Size</th>
                            <th className='py-4 px-3'>Length(in)</th>
                            <th className='py-4 px-3'>Chest(in)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className='px-4 py-3 text-lg font-semibold'>S</td>
                            <td className='px-4 py-3 text-lg font-semibold'>28</td>
                            <td className='px-4 py-3 text-lg font-semibold'>41</td>
                          </tr>
                          <tr>
                            <td className='px-4 py-3 text-lg font-semibold'>M</td>
                            <td className='px-4 py-3 text-lg font-semibold'>29</td>
                            <td className='px-4 py-3 text-lg font-semibold'>43</td>
                          </tr>
                          <tr>
                            <td className='px-4 py-3 text-lg font-semibold'>L</td>
                            <td className='px-4 py-3 text-lg font-semibold'>30</td>
                            <td className='px-4 py-3 text-lg font-semibold'>45</td>
                          </tr>
                          <tr>
                            <td className='px-4 py-3 text-lg font-semibold'>XL</td>
                            <td className='px-4 py-3 text-lg font-semibold'>31</td>
                            <td className='px-4 py-3 text-lg font-semibold'>47</td>
                          </tr>
                          <tr>
                            <td className='px-4 py-3 text-lg font-semibold'>2XL</td>
                            <td className='px-4 py-3 text-lg font-semibold'>32</td>
                            <td className='px-4 py-3 text-lg font-semibold'>48</td>
                          </tr>
                        </tbody>
                      </table> */}
                      <img className='h-full w-full' src={sizeChartImage} alt="Size Chart" />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
}

export default Product;

