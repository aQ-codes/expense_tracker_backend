import mongoose from 'mongoose'

/**
 * Define the expense schema for Expense Tracker
 */
const ExpenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

// Virtual for the category of this expense
ExpenseSchema.virtual('categoryDetails', {
    ref: 'Category',
    localField: 'category',
    foreignField: '_id',
    justOne: true,
});

// Virtual for the user who created this expense
ExpenseSchema.virtual('user', {
    ref: 'User',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true,
});

// Index for better query performance
ExpenseSchema.index({ createdBy: 1, date: -1 });
ExpenseSchema.index({ category: 1 });
ExpenseSchema.index({ createdBy: 1, category: 1 });

ExpenseSchema.set('toObject', { virtuals: true });
ExpenseSchema.set('toJSON', { virtuals: true });

const Expense = mongoose.model('Expense', ExpenseSchema)

export default Expense
