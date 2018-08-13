#!/usr/bin/env bash

# TODO: Read dynamodb table configuration from template.yaml
# echo "Installing shyaml"
# pip install shyaml

#echo "delete resource table"
#aws dynamodb delete-table \
#--table-name aws-lambda-dynamo-table-resource \
#--endpoint http://0.0.0.0:9000 2> /dev/null
#
#echo "create resource table"
#aws dynamodb create-table \
#--table-name aws-lambda-dynamo-table-resource \
#--attribute-definitions AttributeName=resourceName,AttributeType=S AttributeName=userId,AttributeType=S \
#--key-schema AttributeName=resourceName,KeyType=HASH AttributeName=userId,KeyType=RANGE \
#--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
#--endpoint http://0.0.0.0:9000
#
#echo "delete user table"
#aws dynamodb delete-table \
#--table-name aws-lambda-dynamo-table-user \
#--endpoint http://0.0.0.0:9000 2> /dev/null
#
#echo "create user table"
#aws dynamodb create-table \
#--table-name aws-lambda-dynamo-table-user \
#--attribute-definitions AttributeName=email,AttributeType=S \
#--key-schema AttributeName=email,KeyType=HASH \
#--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
#--endpoint http://0.0.0.0:9000

echo "delete token table"
aws dynamodb delete-table \
--table-name aws-lambda-dynamo-table-token \
--endpoint http://0.0.0.0:9000 2> /dev/null

echo "create token table"
aws dynamodb create-table \
--table-name aws-lambda-dynamo-table-token \
--attribute-definitions AttributeName=token,AttributeType=S AttributeName=userId,AttributeType=S \
--key-schema AttributeName=token,KeyType=HASH AttributeName=userId,KeyType=RANGE \
--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
--endpoint http://0.0.0.0:9000

aws dynamodb update-time-to-live \
--table-name aws-lambda-dynamo-table-token \
--time-to-live-specification "Enabled=true, AttributeName=ttl" \
--endpoint http://0.0.0.0:9000

