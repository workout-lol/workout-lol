#!/bin/bash

mongoimport --authenticationDatabase=admin --uri mongodb://mongoadmin:secret@mongodb/db --collection exercises --type json --file /tmp/exercises.metadata.json
mongoimport --authenticationDatabase=admin --uri mongodb://mongoadmin:secret@mongodb/db --collection users --type json --file /tmp/users.metadata.json

mongorestore --authenticationDatabase=admin --uri mongodb://mongoadmin:secret@mongodb/db --collection exercises /tmp/exercises.bson
mongorestore --authenticationDatabase=admin --uri mongodb://mongoadmin:secret@mongodb/db --collection users /tmp/users.bson