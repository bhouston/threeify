import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import examplesJson  from  './examples.json';
interface Example {
  name: string;
  slug: string;
  theme: 'dark' | 'light';
  description: string;
  keywords: string[];
}

const ExampleList: React.FC = () => {
  const [examples, setExamples] = useState<Example[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = examplesJson as Example[];
      setExamples(data);
    };
    fetchData();
  }, []);

  return (
    <div className="ExampleList">
      <h1>Examples</h1>
      <ul>
        {examples.map((example) => (
          <li key={example.name}>
            <Link to={`/examples/${example.slug}`}>{example.name}</Link>
          </li>
        ))}
      </ul>
      <Routes>
        <Route path="/examples/:path" element={<Example />} />
      </Routes>
    </div>
  );
};

const Example: React.FC = () => {
  const path = useLocation();
  // Add code to display the example based on the relative path
  return <div>Displaying example at path: {path.pathname}</div>;
};

export default ExampleList;
