import CompanyList from "./components/CompanyList";
import Filters from "./components/Filters";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Hero />
        <SearchBar />
        <div className="mt-8 flex gap-8">
          <Filters />
          <CompanyList />
        </div>
      </div>
    </main>
  )
}

