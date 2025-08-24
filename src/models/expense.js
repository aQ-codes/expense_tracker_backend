import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
expenseSchema.index({ createdBy: 1, date: -1 });
expenseSchema.index({ category: 1, createdBy: 1 });

// Virtual for formatted date
expenseSchema.virtual('formattedDate').get(function() {
    return this.date.toISOString().split('T')[0];
});

// Ensure virtual fields are serialized
expenseSchema.set('toJSON', { virtuals: true });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
