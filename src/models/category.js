import mongoose from 'mongoose'

/**
 * Define the category schema for Expense Tracker
 */
const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: function() {
                return !this.isDefault; // Only required if not a default category
            },
        },
    },
    {
        timestamps: true,
    },
)

// Virtual for expenses in this category
CategorySchema.virtual('expenses', {
    ref: 'Expense',
    localField: '_id',
    foreignField: 'category',
});

// Virtual for the user who created this category
CategorySchema.virtual('user', {
    ref: 'User',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true,
});

// Ensure virtuals are included when converting to JSON
CategorySchema.set('toJSON', { virtuals: true });

const Category = mongoose.model('Category', CategorySchema)

export default Category
