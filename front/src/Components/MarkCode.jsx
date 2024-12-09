// BookmarkIcon.jsx
import React, { useState,useEffect } from 'react';
import { url } from './ApiUrl/Url';
import { useUser } from './UserContext';
import toast, { Toaster } from 'react-hot-toast';

function MarkCode({ recipe, bookmarkedItems, setBookmarkedItems }) {
  const { user, } = useUser();
  // console.log(user.id);
  const [toastError, setToastError] = useState(false)

   // Function to show toast error
   const notify = () => {
    toast.error('Please log in to add a bookmark',{
      duration: 1500,
      position: "top-right",
      style: {
        border: '1px solid #713200',
        padding: '10px',
        color: '#713200',
        fontSize: '0.9rem',
      },
    });
  };

  const toggleBookmark = async (item) => {
    const token = localStorage.getItem('token');
    
    if (!user) {
      // User is not logged in, show error message when clicking the bookmark icon
      setToastError(true); // Set the error state to true when the user clicks but isn't logged in
      notify();  // Trigger the error toast
      return;
    }

    if (bookmarkedItems.includes(item._id)) {

      // Remove from bookmarks
      const updatedBookmarkedItems = bookmarkedItems.filter((id) => id !== item._id);
      // console.log('Removing bookmark for:', updatedBookmarkedItems);

      const saving_post = {
        BookmarkBy: {
          username: user.username,
          _id: user.id
        },
        Category: item.Category,
        Cuisine: item.Cuisine,
        Post_id: item._id,
        Image_URL: item.Image_URL,
        Recipes: item.Recipes,
        Ingredients: item.Ingredients,
        Instructions: item.Instructions,
        PostedBy: {
          name: item.PostedBy.name,
          username: item.PostedBy.username,
          _id: item.PostedBy._id
        }
      };

      const response = await fetch(`${url}/bookmark/bookmark_remove`, {
        method: 'POST',
        body: JSON.stringify(saving_post),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // console.log('Removed bookmark:', data);
        setBookmarkedItems(updatedBookmarkedItems);
      } else {
        console.log('Failed to remove bookmark');
      }
    } else {
      try {
        // Add to bookmarks
        const updatedBookmarkedItems = [...bookmarkedItems, item._id];
        setBookmarkedItems(updatedBookmarkedItems);

        const saving_post = {
          BookmarkBy: {
            username: user.username,
            _id: user.id
          },
          Category: item.Category,
          Cuisine: item.Cuisine,
          Post_id: item._id,
          Image_URL: item.Image_URL,
          Recipes: item.Recipes,
          Ingredients: item.Ingredients,
          Instructions: item.Instructions,
          PostedBy: {
            name: item.PostedBy.name,
            username: item.PostedBy.username,
            _id: item.PostedBy._id
          }
        };
        // console.log(saving_post);

        const response = await fetch(`${url}/bookmark/bookmark_add`, {
          method: 'POST',
          body: JSON.stringify(saving_post),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // console.log('Added bookmark:', data);
        } else {
          // console.log('Failed to add bookmark');
          setBookmarkedItems(bookmarkedItems); // Revert state on failure
        }
      } catch (error) {
        console.error('Error while adding:', error);
        console.log('befor toast true');
        setToastError(true)
      }

    }
    // console.log('Current bookmarkedItems: ', bookmarkedItems);
  };

  return (
    <>
      <svg onClick={() => toggleBookmark(recipe)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-bookmark-fill" viewBox="0 0 16 16">
        {bookmarkedItems.includes(recipe._id) ? (
          <>
            {/* <h1>dasdf</h1> */}
            <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
          </>
        ) : (
          <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
        )}
      </svg>
      {/* <Toaster /> */}
    </>

  );
}

export default MarkCode;