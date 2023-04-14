To run the api in development:
> Clone the repo on your local machine
> run mongodb local server and connect to compass (Ref: https://youtu.be/D0U8vD8m1I0)
> install node modules by typing 'npm i' and pressing enter
> run app in development mode by entering 'npm run dev' in terminal


Pagination:
for getting next page include  "page": "page_no" in request body
for setting custom documents per page include  "limit": "number" in request body

Remarks:
> There is some extra code in controllers for changing response keys like ('createdAt' and '_id') to ('created_at' and 'id') just to match the example response. It is a bunch of code accomplishing no real goal just making the code look heavy. I couldv'e used ORM to solve this issue but I had already built complete api using ODM and couldn't afford to change it subject to deadline.
> There is a lot of scope for improvement for this api. The application could break if we give it some malicious input. Correcting it would involve a lot of refactoring and model improvement which has been saved for later.