import { useCallback, useEffect, useState } from "react";
import { getReports } from "../api/reports";

const initialFilters = {
  search: "",
  category: "",
  priority: "",
  status: "",
  sortBy: "createdAt",
  order: "desc"
};

const categories = [
  "Furniture",
  "Electrical",
  "Plumbing",
  "Building/Facilities",
  "IT/Network",
  "Roads/Grounds"
];

const priorities = ["Low", "Medium", "High", "Critical"];
const statuses = ["Pending", "In Progress", "Resolved"];

const formatDate = (value) => {
  if (!value) return "Unknown date";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
};

function ReportList({ refreshKey = 0 }) {
  const [filters, setFilters] = useState(initialFilters);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [resultCount, setResultCount] = useState(0);

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await getReports(filters);

      setReports(result.data || []);
      setResultCount(result.count || 0);
    } catch (error) {
      setReports([]);
      setResultCount(0);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadReports();
  }, [loadReports, refreshKey]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <section className="reports-section" id="reports">
      <div className="section-heading section-heading--row">
        <div>
          <p className="eyebrow">Reports</p>
          <h2>Campus infrastructure reports</h2>
          <p>Reports are loaded from MongoDB through the backend API.</p>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={loadReports}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="report-filters">
        <div className="filter-field filter-field--search">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            name="search"
            type="search"
            placeholder="Search title, building, or location"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
          >
            <option value="">All priorities</option>
            {priorities.map((priority) => (
              <option value={priority} key={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option value={status} key={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="sortBy">Sort by</label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            <option value="createdAt">Created date</option>
            <option value="updatedAt">Updated date</option>
            <option value="title">Title</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="order">Order</label>
          <select
            id="order"
            name="order"
            value={filters.order}
            onChange={handleFilterChange}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={clearFilters}
        >
          Clear filters
        </button>
      </div>

      <p className="results-heading">
        <strong>{resultCount}</strong>{" "}
        {resultCount === 1 ? "report" : "reports"} found
      </p>

      {isLoading && (
        <div className="feedback" role="status">
          Loading reports...
        </div>
      )}

      {errorMessage && (
        <div className="feedback feedback--error" role="alert">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && reports.length === 0 && (
        <div className="empty-state">
          <h3>No reports found</h3>
          <p>Create a report or change the search filters.</p>
        </div>
      )}

      {!isLoading && !errorMessage && reports.length > 0 && (
        <div className="reports-list">
          {reports.map((report) => (
            <article className="report-card" key={report._id}>
              <div className="report-card__topline">
                <span className="status-badge">
                  {report.status}
                </span>

                <span className="priority-label">
                  {report.priority} priority
                </span>
              </div>

              <h3>{report.title}</h3>

              <p className="report-description">
                {report.description}
              </p>

              <dl className="report-meta">
                <div>
                  <dt>Category</dt>
                  <dd>{report.category}</dd>
                </div>

                <div>
                  <dt>Location</dt>
                  <dd>
                    {report.building}, {report.location}
                  </dd>
                </div>

                <div>
                  <dt>Reported</dt>
                  <dd>{formatDate(report.createdAt)}</dd>
                </div>

                <div>
                  <dt>Reporter</dt>
                  <dd>{report.reporter?.name || "Unknown"}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ReportList;
