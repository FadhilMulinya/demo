"use client";
import { useAddTodo, useReadTodo, useMarkTodo } from "../contract/todo";
import { useState } from "react";

export default function TodoComponent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedId, setSelectedId] = useState(0);
  const [txHash, setTxHash] = useState("");
  const [markTxHash, setMarkTxHash] = useState("");
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [isMarkLoading, setIsMarkLoading] = useState(false);

  const { addTodo } = useAddTodo();
  const { markTodo } = useMarkTodo();
  const { data: todo, isLoading: todoLoading } = useReadTodo(selectedId);

  const handleAdd = async () => {
    if (!title || !description) return;
    
    try {
      setIsAddLoading(true);
      setTxHash("");
      // Call addTodo function from your hook
      const result = await addTodo(title, description);
      
      // Get transaction hash - adjust according to what your hook returns
      const hash = result?.hash || (typeof result === 'string' ? result : '');
      setTxHash(hash);
      
      // Clear inputs after successful submission
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error adding todo:", err);
    } finally {
      setIsAddLoading(false);
    }
  };

  const handleMark = async () => {
    if (selectedId < 0) return;
    
    try {
      setIsMarkLoading(true);
      setMarkTxHash("");
      // Call markTodo function from your hook
      const result = await markTodo(selectedId);
      
      // Get transaction hash - adjust according to what your hook returns
      const hash = result?.hash || (typeof result === 'string' ? result : '');
      setMarkTxHash(hash);
    } catch (err) {
      console.error("Error marking todo:", err);
    } finally {
      setIsMarkLoading(false);
    }
  };

  const truncateHash = (hash) => {
    if (!hash) return "";
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Blockchain Todo App</h1>
      
      {/* Add Todo Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Create New Todo</h2>
        <div className="space-y-4">
          <div>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Title" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isAddLoading}
            />
          </div>
          
          <div>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Description" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              disabled={isAddLoading}
            />
          </div>
          
          <button 
            onClick={handleAdd}
            className={`w-full text-white py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              isAddLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isAddLoading || !title || !description}
          >
            {isAddLoading ? 'Creating...' : 'Add Todo'}
          </button>
          
          {/* Transaction Hash Display */}
          {txHash && (
            <div className="mt-2 text-sm">
              <p className="font-medium text-gray-700">Transaction Hash:</p>
              <div className="flex items-center mt-1">
                <a 
                  href={`https://eth-sepolia.blockscout.com/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 truncate"
                >
                  {truncateHash(txHash)}
                </a>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(txHash);
                    alert("Transaction hash copied to clipboard!");
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700 p-1"
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
              <p className="text-green-600 text-xs mt-1">Todo created successfully!</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Manage Todo Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Manage Todo</h2>
        <div className="flex space-x-2 mb-4">
          <input 
            type="number" 
            value={selectedId} 
            onChange={(e) => setSelectedId(Number(e.target.value))} 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            placeholder="Todo ID"
            disabled={isMarkLoading}
          />
          <button 
            onClick={handleMark}
            className={`text-white py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
              isMarkLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
            disabled={isMarkLoading || selectedId < 0}
          >
            {isMarkLoading ? 'Marking...' : 'Mark Done'}
          </button>
        </div>
        
        {/* Mark Transaction Hash Display */}
        {markTxHash && (
          <div className="text-sm">
            <p className="font-medium text-gray-700">Transaction Hash:</p>
            <div className="flex items-center mt-1">
              <a 
                href={`https://eth-sepolia.blockscout.com/tx/${markTxHash}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 truncate"
              >
                {truncateHash(markTxHash)}
              </a>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(markTxHash);
                  alert("Transaction hash copied to clipboard!");
                }}
                className="ml-2 text-gray-500 hover:text-gray-700 p-1"
                title="Copy to clipboard"
              >
                📋
              </button>
            </div>
            <p className="text-green-600 text-xs mt-1">Todo marked as completed!</p>
          </div>
        )}
      </div>
      
      {/* Todo Details Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Todo Details</h2>
        
        {todoLoading ? (
          <div className="flex justify-center py-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-md">
              Loading...
            </div>
          </div>
        ) : todo ? (
          <div className="bg-white p-4 rounded-md border border-gray-200">
            <div className="mb-2 pb-2 border-b border-gray-100">
              <span className="font-semibold text-gray-600">Title:</span>
              <p className="mt-1 text-gray-800">{todo[0]}</p>
            </div>
            <div className="mb-2 pb-2 border-b border-gray-100">
              <span className="font-semibold text-gray-600">Description:</span>
              <p className="mt-1 text-gray-800">{todo[1]}</p>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-600 mr-2">Status:</span>
              <span className={`px-2 py-1 rounded-full text-sm ${todo[2] ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {todo[2] ? "Completed ✅" : "Pending ❌"}
              </span>
            </div>
          </div>
        ) : selectedId >= 0 ? (
          <p className="text-center text-gray-500 py-4">
            No todo found with ID {selectedId}
          </p>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Select a todo ID to view details
          </p>
        )}
      </div>
      
      {/* Loading indicators - add these for debugging */}
      <div className="mt-4 text-xs text-gray-500">
        <p>Add loading: {isAddLoading ? "True" : "False"}</p>
        <p>Mark loading: {isMarkLoading ? "True" : "False"}</p>
        <p>Todo loading: {todoLoading ? "True" : "False"}</p>
      </div>
    </div>
  );
}