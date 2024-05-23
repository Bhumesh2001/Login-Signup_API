# Code Logic Explanation

* Created folder structure for the login/signup api using mvc pattern. In root directory, created
the main file app.js.
required and installed neccessary packages for the api.
connected the mongodb connection using mongoose package. defined the sawagger api and route.
and started the server of the main file.

* In the route file defined route using express.js and give endpoint which mentioned in the doc.
route has been scured, used middleware to verify the user.

* In the user controller file, defined the functions for particular task which will be run after going 
that path. used some packages of node like bcrypt for password encryption and nodemailer for the sending 
mail. and jwt for authetication. developed swagger api for paricular api. in that writtern path, endpoint,
and responses.

# signup 
    sending the data to server of user like username, email, password and checking the validation of particular field. if everything is ok then encrypt the password. sending the confirmation mail to user
    after that storing the data of user in the mongodb database. sent the response back to client.
    Implemented the error handling in try/catch block. if the any kind of error or exception will be raise
    it will handled.

# Login
    Get the email and password from user and login with validate email password, cheking for the validation
    error using try/catch block. fetching the data through email from the database and cheking the user is 
    exist in database or not if it is exists then i campare the password is right or wrong, if its right,
    then generationg the token and storing into the cookie. and sent the response back to the user from server.

# Profile
    geting the user detailes from the database which user is current login.
    and response will be sent back to the client.

# sendEmail function 
    In this function created simple email template. getting user data when signup api called.
    include the email in the template. sending the email in the url as encodeURI format.
    used nodemailer for sending the mail.
    using added properties and email and app password for sending mail.


# schema and model
    Defined the schema and model with provided field. e.g username, email, password.
    added properties and built in validation, used the mongoose package for the db connection.
    add extra field e.g isVerified and isVisited. The purpose isVerified field means email address has been confirmd. and second is isVisited this field for link. when user click this link so it should visite only once not again and again. and added also "strict thorow" option there that is main purpose is we can add another property or field in the database. 

# authentication

    # verifyUser

    In Middleware of auth file, created two function once is "verifyUser" and "verify_isVisited"
    the verify user will be check for is user logged in or not. in that function getting the token from 
    cookie and verifying using jwt. after that if the user is verified, login user will be store in req.user object. and we can acces anywhere using req.user. called the next() middleware for next function will work.
    also cheking the token expireation or any kind of error try/catch block will be handled that and have sent the responses to client.

    # verify_isVisited

    In auth file, verifying the user isVisited or not, verifying through user email and that email getting from the url when user click the email confrimation link which will be sent after signup.
    in this function decode the email id and update the data viva email.

# 3.1 User Signup (POST /api/signup)

Description: Allows new users to register with a username, password, and email address.

Request Body:

username: The desired username.
password: The user's password.
email: The user's email address.

Response:

On success, returns a JSON object with a success message.
On failure, returns a JSON object with an error message.

# 3.2 User Login (POST /api/login)

Description: Authenticates existing users based on their email and password.

Request Body:

email: The user's email address.
password: The user's password.

Response:

On success, returns a JSON object containing a message.
On failure, returns a JSON object with an error message.

# 3.3 User Profile (GET /api/profile)

Description: Retrieves the authenticated user's profile information.

Authentication Required: I added the middleware to check for the authentication is user logged in or not.

Response:

Returns a JSON object containing the user's profile information.

# 4. Email Confirmation After Signup

Overview: After successful registration, a confirmation email is sent to the user with a unique link or code to verify their account.

Process Flow:

User send the request for signup.
Server validates and stores user details.
Server generates a unique confirmation link/code.
Server sends confirmation email using an SMTP service.
User clicks the link/code in the email to confirm their account.

Security Considerations

Data Validation: Ensure all inputs are validated before processing.
Password Hashing: Store hashed passwords instead of plain text.
JWT Authentication: Use HTTPS and validate tokens to prevent security risks.

Error Handling

Defined standard error responses for common issues like validation errors, authentication failures, etc.
Provided custom error messages for better debugging and user experience.

# Instructions to run and install.

1. run 'npm i' command.

2. create the .env file and add this variables in there.

    PORT = your desired port
    dbURI = your mongodb url
    SECRET_KEY = here is your secret key
    EMAIL = your email 
    PASS = your app pass of gmail account.

3. use this command for run the file.

    npm run start

if your wan to go for an api doc go on this url => http://localhost:5000/api-docs