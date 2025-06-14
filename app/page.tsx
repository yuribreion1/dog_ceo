'use client'

import { useEffect, useState } from "react";
import { fetchBreeds, fetchBreedImages, fetchSubBreeds } from "./dogApi";

interface SubBreedsMap {
  [breed: string]: string[];
}

export default function Home() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [subBreeds, setSubBreeds] = useState<SubBreedsMap>({});
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [selectedSubBreed, setSelectedSubBreed] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchBreeds().then(async (breedsList) => {
      setBreeds(breedsList);
      const subBreedsMap: SubBreedsMap = {};
      await Promise.all(
        breedsList.map(async (breed) => {
          const subs = await fetchSubBreeds(breed);
          subBreedsMap[breed] = subs;
        })
      );
      setSubBreeds(subBreedsMap);
    });
  }, []);

  const handleBreedClick = async (breed: string) => {
    setSelectedBreed(breed);
    setSelectedSubBreed(null);
    setLoading(true);
    setImages([]);
    const imgs = await fetchBreedImages(breed, 6);
    setImages(imgs);
    setLoading(false);
    setDropdownOpen(false);
  };

  const handleSubBreedClick = async (breed: string, sub: string) => {
    setSelectedBreed(breed);
    setSelectedSubBreed(sub);
    setLoading(true);
    setImages([]);
    const res = await fetch(`https://dog.ceo/api/breed/${breed}/${sub}/images/random/6`);
    const data = await res.json();
    setImages(data.message);
    setLoading(false);
    setDropdownOpen(false);
  };

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const dropdown = document.getElementById('dropdown-menu');
      const button = document.getElementById('dropdown-button');
      if (dropdownOpen && dropdown && button && !dropdown.contains(event.target as Node) && !button.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <html>
      <body>
        <div style={{ maxWidth: 900, margin: '40px auto', padding: 16 }}>
          <h1 style={{ textAlign: 'center', fontSize: 32, marginBottom: 24 }}>Raças de Cachorros</h1>
          <nav style={{ marginBottom: 24 }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                id="dropdown-button"
                style={{ padding: '10px 24px', fontSize: 16, borderRadius: 6, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
                onClick={() => setDropdownOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                Raças &#9662;
              </button>
              {dropdownOpen && (
                <div id="dropdown-menu" style={{ position: 'absolute', left: 0, top: '110%', background: '#fff', border: '1px solid #ccc', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', maxHeight: 320, minWidth: 220, overflowY: 'auto', zIndex: 10 }}>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {breeds.map((breed) => (
                      subBreeds[breed] && subBreeds[breed].length > 0 ? (
                        <li key={breed} style={{ position: 'relative' }}>
                          <button
                            style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: selectedBreed === breed && !selectedSubBreed ? 'bold' : 'normal', textTransform: 'capitalize' }}
                            onClick={() => handleBreedClick(breed)}
                          >
                            {breed}
                          </button>
                          <ul style={{ listStyle: 'none', margin: 0, padding: 0, paddingLeft: 16 }}>
                            {subBreeds[breed].map((sub) => (
                              <li key={sub}>
                                <button
                                  style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: selectedBreed === breed && selectedSubBreed === sub ? 'bold' : 'normal', textTransform: 'capitalize' }}
                                  onClick={() => handleSubBreedClick(breed, sub)}
                                >
                                  {sub}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ) : (
                        <li key={breed}>
                          <button
                            style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: selectedBreed === breed && !selectedSubBreed ? 'bold' : 'normal', textTransform: 'capitalize' }}
                            onClick={() => handleBreedClick(breed)}
                          >
                            {breed}
                          </button>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </nav>
          {selectedBreed && (
            <div>
              <h2 style={{ textAlign: 'center', fontSize: 22, marginBottom: 18 }}>
                Imagens de {selectedSubBreed ? `${selectedSubBreed.charAt(0).toUpperCase() + selectedSubBreed.slice(1)} (${selectedBreed})` : selectedBreed.charAt(0).toUpperCase() + selectedBreed.slice(1)}
              </h2>
              {loading ? (
                <div style={{ textAlign: 'center', margin: 24 }}>
                  <span style={{ fontSize: 18 }}>Carregando imagens...</span>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {images.map((img, idx) => (
                    <div key={idx} style={{ background: '#fafafa', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={img}
                        alt={selectedBreed || ''}
                        style={{ objectFit: 'cover', width: '100%', height: 180, borderRadius: 6 }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
