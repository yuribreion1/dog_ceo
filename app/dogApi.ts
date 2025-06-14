export interface BreedsResponse {
  message: Record<string, string[]>;
  status: string;
}

export async function fetchBreeds(): Promise<string[]> {
  const res = await fetch("https://dog.ceo/api/breeds/list/all");
  const data: BreedsResponse = await res.json();
  return Object.keys(data.message);
}

export async function fetchBreedImages(breed: string, count: number = 6): Promise<string[]> {
  const res = await fetch(`https://dog.ceo/api/breed/${breed}/images/random/${count}`);
  const data = await res.json();
  return data.message;
}

export async function fetchSubBreeds(breed: string): Promise<string[]> {
  const res = await fetch(`https://dog.ceo/api/breed/${breed}/list`);
  const data = await res.json();
  return data.message;
}
