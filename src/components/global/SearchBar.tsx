import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input, ListGroup, ListGroupItem } from "reactstrap";

interface SearchResult {
  title: string;
  path: string;
  excerpt: string;
  section: string;
}

// Search index - in a real app, this could be generated at build time
const searchIndex: SearchResult[] = [
  {
    title: "Home",
    path: "/",
    excerpt: "Welcome to weestoater - personal portfolio and blog",
    section: "Navigation",
  },
  {
    title: "About",
    path: "/about",
    excerpt:
      "Learn about me, my background, and the technologies I use including CSS Shapes",
    section: "Navigation",
  },
  {
    title: "Accessibility (A11y)",
    path: "/a11y",
    excerpt:
      "Accessibility best practices, WCAG guidelines, and inclusive design",
    section: "Navigation",
  },
  {
    title: "Agile",
    path: "/agile",
    excerpt: "Agile methodologies, mob programming, and team collaboration",
    section: "Navigation",
  },
  {
    title: "Football",
    path: "/football",
    excerpt: "Motherwell FC statistics, match results, and season analysis",
    section: "Navigation",
  },
  {
    title: "React Articles",
    path: "/react",
    excerpt: "React tutorials, Vite, Next.js, and modern frontend development",
    section: "Navigation",
  },
  {
    title: "Slimming World",
    path: "/sw",
    excerpt: "Weight tracking with interactive charts and data visualization",
    section: "Navigation",
  },
  {
    title: "Landie",
    path: "/landie",
    excerpt:
      "Stories about Buster the dog, Land Rover adventures, and outdoor experiences",
    section: "Navigation",
  },
  {
    title: "CSS Shapes",
    path: "/about#shapes",
    excerpt: "CSS shape-outside and clip-path demonstrations with examples",
    section: "About",
  },
  {
    title: "Buster - Early Days",
    path: "/landie",
    excerpt: "Buster the dog's early adventures and puppy days",
    section: "Landie",
  },
  {
    title: "Buster's Birthday Treat",
    path: "/landie",
    excerpt: "Buster's special birthday celebration and outdoor adventures",
    section: "Landie",
  },
  {
    title: "Mob Programming Rules",
    path: "/agile",
    excerpt: "Rules and best practices for effective mob programming sessions",
    section: "Agile",
  },
  {
    title: "Vite and React",
    path: "/react",
    excerpt:
      "Building modern React applications with Vite for fast development",
    section: "React",
  },
  {
    title: "Next.js",
    path: "/react",
    excerpt: "Next.js framework for React with server-side rendering",
    section: "React",
  },
  {
    title: "Salt Design System",
    path: "/react",
    excerpt: "JPMorgan's Salt design system for React applications",
    section: "React",
  },
  {
    title: "Motherwell FC",
    path: "/football",
    excerpt: "Statistics and analysis for Motherwell Football Club seasons",
    section: "Football",
  },
  {
    title: "WCAG Guidelines",
    path: "/a11y",
    excerpt: "Web Content Accessibility Guidelines and compliance standards",
    section: "Accessibility",
  },
  {
    title: "Screen Readers",
    path: "/a11y",
    excerpt: "Testing and optimizing for screen reader compatibility",
    section: "Accessibility",
  },
];

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);

    if (value.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchLower = value.toLowerCase();
    const filtered = searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.excerpt.toLowerCase().includes(searchLower) ||
        item.section.toLowerCase().includes(searchLower)
    );

    setResults(filtered);
    setIsOpen(filtered.length > 0);
  };

  const handleResultClick = (path: string) => {
    navigate(path);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
      setResults([]);
    }
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <div className="search-input-wrapper">
        <i className="bi bi-search search-icon" aria-hidden="true"></i>
        <Input
          type="search"
          placeholder="Search site..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          aria-label="Search site content"
          className="search-input"
        />
      </div>
      {isOpen && results.length > 0 && (
        <ListGroup className="search-results">
          {results.map((result, index) => (
            <ListGroupItem
              key={index}
              action
              onClick={() => handleResultClick(result.path)}
              className="search-result-item"
            >
              <div className="search-result-title">
                <i className="bi bi-file-text me-2" aria-hidden="true"></i>
                {result.title}
              </div>
              <div className="search-result-section">{result.section}</div>
              <div className="search-result-excerpt">{result.excerpt}</div>
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </div>
  );
};
