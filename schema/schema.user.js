import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: [true, "Enter a username"],
            unique: true,
        },
        image: {
            type: String,
            required: false,
        },

        passwordHash: {
            type: String,
            required: true,
        },

    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;