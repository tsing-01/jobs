const createError = require('http-errors');
function notFound (req, res, next) {
  next(createError(404));
};

function errorHandler(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
};

function setHeader(req, res, next) {
  res.header('Access-Control-Allow-Origin','*');
  // res.header('Access-Control-Allow-Headers','Content-Type,jobs-token,Origin,X-Requested-With,Accept');
  res.header('Access-Control-Allow-Headers','*');
  res.header('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');
  next();
}

exports.notFound = notFound;
exports.setHeader = setHeader;
exports.errorHandler = errorHandler;