import { Columns3Cog, FileStack, FileText, Grid2X2, Info, Paintbrush, Settings } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

function Store() {
  return (

    <section className='bg-white flex-grow h-full min-h-dvh lg:h-dvh lg:pb-8 pb-20'>
      <div className='lg:my-10 my-5 mx-3 lg:mx-5'>
        <h2 className='text-3xl text-zinc-900 font-extrabold tracking-tightr'>Store Settings</h2>
        <div className='w-full grid grid-flow-row-dense lg:grid-cols-2 gap-4 mt-7'>
          <Link to="/seller/customize-store">
            <div className='bg-gray-50 p-5'>
              <div className='flex'>
                 <Paintbrush className='text-black h-8 w-8 mt-3'/>
                <div className='ml-4'>
                  <h3 className='font-bold text-gray-800 text-xl'>Customize Title</h3>
                  <p className='text-sm text-gray-500'>Personlise store title and color</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/seller/customize-banner">
            <div className='bg-gray-50 p-5'>
              <div className='flex'>
                 <Columns3Cog className='text-black h-8 w-8 mt-3'/><div className='ml-4'>
                  <h3 className='font-bold text-gray-800 text-xl'>Customize Store</h3>
                  <p className='text-sm text-gray-500'>Personlise logo, favicon, banner </p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/seller/store-policies">
            <div className='bg-gray-50 p-5'>
              <div className='flex'>
              <FileText className='text-black h-8 w-8 mt-3'/><div className='ml-4'>
                  <h3 className='font-bold text-gray-800 text-xl'>Add Store Policies</h3>
                  <p className='text-sm text-gray-500'>Write about store shipping and return policy</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/seller/about-page">
            <div className='bg-gray-50 p-5'>
              <div className='flex'>
               <FileStack className='text-black h-8 w-8 mt-3'/>
                <div className='ml-4'>
                  <h3 className='font-bold text-gray-800 text-xl'>Add Store About Page</h3>
                  <p className='text-sm text-gray-500'>Write about you and your store</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/seller/customize-footer">
            <div className='bg-gray-50 p-5'>
              <div className='flex'>
                 <Info className='text-black h-8 w-8 mt-3'/>
                <div className='ml-4'>
                  <h3 className='font-bold text-gray-800 text-xl'>About Store & Social Links</h3>
                  <p className='text-sm text-gray-500'>Write about store and social media links</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/seller/domain-settings">
            <div className='bg-gray-50 p-5'>
              <div className='flex'>
                 <Settings className='text-black h-8 w-8 mt-3'/>
                <div className='ml-4'>
                  <h3 className='font-bold text-gray-800 text-xl'>Settings</h3>
                  <p className='text-sm text-gray-500'>Custom domain & Deactivate/Delete Store</p>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  )
}

export default Store