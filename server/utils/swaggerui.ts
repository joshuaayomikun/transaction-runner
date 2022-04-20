import { baseurl } from "./config";

const options = {
    "swagger": "2.0",
    "info": {
        "title": "Transaction runners",
        "description": "",
        "version": "1.0"
    },
    "shemes": ["http", "https"],
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    },

    "produces": ["application/json"],
    "consumes": ["application/json"],
    "paths": {
        "/api/user/createuser": {
            "post": {
                "x-swagger-router-controller": "home",
                "operationId": "createUser",
                "tags": ["User"],
                "description": "[Login 123](https://www.google.com)",
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "task object",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {

                                "firstname": {
                                    "type": "string",
                                },
                                "lastname": {
                                    "type": "string",
                                },
                                "email": {
                                    "type": "string"
                                },
                                "phonenumber": {
                                    "type": "string"
                                },
                                "password": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "success"
                    }
                }
            }
        },
        "/api/user/{userId}/confirmtoken": {
            "put": {
                "x-swagger-router-controller": "home",
                "operationId": "confirmToken",
                "tags": ["User"],
                "description": "[Login 123](https://www.google.com)",
                "parameters": [
                    {
                        "in": "path",
                        "name": "userId"
                    },
                    {
                        "in": "body",
                        "name": "body",
                        "description": "task object",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {

                                "token": {
                                    "type": "string",
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "success"
                    }
                }
            }
        },
        "/api/user/resendverification": {
            "post": {
                "x-swagger-router-controller": "home",
                "operationId": "resendVerification",
                "tags": ["User"],
                "description": "",
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "task object",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {

                                "email": {
                                    "type": "string",
                                },
                                "password": {
                                    "type": "string",
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "success"
                    }
                }
            }
        },
        "/api/user/login": {
            "post": {
                "x-swagger-router-controller": "home",
                "operationId": "login",
                "tags": ["User"],
                "description": "",
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "task object",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {

                                "email": {
                                    "type": "string",
                                },
                                "password": {
                                    "type": "string",
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "success"
                    }
                }
            }
        },
        "/api/user/changepassword": {
            "put": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "x-swagger-router-controller": "home",
                "operationId": "changepassword",
                "tags": ["User"],
                "description": "",
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "task object",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {

                                "email": {
                                    "type": "string",
                                },
                                "password": {
                                    "type": "string",
                                },
                                "newpassword": {
                                    "type": "string",
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "success"
                    }
                }
            }
        },
        "/api/user/forgotpassword": {
            "post": {
                "x-swagger-router-controller": "home",
                "operationId": "forgotpassword",
                "tags": ["User"],
                "description": "",
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "task object",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "email": {
                                    "type": "string",
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "success"
                    }
                }
            }
        },
        "/api/user/resetpassword": {
            "put": {
                "x-swagger-router-controller": "home",
                "operationId": "resetpassword",
                "tags": ["User"],
                "description": "",
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "task object",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "email": {
                                    "type": "string",
                                },
                                "token": {
                                    "type": "string"
                                },
                                "password": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "success"
                    }
                }
            }
        },
        "/api/user/{userId}/continueregistration": {
            "put": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "x-swagger-router-controller": "home",
                "operationId": "continueregistration",
                "tags": ["User"],
                "description": "",
                "parameters": [
                    {
                        "in": "path",
                        "name": "userId",
                        "required": true
                    },
                    {
                        "in": "body",
                        "name": "body",
                        "description": "task object",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "email": {
                                    "type": "string",
                                },
                                "pin": {
                                    "type": "string"
                                },
                                "password": {
                                    "type": "string"
                                },
                                "openingbalance": {
                                    "type": "number"
                                },
                                "balance": {
                                    "type": "number"
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "success"
                    }
                }
            }
        },
        "/api/transaction/makepayment": {
            "post": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "x-swagger-router-controller": "home",
                "operationId": "makepayment",
                "tags": ["Transaction"],
                "description": "",
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "task object",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "accountnumber": {
                                    "type": "string",
                                },
                                "pin": {
                                    "type": "string"
                                },
                                "amount": {
                                    "type": "number"
                                },
                                "transactiontype": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "success"
                    }
                }
            }
        },
        "/api/transaction/creditaccount": {
            "post": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "x-swagger-router-controller": "home",
                "operationId": "creditaccount",
                "tags": ["Transaction"],
                "description": "",
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "task object",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "accountnumber": {
                                    "type": "string",
                                },
                                "pin": {
                                    "type": "string"
                                },
                                "amount": {
                                    "type": "number"
                                },
                                "transactiontype": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "success"
                    }
                }
            }
        },
        "/api/transaction/toanotheraccount": {
            "post": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "x-swagger-router-controller": "home",
                "operationId": "toanotheraccount",
                "tags": ["Transaction"],
                "description": "",
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "task object",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "accountnumber": {
                                    "type": "string",
                                },
                                "receiver": {
                                    "type": "string",
                                },
                                "pin": {
                                    "type": "string"
                                },
                                "amount": {
                                    "type": "number"
                                },
                                "transactiontype": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "success"
                    }
                }
            }
        },
        "/api/transaction/getalltransactions": {
            "get": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "x-swagger-router-controller": "home",
                "operationId": "getalltransactions",
                "tags": ["Transaction"],
                "description": "",
                "responses": {
                    "201": {
                        "description": "success"
                    }
                }
            }
        },
        "/api/transaction/gettransactionbyuser/{userId}": {
            "get": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "x-swagger-router-controller": "home",
                "operationId": "gettransactionbyuser",
                "tags": ["Transaction"],
                "description": "",
                "parameters": [
                    {
                        "in": "path",
                        "name": "userId",
                        "required": true
                    
                    }
                ],
                "responses": {
                    "201": {
                        "description": "success"
                    }
                }
            }
        },


    }
}

export default options
