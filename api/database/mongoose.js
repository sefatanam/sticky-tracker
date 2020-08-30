const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://cnq:rPKMMHEtEVZI3TTb@cluster0-audg9.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true}).then(() => {
    console.log('Connect Successfully')
}).catch((err) => {
    console.log(err);
})


mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


module.exports = {
    mongoose
}
