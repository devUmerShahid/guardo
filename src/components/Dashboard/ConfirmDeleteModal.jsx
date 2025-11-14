const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, resourceName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Confirm Delete
        </h2>
        <p className="mb-4">
          Are you sure you want to delete <strong>{resourceName}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
