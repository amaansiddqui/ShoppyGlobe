import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";

export function NotFound({ errorDetails }) {
  const location = useLocation();

  const currentPath = location?.pathname || "unknown route";

  const defaultDetails = {
    code: "404 - Page Not Found",
    message: "The page or resource you are looking for does not exist or has been moved.",
    path: currentPath,
    timestamp: new Date().toISOString(),
    suggestion: "Please check the web address for typos, or return to the home page to continue shopping.",
    ...errorDetails,
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 max-w-2xl w-full text-center shadow-lg">
        {/* Error Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-100 text-rose-600 rounded-full mb-6 font-extrabold text-2xl">
          404
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Page Not Found
        </h1>

        <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-md mx-auto">
          We couldn't find the page you were looking for.
        </p>

        {/* Detailed Error Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8 text-left text-sm space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <span className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Error Status</span>
            <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-xs">
              {defaultDetails.code}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1">
            <span className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Requested Path</span>
            <span className="text-purple-600 font-semibold truncate max-w-xs" title={defaultDetails.path}>
              {defaultDetails.path}
            </span>
          </div>

          <div className="pt-2 border-t border-gray-200 font-sans text-xs text-gray-600">
            <span className="font-semibold text-gray-700 block mb-1">Details:</span>
            <p className="leading-relaxed mb-2">{defaultDetails.message}</p>
            <p className="text-gray-500 italic">{defaultDetails.suggestion}</p>
          </div>

          <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-400">
            <span>System: ShoppyGlobe Router</span>
            <span>Time: {new Date(defaultDetails.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-center decoration-none"
          >
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors text-center cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}

NotFound.propTypes = {
  errorDetails: PropTypes.shape({
    code: PropTypes.string,
    message: PropTypes.string,
    path: PropTypes.string,
    timestamp: PropTypes.string,
    suggestion: PropTypes.string,
  }),
};

export default NotFound;
