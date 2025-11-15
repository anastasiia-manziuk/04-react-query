import { useState, useEffect } from "react";
import css from "./App.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import { MovieService } from "../../services/movieService";
import type { MovieResponse } from "../../services/movieService";
import type { Movie } from "../../types/movie";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery<MovieResponse>({
    queryKey: ["movie", searchQuery, page],
    queryFn: () => MovieService(searchQuery, page),
    placeholderData: (prev) => prev,

    enabled: searchQuery !== "",
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
