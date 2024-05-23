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