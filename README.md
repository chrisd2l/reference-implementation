# Serverless Service Template

This is an example of how we build services.

# Get Started

'npm run test' - run the test suite

# Deploy

## Infrastructure
Deploys persistent things required for the service to run (databases, queues, etc.).


> 'npx serverless bootstrap' or 'npx sls bootstrap'

## Compute
Deploys all non-infrastructure things (lambdas, alarms, etc).

> 'npx serverless deploy' or 'npx sls deploy'

# TODO
- testing framework
- use async & promise.all
- whats the difference between driver and model
- move middleware into context(just use tasks?)

# Folders

- context: all code that will run in the service
- deploy: how we deploy
- service: what gets deployed()
- test
