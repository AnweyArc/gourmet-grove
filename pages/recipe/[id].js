import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const RecipeDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            if (id) {
                const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
                try {
                    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
                    setRecipe(response.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchRecipeDetails();
    }, [id]);

    if (!recipe) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <button 
                    onClick={() => router.back()} 
                    className="mb-8 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                    Back to Search
                </button>
                <h1 className="text-4xl font-bold text-center text-green-600 mb-8">{recipe.title}</h1>
                <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-md mb-8" />
                <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: recipe.summary }}></p>
                <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
                <ul className="list-disc list-inside mb-8">
                    {recipe.extendedIngredients.map((ingredient) => (
                        <li key={ingredient.id} className="text-gray-700">{ingredient.original}</li>
                    ))}
                </ul>
                <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
                <p className="text-gray-700 mb-8" dangerouslySetInnerHTML={{ __html: recipe.instructions }}></p>
                <h3 className="text-lg font-semibold mb-2">Origin: <span className="text-gray-700">{recipe.cuisines.join(', ')}</span></h3>
                <h3 className="text-lg font-semibold mb-2">Ready in: <span className="text-gray-700">{recipe.readyInMinutes} minutes</span></h3>
                <h3 className="text-lg font-semibold mb-2">Difficulty: <span className="text-gray-700">{recipe.dishTypes.join(', ')}</span></h3>
            </div>
        </div>
    );
};

export default RecipeDetails;
