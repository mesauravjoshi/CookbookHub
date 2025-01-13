import React, { createContext, useContext, useState, useEffect } from 'react';
import { url } from './ApiUrl/Url';
import axios from 'axios';

const FetchContext = createContext();

export const useFetchData = () => {
    return useContext(FetchContext);
};

export const FetchDataProvider = ({ children }) => {
    const [totalUsers, setTotalUsers] = useState([]);
    const [totalRecipe, setTotalRecipe] = useState([]);
    const [totalRBookmarkRecipe, setTotalRBookmarkRecipe] = useState([]);
    const [recipeAddedToday, setRecipeAddedToday] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('admin token');

        // const fetchUserData = async () => {
        //     try {
        //         const userResponse = await fetch(`${url}/admin/users`, {
        //             method: 'GET',
        //             headers: {
        //                 'Authorization': `Bearer ${token}`,
        //                 'Content-Type': 'application/json',
        //             },
        //         });
        //         if (userResponse.status === 401) {
        //             return;
        //         }
        //         if (!userResponse.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         const usersData = await userResponse.json();
        //         setTotalUsers(usersData.users)
        //     } catch (error) {
        //         console.error('Error fetching data:', error);
        //     }
        // };

        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`${url}/admin/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (userResponse.status === 401) {
                    return;
                }

                setTotalUsers(userResponse.data.users);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // const fetchRecipeData = async () => {
        //     try {
        //         const recipesResponse = await fetch(`${url}/admin/recipes`, {
        //             method: 'GET',
        //             headers: {
        //                 'Authorization': `Bearer ${token}`,
        //                 'Content-Type': 'application/json',
        //             },
        //         });
        //         if (recipesResponse.status === 401) {
        //             return;
        //         }
        //         if (!recipesResponse.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         const recipesData = await recipesResponse.json();
        //         setTotalRecipe(recipesData.recipes)
        //     } catch (error) {
        //         console.error('Error fetching data:', error);
        //     }
        // };

        const fetchRecipeData = async () => {
            try {
                const recipesResponse = await axios.get(`${url}/admin/recipes`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const recipesData = recipesResponse.data;
                // console.log(recipesData.recipes);
                setTotalRecipe(recipesData.recipes)
            } catch (error) {
                // Handle errors from axios, including 401 or other non-2xx status codes
                if (error.response && error.response.status === 401) {
                    return;
                }
                console.error('Error fetching data:', error);
            }
        };

        const fetchBookmarkData = async () => {
            try {
                const recipesResponse = await axios.get(`${url}/admin_bookmark/bookmarks`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const recipesData = recipesResponse.data;
                // console.log(recipesData);
                setTotalRBookmarkRecipe(recipesData.recipes)
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    return;
                }
                console.error('Error fetching data:', error);
            }
        };

        const fetchRecipeAddedToday = async () => {
            try {
                const recipesResponse = await axios.get(`${url}/admin/recipeAddedToday`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const recipesData = await recipesResponse.data;
                setRecipeAddedToday(recipesData.recipes)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
        fetchRecipeData();
        fetchBookmarkData();
        fetchRecipeAddedToday();
    }, [])

    return (
        <FetchContext.Provider value={{ totalUsers, setTotalUsers, totalRecipe, totalRBookmarkRecipe, recipeAddedToday }}>
            {children}
        </FetchContext.Provider>
    );
};
