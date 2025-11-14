import { useState } from "react";
import EditPasswordModal from "./EditPasswordModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { AiFillEdit, AiFillDelete, AiFillEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";

const PasswordList = ({ passwords, onEdit }) => {
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "passwords", id));
      setDeleteData(null);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case "strong":
        return "bg-emerald-500";
      case "medium":
        return "bg-amber-500";
      case "weak":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case "strong":
        return "Strong";
      case "medium":
        return "Medium";
      case "weak":
        return "Weak";
      default:
        return "Unknown";
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(passwords.length / pageSize);
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentPasswords = passwords.slice(indexOfFirstItem, indexOfLastItem);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Saved Passwords</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {passwords.length} {passwords.length === 1 ? "item" : "items"}
          </span>
          
          {/* Page Size Selector */}
          {passwords.length > 5 && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">Show:</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4">
        {currentPasswords.map((p) => (
          <div key={p.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-800 text-lg">{p.resourceName}</h3>
              <div className="flex items-center gap-1">
                <span className={`w-3 h-3 rounded-full ${getStrengthColor(p.strength)}`}></span>
                <span className="text-xs text-gray-600 capitalize">{p.strength}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div>
                <label className="text-xs text-gray-500">Username</label>
                <p className="font-medium">{viewData?.id === p.id ? p.username : "••••••"}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Password</label>
                <p className="font-mono">{viewData?.id === p.id ? p.password : "••••••••"}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <div className="flex gap-3">
                <button
                  onClick={() => setEditData(p)}
                  className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50"
                  title="Edit"
                >
                  <AiFillEdit size={18} />
                </button>
                <button
                  onClick={() => setDeleteData(p)}
                  className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                  title="Delete"
                >
                  <AiFillDelete size={18} />
                </button>
              </div>
              <button
                onClick={() => setViewData(viewData?.id === p.id ? null : p)}
                className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-100 flex items-center gap-1"
                title={viewData?.id === p.id ? "Hide" : "View"}
              >
                {viewData?.id === p.id ? (
                  <AiOutlineEyeInvisible size={18} />
                ) : (
                  <AiFillEye size={18} />
                )}
                <span className="text-sm">{viewData?.id === p.id ? "Hide" : "View"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-4 px-6 font-semibold text-gray-700">Resource</th>
              <th className="py-4 px-6 font-semibold text-gray-700">Username</th>
              <th className="py-4 px-6 font-semibold text-gray-700">Password</th>
              <th className="py-4 px-6 font-semibold text-gray-700">Strength</th>
              <th className="py-4 px-6 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentPasswords.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 font-medium text-gray-900">{p.resourceName}</td>
                <td className="py-4 px-6 font-mono text-sm">
                  {viewData?.id === p.id ? p.username : "••••••"}
                </td>
                <td className="py-4 px-6 font-mono text-sm">
                  {viewData?.id === p.id ? p.password : "••••••••"}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${getStrengthColor(p.strength)}`}></span>
                    <span className="text-sm text-gray-600 capitalize">{getStrengthText(p.strength)}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditData(p)}
                      className="text-blue-900 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50"
                      title="Edit"
                    >
                      <AiFillEdit size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteData(p)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                      title="Delete"
                    >
                      <AiFillDelete size={18} />
                    </button>
                    <button
                      onClick={() => setViewData(viewData?.id === p.id ? null : p)}
                      className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-100"
                      title={viewData?.id === p.id ? "Hide" : "View"}
                    >
                      {viewData?.id === p.id ? (
                        <AiOutlineEyeInvisible size={18} />
                      ) : (
                        <AiFillEye size={18} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {passwords.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No passwords found</p>
          <p className="text-gray-400 text-sm mt-1">Add your first password to get started</p>
        </div>
      )}

      {/* Enhanced Pagination */}
      {passwords.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
          {/* Items info */}
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(indexOfLastItem, passwords.length)}
            </span>{" "}
            of <span className="font-semibold">{passwords.length}</span> results
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((pageNum, index) => (
                pageNum === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="hidden sm:inline">Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editData && (
        <EditPasswordModal
          isOpen={!!editData}
          existingData={editData}
          onClose={() => setEditData(null)}
          onUpdate={(id, updatedData) => {
            onEdit(id, updatedData);
            setEditData(null);
          }}
        />
      )}

      {/* Delete Modal */}
      {deleteData && (
        <ConfirmDeleteModal
          isOpen={!!deleteData}
          resourceName={deleteData.resourceName}
          onClose={() => setDeleteData(null)}
          onConfirm={() => handleDelete(deleteData.id)}
        />
      )}
    </div>
  );
};

export default PasswordList;