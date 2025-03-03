import { useState } from "react";
import axios from "axios";

function PokemonSearch() {
  const [query, setQuery] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPokemon = async () => {
    if (!query) return;
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
      );
      if (!pokemonList.some((p) => p.id === data.id)) {
        setPokemonList((prev) => [...prev, data]);
      }
    } catch {
      setError("No Pokémon like this!");
    }
    setLoading(false);
  };

  const removePokemon = (id) => {
    setPokemonList((prev) => prev.filter((p) => p.id !== id));
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleFavorite = (pokemon) => {
    setFavorites((prev) =>
      prev.some((p) => p.id === pokemon.id)
        ? prev.filter((p) => p.id !== pokemon.id)
        : [...prev, pokemon]
    );
  };

  return (
    <div className="app-container">
      {error && <div className="error-message">{error}</div>}

      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchPokemon()}
          placeholder="Search Pokémon"
        />
        <button onClick={fetchPokemon}>Search</button>
      </div>

      <div className="pokemon-container">
        {loading ? "Loading..." : null}
        {pokemonList.map((poke) => (
          <div key={poke.id} className="pokemon-card">
            <img src={poke.sprites.front_default} alt={poke.name} />
            <h3>{poke.name.toUpperCase()}</h3>
            <p>Type: {poke.types[0].type.name}</p>
            <div className="buttons">
              <button
                className="remove-btn"
                onClick={() => removePokemon(poke.id)}
              >
                -
              </button>
              <button
                className={`star-btn ${
                  favorites.some((p) => p.id === poke.id) ? "favorited" : ""
                }`}
                onClick={() => toggleFavorite(poke)}
              >
                ⭐
              </button>
            </div>
          </div>
        ))}
      </div>

      {favorites.length > 0 && (
        <div className="favorites-container">
          <h2>⭐ Favorites ⭐</h2>
          <div className="pokemon-container">
            {favorites.map((poke) => (
              <div key={poke.id} className="pokemon-card favorite">
                <img src={poke.sprites.front_default} alt={poke.name} />
                <h3>{poke.name.toUpperCase()}</h3>
                <p>Type: {poke.types[0].type.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PokemonSearch;
