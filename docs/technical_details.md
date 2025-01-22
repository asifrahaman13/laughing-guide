## Tech stacks

A large number of tech stacks are used to apply different concepts and take advantages of their strengths.

`python` `golang` `javascript` `typescript` `fastapi` `qdrant` `gin` `next js` `postgresql` `docker` `redis` `git` `linux` `ollama` `aws`

## Authentication

Authentication is done through google oauth2 flow. Here the standard security flow is taken into consideration.

- Google sends the access token which is validated by our backend first.
- Then our backend creates the access token which is then stored by the browser.
- This token is being used by the system to validate the user.

## Bulk processing capability

The system is extremely efficient in terms of bulk processing. Go's user level threads allow to concurrently process the docuemts. Can easily scale for 10k+ users.

## Data validation

Proper usage of types is used for all the codebases (go, typescript, python). Data is validated poperly.
