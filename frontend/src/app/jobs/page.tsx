import Filters from "./components/Filters";
import Hero from "./components/Hero";
import JobList from "./components/JobList";
import SearchBar from "./components/SearchBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Hero />
        <SearchBar />
        <div className="py-8 flex gap-8">
          <Filters />
          <JobList />
        </div>
      </div>
    </main>
  );
}
