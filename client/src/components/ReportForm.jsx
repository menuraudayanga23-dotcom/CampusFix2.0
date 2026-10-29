import { useState } from "react";
import { createReport } from "../api/reports";

const initialForm = {
  title: "",
  description: "",
  category: "",
  building: "",
  location: "",
  priority: "Medium",
  reporter: ""
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

function ReportForm() {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value
    }));

    setSuccessMessage("");
    setErrorMessage("");
    setFieldErrors([]);
  };

  const validateForm = () => {
    const errors = [];

    if (formData.title.trim().length < 5) {
      errors.push({
        field: "title",
        message: "Title must contain at least 5 characters."
      });
    }

    if (formData.description.trim().length < 10) {
      errors.push({
        field: "description",
        message: "Description must contain at least 10 characters."
      });
    }

    if (!formData.category) {
      errors.push({
        field: "category",
        message: "Please select a category."
      });
    }

    if (!formData.building.trim()) {
      errors.push({
        field: "building",
        message: "Building is required."
      });
    }

    if (!formData.location.trim()) {
      errors.push({
        field: "location",
        message: "Exact location is required."
      });
    }

    if (!formData.reporter.trim()) {
      errors.push({
        field: "reporter",
        message: "Reporter ID is required for this milestone."
      });
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const clientErrors = validateForm();

    if (clientErrors.length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createReport({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        building: formData.building.trim(),
        location: formData.location.trim(),
        priority: formData.priority,
        reporter: formData.reporter.trim()
      });

      setSuccessMessage(
        result.message || "Infrastructure report created successfully."
      );
      setFormData(initialForm);
      setFieldErrors([]);
    } catch (error) {
      setErrorMessage(error.message);

      if (error.details?.length > 0) {
        setFieldErrors(error.details);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName) => {
    return fieldErrors.find((error) => error.field === fieldName)?.message;
  };

  return (
    <section className="form-section" aria-labelledby="create-report-heading">
      <div className="section-heading">
        <p className="eyebrow">Create a new report</p>
        <h2 id="create-report-heading">Tell the campus team what needs attention.</h2>
        <p>
          Provide enough detail so the issue can be located and assigned to the
          right maintenance team.
        </p>
      </div>

      {successMessage && (
        <div className="feedback feedback--success" role="status">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="feedback feedback--error" role="alert">
          {errorMessage}
        </div>
      )}

      {fieldErrors.length > 0 && (
        <div className="validation-summary" role="alert">
          <strong>Please correct the following:</strong>
          <ul>
            {fieldErrors.map((error, index) => (
              <li key={`${error.field}-${index}`}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      <form className="report-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field form-field--wide">
          <label htmlFor="title">Report title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Example: Broken classroom chair"
            aria-invalid={Boolean(getFieldError("title"))}
          />
          <span className="field-help">Use a short, clear title.</span>
        </div>

        <div className="form-field form-field--wide">
          <label htmlFor="description">Detailed description</label>
          <textarea
            id="description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            placeholder="Explain what is damaged and why it needs attention."
            aria-invalid={Boolean(getFieldError("description"))}
          />
        </div>

        <div className="form-field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            aria-invalid={Boolean(getFieldError("category"))}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            {priorities.map((priority) => (
              <option value={priority} key={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="building">Building or facility</label>
          <input
            id="building"
            name="building"
            type="text"
            value={formData.building}
            onChange={handleChange}
            placeholder="Example: Engineering Building"
            aria-invalid={Boolean(getFieldError("building"))}
          />
        </div>

        <div className="form-field">
          <label htmlFor="location">Exact location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="Example: Room E204, front window"
            aria-invalid={Boolean(getFieldError("location"))}
          />
        </div>

        <div className="form-field form-field--wide">
          <label htmlFor="reporter">Reporter ID</label>
          <input
            id="reporter"
            name="reporter"
            type="text"
            value={formData.reporter}
            onChange={handleChange}
            placeholder="Paste the MongoDB User _id"
            aria-invalid={Boolean(getFieldError("reporter"))}
          />
          <span className="field-help">
            Temporary field until authentication is implemented.
          </span>
        </div>

        <div className="form-actions form-field--wide">
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting report..." : "Submit report"}
          </button>

          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              setFormData(initialForm);
              setFieldErrors([]);
              setErrorMessage("");
              setSuccessMessage("");
            }}
            disabled={isSubmitting}
          >
            Clear form
          </button>
        </div>
      </form>
    </section>
  );
}

export default ReportForm;
