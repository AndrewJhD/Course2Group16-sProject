import mongoose from 'mongoose';
const entrySchema = new mongoose.Schema( 
    {
        fileName: {
            type: String,
            required: 'entryname Required',
        },
        username: {
            type: String, 
            required: 'username required',
        },
    },
    { timestamps: true }
);

export default mongoose.model('Entry', entrySchema);


