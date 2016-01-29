# Security

Flow is a secure MUD. This means that all the communcation between the client and the server is encrypted. But how does this work?

## How

1. Communication is encrypted with TLS.
2. Client executes a `login` action, sending user name and password (remember, over TLS).
3. Server verifies and sends back an session token (crypto secure random string).
4. Client uses token to make all its requests.

## Password storage

Passwords are stored `sha256` encoded.
