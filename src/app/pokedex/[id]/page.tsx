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
    stats: { [key: string]: number };
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
        return <p className="text-center text-lg font-semibold">Chargement...</p>;
    }

    return (
        <div className="p-8">
            <button
                onClick={() => router.push('/')}
                className="mb-8 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition"
            >
                Retour
            </button>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column: Image and name */}
                <div className="flex-1 text-center">
                    <h1 className="capitalize text-3xl font-bold mb-6">{pokemon.name}</h1>
                    <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        className="w-64 h-64 mx-auto rounded-lg border border-gray-300"
                    />
                </div>

                {/* Right Column: Statistics */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-6">Statistiques</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {pokemon.stats ? (
                            Object.entries(pokemon.stats).map(([statName, statValue]) => (
                                <React.Fragment key={statName}>
                                    <p className="capitalize font-semibold text-gray-600">{statName}</p>
                                    <p className="font-medium">{statValue}</p>
                                </React.Fragment>
                            ))
                        ) : (
                            <p className="col-span-2 text-center">Aucune statistique disponible</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PokemonDetailsPage;
