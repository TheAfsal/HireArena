import { Bell, ChevronDown } from "lucide-react"

function Header() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg"></div>
        <div className="font-medium">Company</div>
        <div className="flex items-center text-gray-500">
          Nomad
          <ChevronDown className="w-4 h-4 ml-1" />
        </div>
      </div>
      <button className="p-2 rounded-lg hover:bg-gray-100">
        <Bell className="w-5 h-5" />
      </button>
    </div>
  )
}

export default Header;
