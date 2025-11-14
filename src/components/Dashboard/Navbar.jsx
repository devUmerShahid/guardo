const Navbar = ({ onLogout, onAddClick }) => {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 py-4 px-4 sm:px-6 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/GUARDO.png"
          alt="Guardo Logo"
          className="w-36 h-10 sm:w-50 sm:h-15 object-contain transition-transform hover:scale-105"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Add Password Button */}
        <button
          onClick={onAddClick}
          className="bg-blue-900 text-white px-3 sm:px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 min-w-[50px] sm:min-w-[140px] justify-center transform hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Password</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-3 sm:px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 min-w-[50px] sm:min-w-[100px] justify-center transform hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
