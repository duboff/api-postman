# Postman Pre-Request Script for Usabilla API

The Usabilla API Postman Pre-Request Script provides access to the Usabilla database from Postman.

The script has the following features:
* Read the authentication information from the environmental variables
* Calculate the required signatures
* Expose the signaturs and date headers into global variables

## Authentication

The client uses extensive authentication based on a request signing process. For more information,
please see the Usabilla [developers guide](http://developers.usabilla.com)

## Getting started

### Step 1

Create your Usabilla environment

![alt tag](https://github.com/ulabcool/api-postman/blob/master/readme-1.png?raw=true)

1. add the environment name
2. add 'access_key', and enter your accounts Access Key
3. add 'secret_key', and enter your accounts Secret Key

### Step 2

Set-up your Request

![alt tag](https://github.com/ulabcool/api-postman/blob/master/readme-2.png?raw=true)

1. make a GET request
2. add the URL you want to connect to
3. in the 'HEADERS' tab add two headers
   * Set the Authorization header to {{ub_header_auth}}
   * Set the x-ubsl header to {{ub_header_date}}

### Step 3

Add the Pre-Request Script

![alt tag](https://github.com/ulabcool/api-postman/blob/master/readme-3.png?raw=true)

1. copy the code from this repository and paste it in this tab!

## Support

ULab Postman Pre-Request Script is a Hack Day Project - There is no operational support or maintenance.
