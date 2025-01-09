'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PokemonType {
  id: number;
  name: string;
  image: string; // URL to the image icon
}

interface Pokemon {
  id: number;
  pokedexId: number;
  name: string;
  image: string;
  types: PokemonType[] | undefined;
}

// Map type names to corresponding colors
const typeColors: Record<string, string> = {
  Feu: 'bg-red-600',
  Eau: 'bg-blue-500',
  Plante: 'bg-green-500',
  Électrik: 'bg-yellow-500',
  Poison: 'bg-purple-500',
  Vol: 'bg-indigo-400',
  Psychic: 'bg-pink-500',
  Ice: 'bg-cyan-400',
  Dragon: 'bg-orange-600',
  Dark: 'bg-gray-800',
  Fée: 'bg-pink-300',
  Normal: 'bg-gray-200',
  Sol: 'bg-yellow-600',
  Insecte: 'bg-green-400',
};

const PokemonListPage = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const router = useRouter();

  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://nestjs-pokedex-api.vercel.app/pokemons?offset=${offset}&limit=${limit}`);
      const data = await response.json();
      console.log('Data fetched:', data);

      if (Array.isArray(data)) {
        setPokemons(data);
      } else {
        console.error('Data format is incorrect:', data);
      }
    } catch (error) {
      console.error('Failed to fetch pokemons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, [offset, limit, search, typeFilter]);

  const handleNextPage = () => setOffset((prev) => prev + limit);
  const handlePrevPage = () => setOffset((prev) => Math.max(prev - limit, 0));

  const uniqueTypes = Array.from(
    new Set(pokemons.flatMap((pokemon) => pokemon.types?.map((typeObj) => typeObj.name) || []))
  );

  const filteredPokemons = pokemons.filter((pokemon) => {
    const pokemonTypes = (pokemon.types || []).map((typeObj) => typeObj.name.toLowerCase());
    const matchesName = pokemon.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter ? pokemonTypes.includes(typeFilter.toLowerCase()) : true;
    return matchesName && matchesType;
  });

  return (
    <div className="p-6 bg-gradient-to-b from-blue-100 via-purple-100 to-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-center text-4xl font-bold mb-6 text-gray-800 dark:text-white">Pokedex</h1>
      <div className="flex justify-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Rechercher par nom"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-64 dark:bg-gray-800 dark:text-white"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white"
        >
          <option value="">Tous les types</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value))}
          className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white"
        >
          <option value="10">10 par page</option>
          <option value="20">20 par page</option>
          <option value="50">50 par page</option>
          <option value="100">100 par page</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPokemons.map((pokemon, index) => {
          const bgColor = pokemon.types ? typeColors[pokemon.types[0].name] || 'bg-gray-200' : 'bg-gray-200';

          return (
            <div
              key={`${pokemon.pokedexId}-${pokemon.id}-${index}`}
              onClick={() => router.push(`/pokedex/${pokemon.id}`)}
              className={`border rounded-lg shadow-md p-4 cursor-pointer hover:scale-105 hover:shadow-lg transition-transform ${bgColor}`}
            >
              <h3 className="text-xl font-semibold capitalize text-center mb-3 text-white">{pokemon.name}</h3>
              <img src={pokemon.image} alt={pokemon.name} className="w-32 h-32 mx-auto mb-3 rounded-lg" />
              <p className="text-center text-white">ID: #{pokemon.pokedexId}</p>
              <div className="text-center mt-2 flex gap-2 justify-center">
                {pokemon.types
                  ? pokemon.types.map((typeObj) => (
                    <span key={typeObj.id} className="flex items-center gap-2 text-white">
                      <img src={typeObj.image || ''} alt={typeObj.name} className="w-5 h-5 inline-block" />
                      {typeObj.name}
                    </span>
                  ))
                  : 'Inconnu'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={handlePrevPage}
          disabled={offset === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Précédent
        </button>
        <span className="font-semibold">Page {Math.ceil(offset / limit) + 1}</span>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Suivant
        </button>
      </div>

      {loading && <p className="text-center text-lg font-semibold mt-6 text-gray-600">Chargement...</p>}
    </div>
  );
};

export default PokemonListPage;