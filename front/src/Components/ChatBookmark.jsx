// src/Bookmark.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatBookmark = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');

    const fetchBookmarks = async () => {
        const response = await axios.get('http://localhost:5000/bookmarks');
        console.log(response);
        
        setBookmarks(response.data);
    };

    const addBookmark = async (e) => {
        e.preventDefault();
        const newBookmark = { title, url };
        await axios.post('http://localhost:5000/bookmarks', newBookmark);
        setTitle('');
        setUrl('');
        fetchBookmarks();
    };

    const deleteBookmark = async (id) => {
        await axios.delete(`http://localhost:5000/bookmarks/${id}`);
        fetchBookmarks();
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    return (
        <div>
            <h1>Bookmarks</h1>
            <form onSubmit={addBookmark}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="test"
                    placeholder="URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <button type="submit">Add Bookmark</button>
            </form>
            <ul>
                {bookmarks.map((bookmark) => (
                    <li key={bookmark._id}>
                        <a href={bookmark.url} target="_blank" rel="noopener noreferrer">{bookmark.title}</a>
                        <button onClick={() => deleteBookmark(bookmark._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatBookmark;
