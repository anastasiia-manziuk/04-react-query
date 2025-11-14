// src/Service/MovieService.ts
import axios from "axios";
import type { MovieResponse } from "../types/movie";

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
