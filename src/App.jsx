import { useState, useEffect } from "react";

export default function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'driver'
  const [darkMode, setDarkMode] = useState(false);

  // Mock login handler
  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentPage(role === "admin" ? "admin-dashboard" : "driver-interface");
  };

  // Mock bins with simulated sensor data
  const mockBins = [
    { id: 1, location: "Downtown", fillLevel: 85, lastCollected: "2024-03-15", status: "Full" },
    { id: 2, location: "Northside", fillLevel: 60, lastCollected: "2024-03-14", status: "Moderate" },
    { id: 3, location: "East Village", fillLevel: 30, lastCollected: "2024-03-13", status: "Low" },
    { id: 4, location: "West End", fillLevel: 95, lastCollected: "2024-03-12", status: "Full" },
    { id: 5, location: "Uptown", fillLevel: 45, lastCollected: "2024-03-16", status: "Low" },
  ];

  // Simulate live updates
  useEffect(() => {
    if (currentPage === "admin-dashboard") {
      const interval = setInterval(() => {
        mockBins.forEach(bin => {
          bin.fillLevel = Math.min(100, bin.fillLevel + Math.floor(Math.random() * 3));
          bin.status = bin.fillLevel > 90 ? "Full" : bin.fillLevel > 50 ? "Moderate" : "Low";
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentPage]);

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "Full": return "bg-red-500 text-white";
      case "Moderate": return "bg-yellow-500 text-black";
      case "Low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  // Conditional rendering based on current page
  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <LoginPage onLogin={handleLogin} darkMode={darkMode} />;
      case "admin-dashboard":
        return (
          <AdminDashboard
            bins={mockBins}
            getStatusColor={getStatusColor}
            darkMode={darkMode}
            setCurrentPage={setCurrentPage}
          />
        );
      case "driver-interface":
        return <DriverInterface darkMode={darkMode} setCurrentPage={setCurrentPage} />;
      case "reports":
        return <ReportsPage darkMode={darkMode} setCurrentPage={setCurrentPage} />;
      case "settings":
        return <SettingsPage darkMode={darkMode} setCurrentPage={setCurrentPage} />;
      default:
        return <LoginPage onLogin={handleLogin} darkMode={darkMode} />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} transition-colors duration-300`}>
      {isLoggedIn && <NavBar userRole={userRole} setCurrentPage={setCurrentPage} darkMode={darkMode} setDarkMode={setDarkMode} />}
      {renderPage()}
    </div>
  );
}

// Navigation Bar Component
function NavBar({ userRole, setCurrentPage, darkMode, setDarkMode }) {
  return (
    <header className={`px-6 py-4 shadow-md flex justify-between items-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <h1 className="text-xl font-bold">Smart Waste Management</h1>
      <nav className="flex space-x-4">
        {userRole === "admin" && (
          <>
            <button onClick={() => setCurrentPage("admin-dashboard")} className="hover:underline">Dashboard</button>
            <button onClick={() => setCurrentPage("reports")} className="hover:underline">Reports</button>
          </>
        )}
        {userRole === "driver" && (
          <button onClick={() => setCurrentPage("driver-interface")} className="hover:underline">My Route</button>
        )}
        <button onClick={() => setCurrentPage("settings")} className="hover:underline">Settings</button>
        <button onClick={() => setDarkMode(prev => !prev)} className="hover:underline">
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </nav>
    </header>
  );
}

// Login Page
function LoginPage({ onLogin, darkMode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-3xl font-bold mb-6">Login</h2>
      <div className="w-full max-w-sm p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <form className="space-y-4">
          <div>
            <label className="block mb-2">Username</label>
            <input type="text" className="w-full p-2 border rounded" placeholder="Enter username" />
          </div>
          <div>
            <label className="block mb-2">Password</label>
            <input type="password" className="w-full p-2 border rounded" placeholder="Enter password" />
          </div>
          <button type="button" onClick={() => onLogin('admin')} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
            Login as Admin
          </button>
          <button type="button" onClick={() => onLogin('driver')} className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded">
            Login as Driver
          </button>
        </form>
      </div>
    </div>
  );
}

// Admin Dashboard
function AdminDashboard({ bins, getStatusColor, darkMode, setCurrentPage }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bins.map(bin => (
          <div key={bin.id} className={`p-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className="font-semibold">{bin.location}</h3>
            <p>Fill Level: <strong>{bin.fillLevel}%</strong></p>
            <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-blue-500" style={{ width: `${bin.fillLevel}%` }}></div>
            </div>
            <p className="mt-2">
              Status: <span className={`inline-block px-2 py-1 rounded ${getStatusColor(bin.status)}`}>{bin.status}</span>
            </p>
            <p>Last Collected: {bin.lastCollected}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <button onClick={() => setCurrentPage("reports")} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
          View Reports
        </button>
      </div>
    </div>
  );
}

// Driver Interface
function DriverInterface({ darkMode, setCurrentPage }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Collection Route</h2>
      <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <img src="https://placehold.co/800x400?text=Route+Map" alt="Collection Route Map" className="w-full h-auto rounded" />
        <div className="mt-4">
          <h3 className="font-semibold">Today's Schedule:</h3>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Downtown - 9:00 AM</li>
            <li>Northside - 10:30 AM</li>
            <li>East Village - 12:00 PM</li>
            <li>West End - 1:30 PM</li>
            <li>Uptown - 3:00 PM</li>
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <button onClick={() => setCurrentPage("reports")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          View Performance Report
        </button>
      </div>
    </div>
  );
}

// Reports Page
function ReportsPage({ darkMode, setCurrentPage }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Performance Reports</h2>
      <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <img src=" https://placehold.co/800x400?text=Data+Visualization+Chart" alt="Report Chart" className="w-full h-auto rounded" />
        <p className="mt-4">Efficiency improvements: 25% reduction in unnecessary trips since implementation.</p>
        <p>Environmental impact reduced by 18% due to optimized collection routes.</p>
      </div>
      <div className="mt-8">
        <button onClick={() => setCurrentPage("admin-dashboard")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

// Settings Page
function SettingsPage({ darkMode, setCurrentPage }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h3 className="font-semibold mb-4">Sensor Integration</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">MQTT Broker URL</label>
            <input type="text" defaultValue="mqtt://broker.example.com" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block mb-2">API Endpoint</label>
            <input type="text" defaultValue=" https://api.smartwaste.com/data " className="w-full p-2 border rounded" />
          </div>
        </div>
        <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </div>
      <div className="mt-8">
        <button onClick={() => setCurrentPage("admin-dashboard")} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
          Back
        </button>
      </div>
    </div>
  );
}