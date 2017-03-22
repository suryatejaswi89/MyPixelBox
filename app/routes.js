// app/routes.js
module.exports = function(app, passport, aws) {
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
          res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    // process the login form
    // app.post('/login', do all our passport stuff here);
    // process the login form
   app.post('/login', passport.authenticate('local-login', {
       successRedirect : '/profile', // redirect to the secure profile section
       failureRedirect : '/login', // redirect back to the signup page if there is an error
       failureFlash : true // allow flash messages
   }));
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));
  // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    //routes for google authentication and loginapp.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
// the callback after google has authenticated the user
app.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
        }));
        // =====================================
        // Routes for s3 upload ========
        // =====================================
        app.get('/sign-s3', (req, res) => {
          const S3_BUCKET = 'mypixelbox';
          const s3 = new aws.S3();
          const fileName = req.query['file-name'];
          const fileType = req.query['file-type'];
          const s3Params = {
            Bucket: S3_BUCKET,
            Key: req.user._id+'/'+fileName,
            Expires: 60,
            ContentType: fileType,
            ACL: 'public-read',
            ServerSideEncryption: 'AES256'
          };
          s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
              console.log(err);
              return res.end();
            }
            const returnData = {
              signedRequest: data,
              url: `https://mypixelbox.s3.amazonaws.com/${fileName}`
            };
          res.write(JSON.stringify(returnData));
            res.end();
          });

        });
        app.post('/save-details', (req, res) => {
         console.log(req);
        });
        //route for viewing images
        app.get('/showImages',(req,res) => {
          console.log(req.user.id.toString());
          const S3_BUCKET = 'mypixelbox';

          const s3 = new aws.S3();
          const s3Params = {
            Bucket: S3_BUCKET,
            EncodingType: 'url',
            Prefix: req.user._id.toString()
          };

          s3.listObjects(s3Params, function(err , data){

            if(err) console.log(err, err.stack);
            else {
              var bucketContents = data.Contents;
              res.render('myimages.ejs', {
                  bucketContents: bucketContents
              });
            }
          })

        });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
        // if they aren't redirect them to the home page
           res.redirect('/');
       }
