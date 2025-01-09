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

// Map type names to corresponding icons or emoji
const typeIcons: Record<string, string> = {
  Fire: '🔥',
  Water: '💧',
  Grass: '🌿',
  Electric: '⚡',
  Poison: '☠️',
  Flying: '🕊️',
  Psychic: '🔮',
  Ice: '❄️',
  Dragon: '🐉',
  Dark: '🌑',
  Fairy: '✨',
  Normal: '⭐',
  Fighting: '🥊',
  Rock: '🪨',
  Ground: '🌍',
  Bug: '🐛',
  Ghost: '👻',
  Steel: '⚙️',
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
        setPokemons((prev) => [...prev, ...data]);
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
  }, [offset]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 500 && !loading) {
        setOffset((prev) => prev + limit);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

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
    <div className="p-6">
      <h1 className="text-center text-4xl font-bold mb-6 text-gray-800 dark:text-gray-200">Pokedex</h1>
      <div className="flex justify-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Rechercher par nom"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-64 dark:bg-gray-800 dark:text-gray-200"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="">Tous les types</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPokemons.map((pokemon, index) => (
          <div
            key={`${pokemon.pokedexId}-${pokemon.id}-${index}`}
            onClick={() => router.push(`/pokedex/${pokemon.id}`)}
            className="border border-gray-300 rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700 p-4 cursor-pointer hover:scale-105 hover:shadow-lg transition-transform"
          >
            <h3 className="text-xl font-semibold capitalize text-center mb-3">{pokemon.name}</h3>
            <img src={pokemon.image} alt={pokemon.name} className="w-32 h-32 mx-auto mb-3 rounded-lg" />
            <p className="text-center text-gray-600 dark:text-gray-400">ID: #{pokemon.pokedexId}</p>
            <div className="text-center mt-2 text-gray-600 dark:text-gray-400 flex gap-2 justify-center">
              {pokemon.types
                ? pokemon.types.map((typeObj) => (
                  <span key={typeObj.id} className="flex items-center gap-2">
                    <img
                      src={typeObj.image || ''}
                      alt={typeObj.name}
                      className="w-5 h-5 inline-block"
                    />
                    {typeIcons[typeObj.name] || typeObj.name}
                  </span>
                ))
                : 'Inconnu'}
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="text-center text-lg font-semibold mt-6">Chargement...</p>}
    </div>
  );
};

export default PokemonListPage;
