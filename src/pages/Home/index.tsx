import { FC, useEffect, useState } from "react";

import { Layout } from "../../components/layout";

export const Home: FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-fade-in">
              Welcome to the Nafes Organization
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Empowering innovation and collaboration for a better tomorrow
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
