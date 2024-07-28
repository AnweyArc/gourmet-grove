import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const RecipeDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [recipe, setRecipe] = useState(null);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            if (id) {
                const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
                try {
                    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`);
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

    const commonNutrients = [
        'Calories', 
        'Total Fat', 
        'Saturated Fat', 
        'Trans Fat', 
        'Cholesterol', 
        'Sodium', 
        'Total Carbohydrates', 
        'Dietary Fiber', 
        'Total Sugars', 
        'Added Sugars', 
        'Protein', 
        'Vitamin D', 
        'Calcium', 
        'Iron', 
        'Potassium'
    ];

    const filteredNutrients = recipe.nutrition.nutrients.filter(nutrient => commonNutrients.includes(nutrient.name));
    const additionalNutrients = recipe.nutrition.nutrients.filter(nutrient => !commonNutrients.includes(nutrient.name));

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
                <h3 className="text-lg font-semibold mb-2">Ready in: <span className="text-gray-700">{recipe.readyInMinutes} minutes</span></h3>
                <h3 className="text-lg font-semibold mb-2">Dish Type: <span className="text-gray-700">{recipe.dishTypes.join(', ')}</span></h3>
                <h3 className="text-lg font-semibold mb-2">Cuisine: <span className="text-gray-700">{recipe.cuisines.join(', ') || 'Not specified'}</span></h3>
                <h3 className="text-lg font-semibold mb-2">Servings: <span className="text-gray-700">{recipe.servings}</span></h3>
                <h2 className="text-2xl font-semibold mb-4">Nutritional Facts</h2>
                {recipe.nutrition && recipe.nutrition.nutrients && (
                    <div className="border border-gray-400 p-4 rounded-md bg-white">
                        <h3 className="text-2xl font-bold mb-4">Nutrition Facts</h3>
                        <table className="w-full text-left border-t border-b border-gray-400">
                            <tbody>
                                <tr className="border-b border-gray-400">
                                    <td className="py-2 font-bold text-xl">Amount per Serving</td>
                                    <td className="py-2 font-bold text-xl">{recipe.servings}</td>
                                </tr>
                                {filteredNutrients.map((nutrient, index) => (
                                    <tr key={index} className="border-b border-gray-300">
                                        <td className="py-1 font-medium">{nutrient.name}</td>
                                        <td className="py-1 text-right">{nutrient.amount}{nutrient.unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {showMore && (
                            <table className="w-full text-left border-t border-b border-gray-400 mt-4">
                                <tbody>
                                    {additionalNutrients.map((nutrient, index) => (
                                        <tr key={index} className="border-b border-gray-300">
                                            <td className="py-1 font-medium">{nutrient.name}</td>
                                            <td className="py-1 text-right">{nutrient.amount}{nutrient.unit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <button 
                            onClick={() => setShowMore(!showMore)} 
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                        >
                            {showMore ? 'Show Less Nutritional Facts' : 'Show More Nutritional Facts'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeDetails;
