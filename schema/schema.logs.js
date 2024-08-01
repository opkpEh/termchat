import mongoose, {Schema} from 'mongoose';

const logSchema= new mongoose.Schema({
    userId: {
        type:Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    message:{
            type: String,
            required: true
    },
    createAt:{
        type: Date,
        default: Date.now,
    }
});

const Log = mongoose.model('log', logSchema);

export default Log;