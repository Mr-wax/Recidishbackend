import mongoose, {Schema} from "mongoose";

const paymentSchema = new mongoose.Schema({
    fromUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency:{
      type:String,
      required:true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    }});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;