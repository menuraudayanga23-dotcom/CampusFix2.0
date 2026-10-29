import "./App.css";
import ReportForm from "./components/ReportForm";

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Campus infrastructure management</p>
          <h1>CampusFix2.0</h1>
        </div>

        <nav aria-label="Main navigation">
          <a href="/">Dashboard</a>
          <a href="#create-report">New report</a>
          <a href="#reports">Reports</a>
        </nav>
      </header>

      <main className="app-main">
        <section className="welcome-card">
          <p className="eyebrow">Make the campus safer</p>
          <h2>Report a problem before it becomes a bigger one.</h2>
          <p>
            Submit clear infrastructure reports so the campus team can
            investigate, prioritize, and resolve them.
          </p>
        </section>

        <div id="create-report">
          <ReportForm />
        </div>

        <section id="reports" className="coming-soon-card">
          <p className="eyebrow">Next step</p>
          <h2>Saved reports will appear here.</h2>
          <p>
            The report list and search controls will be connected in the Read
            milestone.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
