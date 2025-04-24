import React, { useEffect, useState } from 'react';
import { useAuth } from '../../store/auth';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';

function StoreAboutPage() {
    // State management for the store and editor content
  const [storeId, setStoreId] = useState("");
  const [loading, setLoading] = useState(true);
  const [aboutContent, setAboutContent] = useState("");
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
      setAboutContent(storeData.aboutContent);
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store/update/aboutpage/${storeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ aboutContent }),
      });

      if (response.ok) {
        toast.success("Store about page updated");
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
        <section className='bg-white flex-grow h-full min-h-dvh lg:h-dvh lg:pb-8 pb-20 px-3 lg:px-5'>
            <h2 className='mt-7 mb-3 text-lg font-semibold lg:text-xl'>About Us Page</h2>
            <form onSubmit={handleSubmit}>
            <div className="form-group h-[300px] mb-36 lg:mb-24">
                <ReactQuill
                    value={aboutContent}
                    onChange={setAboutContent}
                    style={{ height: "300px" }}
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

            <button type="submit" className='bg-orange-600 hover:bg-orange-700 text-lg font-semibold w-full lg:w-40 text-white px-5 py-2 rounded-lg'>Save</button>
            </form>
        </section>
    )
}

export default StoreAboutPage