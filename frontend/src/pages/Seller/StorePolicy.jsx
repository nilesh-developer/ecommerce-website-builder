import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../store/auth';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';

function StorePolicy() {
  // State management for the store and editor content
  const [storeId, setStoreId] = useState("");
  const [loading, setLoading] = useState(true);
  const [shippingPolicy, setShippingPolicy] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");
  const { token } = useAuth();

  const getStoreData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/current-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const responseData = await response.json();
      const storeData = responseData.data.store;
      setStoreId(storeData._id);
      setShippingPolicy(storeData.shippingPolicy);
      setReturnPolicy(storeData.returnPolicy);
    } catch (error) {
      console.error("Failed to fetch store data:", error);
      toast.error("Failed to fetch store data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getStoreData();
  }, [token]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/update/policy/${storeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ returnPolicy, shippingPolicy }),
      });

      if (response.ok) {
        toast.success("Store updated successfully");
      } else {
        const errorResponse = await response.json();
        toast.error(errorResponse.message || "Failed to update store");
      }
    } catch (error) {
      toast.error("Something went wrong while updating the store");
      console.error(error);
    }
  }

  // Render a loading spinner while data is being fetched
  if (loading) {
    return (
      <div className='flex h-[calc(100vh-100px)] lg:h-screen w-full justify-center items-center'>
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className='flex-grow h-screen'>
      <div className='lg:my-7 lg:mx-10 my-3 mx-3'>
        <h2 className='text-2xl lg:text-3xl text-zinc-900 font-bold tracking-tighter'>Store Policies</h2>
        <div className='mt-8 pb-20'>
          <form className='grid grid-flow-row' onSubmit={handleSubmit}>
            <div>
              <h2 className='mb-3 text-lg font-semibold lg:text-xl'>Shipping Policy</h2>
              <div className="form-group mb-32 lg:mb-20">
                <ReactQuill
                  value={shippingPolicy}
                  onChange={setShippingPolicy}
                  style={{height: "300px"}}
                  modules={{
                    toolbar: [
                      [{ header: '1' }, { header: '2' }, { font: [] }],
                      [{ size: [] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link', 'image'],
                      ['clean'],
                    ],
                  }}
                  formats={[
                    'header',
                    'font',
                    'size',
                    'bold',
                    'italic',
                    'underline',
                    'strike',
                    'blockquote',
                    'list',
                    'bullet',
                    'link',
                    'image',
                  ]}
                />
              </div>

              <h2 className='mt-7 mb-3 text-lg font-semibold lg:text-xl'>Return & Replacement Policy</h2>
              <div className="form-group h-[300px] mb-32 lg:mb-20">
                  <ReactQuill
                    value={returnPolicy}
                    onChange={setReturnPolicy}
                    style={{height: "300px"}}
                    modules={{
                      toolbar: [
                        [{ header: '1' }, { header: '2' }, { font: [] }],
                        [{ size: [] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image'],
                        ['clean'],
                      ],
                    }}
                    formats={[
                      'header',
                      'font',
                      'size',
                      'bold',
                      'italic',
                      'underline',
                      'strike',
                      'blockquote',
                      'list',
                      'bullet',
                      'link',
                      'image',
                    ]}
                  />
                </div>

              <button type="submit" className='bg-orange-600 hover:bg-orange-700 text-lg font-semibold w-full lg:w-40 text-white px-5 py-2 rounded-lg' style={{ marginTop: '20px' }}>Save</button>

              {/* Content preview */}
              {/* <div>
                <h3>Content Preview:</h3>
                <p><strong>Shipping Policy:</strong></p>
                <div dangerouslySetInnerHTML={{ __html: shippingPolicy }} />
                <p><strong>Return & Replacement Policy:</strong></p>
                <div dangerouslySetInnerHTML={{ __html: returnPolicy }} />
              </div> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StorePolicy;
