// src/Service/MovieService.ts
import axios from "axios";
import type { Movie } from "../types/movie";

export interface MovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export const MovieService = async (
  query: string,
  page = 1
): Promise<MovieResponse> => {
  const url = `${BASE_URL}/search/movie`;

  const response = await axios.get<MovieResponse>(url, {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page,
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data;
};
