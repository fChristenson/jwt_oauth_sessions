# JWT Oauth and Sessions

## What we will cover

* What is a Session?
* What is a JWT?
* What is Oauth?

## Notes

### Session
Sessions is at a high level just a way for a server to figure out who a client is.

The server needs to have some token that is included in the clients request to figure
out if the server has seen this client before.

Usually this is done using a cookie that is stored on a users browser.

What we most commonly use this system for is to check if a user has logged in to our application.

The flow goes like this:

```
User tries to access private page -> session cookie is missing -> we send user to login page ->
user logs in -> we create a session cookie and set it in the browser ->
user tries to access private page -> session cookie is included -> user gets to page
```

### JWT

A JWT (Json web token) is a string with a specific structure e.g:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaWF0IjoxNTYzNjk2NjMxLCJleHAiOjE1NjM3MDAyMzF9.zixrGkCPvuBYIXWXaEx8vmZfEeen0Tj_qmL8hcEiJi4
```

Notice that the JWT has 3 sections:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9. // the header
eyJ1c2VySWQiOiIxIiwiaWF0IjoxNTYzNjk2NjMxLCJleHAiOjE1NjM3MDAyMzF9. // the body
zixrGkCPvuBYIXWXaEx8vmZfEeen0Tj_qmL8hcEiJi4 // the signature
```

The header and body are just base64 encoded and can be viewed by anyone.

The header can look like this:
```
{
  "alg": "HS256",
  "typ": "JWT"
}
```

This information is important for the server who is going to validate the tokens signature because
it tells us what type of token we are dealing with and what type of algorithm was used to sign it.

With this information we can verify the signature which tells us if the information in the token
has been changed since the signing was done.

The body is also just base64 encoded and can look like this:

```
{
  "userId":"1",
  "iat":1563696631,
  "exp":1563700231
}
```

This is the data we included in the JWT that we want to transfer and since it is not encrypted we
can never send private information with a JWT without risking someone getting a hold of it.

### Oauth

Oauth is a system where a third party has some data about our user that we want and we can get
this data if the user lets us.

A common use case is for login where we want to user to just click a button and then be sent to
a oauth provider that can validate that the user is who they claim to be and then send us the
data we want so we can create a session.

There are other use cases for oauth that has nothing to do with login but this is the one you
likely are most familiar with.
