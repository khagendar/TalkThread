// const mongoose = require('mongoose');

// const postSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Signup",
//     required: true
//   },
//   title: {
//     type: String,
//     required: true
//   },
//   image: {
//     type: String,
//     required: true
//   },
//   like: {
//     type: [mongoose.Schema.Types.ObjectId],
//     ref: "Signup",
//     default: []
//   },
//   comment: [
//     {
//       user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Signup",
//         required: true
//       },
//       name: {
//         type: String,
//         required: true
//       },
//       // profile: {
//       //   type: String,
//       //   required: true
//       // },
//       comment: {
//         type: String,
//         required: true
//       }
//     }
//   ]
// }, { timestamps: true });

// const Post = mongoose.model("Post", postSchema);
// module.exports = Post;
