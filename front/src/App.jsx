import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import MyRecipes from './Components/Profile/MyRecipes/MyRecipes';
import EditProfile from './Components/Profile/EditProfile/EditProfile';
import EditRecipe from './Components/Profile/EditRecipe/EditRecipe';
import ChangePassword from './Components/Profile/ChangePassword/ChangePassword';
import Upload from './Components/Upload/Upload';
import Home from './Components/Home/Home';
import Bookmark from './Components/Bookmark';
import RecipeID from './Components/Recipe/RecipeID';
import Recipe from './Components/Recipe/Recipe';
import RecipeNewest from './Components/Recipe/RecipeNewest';
import RecipeCat from './Components/Recipe/RecipeCat';
import RecipeCuisine from './Components/Recipe/RecipeCuisine';
import Search from './Components/Search';
import SearchBox from './Components/Nav/SearchBox';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
// import ImageUploader from './Components/ImageUploader';

function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/bookmark" element={<Bookmark />} />
                  <Route path="/recipe" element={<Recipe />} />
                  <Route path="/recipe/:_id" element={<RecipeID />} />
                  <Route path="/RecipeNewest" element={<RecipeNewest />} />
                  <Route path="/RecipeCat" element={<RecipeCat />} />
                  <Route path="/RecipeCuisine" element={<RecipeCuisine />} />
                  <Route path="/Search/:searchRecipe" element={<Search />} />
                  <Route path="/SearchBox" element={<SearchBox />} />
                  {/* <Route path="/ImageUploader" element={<ImageUploader />} /> */}
                  
                  {/* Profile Route with Nested MyRecipes */}
                  <Route path="/profile" >
                      <Route path="MyRecipes" element={<MyRecipes />} />
                      <Route path="EditProfile" element={<EditProfile />} />
                      <Route path="EditRecipe/:_id" element={<EditRecipe />} />
                      <Route path="ChangePassword" element={<ChangePassword />} />
                  </Route>
              </Routes>
          </div>
      </Router>
  );
}

export default App;
