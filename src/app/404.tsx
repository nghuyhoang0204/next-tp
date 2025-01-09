'use client';

import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
            <h1 className="text-5xl font-bold mb-6">404 - Pokémon introuvable</h1>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-400">
                Le Pokémon que vous cherchez n'existe pas ou a disparu !
            </p>
            <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition"
            >
                Retour à la liste des Pokémons
            </button>
        </div>
    );
};

export default NotFoundPage;
