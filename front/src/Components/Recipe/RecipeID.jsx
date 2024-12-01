import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../Nav/Nav';
import './RecipeID.css';
import { useUser } from '../UserContext';

function RecipeID() {
    const { _id } = useParams(); // Get recipe id from URL
    const [recipes, setRecipes] = useState([]);
    const { user, setUser } = useUser();
    const [isLoggedIn, setIsLoggedIn] = useState(true); // New state for login status

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userData = JSON.parse(atob(token.split('.')[1]));
            setUser(userData);
        }
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/recipes/recipe/${_id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.status === 401) {
                    // Token is expired or invalid
                    setIsLoggedIn(false);
                    return;
                }
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('fetched post by _id', data);

                setRecipes([data[0]]); // Assuming you get a single recipe object
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoggedIn(false); // Set logged out state on error
            }
        };
        fetchData();
    }, [_id]);

    // Function to split ingredients and instructions by newline (\n)
    const formatText = (text) => {
        return text.replace(/\n/g, '<br/>');
    };

    return (
        <>
            <Nav isLoggedIn={isLoggedIn} user={user} />
            <div>
                <div id="Recipe-container">
                    {recipes.map((recipe, index) => (
                        <div className="Recipe-card" key={index}>
                            <img src={recipe.Image_URL} alt="Recipe" />
                            <div className="Recipe-card__details">
                                <div className='Recipe-psot-line'>
                                    {/* <span className="Recipe-tag">Posted By: {recipe.PostedBy.name}</span>
                                    <span className="Recipe-tag">Username: {recipe.PostedBy.username}</span> */}
                                </div>
                                <span className="tag">Category: {recipe.Category}</span>
                                <span className="tag">Cuisine: {recipe.Cuisine}</span>

                                <div className="Recipe-name">Recipes Name:
                                    <p>{recipe.Recipes}</p>
                                </div>
                                <div className="Recipe-name">Ingredients:
                                    {/* Use the formatText function to split the ingredients */}
                                    <p dangerouslySetInnerHTML={{ __html: formatText(recipe.Ingredients) }} />
                                </div>
                                <div className="Recipe-name">Instructions to make Recipes:
                                    {/* Use the formatText function to split the instructions */}
                                    <p dangerouslySetInnerHTML={{ __html: formatText(recipe.Instructions) }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default RecipeID;
