import type { ReactNode } from "react";
import "./App.css";
import { Route, Router } from "./components/router-provider";
import { useRouter } from "./hooks/use-router";

const HomePage = () => {
  const { navigate } = useRouter();
  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={() => navigate("/about")}>Go to About</button>
    </div>
  );
};

const AboutPage = () => {
  const { navigate } = useRouter();

  return (
    <div>
      <button onClick={() => navigate("/")}>Go to Home</button>
      <h1>About Page</h1>
      <button onClick={() => navigate(`/about/company`)}>
        Company Details
      </button>
      <button onClick={() => navigate("/about/legal")}>Legal Details</button>
    </div>
  );
};

const CompanyDetails = () => (
  <div>
    <h2>Company Details</h2>
    <p>Here are the details of the company...</p>
    <a href={`/about/company/sas`}>sahil company</a>
  </div>
);

const LegalDetails = () => {
  const { params } = useRouter();
  console.log(params);
  return (
    <div>
      <h2>Legal Details</h2>
      <p>Here are the legal details...</p>
    </div>
  );
};

const AboutLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <p>this is layout</p>
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Route path="/" render={<HomePage />} />
      <Route path="/about" render={<AboutPage />} layout={AboutLayout}>
        <Route path="/:company" render={<CompanyDetails />}>
          <Route path="/:name" render={<LegalDetails />} />
        </Route>
      </Route>
    </Router>
  );
}

export default App;
