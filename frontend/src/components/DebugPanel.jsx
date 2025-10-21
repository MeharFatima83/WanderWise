import React, { useState } from 'react';
import { userAPI } from '../app/api/api';

const DebugPanel = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    setLoading(true);
    setTestResult('Testing backend connection...');
    
    try {
      // Test health endpoint first
      const healthResult = await userAPI.testHealth();
      setTestResult(`✅ Health check passed: ${healthResult.message}`);
      
      // Then test API endpoint
      const apiResult = await userAPI.testConnection();
      setTestResult(prev => prev + `\n✅ API test passed: ${apiResult.message}`);
    } catch (error) {
      setTestResult(`❌ Backend error: ${error.message}\n\nMake sure:\n1. Backend server is running (npm start in backend folder)\n2. MongoDB is running\n3. Server is on port 5000`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-blue-200 rounded-xl shadow-lg p-4 max-w-sm">
      <h3 className="font-bold text-blue-600 mb-2">🔧 Debug Panel</h3>
      <button
        onClick={testBackend}
        disabled={loading}
        className="w-full py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Backend'}
      </button>
      {testResult && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
          {testResult}
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
