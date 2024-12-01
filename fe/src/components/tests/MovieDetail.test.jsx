import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import MovieDetailPage from "../MovieDetail";
import userEvent from "@testing-library/user-event"; // Menggunakan userEvent untuk interaksi

describe("MovieDetailPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the spinner while loading", async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Memastikan spinner loading ada saat pengambilan data
    await waitFor(() => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
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
        MovieVideos: [
          { id: 1, url: "https://www.youtube.com/watch?v=12345" },
        ],
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
      expect(screen.getByText(/Failed to load movie details/i)).toBeInTheDocument();
    });
  });

  it("should load more reviews when 'Load More' is clicked", async () => {
    const mockReviews = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      content: `Review ${i + 1}`,
      rating: 8,
      User: { username: `User ${i + 1}` },
      createdAt: "2023-01-01",
    }));

    vi.spyOn(global, "fetch").mockImplementation((url) => {
      if (url.includes("/reviews/")) {
        return Promise.resolve({
          ok: true,
          json: async () => mockReviews,
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

    // Memastikan review pertama muncul
    await waitFor(() => {
      expect(screen.getByText("Review 1")).toBeInTheDocument();
      expect(screen.getByText("Review 2")).toBeInTheDocument();
    });

    // Memastikan review tambahan muncul saat "Load More" diklik
    userEvent.click(screen.getByText(/Load More/i));

    await waitFor(() => {
      expect(screen.getByText("Review 3")).toBeInTheDocument();
    });
  });

  it("should allow logged-in users to add a review", async () => {
    // Menyimpan informasi pengguna yang sudah login di localStorage
    localStorage.setItem("token", "mock-token");
    localStorage.setItem("username", "testuser");
    localStorage.setItem("userId", "1");

    vi.spyOn(global, "fetch").mockImplementation((url) => {
      if (url.includes("/movies/")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ movie: { id: 1, title: "Test Movie" } }),
        });
      }
      if (url.includes("/reviews/add")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
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

    // Memastikan form untuk menambahkan review muncul
    await waitFor(() => {
      expect(screen.getByText("ADD YOUR REVIEW")).toBeInTheDocument();
    });

    // Mengisi form review dan mengirimkan
    userEvent.type(screen.getByPlaceholderText(/Enter your rating/i), "8");
    userEvent.type(screen.getByPlaceholderText(/Write your review here/i), "Great movie!");
    userEvent.click(screen.getByText(/Submit Review/i));

    // Memastikan review berhasil ditambahkan
    await waitFor(() => {
      expect(screen.getByText(/Review added:/i)).toBeInTheDocument();
    });
  });
});
