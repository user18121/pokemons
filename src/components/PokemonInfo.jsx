import { useState, useEffect } from "react";
import axios from "axios";

function PokemonSearch() {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");

  // Function to fetch a random Pokémon
  const fetchRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * 898) + 1; // Pokémon IDs range from 1 to 898
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${randomId}`
      );
      setPokemon((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error fetching random Pokémon:", error);
    }
  };

  // Load 5 random Pokémon when the site loads
  useEffect(() => {
    setPokemon([]); // Clear previous list
    for (let i = 0; i < 20; i++) {
      fetchRandomPokemon();
    }
  }, []);

  // Function to search for Pokémon
  const fetchPokemon = async () => {
    if (!query) return;
    setError("");
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
      );
      setPokemon((prev) => [...prev, response.data]);
    } catch (error) {
      setError("No Pokémon found with this name or ID.");
    }
    setQuery("");
  };

  // Function to add to favorites
  const addToFavorites = (poke) => {
    if (!favorites.some((fav) => fav.id === poke.id)) {
      setFavorites([...favorites, poke]);
    }
  };

  // Function to remove Pokémon from the list
  const removePokemon = (id) => {
    setPokemon(pokemon.filter((poke) => poke.id !== id));
  };

  return (
    <div className="app-container">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchPokemon()}
          placeholder="Search Pokémon by name or ID"
        />
        <button onClick={fetchPokemon}>Search</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="pokemon-container">
        {pokemon.map((poke) => (
          <div key={poke.id} className="pokemon-card">
            <img src={poke.sprites.front_default} alt={poke.name} />
            <h3>{poke.name.toUpperCase()}</h3>
            <p>Type: {poke.types[0].type.name}</p>
            <div className="card-buttons">
              <button className="star-btn" onClick={() => addToFavorites(poke)}>
                ⭐
              </button>
              <button
                className="remove-btn"
                onClick={() => removePokemon(poke.id)}
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2>Favorites</h2>
      <div className="favorites-container">
        {favorites.map((poke) => (
          <div key={poke.id} className="pokemon-card">
            <img src={poke.sprites.front_default} alt={poke.name} />
            <h3>{poke.name.toUpperCase()}</h3>
            <p>Type: {poke.types[0].type.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PokemonSearch;
