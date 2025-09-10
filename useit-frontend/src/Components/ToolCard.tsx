import type { Tool } from "../Types/Tool";

export default function ToolCard(tool : Tool) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{tool.name}</div>
        <p className="text-gray-700 text-base">
          {tool.description}
        </p>
        <p className="text-gray-600 text-sm mt-2">Owner ID: {tool.ownerId}</p>
        <p className={`text-sm mt-2 ${tool.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
          {tool.isAvailable ? 'Available' : 'Not Available'}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
          {tool.isAvailable ? 'Borrow' : 'Request'}
        </button>
      </div>
    </div>
  )
}
