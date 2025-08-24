import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

/**
 * Define the user schema for Expense Tracker
 */
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

// Virtual for categories (categories created by this user)
UserSchema.virtual('categories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'createdBy',
});

// Virtual for expenses (expenses created by this user)
UserSchema.virtual('expenses', {
    ref: 'Expense',
    localField: '_id',
    foreignField: 'createdBy',
});

// Compare the hashed password with the password that the user sends in the request
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', UserSchema)

export default User
