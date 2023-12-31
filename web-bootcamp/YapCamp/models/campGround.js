const mongoose = require('mongoose');
const schema = mongoose.Schema; // 많이 참조하는 것은 이렇게 빼두는 것이 좋다.

const campGroundSchema = new schema({
    title: String,
    image: [
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    author: {
        type:schema.Types.ObjectId, 
        ref:'User'
    }
}) // 스키마 생성 

module.exports = mongoose.model('campGround', campGroundSchema); // 모델 생성 및 export