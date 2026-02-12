import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { bugAPI } from "../api/bugAPI";
import BugCard from "../components/BugCard";
import LoadingSpinner, { ErrorAlert } from "../components/Alerts";
import "../styles/BugList.css";

const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination State
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = Number(searchParams.get("page")) || 1;

  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "all",
    sort: searchParams.get("sort") || "newest",
    search: searchParams.get("search") || "",
  });

  useEffect(() => {
    fetchBugs();
  }, [filters, currentPage]); // Re-fetch when filters or page changes

  const fetchBugs = async () => {
    setLoading(true);
    try {
      const query = {
        page: currentPage,
        limit: 10, // Match backend default or customize
        status: filters.status !== "all" ? filters.status : undefined,
        search: filters.search || undefined,
      };

      const response = await bugAPI.getAllBugs(query);

      // Update state with paginated data from backend
      setBugs(response.data.data.bugs || []);
      setTotalPages(response.data.data.pages || 1);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bugs");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    params.set("page", 1); // Reset to page 1 on filter change
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== "all") params.set(k, v);
    });
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange("search", e.target.search.value);
  };

  if (loading && bugs.length === 0) return <LoadingSpinner />;

  return (
    <div className="bug-list-container">
      <div className="bug-list-header">
        <h1>Browse Bugs</h1>
        <p>Find bugs and earn rewards by submitting solutions</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError("")} />}

      <div className="bug-list-content">
        <aside className="bug-filters">
          <h3>Filters</h3>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              name="search"
              placeholder="Search bugs..."
              defaultValue={filters.search}
              className="search-input"
            />
            <button type="submit" className="btn btn-small">
              Search
            </button>
          </form>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </aside>

        <main className="bug-list-main">
          <div className="bugs-count">
            Found {bugs.length} bug{bugs.length !== 1 ? "s" : ""} on this page
          </div>

          {bugs.length > 0 ? (
            <>
              <div className="bugs-grid">
                {bugs.map((bug) => (
                  <BugCard key={bug._id} bug={bug} />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="pagination-container">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="pagination-btn"
                >
                  Previous
                </button>

                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>No bugs found. Try adjusting your filters.</p>
              <Link to="/create-bug" className="btn btn-primary">
                Post a Bug
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BugList;
