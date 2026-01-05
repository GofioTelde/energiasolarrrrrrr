export default function LocationInput() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-gray-900/30">
      <input
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="Ingresa ubicación"
      />
    </div>
  );
}
