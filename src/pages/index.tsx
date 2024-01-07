import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/firebase';
import CategoryList from '@/components/CategoryList';
import GpxList from '@/components/GpxList';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [gpxFiles, setGpxFiles] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(firestore, 'categories');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesData = categoriesSnapshot.docs.map((doc: any) => (
      {
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
      setSelectedCategory(categoriesData?.[0]?.id ?? null)
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchGpxFiles = async () => {
      if (!categories || !selectedCategory) return;
      const gpxFilesCollection = categories.find((category) => category.id === selectedCategory)?.gpxFiles
      setGpxFiles(gpxFilesCollection);
    };
    fetchGpxFiles();
  }, [categories]);

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
        <div className="max-w-[60rem] mx-auto min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8 dark:bg-gray-800 dark:border-x-gray-700">      
          <h1 className="block text-2xl font-bold text-gray-800 sm:text-3xl dark:text-white">GPX File List</h1>
          <div className="my-8">
            <CategoryList categories={categories} onSelectCategory={(id: string) => setSelectedCategory(id)} />
          </div>
          <div>
            <GpxList gpxFiles={gpxFiles} />
          </div>
        </div>
    </div>
  );
};

export default Home;