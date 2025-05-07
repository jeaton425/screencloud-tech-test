# screencloud-tech-test

This is a test project for Screencloud.

## Setup

Run the following commands to setup the environment:

```
docker-compose up --build
```

Once the containers are up, you can use the Bruno scripts to make POST and GET requests to the API.

## Tests

I've created Jest tests both for the Routes and the Services. To run the tests, run the following command:

```
npm run test
``` 

## Assumptions and Discussions

This project went off the assumption that the service would be hit by a queue service like AWS SQS to handle the async requests. Due to the time frame of the test, I've opted just to assume that the service will be hit directly by the API requests. It allows for both single and batch requests to be made to the API as well as the ability to still process invalid/currupted data as requests to ensure there is no 'surviver bias' in the data. 

I've opted for a express.js application as it was quick and easy to setup the routes for the API. I've also opted to use MongoDB as the database for the data as the No-SQL meant I didn't need to worry about the schema and the data was easy to insert and retrieve. Also for a project were you expect to recieve alot of different types of records then MongoDB would be a good choice (e.g. different event types and telemetryData). 


## Stuff I'd Like To Have Done

Ideally this would be utilising a queue service like AWS SQS to handle the async requests, but felt would have taken me outside the time frame of the test.

For Integration tests, id use a tool like Playwright to mimic the API Requests to check that the responses were as expected (Unsure what detail to add sadly but would love to expand on this more if additional questions arise)

## Additional Notes for Interview (8/5/25)

Following a structure that allowed me to best separate concerns and create reusable code that was effectively testable. 

I used MongoMemoryServer as it provided a fast, isolated, reliable and dependency-free teesting enviroment as I was previously getting errors and opted to do this to reduce both the runtime and reduce the chances of other tests affecting it. 

For validation I did briefly look into using Zod and would have opted to use this now (hadn't used it but have started researching into it for the project on the Home Office since doing this challange) 

For endpoints for GET requests, I could have thought a bit more about the types of queries that the user might want as well as pagination and filtering to limit the number of responses. 

For additional endpoints that I didn't create, I could have created DELETE. However ideally this would want to be audited to ensure that all DB interactions are recorded

For Fields, I only had a single field in telemetryData so ideally should have added more such as Battery Life and other fields 

Also could be additional validation to record missing expected data, for example:
  If a drone has taken off, then it is assumed that has landed if the data is recorded (assuming data is delivered on landing). 
  If a drone had delivered an Item, then it is assumed it has taken off and landed (with the above assumption being valid) 

With the use of the LatLong's, would be an interesting feature to have a map track the event locations to see maps plotted for users
  Could be used to see bad flight paths or enviromental hazards causing Drones to not return or not successfully make a delivery
  Could be used to find optimal routes for drones flight paths in the future
  Could be used to track suspicious missing deliveries


