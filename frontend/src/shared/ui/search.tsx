import "../styles/search.css"

interface SearchProps {
    value: string;
    onChange: (query: string) => void;
}

export const Search = ({ value, onChange }:SearchProps) => {
    return (
        <div className="item-search">
            <input
                type="text"
                placeholder="Поиск"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="search-input"
            />
        </div>
    );
};