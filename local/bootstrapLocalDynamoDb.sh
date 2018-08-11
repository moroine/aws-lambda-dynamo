#!/usr/bin/env bash

# TODO: Read dynamodb table configuration from template.yaml
# echo "Installing shyaml"
# pip install shyaml

aws dynamodb delete-table \
--table-name aws-lambda-dynamo-table \
--endpoint http://0.0.0.0:9000 2> /dev/null

aws dynamodb create-table \
--table-name aws-lambda-dynamo-table \
--attribute-definitions AttributeName=id,AttributeType=S \
--key-schema AttributeName=id,KeyType=HASH \
--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
--endpoint http://0.0.0.0:9000

