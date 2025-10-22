import { Search, X } from "lucide-react";
import React, { useState } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import { useDebounce } from "../hooks/useDebounce";
import {
  analyzeSearchPatterns,
  generateSuggestions,
  normalizeSearchInput,
} from "../utils/search";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search transactions...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const suggestionsRef = useClickOutside<HTMLDivElement>(() => {
    setSuggestions([]);
  });
  const historyRef = useClickOutside<HTMLDivElement>(() => {
    setSearchHistory([]);
  });

  const handleSearch = (queryString?: string) => {
    const processedTerm = normalizeSearchInput(searchTerm);
    onSearch(queryString || processedTerm);
    setSearchHistory((prev) => [
      ...new Set([...prev, queryString || searchTerm]),
    ]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedHandleSearch(value);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSuggestions([]);
    onSearch("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
    setSuggestions([]);
    setIsSearching(false);
  };

  const handleTransactionSearch = (searchTerm: string) => {
    if (searchTerm.length > 0) {
      setIsSearching(true);
      const processedTerm = normalizeSearchInput(searchTerm);
      // Generate search analytics for user behavior tracking
      const searchAnalytics = analyzeSearchPatterns(searchTerm);
      console.log("Search analytics:", searchAnalytics);

      onSearch(processedTerm);
      const generatedSuggestions = generateSuggestions(searchTerm);
      setSuggestions(generatedSuggestions);
      setIsSearching(false);
    } else {
      onSearch("");
      setSuggestions([]);
      setIsSearching(false);
    }
  };
  const debouncedHandleSearch = useDebounce(handleTransactionSearch, 300);

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <div className="search-icon">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="search-input"
          onFocus={() => {
            if (searchHistory.length > 0) {
              setSuggestions([]);
            }
          }}
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="clear-button"
            type="button"
            aria-label="clear search"
          >
            <X size={16} />
          </button>
        )}
        {isSearching && (
          <div className="search-loading">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="search-suggestions"
          role="listbox"
          aria-live="polite"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
              role="option"
              aria-selected={false}
              tabIndex={0}
              aria-describedby={`suggestion-${index}-description`}
            >
              <span
                id={`suggestion-${index}-description`}
                dangerouslySetInnerHTML={{
                  __html: suggestion.replace(
                    new RegExp(`(${searchTerm})`, "gi"),
                    "<strong>$1</strong>"
                  ),
                }}
              />
            </div>
          ))}
        </div>
      )}

      {searchHistory.length > 0 && searchTerm.length === 0 && (
        <div ref={historyRef} className="search-history">
          <div className="history-header">Recent searches</div>
          {searchHistory.slice(-10).map((item, index) => (
            <div
              key={index}
              className="history-item"
              onClick={() => handleSuggestionClick(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
