mongoose = require('mongoose')
Schema = mongoose.Schema
bcrypt = require('bcrypt')
SALT_WORK_FACTOR = 10;

userFavoriteSchema = new Schema(
  userid: {
		type: Schema.Types.ObjectId,
		index: true
  }
  username:{
    type: String,
    required: [true, 'Username is required'],
    maxlength: 20,
    minlength: 2
  },
  pinned: [Schema(
    {
      product : {
        type: String,
        required: true
      },
      type : {
        type: String,
        required: true
      },
      uid : {
        type: String,
        required: true
      },
      originBuild: {
        type: Schema.Types.ObjectId,
      },
      originDate: {
        type: Date,
      },
      comments: Schema.Types.Mixed
    }, 
    {_id: true}
    )
  ],
  executions: [Schema(
    {	
      name: {
        type: String
      },
      build: {
        type: Schema.Types.ObjectId,
      },
      comments: Schema.Types.Mixed
    }, 
    {_id: true}
    )
  ],
  ceses: [Schema(
    {	
      name: {
        type: String
      },
      type: {
        type: String
      },
      script: {
        type: String
      }
    }, 
    {_id: true}
    )
  ]
)

userFavoriteSchema.statics.updateOne = (userFav, payload) ->
  if(payload)
    if(payload.username)
      userFav.username = payload.username
    if(payload.executions)
      userFav.executions = payload.executions
    if(payload.pinned)
      userFav.pinned = payload.pinned
    if(payload.ceses)
      userFav.ceses = payload.ceses

userFavoriteSchema.statics.find = (username, password, callback) ->
  User.findOne({username: username}).exec (err, user) ->
    if err
      callback(null)
    else if !user
      callback(null)
    callback user


UserFavorite = mongoose.model('users_favorite', userFavoriteSchema)
module.exports = UserFavorite