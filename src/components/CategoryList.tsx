import React from 'react';
import {Tabs, Tab} from "@nextui-org/react";

interface CategoryListProps {
    categories: Array<{id: string; name: string;}>
    onSelectCategory: (id: string) => void;
}

const CategoryList = ({ categories, onSelectCategory }: CategoryListProps) => {
  return (
    <Tabs color={'primary'} radius="full">
        {categories.map((category) => (
            <Tab  key={category.id} title={category.name} onClick={() => onSelectCategory(category.id)}/>
        ))}
    </Tabs>
  );
};

export default CategoryList;