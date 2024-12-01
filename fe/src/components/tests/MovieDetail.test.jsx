import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import MovieDetailPage from "../MovieDetail";
import userEvent from "@testing-library/user-event"; // Menggunakan userEvent untuk interaksi
import axios from "axios";

describe("MovieDetailPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should display movie details after loading", async () => {
    const mockMovieData = {
      movie: {
        id: 1,
        title: "Test Movie",
        poster_url: "/path/to/image.jpg",
        synopsis: "A great movie",
        rating: 8.5,
        release_date: "2023-01-01",
        Director: { name: "Test Director" },
        Genres: [{ id: 1, name: "Action" }],
        Actors: [
          { id: 1, name: "Actor 1", image: "/path/to/actor1.jpg" },
          { id: 2, name: "Actor 2", image: "/path/to/actor2.jpg" },
        ],
        MovieVideos: [{ id: 1, url: "https://www.youtube.com/watch?v=12345" }],
      },
      recommendations: [],
    };
  
    vi.spyOn(global, "fetch").mockImplementation((url) => {
      if (url.includes("/movies/1")) {
        return Promise.resolve({
          ok: true,
          json: async () => mockMovieData,
        });
      }
      if (url.includes("/countries")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ countries: [{ id: 1, name: "USA" }] }),
        });
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });
  
    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
  
    // Menunggu data dimuat dan memastikan informasi film muncul
    await waitFor(() => {
      expect(screen.getByText(/Test Movie/i)).toBeInTheDocument();
    });
  
    expect(screen.getByText("Test Director")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("A great movie")).toBeInTheDocument();
  
    // Check for the full rating using a regex to handle split text
    const rating = screen.getByText(/8\.5.*\/10/i);
    expect(rating).toBeInTheDocument();
  
    expect(screen.getByText("2023-01-01")).toBeInTheDocument();
  });  

  it("should display an error message when the fetch fails", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("Failed to fetch"));

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Memastikan pesan error muncul jika fetch gagal
    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });

  it("should display a poster image", async () => {
    const mockMovieData = {
      movie: {
        id: 1,
        title: "Test Movie",
        poster_url: "/path/to/image.jpg",
        synopsis: "A great movie",
        rating: 8.5,
        release_date: "2023-01-01",
        Director: { name: "Test Director" },
        Genres: [{ id: 1, name: "Action" }],
        Actors: [
          { id: 1, name: "Actor 1", image: "/path/to/actor1.jpg" },
          { id: 2, name: "Actor 2", image: "/path/to/actor2.jpg" },
        ],
        MovieVideos: [{ id: 1, url: "https://www.youtube.com/watch?v=12345" }],
      },
      recommendations: [],
    };

    vi.spyOn(global, "fetch").mockImplementation((url) => {
      if (url.includes("/movies/1")) {
        return Promise.resolve({
          ok: true,
          json: async () => mockMovieData,
        });
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Memastikan gambar poster ada dan memiliki src yang benar
    await waitFor(() => {
      expect(screen.getByAltText("Test Movie")).toHaveAttribute(
        "src",
        "/path/to/image.jpg"
      );
    });
  });

  it("should handle no recommendations gracefully", async () => {
    const mockMovieData = {
      movie: {
        id: 1,
        title: "Test Movie",
        poster_url: "/path/to/image.jpg",
        synopsis: "A great movie",
        rating: 8.5,
        release_date: "2023-01-01",
        Director: { name: "Test Director" },
        Genres: [{ id: 1, name: "Action" }],
        Actors: [
          { id: 1, name: "Actor 1", image: "/path/to/actor1.jpg" },
          { id: 2, name: "Actor 2", image: "/path/to/actor2.jpg" },
        ],
        MovieVideos: [{ id: 1, url: "https://www.youtube.com/watch?v=12345" }],
      },
      recommendations: [],
    };

    vi.spyOn(global, "fetch").mockImplementation((url) => {
      if (url.includes("/movies/1")) {
        return Promise.resolve({
          ok: true,
          json: async () => mockMovieData,
        });
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Memastikan tidak ada rekomendasi yang ditampilkan
    await waitFor(() => {
      expect(screen.queryByText(/Recommendations/i)).not.toBeInTheDocument();
    });
  });

  it("should display trailers correctly", async () => {
    const mockMovieData = {
      movie: {
        id: 1,
        title: "Test Movie",
        poster_url: "/path/to/image.jpg",
        synopsis: "A great movie",
        rating: 8.5,
        release_date: "2023-01-01",
        Director: { name: "Test Director" },
        Genres: [{ id: 1, name: "Action" }],
        Actors: [
          { id: 1, name: "Actor 1", image: "/path/to/actor1.jpg" },
          { id: 2, name: "Actor 2", image: "/path/to/actor2.jpg" },
        ],
        MovieVideos: [{ id: 1, url: "https://www.youtube.com/watch?v=12345" }],
      },
      recommendations: [],
    };

    vi.spyOn(global, "fetch").mockImplementation((url) => {
      if (url.includes("/movies/1")) {
        return Promise.resolve({
          ok: true,
          json: async () => mockMovieData,
        });
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Pastikan trailer ditampilkan dan iframe tersedia
    await waitFor(() => {
      expect(screen.getByTitle("Trailer")).toBeInTheDocument();
      expect(screen.getByTitle("Trailer")).toHaveAttribute("src", "https://www.youtube.com/embed/12345");
    });
  });
});
