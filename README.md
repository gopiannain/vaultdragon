# Build RESTful API using Node and MongoDB

## Installation : 

Download or clone the code.

Run MongoDB on default instance.

Run program by typing ```npm start``` on terminal.

## Testing REST api : 

Open up REST simulator ( Postman recommended ) : Check Email for Postman Backup fail. 

Hit following URL's : 

Add/Update 
==========

- /POST http://localhost:3000/vault

Request Body

{
  "Keyname": "value"
}

Get Value
==========
- /GET localhost:3000/vault/keyname 

Get Value with TimeStamp
==========
- /GET localhost:3000/vault/keyname?timestamp=1494916279 