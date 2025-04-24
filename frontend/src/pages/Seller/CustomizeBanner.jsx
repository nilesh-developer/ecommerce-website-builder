import React, { useEffect, useState } from 'react';
import useStoreData from '../../Hooks/useStoreData';
import axios from 'axios';
import toast from 'react-hot-toast';

function CustomizeBanner() {
  const { user, loading } = useStoreData()
  const [logo, setLogo] = useState("")
  const [favicon, setFavicon] = useState("")
  const [banner, setBanner] = useState("")
  const [mobileBanner, setMobileBanner] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(()=> {
    setLogo(user?.store?.logo)
    setFavicon(user?.store?.favicon)
    setBanner(user?.store?.banner)
    setMobileBanner(user?.store?.mobileBanner)
  }, [loading])

  if (loading) {
    return <div className='flex h-screen w-full justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
  }

  const getImageUrl = (image) => {
    if (!image) {
      return "/image.svg";
    }
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    if (typeof image === 'string') {
      return image;
    }
    return "/image.svg";
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setUploading(true)
    const formdata = new FormData()
    formdata.append('logo', logo)
    formdata.append('favicon', favicon)
    formdata.append('banner', banner)
    formdata.append('mobileBanner', mobileBanner)
    formdata.append('storeId', user.store._id)
    axios.post(`${import.meta.env.VITE_API_URL}/api/store/upload/images`, formdata)
      .then(res => {
        toast.success(res.data.message)
        setUploading(false)
      })
      .catch(err => console.log(err))
  }


  return (
    <div className='flex-grow h-full min-h-dvh mb-20'>
      <div className='lg:my-7 lg:mx-10 my-3 mx-3'>
        <h2 className='text-xl lg:text-3xl text-zinc-900 font-bold tracking-tighter'>Customize Store</h2>
        <div className='mt-8'>
          <form className='grid grid-flow-row'>
            <label className='font-semibold tracking-tight text-zinc-800 text-lg' htmlFor="logo">Logo</label>
            <div className="w-32 cursor-pointer">
              <input onChange={e => setLogo(e.target.files[0])} type="file" id="logo" name="logo" accept="image/*" hidden />
              <label htmlFor="logo">
                <div className="border border-gray-300 rounded flex justify-center items-center mb-2">
                <img src={getImageUrl(logo)} alt="Upload images" className="w-28 p-2" />
                </div>
              </label>
            </div>
            {/* <input
              type="file"
              id='logo'
              name='logo'
              onChange={e => setLogo(e.target.files[0])}
              className="file-input file-input-bordered bg-transparent file-input-primary w-full max-w-xs"
            /> */}

            {/* {user.store.logo ?
              <>
                <h3 className='mt-5 font-semibold'>Current Logo:</h3>
                <img className='h-20 border border-gray-500 rounded-lg p-2' src={user.store.logo} alt="" />
              </>
              : ""} */}
            <label className='font-semibold tracking-tight text-zinc-800 text-lg mt-7' htmlFor="favicon">Favicon</label>
            <div className="w-32 cursor-pointer">
              <input onChange={e => setFavicon(e.target.files[0])} type="file" id="favicon" name="favicon" accept="image/*" hidden />
              <label htmlFor="favicon" className="flex flex-col items-center">
                <div className="border border-gray-300 rounded flex justify-center items-center mb-2">
                <img src={getImageUrl(favicon)} alt="Upload images" className="w-28 p-2" />
                </div>
              </label>
            </div>
            {/* <input
              type="file"
              name='favicon'
              id='favicon'
              onChange={e => setFavicon(e.target.files[0])}
              className="file-input file-input-bordered bg-transparent file-input-accent w-full max-w-xs"
            />
            {user.store.favicon ?
              <>
                <h3 className='mt-5 font-semibold'>Current Favicon:</h3>
                <img className='h-20 border border-gray-500 rounded-lg p-2' src={user.store.favicon} alt="" />
              </>
              : ""} */}
            <label className='font-semibold tracking-tight text-zinc-800 text-lg mt-7' htmlFor="storeTitle">Desktop Banner Image</label>
            <div className="w-32 cursor-pointer">
              <input onChange={e => setBanner(e.target.files[0])} type="file" id="banner" name="banner" accept="image/*" hidden />
              <label htmlFor="banner" className="flex flex-col items-center">
                <div className="border border-gray-300 rounded flex justify-center items-center mb-2">
                <img src={getImageUrl(banner)} alt="Upload images" className="w-28 p-2" />
                </div>
              </label>
            </div>
            {/* <input
              type="file"
              name='banner'
              id='banner'
              onChange={e => setBanner(e.target.files[0])}
              className="file-input file-input-bordered bg-transparent mt-1 file-input-primary w-full max-w-xs"
            />
            <p className='text-sm text-gray-500'>Cover should be atleast 1200 X 400px</p>
            {user.store.banner ?
              <>
                <h3 className='mt-5 font-semibold'>Current Banner:</h3>
                <img className='h-20 border border-gray-500 rounded-lg p-2' src={user.store.banner} alt="" />
              </>
              : ""} */}
            {/* <label className='font-semibold tracking-tight text-zinc-800 text-lg mt-7' htmlFor="storeTitle">Add Banner Text</label>
            <input type="text" name='storeTitle' id="storeTitle" placeholder="Banner Text" className="input input-primary text-black bg-transparent w-full max-w-xs" />
            <div className="form-control mt-7 w-44">
              <label className="label cursor-pointer">
                <span className="label-text text-lg tracking-tight text-black font-semibold">Hide Banner Text</span>
                <input type="checkbox" defaultChecked className="checkbox checkbox-primary border border-gray-700" />
              </label>
            </div> */}

            <label className='font-semibold tracking-tight text-zinc-800 text-lg mt-6' htmlFor="mobileBanner">Mobile Banner</label>
            <div className="w-32 cursor-pointer">
              <input onChange={e => setMobileBanner(e.target.files[0])} type="file" id="mobileBanner" name="mobileBanner" accept="image/*" hidden />
              <label htmlFor="mobileBanner" className="flex flex-col items-center">
                <div className="border border-gray-300 rounded flex justify-center items-center mb-2">
                  <img src={getImageUrl(mobileBanner)} alt="Upload images" className="w-28 p-2" />
                </div>
              </label>
            </div>
            {/* <input
              type="file"
              id='mobileBanner'
              name='mobileBanner'
              onChange={e => setMobileBanner(e.target.files[0])}
              className="file-input file-input-bordered bg-transparent file-input-primary w-full max-w-xs"
            />

            {user.store.mobileBanner ?
              <>
                <h3 className='mt-5 font-semibold'>Current Mobile Banner:</h3>
                <img className='h-20 border border-gray-500 rounded-lg p-2' src={user.store.mobileBanner} alt="" />
              </>
              : ""} */}

            <button onClick={handleSubmit} className="bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 text-lg mt-6 w-28">{uploading ? <span className="loading loading-spinner loading-sm"></span> : "Save"}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CustomizeBanner