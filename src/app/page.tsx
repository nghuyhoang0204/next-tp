'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Pokemon {
  id: number;
  pokedexId: number;
  name: string;
  image: string;
  types: string[];
}

const PokemonListPage = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(50); // Par défaut : 50
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const router = useRouter();

  // Récupération des Pokémons
  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://nestjs-pokedex-api.vercel.app/pokemons?offset=${offset}&limit=${limit}`);
      const data = await response.json();
      console.log("Data fetched:", data); // Affiche les données

      // Vérifiez ici que `data` est bien un tableau et ajoutez-le au state
      if (Array.isArray(data)) {
        setPokemons((prev) => [...prev, ...data]); // Ajout des Pokémons au state
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

  // Gestion du scroll infini
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 500 && !loading) {
        setOffset((prev) => prev + limit);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesName = pokemon.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter ? pokemon.types.includes(typeFilter) : true;
    return matchesName && matchesType;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Pokedex</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Rechercher par nom"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px', width: '200px' }}
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: '10px' }}>
          <option value="">Tous les types</option>
          <option value="Fire">Feu</option>
          <option value="Water">Eau</option>
          <option value="Grass">Plante</option>
          <option value="Electric">Électrique</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {filteredPokemons.map((pokemon, index) => (
          <div
            key={`${pokemon.pokedexId}-${pokemon.id}-${index}`} // Ajout de l'index pour garantir l'unicité
            onClick={() => router.push(`/pokedex/${pokemon.id}`)}
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: '#fff',
              maxWidth: '200px',
              textAlign: 'center',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ textTransform: 'capitalize' }}>{pokemon.name}</h3>
            <img src={pokemon.image} alt={pokemon.name} style={{ width: '120px', height: '120px' }} />
            <p>ID: #{pokemon.pokedexId}</p>
            <p>Type(s) : {pokemon.types.join(', ')}</p>
          </div>
        ))}
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Chargement...</p>}
    </div>
  );
};

export default PokemonListPage;