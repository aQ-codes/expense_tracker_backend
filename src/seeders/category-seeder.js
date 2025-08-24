import Category from "../models/category.js";

const defaultCategories = [
    {
        name: "Food",
        isDefault: true,
        createdBy: null // null means it's a default category available to all users
    },
    {
        name: "Travel",
        isDefault: true,
        createdBy: null
    },
    {
        name: "Bills",
        isDefault: true,
        createdBy: null
    },
    {
        name: "Shopping",
        isDefault: true,
        createdBy: null
    },
    {
        name: "Others",
        isDefault: true,
        createdBy: null
    }
];

async function seedCategories() {
    try {
        console.log('Seeding default categories...');
        
        for (const category of defaultCategories) {
            const existingCategory = await Category.findOne({ 
                name: category.name, 
                isDefault: true 
            });
            
            if (!existingCategory) {
                await Category.create(category);
                console.log(`Created default category: ${category.name}`);
            } else {
                console.log(`Default category already exists: ${category.name}`);
            }
        }
        
        console.log('Category seeding completed!');
    } catch (error) {
        console.error('Error seeding categories:', error);
        throw new Error(error);
    }
}

export default seedCategories;