import mongoose, {Schema} from 'mongoose';

const logSchema= new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
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
},
    {
        timestamps: true
});

const Log = mongoose.model('log', logSchema);

export default Log;