const EmailAndDaily = require('./sendEmailAndWriterDaily') 

function logErrors(err, req, res, next) {
    if(req.xhr){
        res.status(500).send({error:'Something failed!'})
    }else if(err.name === 'UnauthorizedError'){
        res.status(401).send('invalid token')
    }    
    else{
        errIfo = `${err.stack}`
        EmailAndDaily.sendEmail(errIfo)
        EmailAndDaily.writeDaily(errIfo)
    }


}
module.exports = logErrors
