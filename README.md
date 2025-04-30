# screencloud-tech-test
Tech Test for Screencloud 

## Setup

Run the following commands to setup the environment:

```
docker-compose up --build

Once the containers are up, you can use the Bruno scripts to make POST and GET requests to the API.


## Stuff I'd Like To Have Done

Ideally this would be utilising a queue service like AWS SQS to handle the async requests, but felt would have taken me outside the time frame of the test.

For Integration tests, id use a tool like Playwright to mimic the API Requests to check that the responses were as expected (Unsure what detail to add sadly but would love to expand on this more if additional questions arise)
