import React, { createContext, useContext, useState, useEffect } from 'react';
import {url} from './ApiUrl/Url';

const FetchContext = createContext();

export const useFetchData = () => {
    return useContext(FetchContext);
};

export const FetchDataProvider = ({ children }) => {
    const [totalUsers, setTotalUsers] = useState([]);
    const [totalRecipe, setTotalRecipe] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await fetch(`${url}/admin/users`, {
                    method: 'GET',
                    headers: {
                        // 'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (userResponse.status === 401) {
                    return;
                }
                if (!userResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const usersData = await userResponse.json();
                setTotalUsers(usersData.users)
                // console.log(usersData.users);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchRecipeData = async () => {
            try {
                const recipesResponse = await fetch(`${url}/admin/recipes`, {
                    method: 'GET',
                    headers: {
                        // 'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (recipesResponse.status === 401) {
                    return;
                }
                if (!recipesResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const recipesData = await recipesResponse.json();
                setTotalRecipe(recipesData.recipes)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
        fetchRecipeData();
    }, [])

    return (
        <FetchContext.Provider value={{ totalUsers ,setTotalUsers, totalRecipe, setTotalRecipe }}>
            {children}
        </FetchContext.Provider>
    );
};
