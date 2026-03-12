import "./App.css";
import { Route, Router } from "./components/router-provider";
import { useNavigate } from "./hooks/use-navigate";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={() => navigate("/about")}>Go to About</button>
    </div>
  );
};

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/")}>Go to Home</button>
      <h1>About Page</h1>
      <button onClick={() => navigate(`/about/company`)}>
        Company Details
      </button>
      <button onClick={() => navigate("/about/legal")}>Legal Details</button>

      <Route path="/about/company" exact>
        <CompanyDetails />
      </Route>
      <Route path="/about/legal" exact>
        <LegalDetails />
      </Route>
    </div>
  );
};

const CompanyDetails = () => (
  <div>
    <h2>Company Details</h2>
    <p>Here are the details of the company...</p>
  </div>
);

const LegalDetails = () => (
  <div>
    <h2>Legal Details</h2>
    <p>Here are the legal details...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Route path="/" exact>
        <HomePage />
      </Route>
      <Route path="/about" exact={false}>
        <AboutPage />
      </Route>
    </Router>
  );
}

export default App;
