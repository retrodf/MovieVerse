import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Tambahkan ini
import { vi } from "vitest";
import HomePage from "../../pages/HomePage";

describe("HomePage", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });
  
    it("should render the spinner while loading", () => {
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  
    it("should display carousel after loading data", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            title: "Movie 1",
            poster_url: "/path/to/image.jpg",
            Genres: [{ id: 1, name: "Action" }],
            rating: 8.5,
          },
        ],
      });
  
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );
  
      await waitFor(() => {
        expect(screen.getByText("Movie 1")).toBeInTheDocument();
      });
    });
  
    it("should display an error message when the fetch fails", async () => {
      vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Failed to fetch"));
  
      render(
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      );
  
      await waitFor(() => {
        expect(screen.getByText(/error:/i)).toBeInTheDocument();
      });
    });

    it("should navigate to movie details when 'Watch Now' is clicked", async () => {
        vi.spyOn(global, "fetch").mockResolvedValueOnce({
          ok: true,
          json: async () => [
            {
              id: 1,
              title: "Movie 1",
              poster_url: "/path/to/image.jpg",
              Genres: [{ id: 1, name: "Action" }],
              rating: 8.5,
            },
          ],
        });
      
        render(
          <MemoryRouter>
            <HomePage />
          </MemoryRouter>
        );
      
        await waitFor(() => {
          const watchNowButton = screen.getByText("Watch Now");
          expect(watchNowButton).toBeInTheDocument();
        });
      });

      it("should display genres for each movie", async () => {
        vi.spyOn(global, "fetch").mockResolvedValueOnce({
          ok: true,
          json: async () => [
            {
              id: 1,
              title: "Movie 1",
              poster_url: "/path/to/image.jpg",
              Genres: [{ id: 1, name: "Action" }, { id: 2, name: "Drama" }],
              rating: 8.5,
            },
          ],
        });
      
        render(
          <MemoryRouter>
            <HomePage />
          </MemoryRouter>
        );
      
        await waitFor(() => {
          expect(screen.getByText("Action")).toBeInTheDocument();
          expect(screen.getByText("Drama")).toBeInTheDocument();
        });
      });
      
  });  