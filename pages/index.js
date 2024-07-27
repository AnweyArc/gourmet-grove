import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Home = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const searchRecipes = async () => {
        const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
        setLoading(true);
        setSearched(false);
        try {
            const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${apiKey}`);
            const recipes = await Promise.all(
                response.data.results.map(async (recipe) => {
                    const details = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`);
                    return details.data;
                })
            );
            setResults(recipes);
        } catch (error) {
            console.error('Error fetching data:', error);
            setResults([]);
        } finally {
            setLoading(false);
            setSearched(true);
        }
    };

    return (
        <div className="min-h-screen bg-F5EFE6 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-1A4D2E mb-8">Gourmet Grove</h1>
                <div className="flex justify-center mb-8">
                    <input 
                        type="text" 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        placeholder="Search for food..." 
                        className="px-4 py-2 border border-4F6F52 rounded-l-md focus:outline-none focus:ring-2 focus:ring-1A4D2E"
                    />
                    <button 
                        onClick={searchRecipes} 
                        className="px-4 py-2 bg-1A4D2E text-E8DFCA rounded-r-md hover:bg-4F6F52 focus:outline-none focus:ring-2 focus:ring-1A4D2E"
                    >
                        Search
                    </button>
                </div>
                {loading && (
                    <div className="text-center mb-8">
                        <div className="loader"></div>
                        <p className="text-xl text-1A4D2E">Searching...</p>
                    </div>
                )}
                {searched && results.length === 0 && !loading && (
                    <div className="text-center text-red-600 text-xl">
                        Food is not in the Database
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {results.map((recipe) => (
                        <div 
                            key={recipe.id} 
                            className="bg-white p-4 rounded-lg shadow-md cursor-pointer transform transition duration-300 hover:scale-105"
                            onClick={() => router.push(`/recipe/${recipe.id}`)}
                        >
                            <h2 className="text-2xl font-semibold mb-2 text-1A4D2E">{recipe.title}</h2>
                            <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover rounded-md mb-4" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
