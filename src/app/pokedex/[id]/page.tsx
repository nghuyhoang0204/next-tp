'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Stat {
    base_stat: number;
    stat: {
        name: string;
    };
}

interface Evolution {
    name: string;
    image: string;
}

interface PokemonDetails {
    _id: string;
    name: string;
    image: string;
    stats: { [key: string]: number }; // Stats as an object with key-value pairs
    types: { name: string; image: string }[];
    evolutions: Evolution[];
}

const PokemonDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                const response = await fetch(`https://nestjs-pokedex-api.vercel.app/pokemons/${params.id}`);
                if (!response.ok) {
                    throw new Error('Pokemon non trouvé');
                }
                const data = await response.json();
                setPokemon(data);
            } catch (error) {
                console.error(error);
                router.push('/404');
            }
        };
        fetchPokemonDetails();
    }, [params.id, router]);

    if (!pokemon) {
        return <p style={{ textAlign: 'center' }}>Chargement...</p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <button onClick={() => router.push('/')} style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer' }}>
                Retour
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px' }}>
                {/* Left Column: Image and name */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <h1 style={{ textTransform: 'capitalize', marginBottom: '20px' }}>{pokemon.name}</h1>
                    <img src={pokemon.image} alt={pokemon.name} style={{ width: '250px', height: '250px', borderRadius: '12px' }} />
                </div>

                {/* Right Column: Statistics */}
                <div style={{ flex: 1 }}>
                    <h2 style={{ marginBottom: '20px' }}>Statistiques</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {pokemon.stats ? (
                            Object.entries(pokemon.stats).map(([statName, statValue]) => (
                                <React.Fragment key={statName}>
                                    <p style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{statName}</p>
                                    <p>{statValue}</p>
                                </React.Fragment>
                            ))
                        ) : (
                            <p>Aucune statistique disponible</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PokemonDetailsPage;